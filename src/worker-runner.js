import "./workers/emailWorker.js";
import { connectDB } from "./config/db.js";

const startWorkerProcess = async () => {
  try {
    console.log("Bootstrapping Enterprise Queue Processor Node...");

    await connectDB();
    console.log("MongoDB pipeline wide open for background tasks.");

    console.log(
      "System Workers successfully attached and reading from Redis queue stream.",
    );
  } catch (error) {
    console.error(
      `Critical Worker Process Initialization Failure: ${error.message}`,
    );
    process.exit(1);
  }
};

startWorkerProcess();
