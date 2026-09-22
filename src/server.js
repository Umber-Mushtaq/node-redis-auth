import app from "./app.js";
import { connectDB } from "./config/db.js";
import { ENV_VARIABLES } from "./config/constants.js";

const startWebServer = async () => {
  try {
    await connectDB();

    const PORT = ENV_VARIABLES.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Express Gateway API Cluster running on Port: ${PORT}`);
    });
  } catch (error) {
    console.error(
      `Critical Web Server Initialization Failure: ${error.message}`,
    );
    process.exit(1);
  }
};

startWebServer();
