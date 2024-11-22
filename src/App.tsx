import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect, useState } from "react";


export default function App() {
  const messages = useQuery(api.messages.list);
  const sendMessage = useMutation(api.messages.send);

  const [newMessageText, setNewMessageText] = useState("");

  const [userName, setUserName] = useState("Convidado");
  const [isNameSet, setIsNameSet] = useState(false);

  useEffect(() => {
    // Make sure scrollTo works on button click in Chrome
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 0);
  }, [messages]);

  if (!isNameSet) {
    return (
      <main className="name-card">
        <div className="card">
          <h2>Bem-vindo ao Convex Chat!</h2>
          <p>Qual é o seu nome?</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (userName.trim()) {
                setIsNameSet(true); 
              }
            }}
          >
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Digite seu nome…"
            />
            <button type="submit" disabled={!userName.trim()}>
              Entrar
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="chat">
      <header>
        <h1>Convex Chat</h1>
        <p>
          Connected as <strong>{userName}</strong>
        </p>
      </header>
      {messages?.map((message) => (
        <article
          key={message._id}
          className={message.author === userName ? "message-mine" : ""}
        >
          <div>{message.author}</div>

          <p>{message.body}</p>
        </article>
      ))}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await sendMessage({ body: newMessageText, author: userName });
          setNewMessageText("");
        }}
      >
        <input
          value={newMessageText}
          onChange={async (e) => {
            const text = e.target.value;
            setNewMessageText(text);
          }}
          placeholder="Write a message…"
        />
        <button type="submit" disabled={!newMessageText}>
          Send
        </button>
      </form>
    </main>
  );
}
