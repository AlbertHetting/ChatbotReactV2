import {
  useActionData,
  Form,
  redirect,
  Link,
  useRouteLoaderData,
} from "react-router";

/**
 * Edit Thread Title Route Component
 *
 * Simple form to edit a thread's title.
 * Key concepts:
 * 1. DEDICATED ROUTE: Separate page for editing
 * 2. NESTED ROUTE: Child route of chat-thread, rendered in Outlet
 * 3. useRouteLoaderData(): Access parent route's loader data without refetching
 * 4. SIMPLE FORM: Just one input field and buttons
 * 5. UNCONTROLLED INPUT: Using defaultValue, read from formData in action
 * 6. REDIRECT ON SUCCESS: Returns to parent route after save
 * 7. NAVIGATION: URL represents UI state (editing vs viewing)
 */
export default function ChatThreadEdit() {
  // Access the thread data from the parent route's loader
  // useRouteLoaderData avoids needing a separate clientLoader here
  const { thread } = useRouteLoaderData("routes/chat-thread");

  // Access any errors from the action
  const actionData = useActionData();

  return (
    <div className="edit-title-overlay">
      <Form method="post" className="edit-title-form">
        <div className="form-field">
          <label htmlFor="title">Edit thread title</label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={thread.title}
            autoFocus
            required
            className="title-input"
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="save-button">
            Save
          </button>
          <Link to=".." className="cancel-button">
            Cancel
          </Link>
        </div>
      </Form>
      {actionData?.error && (
        <div className="error-message">{actionData.error}</div>
      )}
    </div>
  );
}

/**
 * CLIENT ACTION FUNCTION
 *
 * Handles the form submission to update the thread title.
 * Key concepts:
 * 1. PATCH REQUEST: Partial update of the thread resource
 * 2. VALIDATION: Check that title is not empty
 * 3. REDIRECT: Navigate back to thread view on success
 * 4. ERROR HANDLING: Return errors to display in UI
 *
 * The action runs:
 * - When the Form with method="post" is submitted
 * - Returns redirect to parent route on success
 */
export async function clientAction({ params, request }) {
  const apiUrl = import.meta.env.VITE_API_URL;

  // Extract form data
  const formData = await request.formData();
  const title = formData.get("title");

  // Validate title
  if (!title || !title.trim()) {
    return { error: "Title cannot be empty" };
  }

  try {
    // PATCH to our custom API to update the thread title
    const response = await fetch(`${apiUrl}/api/threads/${params.threadId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: title.trim() }),
    });

    // Check for validation errors (400)
    if (response.status === 400) {
      const error = await response.json();
      return { error: error.error || "Invalid title" };
    }

    // Check for not found (404)
    if (response.status === 404) {
      return { error: "Thread not found" };
    }

    // Check for other errors
    if (!response.ok) {
      return { error: `Failed to update title: ${response.status}` };
    }

    // Success! Redirect back to the thread view
    // ".." navigates to the parent route
    return redirect("..");
  } catch (error) {
    return { error: error.message };
  }
}
