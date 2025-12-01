import app from ".";
import PrismaSingleton from "./config/prisma.singleton";

const prisma = PrismaSingleton.getInstance();

process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

const server = app.listen(3000, () => {
  console.log("Server started on port 3000");
});

process.on(
  "unhandledRejection",
  async (reason: unknown, promise: Promise<unknown>) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    await prisma.$disconnect();
    server.close(() => process.exit(1));
  }
);

process.on("SIGINT", async () => {
  console.log("Stopping app (SIGINT)...");

  try {
    // Close Prisma connections
    await prisma.$disconnect();
    console.log("✅ Prisma disconnected");

    // Close the server gracefully
    server.close(() => {
      console.log("✅ Server closed");
      process.exit(0);
    });
  } catch (err) {
    console.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
});

