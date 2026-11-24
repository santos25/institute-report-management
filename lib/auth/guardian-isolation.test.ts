import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { signSession, verifySessionToken, SESSION_COOKIE } from "./token";
import {
  GUARDIAN_SESSION_COOKIE,
  signGuardianSession,
  verifyGuardianToken,
} from "./guardian-token";
import {
  GUARDIAN_LOCK_MS,
  GUARDIAN_MAX_FAILED_ATTEMPTS,
  isGuardianLocked,
  registerFailedAttempt,
} from "./guardian-lockout";
import { decideRequestAccess } from "./routes";
import { childrenVisibleToGuardian } from "../guardian/visibility";
import {
  canonicalPhone,
  familyLoginUrl,
  generateInitialPassword,
  guardianWelcomeMessage,
  validateCedula,
  validateChosenPassword,
  whatsAppHref,
} from "../guardian/credentials";

const SECRET = "test-secret";

describe("sesiones separadas", () => {
  it("usa cookies distintas", () => {
    assert.notEqual(SESSION_COOKIE, GUARDIAN_SESSION_COOKIE);
    assert.equal(SESSION_COOKIE, "session");
    assert.equal(GUARDIAN_SESSION_COOKIE, "guardian_session");
  });

  it("un token de acudiente no pasa como personal, ni al revés", async () => {
    const guardianToken = await signGuardianSession(
      {
        typ: "guardian",
        sub: "guardian-a",
        identification: "1234567890",
        name: "Acudiente A",
        exp: Math.floor(Date.now() / 1000) + 60,
      },
      SECRET
    );
    const staffToken = await signSession(
      {
        sub: "staff-1",
        username: "admin",
        name: "Administrador",
        role: "ADMIN",
        exp: Math.floor(Date.now() / 1000) + 60,
      },
      SECRET
    );

    assert.equal(await verifySessionToken(guardianToken, SECRET), null);
    assert.equal(await verifyGuardianToken(staffToken, SECRET), null);
    assert.equal((await verifyGuardianToken(guardianToken, SECRET))?.sub, "guardian-a");
    assert.equal((await verifySessionToken(staffToken, SECRET))?.role, "ADMIN");
  });

  it("rechaza un token de acudiente alterado o vencido", async () => {
    const token = await signGuardianSession(
      {
        typ: "guardian",
        sub: "guardian-a",
        identification: "1234567890",
        name: "Acudiente A",
        exp: Math.floor(Date.now() / 1000) - 10,
      },
      SECRET
    );
    assert.equal(await verifyGuardianToken(token, SECRET), null);

    const valid = await signGuardianSession(
      {
        typ: "guardian",
        sub: "guardian-a",
        identification: "1234567890",
        name: "Acudiente A",
        exp: Math.floor(Date.now() / 1000) + 60,
      },
      SECRET
    );
    const [body, signature] = valid.split(".");
    const tampered = `${body.slice(0, -2)}aa.${signature}`;
    assert.equal(await verifyGuardianToken(tampered, SECRET), null);
  });
});

describe("rutas", () => {
  const staffPaths = [
    "/planillas",
    "/planillas/grado",
    "/boletines",
    "/boletines/1",
    "/avance",
    "/avance/1",
    "/estudiantes",
    "/estudiantes/1",
    "/usuarios",
    "/usuarios/1",
    "/acudientes",
    "/acudientes/1",
  ];

  it("un acudiente no entra a las rutas del personal", () => {
    for (const pathname of staffPaths) {
      assert.deepEqual(
        decideRequestAccess({
          pathname,
          staffRole: null,
          guardianAuthenticated: true,
        }),
        { type: "redirect", to: "/login" }
      );
    }
  });

  it("el personal no entra al portal de familias con su sesión", () => {
    for (const pathname of [
      "/familias",
      "/familias/cambiar-clave",
      "/familias/hijos/estudiante-ajeno",
    ]) {
      assert.deepEqual(
        decideRequestAccess({
          pathname,
          staffRole: "ADMIN",
          guardianAuthenticated: false,
        }),
        { type: "redirect", to: "/familias/login" }
      );
    }
  });

  it("solo ADMIN abre acudientes y usuarios", () => {
    assert.deepEqual(
      decideRequestAccess({
        pathname: "/acudientes",
        staffRole: "TEACHER",
        guardianAuthenticated: false,
      }),
      { type: "redirect", to: "/planillas" }
    );
    assert.deepEqual(
      decideRequestAccess({
        pathname: "/acudientes",
        staffRole: "ADMIN",
        guardianAuthenticated: false,
      }),
      { type: "next" }
    );
  });

  it("el acudiente autenticado ve su portal y el login lo devuelve allí", () => {
    assert.deepEqual(
      decideRequestAccess({
        pathname: "/familias",
        staffRole: null,
        guardianAuthenticated: true,
      }),
      { type: "next" }
    );
    assert.deepEqual(
      decideRequestAccess({
        pathname: "/familias/login",
        staffRole: null,
        guardianAuthenticated: true,
      }),
      { type: "redirect", to: "/familias" }
    );
    assert.deepEqual(
      decideRequestAccess({
        pathname: "/login",
        staffRole: null,
        guardianAuthenticated: true,
      }),
      { type: "next" }
    );
  });
});

