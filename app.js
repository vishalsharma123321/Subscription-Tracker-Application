import express from "express";
import cookieParser from "cookie-parser";
import { PORT } from './config/env.js';
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middelware.js";
import workflowRouter from "./routes/workflow.routes.js";

const app = express();

// Middleware to parse JSON data in incoming requests
app.use(express.json());

// Middleware to parse URL-encoded form data
// { extended: false } means it will only parse simple key-value pairs (not nested objects)
app.use(express.urlencoded({ extended: false }));

// Middleware to parse cookies in incoming requests
app.use(cookieParser());

// Custom middleware for additional processing (arcjetMiddleware)
app.use(arcjetMiddleware);

// Route handlers for different parts of the API
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/workflows", workflowRouter);

// Middleware to handle errors globally
app.use(errorMiddleware);

// Default route to check if the server is running
app.get('/', (req, res) => {
    res.send("Welcome to the Subscription Tracker API!");
});

// Function to start the server and connect to the database
const startServer = async () => {
    try {
        await connectToDatabase(); // Connects to MongoDB
        app.listen(PORT, () => {
            console.log(`The Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to the server:", error);
        process.exit(1); // Exits the process if the server fails to start
    }
};

// Start the server
startServer();

export default app;
