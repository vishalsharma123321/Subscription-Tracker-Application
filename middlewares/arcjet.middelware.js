
import { aj } from '../config/arcjet.js';

/**
 * ArcJet Protection Middleware
 * 
 * This middleware integrates ArcJet's security protections into Express routes.
 * It handles:
 * - Rate limiting
 * - Bot detection
 * - General request protection
 */
const arcjetMiddleware = async (req, res, next) => {
  try {
    // Request protection decision from ArcJet
    // The { requested: 1 } parameter counts this as 1 request for rate limiting purposes
    const decision = await aj.protect(req, { requested: 1 });

    // Check if ArcJet denied the request
    if (decision.isDenied()) {
      // Handle different denial reasons with appropriate HTTP responses
      
      // Case 1: Rate limit exceeded
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ 
          error: 'Rate limit exceeded',
          message: 'Too many requests, please try again later'
        });
      }
      
      // Case 2: Automated bot detected
      if (decision.reason.isBot()) {
        return res.status(403).json({ 
          error: 'Bot detected',
          message: 'Automated requests are not allowed'
        });
      }

      // Case 3: General protection rule triggered
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'This request was blocked by security rules'
      });
    }

    // If request is allowed, proceed to next middleware/route handler
    next();
    
  } catch (error) {
    // Error handling for ArcJet service failures
    
    // Log the error for debugging and monitoring
    console.error(`ArcJet Middleware Error: ${error.message}`, {
      timestamp: new Date().toISOString(),
      path: req.path,
      errorDetails: error
    });
    
    // Continue to next middleware (fail-open design)
    // This ensures service availability even if ArcJet fails
    next(error);
  }
}

// Export the middleware for use in Express routes
export default arcjetMiddleware;