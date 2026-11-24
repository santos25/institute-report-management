import type { Role } from "@/lib/auth/roles";

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type SessionPayload = {
  sub: string;
  username: string;
  name: string;
  role: Role;
  exp: number;
};

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const pad = (4 - (value.length % 4)) % 4;
  const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signSession(
  payload: SessionPayload,
  secret: string
): Promise<string> {
  const body = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(body)
  );
  return `${body}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(
  token: string,
  secret: string
): Promise<SessionPayload | null> {
  try {
    const [body, signature] = token.split(".");
    if (!body || !signature || token.split(".").length !== 2) return null;

    const key = await hmacKey(secret);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToBytes(signature),
      new TextEncoder().encode(body)
    );
    if (!valid) return null;

    const parsed = JSON.parse(
      new TextDecoder().decode(base64UrlToBytes(body))
    ) as Partial<SessionPayload>;

    if (
      typeof parsed.sub !== "string" ||
      typeof parsed.username !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.exp !== "number" ||
      (parsed.role !== "ADMIN" && parsed.role !== "TEACHER")
    ) {
      return null;
    }

    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;

    return {
      sub: parsed.sub,
      username: parsed.username,
      name: parsed.name,
      role: parsed.role,
      exp: parsed.exp,
    };
  } catch {
    return null;
  }
}
