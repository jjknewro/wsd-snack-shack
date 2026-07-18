export type Env = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

const REQUIRED_VARS = ['EXPO_PUBLIC_SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_ANON_KEY'] as const;

/**
 * Reads and validates the public environment configuration.
 *
 * Throws immediately with a clear, actionable message if a required
 * variable is missing, rather than letting the app start in a broken
 * state and fail confusingly later at first network use.
 *
 * Deliberately reads `process.env` through a variable key (never a literal
 * `process.env.EXPO_PUBLIC_X` member expression) — babel-preset-expo
 * statically rewrites literal EXPO_PUBLIC_* accesses at build time, which
 * breaks reading a value set dynamically (e.g. in tests).
 */
export function getEnv(): Env {
  const values = Object.fromEntries(
    REQUIRED_VARS.map((name) => [name, process.env[name]]),
  ) as Record<(typeof REQUIRED_VARS)[number], string | undefined>;

  const missing = REQUIRED_VARS.filter((name) => !values[name]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}. ` +
        'Copy .env.example to .env and fill in your Supabase development project values before starting the app.',
    );
  }

  return {
    supabaseUrl: values.EXPO_PUBLIC_SUPABASE_URL as string,
    supabaseAnonKey: values.EXPO_PUBLIC_SUPABASE_ANON_KEY as string,
  };
}
