/**
 * Authentication Middleware
 *
 * This module provides authentication functionality for the Express API.
 * It uses Supabase Auth to verify JWT tokens sent by the frontend.
 *
 * Key Concepts:
 * 1. MIDDLEWARE: Functions that run before route handlers to add functionality
 * 2. JWT VERIFICATION: Validating tokens to ensure they're legitimate
 * 3. BEARER TOKEN: Standard format for sending tokens in HTTP headers
 * 4. AUTHENTICATION: Verifying "you are who you say you are"
 * 5. REQUEST AUGMENTATION: Adding user info to req object for route handlers
 *
 * How Authentication Works:
 * 1. Frontend sends JWT token in Authorization header: "Bearer <token>"
 * 2. Middleware extracts and verifies the token with Supabase
 * 3. If valid, user ID is attached to req.userId for route handlers to use
 * 4. If invalid/missing, middleware returns 401 Unauthorized
 * 5. Route handler only runs if authentication succeeds
 *
 * Middleware Order Matters:
 * - Middleware functions execute in the order they're added with app.use()
 * - requireAuth must come AFTER body parsing middleware
 * - requireAuth must come BEFORE protected route handlers
 *
 * Example Usage:
 *   app.get('/api/threads', requireAuth, async (req, res) => {
 *     // req.userId is available here
 *     const userId = req.userId;
 *   });
 */

import { createClient } from "@supabase/supabase-js";

// ========== Initialize Supabase Client ========== //

/**
 * Create a Supabase client instance for the backend.
 *
 * This is similar to the frontend Supabase client, but used server-side.
 * It connects to the same Supabase project and can verify JWT tokens.
 *
 * Environment Variables Required:
 * - SUPABASE_URL: Your Supabase project URL (e.g., https://xxx.supabase.co)
 * - SUPABASE_ANON_KEY: Your Supabase anonymous/public key
 *
 * Note: The anon key is safe to use here because it's designed to be public.
 * It allows the backend to verify tokens but not perform admin operations.
 */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing required environment variables: SUPABASE_URL and SUPABASE_ANON_KEY must be set"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ========== Authentication Middleware ========== //

/**
 * requireAuth - Middleware to protect routes with authentication
 *
 * This middleware verifies that the request includes a valid JWT token.
 * If the token is valid, it extracts the user ID and attaches it to req.userId.
 * If the token is missing or invalid, it returns a 401 Unauthorized response.
 *
 * How it works:
 * 1. Extract the Authorization header from the request
 * 2. Parse the Bearer token format: "Bearer <jwt-token>"
 * 3. Verify the token with Supabase Auth
 * 4. If valid, attach user ID to req.userId and call next()
 * 5. If invalid, return 401 error and stop the request
 *
 * The 401 Status Code:
 * - 401 Unauthorized means "authentication is required and has failed"
 * - Different from 403 Forbidden (authenticated but not allowed)
 * - Tells the client to prompt for login credentials
 *
 * Using req.userId in Route Handlers:
 * - After this middleware runs successfully, req.userId contains the user's ID
 * - Route handlers can use this to filter data by user
 * - Example: WHERE user_id = ${req.userId} (coming in PR #17!)
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function (calls the next middleware/handler)
 */
export async function requireAuth(req, res, next) {
  try {
    // Step 1: Extract the Authorization header
    // Format should be: "Bearer <jwt-token>"
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        error: "Authentication required. Please provide a valid token.",
      });
    }

    // Step 2: Extract the token from the "Bearer <token>" format
    // Split by space and take the second part
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Invalid authorization header format. Expected: Bearer <token>",
      });
    }

    // Step 3: Verify the token with Supabase Auth
    // supabase.auth.getUser() validates the JWT and returns the user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    // Check if token verification failed
    if (error || !user) {
      return res.status(401).json({
        error: "Invalid or expired token. Please log in again.",
      });
    }

    // Step 4: Token is valid! Attach user ID to the request object
    // This makes the user ID available to all route handlers
    req.userId = user.id;

    // Step 5: Call next() to continue to the route handler
    // Without calling next(), the request would hang
    next();
  } catch (error) {
    // Catch any unexpected errors during authentication
    console.error("Authentication error:", error);
    return res.status(401).json({
      error: "Authentication failed. Please try again.",
    });
  }
}
