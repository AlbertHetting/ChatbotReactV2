import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { supabase } from "../lib/supabase";

/**
 * Client Action - Handles login form submission
 */
export async function clientAction({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  // Validate inputs
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  // Call Supabase Auth API to sign in
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error);
    // Return a user-friendly error message
    return { error: "Invalid email or password" };
  }

  // Success! Supabase has stored the JWT token in localStorage
  // The token will be automatically included in future requests
  console.log("Login successful! User:", data.user.email);
  console.log("JWT token has been stored in localStorage");

  // Redirect to home page
  return redirect("/");
}

/**
 * Login Component
 */
export default function Login() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Check if user was redirected here after successful registration
  const [searchParams] = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Log in to continue using the chatbot</p>

        {justRegistered && (
          <div className="success-message">
            Account created successfully! Please log in.
          </div>
        )}

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
              autoComplete="current-password"
              placeholder="Your password"
            />
          </div>

          {actionData?.error && (
            <div className="error-message">{actionData.error}</div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </Form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>

        {/* Educational hint */}
        <div className="auth-hint">
          <p>
            💡 <strong>Explore JWTs:</strong> After logging in, open DevTools →
            Application → Local Storage to see your JWT token. Copy it and paste
            it at{" "}
            <a href="https://jwt.io" target="_blank" rel="noopener noreferrer">
              jwt.io
            </a>{" "}
            to decode it!
          </p>
        </div>
      </div>
    </div>
  );
}
