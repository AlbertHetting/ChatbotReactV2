import { Outlet, useLoaderData, redirect } from "react-router";
import Sidebar from "../components/Sidebar.jsx";

/**
 * CLIENT LOADER FUNCTION
 * Fetches the list of chat threads from our Node.js backend.
 */
export async function clientLoader() {
  const response = await fetch("http://localhost:3000/api/threads");

  if (!response.ok) {
    throw new Error(`Failed to fetch threads: ${response.status}`);
  }

  const threads = await response.json();
  return { threads };
}

/**
 * CLIENT ACTION FUNCTION
 * Handles thread deletion requests via our Node.js backend.
 */
export async function clientAction({ request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const threadId = formData.get("threadId");

  if (intent === "delete" && threadId) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/threads/${threadId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        return { error: `Failed to delete thread: ${response.status}` };
      }

      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }

  return null;
}

export default function Layout() {
  // Access threads data from the loader
  const { threads } = useLoaderData();

  return (
    <div className="app-layout">
      <Sidebar threads={threads} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
