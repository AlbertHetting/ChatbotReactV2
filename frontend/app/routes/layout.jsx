import { Outlet } from "react-router";
import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import { useLoaderData } from "react-router";

export async function clientLoader() {

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  


  const url = `${supabaseUrl}/rest/v1/threads?select=*&order=created_at.desc`;

  console.log("MY URL IS:", url);
  console.log("MY KEY:", supabaseKey);

  const response = await fetch(url, {
    headers:{
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`
    }
  })

  if (!response.ok){
    throw new Error(`failed to fetch threads ${response.status}`)
  }


  const threads = await response.json();

  console.log(import.meta.env.VITE_SUPABASE_URL)

  return { threads }
}


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
