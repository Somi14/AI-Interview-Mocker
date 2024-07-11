/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://ai-interview-mocker_owner:mY8nS7rUEGop@ep-bold-unit-a1uatndo.ap-southeast-1.aws.neon.tech/ai-interview-mocker?sslmode=require',
    }
  };