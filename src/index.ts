import dotenv from 'dotenv';
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import platformAuthRouter from './routes/platformAuthRoutes';
import tenantRouter from './routes/tenantRoutes';
import paymentRouter from './routes/paymentRoutes';
import "./event/paymentEvent"
import adminRouter from './routes/adminRoutes';
import userServiceRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';
dotenv.config();

const app: Express = express();

// Middleware
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use("/api/payments", paymentRouter);
app.use(express.json());
app.use(cookieParser());

//routes

app.use("/api/platform/auth",platformAuthRouter);
app.use("/api/platform/tenant",tenantRouter);
app.use("/api/:slug/auth",authRouter);
app.use("/api/:slug/admin",adminRouter)
app.use("/api/:slug/user",userServiceRouter)



// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('Error', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  const isOperational = err.isOperational || false;

  if (isOperational) {
    res.status(statusCode).json({ success: false, message });
  } else {
    res.status(statusCode).json({ success: false, error: 'Internal Server Error' });
  }
});

export default app;
