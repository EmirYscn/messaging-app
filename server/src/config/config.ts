import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  DATABASE_URL: z.string().url(),
  CLIENT_URL: z.string().url(),
  SERVER_URL: z.string().url(),
  SOCKET_ADMIN_IO_URL: z.string().url(),

  JWT_SECRET: z.string(),
  JWT_ACCESS_TOKEN_EXPIRESIN: z.string().default("3600"), // 1 hour in seconds
  JWT_REFRESH_TOKEN_EXPIRESIN: z.string().default("604800"), // 7 days in seconds
  JWT_AUDIENCE: z.string().default("chat-app"),
  JWT_ISSUER: z.string().default("chat-app"),

  SERVER_JWT_SECRET: z.string(),
  SERVER_JWT_EXPIRESIN: z.string().default("3600"), // 1 hour in seconds

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),

  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),

  SUPABASE_URL: z.string(),
  SUPABASE_KEY: z.string(),

  SOCKET_ADMIN_USERNAME: z.string(),
  SOCKET_ADMIN_PASSWORD: z.string(),

  ENCRYPTION_KEY: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsedEnv.error.flatten().fieldErrors
  );
  process.exit(1);
}

const env = parsedEnv.data;

const config = {
  port: Number(env.PORT),
  nodeEnv: env.NODE_ENV,

  databaseUrl: env.DATABASE_URL,
  clientUrl: env.CLIENT_URL,
  serverUrl: env.SERVER_URL,
  socketAdminIoUrl: env.SOCKET_ADMIN_IO_URL,

  jwtSecret: env.JWT_SECRET,
  jwtAccessTokenExpiresIn: parseInt(env.JWT_ACCESS_TOKEN_EXPIRESIN, 10),
  jwtRefreshTokenExpiresIn: parseInt(env.JWT_REFRESH_TOKEN_EXPIRESIN, 10),
  jwtAudience: env.JWT_AUDIENCE,
  jwtIssuer: env.JWT_ISSUER,

  server: {
    jwtSecret: env.SERVER_JWT_SECRET,
    jwtExpiresIn: parseInt(env.SERVER_JWT_EXPIRESIN, 10), // 1 hour
  },

  googleClientId: env.GOOGLE_CLIENT_ID,
  googleClientSecret: env.GOOGLE_CLIENT_SECRET,

  githubClientId: env.GITHUB_CLIENT_ID,
  githubClientSecret: env.GITHUB_CLIENT_SECRET,

  supabaseUrl: env.SUPABASE_URL,
  supabaseKey: env.SUPABASE_KEY,

  socketAdminUsername: env.SOCKET_ADMIN_USERNAME,
  socketAdminPassword: env.SOCKET_ADMIN_PASSWORD,

  encryptKey: env.ENCRYPTION_KEY,
};

export default config;
