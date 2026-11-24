export const GUARDIAN_SESSION_COOKIE = "guardian_session";
export const GUARDIAN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type GuardianSessionPayload = {
  typ: "guardian";
  sub: string;
  identification: string;
  name: string;
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

export async function signGuardianSession(
  payload: GuardianSessionPayload,
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

export async function verifyGuardianToken(
  token: string,
  secret: string
): Promise<GuardianSessionPayload | null> {
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
    ) as Partial<GuardianSessionPayload> & { role?: unknown };

    if (
      parsed.typ !== "guardian" ||
      "role" in parsed ||
      typeof parsed.sub !== "string" ||
      typeof parsed.identification !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.exp !== "number"
    ) {
      return null;
    }

    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;

    return {
      typ: "guardian",
      sub: parsed.sub,
      identification: parsed.identification,
      name: parsed.name,
      exp: parsed.exp,
    };
  } catch {
    return null;
  }
}
