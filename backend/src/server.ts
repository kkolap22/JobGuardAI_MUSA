import app from "./app.js";

import { env } from "./config/env.js";
import { connectMongoDB } from "./database/mongodb.js";

async function startServer(): Promise<void> {
  try {
    await connectMongoDB();

    app.listen(env.PORT, () => {
      console.log(
        `JobGuard AI API running on port ${env.PORT}`,
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error,
    );

    process.exit(1);
  }
}

startServer();