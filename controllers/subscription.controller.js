// Import required models and configurations
import Subscription from '../models/subscription.model.js'; // Mongoose Subscription model
import { workflowClient } from '../config/upstash.js'; // Upstash workflow client for triggering workflows
import { SERVER_URL } from '../config/env.js'; // Base server URL from environment variables

// Create a new subscription for the authenticated user and trigger a reminder workflow
export const createSubscription = async (req, res, next) => {
  try {
    // 1. Create a new subscription in the database
    // - Spread all fields from req.body (e.g., plan, duration)
    // - Attach the user's ID from the authenticated request (req.user._id)
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    // 2. Trigger an external workflow (e.g., Upstash) to schedule reminders
    // - Calls a predefined workflow endpoint (e.g., for sending reminders)
    // - Passes the subscription ID to the workflow for reference
    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`, // Workflow endpoint
      body: {
        subscriptionId: subscription.id, // Pass subscription ID to the workflow
      },
      headers: {
        'content-type': 'application/json', // Set content type
      },
      retries: 0, // Disable retries if the workflow fails
    });

    // 3. Return success response (201 Created) with the new subscription and workflow ID
    res.status(201).json({
      success: true,
      data: { subscription, workflowRunId }, // Include workflowRunId for tracking
    });

  } catch (e) {
    // Pass any errors to the Express error handler
    next(e);
  }
};

// Fetch all subscriptions for a specific user (with ownership validation)
export const getUserSubscription = async (req, res, next) => {
  try {
    // 1. Validate ownership: Check if the authenticated user (req.user.id) matches the requested user (req.params.id)
    // - Prevents users from accessing others' subscriptions
    if (req.user.id !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.status = 401; // Unauthorized status code
      throw error; // Triggers the catch block
    }

    // 2. Fetch all subscriptions for the user from the database
    const subscriptions = await Subscription.find({ user: req.params.id });

    // 3. Return success response (200 OK) with the subscriptions list
    res.status(200).json({
      success: true,
      data: subscriptions,
    });

  } catch (e) {
    // Pass any errors to the Express error handler
    next(e);
  }
};