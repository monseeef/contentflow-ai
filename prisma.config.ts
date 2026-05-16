import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://neondb_owner:npg_fTU8IZDO9djX@ep-rapid-mountain-aqw9s3im.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require",
  },
});
