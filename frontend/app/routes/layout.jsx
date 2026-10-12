import { Outlet } from "react-router";
import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import { useLoaderData } from "react-router";

export async function clientLoader() {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const mockThread = [
    {
      id: 1,
      title: "How to learn programming?",
    },
    {
      id: 2,
      title: "What are the best pizza toppings?",
    },
    {
      id: 3,
      title: "Can you explain quantum physics?",
    },
    {
      id: 4,
      href: "/chat/morning-routine-ideas",
      title: "Help me create a morning routine",
    },
    {
      id: 5,
      title: "What should I do this weekend?",
    },
    { id: 6, href: "/chat/why-sky-blue", title: "Why is the sky blue?" },
    {
      id: 7,
      title: "How do I learn a new language?",
    },
    {
      id: 8,
      title: "What's the meaning of life?",
    },
    { id: 9, href: "/chat/funny-joke-please", title: "Tell me a funny joke" },
    {
      id: 10,
      title: "What's a healthy dinner idea?",
    },
    {
      id: 11,
      title: "Recommend me a good book",
    },
    {
      id: 12,
      title: "Give me a creative writing prompt",
    },
    {
      id: 13,
      title: "My computer is slow, help?",
    },
    {
      id: 14,
      title: "Tell me an interesting history fact",
    },
  ];

  return {
    threads: mockThread,
  };
}

/**
 * Layout Component
 *
 * Now demonstrates STATE MANAGEMENT and CALLBACK PATTERNS:
 * 1. USESTATE HOOK: Managing dynamic data that changes over time
 * 2. STATE UPDATES: Immutable updates using array filter method
 * 3. CALLBACK PROPS: Passing functions down to child components
 * 4. DATA FLOW: State updates flow up, data flows down
 * 5. COMPONENT COMMUNICATION: Parent-child communication via callbacks
 */
export default function Layout() {
  const { threads } = useLoaderData();

  // CALLBACK FUNCTION: Handle deleting a thread by ID
  const deleteThread = (threadId) => {
    console.log("Layout: Deleting thread with ID:", threadId);
  };

  return (
    <div className="app-layout">
      {/* Passing both data and callbacks via prop drilling */}
      <Sidebar threads={threads} onDeleteThread={deleteThread} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
