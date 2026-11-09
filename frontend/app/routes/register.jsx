/**
 * Registration Route
 *
 * This route allows new users to create an account.
 *
 * Authentication Flow:
 * 1. User enters email and password in the form
 * 2. Form submits to clientAction (runs on form submission)
 * 3. clientAction calls Supabase Auth API (supabase.auth.signUp)
 * 4. Supabase creates a new user in the auth.users table
 * 5. Supabase hashes the password using bcrypt (never stored in plain text!)
 * 6. User is redirected to login page to sign in
 *
 * Password Security:
 * - Passwords are NEVER stored in plain text
 * - Supabase uses bcrypt to hash passwords before storing
 * - Even database admins cannot see actual passwords
 * - Each password gets a unique "salt" to prevent rainbow table attacks
 *
 * Email Verification:
 * By default, Supabase sends a verification email after signup.
 * For development, you can disable this in Supabase Dashboard:
 * Authentication > Settings > Enable email confirmations: OFF
 */

import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
} from "react-router";
import { supabase } from "../lib/supabase";

/**
 * Client Action - Handles form submission
 *
 * This function runs when the form is submitted.
 * It processes the registration and returns either:
 * - A redirect (on success)
 * - An error object (on failure) that can be displayed to the user
 */
export async function clientAction({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  // Validate inputs on the frontend before sending to Supabase
  if (!email || !password || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  // Call Supabase Auth API to create the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Registration error:", error);
    return { error: error.message };
  }

  // Success! User account created
  // Redirect to login page with a query parameter
  return redirect("/login?registered=true");
}

/**
 * Register Component
 *
 * Renders the registration form and handles user interactions.
 */
export default function Register() {
  // useActionData gives us the return value from clientAction (if any)
  // This will contain error messages if registration failed
  const actionData = useActionData();

  // useNavigation tells us if a form is currently submitting
  // We use this to show a loading state on the submit button
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Sign up to start using the chatbot</p>

        <Form method="post" className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="new-password"
              minLength={6}
              placeholder="At least 6 characters"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              autoComplete="new-password"
              minLength={6}
              placeholder="Re-enter your password"
            />
          </div>

          {actionData?.error && (
            <div className="error-message">{actionData.error}</div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </Form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
