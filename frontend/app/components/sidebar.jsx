function Sidebarfooter() {

    return(
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

function Sidebarheader(){
    return(
    <div className="sidebar-header">
          <h2 className="chatbot-title">Chatbot</h2>
          <a href="/chat/new" className="new-chat-btn">
            + New
          </a>
        </div>
    );
}

function Sidebarlist(){

            function ChatThreadItem(props) {

            return <a href={props.href} className="chat-thread-link">{props.title}</a>;
            }
        return(
        <nav className="chat-threads-list" aria-label="Chat threads">
          <ul>
            <li className="chat-thread-item">
            <ChatThreadItem href="/chat/why-sky-blue" title="Why is the sky blue?" />
            </li>
            <li className="chat-thread-item">
              <a href="/chat/best-pizza-toppings" className="chat-thread-link">
                What are the best pizza toppings?
              </a>
            </li>
            <li className="chat-thread-item">
           <ChatThreadItem href="/chat/why-sky-blue" title="Why is the sky blue?" />
            </li>
            <li className="chat-thread-item">
            <ChatThreadItem href="/chat/why-sky-blue" title="Why is the sky blue?" />
            </li>
            <li className="chat-thread-item">
            <ChatThreadItem href="/chat/why-sky-blue" title="Why is the sky blue?" />
            </li>
            <li className="chat-thread-item">
            <ChatThreadItem href="/chat/why-sky-blue" title="Why is the sky blue?" />
            </li>
            <li className="chat-thread-item">
             <ChatThreadItem href="/chat/why-sky-blue" title="Why is the sky blue?" />
            </li>
            <li className="chat-thread-item">
             <ChatThreadItem href="/chat/why-sky-blue" title="Why is the sky blue?" />
            </li>
            <li className="chat-thread-item">
             <ChatThreadItem href="/chat/why-sky-blue" title="Why is the sky blue?" />
            </li>
            <li className="chat-thread-item">
              <ChatThreadItem href="/chat/why-sky-blue" title="Why is the sky blue?" />
            </li>
            <li className="chat-thread-item">
            <ChatThreadItem href="/chat/why-sky-blue" title="Why is the sky blue?" />
            </li>
            <li className="chat-thread-item">
              <ChatThreadItem href="/chat/why-sky-blue" title="Why is the sky blue?" />
            </li>
            <li className="chat-thread-item">
             <ChatThreadItem href="/chat/why-sky-blue" title="Why is the sky blue?" />
            </li>
            <li className="chat-thread-item">
             <ChatThreadItem href="/chat/why-sky-blue" title="Why is the sky blue?" />
            </li>
          </ul>
        </nav>
        );
        }




export default function SideBar(){

    return(
          <aside className="sidebar">
  
        <Sidebarheader/>
        {/* Chat threads list */}
        <Sidebarlist />
        {/* Sidebar footer */}
        <Sidebarfooter/>
      </aside>
    );
}