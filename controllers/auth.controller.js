import bcrypt from "bcryptjs"; // Library for password hashing
import mongoose from "mongoose"; // MongoDB ORM
import User from "../models/user.model.js"; // User schema
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js"; // JWT configuration
import JWT from "jsonwebtoken"; // Library for JWT authentication

/**
 * User Registration (Sign Up)
 */
export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession(); // Start a database transaction
    try {
        session.startTransaction(); 

        // Extract user details from request body
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }

        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user in the database
        const newUser = await User.create([{ name, email, password: hashedPassword }], { session });

        // Generate a JWT token for authentication
        const token = JWT.sign({ userId: newUser[0].id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        // Send success response with the generated token
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUser[0],
            },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error); // Pass error to error handling middleware
    }
};

/**
 * User Login (Sign In)
 */
export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        
        // Compare entered password with hashed password in DB
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error("Invalid Password!");
            error.statusCode = 401;
            throw error;
        }

        // Generate a new JWT token for the user
        const token = JWT.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                token,
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * User Logout (Sign Out)
 */
export const signOut = async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Remove the JWT Token from the cookie for the sign-out process !!!!!",
    });
};
