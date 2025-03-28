//This code implements a subscription reminder system that sends email 
// notifications to users at specific intervals before their subscription renewal date.

import dayjs from 'dayjs'; // Lightweight date library for date manipulation
import { createRequire } from 'module'; // Node.js module to create require function in ESM
const require = createRequire(import.meta.url); // Create require function for ESM
const { serve } = require("@upstash/workflow/express"); // Upstash Workflow's Express integration
import Subscription from '../models/subscription.model.js'; // Mongoose Subscription model
import { sendReminderEmail } from '../utils/send-email.js'; // Email sending utility

// Define reminder intervals (in days before renewal)
const REMINDERS = [7, 5, 2, 1]; // Reminders will be sent 7, 5, 2, and 1 day before renewal

/**
 * @function sendReminders
 * @desc Main workflow function to handle subscription reminders
 */
export const sendReminders = serve(async (context) => {
  // Extract subscription ID from the workflow trigger payload
  const { subscriptionId } = context.requestPayload;
  
  // Fetch the subscription details from database
  const subscription = await fetchSubscription(context, subscriptionId);

  // Check if subscription exists and is active
  if (!subscription || subscription.status !== 'active') {
    console.log(`Subscription ${subscriptionId} not found or inactive`);
    return; // Exit workflow if subscription is invalid
  }

  // Parse the renewal date using dayjs
  const renewalDate = dayjs(subscription.renewalDate);

  // Check if renewal date has already passed
  if (renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
    return; // Exit workflow if renewal date is in the past
  }

  // Process each reminder in the REMINDERS array
  for (const daysBefore of REMINDERS) {
    // Calculate the exact date when this reminder should be sent
    const reminderDate = renewalDate.subtract(daysBefore, 'day');

    // If reminder date is in the future, sleep until that date
    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(
        context, 
        `Reminder ${daysBefore} days before`, 
        reminderDate
      );
    }

    // If current date matches reminder date, send the reminder
    if (dayjs().isSame(reminderDate, 'day')) {
      await triggerReminder(
        context, 
        `${daysBefore} days before reminder`, 
        subscription
      );
    }
  }
});

/**
 * @function fetchSubscription
 * @desc Fetches subscription details from database with user information
 */
const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    // Find subscription by ID and populate user's name and email
    return Subscription.findById(subscriptionId).populate('user', 'name email');
  });
  // Note: context.run provides automatic retries and execution tracking
};

/**
 * @function sleepUntilReminder
 * @desc Pauses workflow execution until the specified reminder date
 */
const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  // Use Upstash's sleepUntil to pause workflow until specified date
  await context.sleepUntil(label, date.toDate());
  // Workflow will automatically resume execution at this point
};

/**
 * @function triggerReminder
 * @desc Sends a reminder email for the subscription
 */
const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);
    
    // Send reminder email using the email utility
    await sendReminderEmail({
      to: subscription.user.email, // User's email address
      type: label, // Reminder type (e.g., "7 days before reminder")
      subscription, // Full subscription data
    });
    
    // context.run provides automatic retries if email sending fails
  });
};