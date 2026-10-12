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
  await new Promise((resolve) => setTimeout(resolve, 500));

  const mockMessages = [
    {
      id: 1,
      type: "user",
      content: `this is a message in thread ${params.threadid}`,
    },
    {
      id: 1,
      type: "bot",
      content: `this is a response ${params.threadid}`,
    },
  ];

  return {
    threadId: params.threadId,
    messages: mockMessages,
  };
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
