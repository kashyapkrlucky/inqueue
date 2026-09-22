const REQUIRED_ENV_VARS = ["VITE_AUTH_URL", "VITE_API_URL", "VITE_CLIENT_ID"] as const;

type RequiredEnvVar = (typeof REQUIRED_ENV_VARS)[number];

export class MissingEnvError extends Error {
  readonly missing: string[];

  constructor(missing: string[]) {
    super(
      `Missing required environment variable(s): ${missing.join(", ")}. ` +
        "Copy .env.example to .env (or set them in your deployment) and restart.",
    );
    this.name = "MissingEnvError";
    this.missing = missing;
  }
}

const readEnv = (): Record<RequiredEnvVar, string> => {
  const missing: string[] = [];
  const values = {} as Record<RequiredEnvVar, string>;

  for (const key of REQUIRED_ENV_VARS) {
    const value = import.meta.env[key];
    if (!value) {
      missing.push(key);
    } else {
      values[key] = value;
    }
  }

  if (missing.length > 0) {
    throw new MissingEnvError(missing);
  }

  return values;
};

// Fails fast at import time (before the app renders — see main.tsx) rather
// than letting a misconfigured deployment silently fall back to
// http://localhost:3000 and fail in confusing ways later (e.g. guest login
// sending clientId: undefined).
export const env = readEnv();
