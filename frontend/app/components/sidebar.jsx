import React from "react";
import { href, Link, NavLink } from "react-router";

function SidebarHeader() {
  return (
    <div className="sidebar-header">
      <h2 className="chatbot-title">Chatbot</h2>
      <Link to="/chat/new" className="new-chat-btn">
        + New
      </Link>
    </div>
  );
}

function ChatThreadItem({ thread, onDeleteThread }) {
  const { id, title } = thread;

  const handleDeleteClick = (event) => {
    // Prevent the click from bubbling up to parent elements
    event.stopPropagation();

    // Call the callback function passed from parent to delete the thread
    if (onDeleteThread) {
      onDeleteThread(id);
    }
  };

  return (
    <li className="chat-thread-item">
      <div className="chat-thread-item-content">
        <NavLink
          to={href("/chat/:threadId", { threadId: id })}
          className={({ isActive }) =>
            isActive
              ? "chat-thread-link chat-thread-link-active"
              : "chat-thread-link"
          }
        >
          {title}
        </NavLink>
        <button
          className="delete-thread-btn"
          aria-label={`Delete thread: ${title}`}
          title="Delete this conversation"
          type="button"
          onClick={handleDeleteClick}
        >
          &times;
        </button>
      </div>
    </li>
  );
}

function ChatThreadsList({ threads = [], onDeleteThread }) {
  // LOCAL STATE: Managing search input value (controlled component)
  const [searchValue, setSearchValue] = React.useState("");

  // EVENT HANDLER: Update search value as user types
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredThreads = threads.filter((thread) =>
    thread.title.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <nav className="chat-threads-list" aria-label="Chat threads">
      {/* Search input - CONTROLLED COMPONENT */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search conversations..."
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      <ul>
        {/* Render filtered threads instead of all threads */}
        {filteredThreads.map((thread) => (
          <ChatThreadItem
            key={thread.id}
            thread={thread}
            onDeleteThread={onDeleteThread}
          />
        ))}
      </ul>
    </nav>
  );
}

/**
 * SidebarFooter Component
 *
 * Handles the user profile section at the bottom of the sidebar.
 * Demonstrates component modularity and independence.
 */
function SidebarFooter() {
  return (
    <div className="sidebar-footer">
      <a href="/profile" className="user-profile">
        <img
          src="https://ui-avatars.com/api/?name=Batman&background=0D0D0D&color=fff&size=40"
          alt="User avatar"
          className="user-avatar"
          width={30}
          height={30}
        />
        <span className="user-name">Batman</span>
      </a>
    </div>
  );
}

/**
 * Main Sidebar Component
 *
 * Now handles CALLBACK PROP DRILLING! Key concepts:
 * 1. DESTRUCTURING: Extract both data and callback functions
 * 2. CALLBACK DRILLING: Pass functions down through component hierarchy
 * 3. INTERMEDIATE COMPONENT: Forwards callbacks without using them directly
 * 4. SEPARATION OF CONCERNS: Sidebar doesn't handle delete logic
 * 5. PROP FORWARDING: Clean pattern for passing props to children
 */
export default function Sidebar({ threads, onDeleteThread }) {
  return (
    <aside className="sidebar">
      {/* Component composition with both data and callback drilling */}
      <SidebarHeader />
      <ChatThreadsList threads={threads} onDeleteThread={onDeleteThread} />
      <SidebarFooter />
    </aside>
  );
}
