import { ChatMessages, ChatInput } from "../components/Chat";
import { useLoaderData } from "react-router";

const defaultMessages = [
  {
    id: 1,
    type: "user",
    content: "Random Message!",
  },
  {
    id: 2,
    type: "bot",
    content: "Another random message!",
  },
];

export async function clientLoader({ params }) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const threadUrl = `${supabaseUrl}threads?id=eq.${params.threadId}&select=*`;

  const threadResponse = await fetch(threadUrl, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!threadResponse.ok) {
    console.error("SUPABASE 401 DETAILS");
    throw new Error(`failed to fetch threads ${threadResponse.status}`);
  }

  const threadData = await threadResponse.json();
  const thread = threadData[0];

  const messagesUrl = `${supabaseUrl}messages?thread_id=eq.${params.threadId}&select=*&order=created_at.asc`;

  const messageResponse = await fetch(messagesUrl, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!messageResponse.ok) {
    console.error("SUPABASE ERROR 404");
    throw new Error(`Failed to fetch messages: ${messageResponse.status}`);
  }

  const messages = await messageResponse.json();

  return { thread, messages };
}

export default function chatThread() {
  const { threadId, messages } = useLoaderData();

  const addMessage = (content) => {
    console.log("message submitted", content);
  };

  return (
    <main className="chat-container">
      <h2> Dette er: {threadId} </h2>
      <ChatMessages messages={messages} />
      <ChatInput onAddMessage={addMessage} />
    </main>
  );
}