describe("bloqueo y visibilidad", () => {
  it("bloquea al quinto intento durante 15 minutos", () => {
    const now = new Date("2026-11-24T12:00:00.000Z");
    let state: { failedAttempts: number; lockedUntil: Date | null } = {
      failedAttempts: 0,
      lockedUntil: null,
    };

    for (let attempt = 1; attempt < GUARDIAN_MAX_FAILED_ATTEMPTS; attempt += 1) {
      const next = registerFailedAttempt(state, now);
      assert.equal(next.locked, false);
      state = next;
    }

    const locked = registerFailedAttempt(state, now);
    assert.equal(locked.locked, true);
    assert.equal(locked.failedAttempts, 5);
    assert.equal(locked.lockedUntil?.getTime(), now.getTime() + GUARDIAN_LOCK_MS);
    assert.equal(isGuardianLocked(locked.lockedUntil, now), true);
    assert.equal(
      isGuardianLocked(locked.lockedUntil, new Date(now.getTime() + GUARDIAN_LOCK_MS)),
      false
    );
  });

  it("un bloqueo vencido vuelve a contar desde cero", () => {
    const now = new Date("2026-11-24T12:00:00.000Z");
    const next = registerFailedAttempt(
      {
        failedAttempts: 5,
        lockedUntil: new Date(now.getTime() - 1),
      },
      now
    );
    assert.equal(next.locked, false);
    assert.equal(next.failedAttempts, 1);
  });

  it("el acudiente A no ve los hijos del acudiente B", () => {
    const students = [
      { id: "1", name: "Hijo de A", guardianId: "guardian-a" },
      { id: "2", name: "Hijo de B", guardianId: "guardian-b" },
      { id: "3", name: "Sin acudiente", guardianId: null },
    ];
    const visible = childrenVisibleToGuardian("guardian-a", students);
    assert.deepEqual(
      visible.map((student) => student.name),
      ["Hijo de A"]
    );
    assert.equal(
      visible.some((student) => student.name === "Hijo de B"),
      false
    );
  });
});

describe("clave y WhatsApp", () => {
  it("genera una clave inicial y valida la clave propia", () => {
    const password = generateInitialPassword();
    assert.match(password, /^[A-HJ-NP-Za-km-z2-9]{10}$/);
    assert.equal(validateCedula("1234567890"), null);
    assert.equal(validateChosenPassword("clave-nueva", "clave-nueva"), null);
    assert.ok(validateChosenPassword("corta", "corta"));
  });

  it("arma el mensaje de WhatsApp solo con el acceso de ese acudiente", () => {
    const message = guardianWelcomeMessage({
      name: "María Pérez",
      identification: "1045678901",
      password: "Clave1234",
      loginUrl: familyLoginUrl("https://colegio.example"),
    });
    assert.match(message, /https:\/\/colegio\.example\/familias\/login/);
    assert.match(message, /Usuario: 1045678901/);
    assert.match(message, /Clave inicial: Clave1234/);
    assert.equal(message.includes("Hijo de B"), false);
    assert.equal(
      whatsAppHref("3001234567", message),
      `https://wa.me/573001234567?text=${encodeURIComponent(message)}`
    );
    assert.equal(canonicalPhone("+57 300 123 4567"), "3001234567");
    assert.equal(whatsAppHref("", message), null);
  });
});
