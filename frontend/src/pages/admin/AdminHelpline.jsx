import { useEffect, useMemo, useState } from "react";
import { Headset, Send, UserRound, Circle, CheckCircle2 } from "lucide-react";
import { helplineApi } from "../../api/client";

export default function AdminHelpline() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const selected = useMemo(() => items.find((x) => x.conversationId === selectedId) || items[0], [items, selectedId]);

  async function load() {
    try { const data = await helplineApi.adminList(); setItems(data.items); if (!selectedId && data.items[0]) setSelectedId(data.items[0].conversationId); } finally { setLoading(false); }
  }
  useEffect(() => { load(); const timer = setInterval(load, 2500); return () => clearInterval(timer); }, []);

  async function send(e) {
    e.preventDefault(); if (!text.trim() || !selected) return;
    const updated = await helplineApi.adminSend(selected.conversationId, text);
    setItems((prev) => prev.map((x) => x.conversationId === updated.conversationId ? updated : x)); setText("");
  }
  async function toggleStatus() {
    if (!selected) return;
    const updated = await helplineApi.setStatus(selected.conversationId, selected.status === "open" ? "closed" : "open");
    setItems((prev) => prev.map((x) => x.conversationId === updated.conversationId ? updated : x));
  }

  return <div className="admin-helpline-page">
    <div><span className="section-eyebrow"><Headset size={13}/> Citizen Helpline</span><h1 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">Talk directly with citizens</h1><p className="mt-1.5 text-sm text-white/45">Live support inbox. New messages appear automatically.</p></div>
    <div className="admin-chat-layout">
      <aside className="admin-conversations card-base">
        <div className="admin-inbox-head"><div><b>Conversations</b><small>{items.length} total</small></div><span className="live-dot"><Circle size={8} fill="currentColor"/> Live</span></div>
        <div className="admin-conversation-list">
          {loading && <p className="empty-chat">Loading inbox…</p>}
          {!loading && !items.length && <p className="empty-chat">No citizen conversations yet.</p>}
          {items.map((item) => { const last = item.messages?.[item.messages.length - 1]; return <button key={item.conversationId} onClick={() => setSelectedId(item.conversationId)} className={`admin-conversation ${selected?.conversationId === item.conversationId ? "active" : ""}`}><span className="admin-user-avatar"><UserRound size={15}/></span><span className="admin-conversation-copy"><b>{item.name || "Citizen"}</b><small>{last?.text || "New conversation"}</small></span><span className={`admin-status-dot ${item.status}`}/></button>})}
        </div>
      </aside>
      <section className="admin-chat card-base">
        {!selected ? <div className="empty-chat"><Headset size={30}/><p>Select a conversation to start replying.</p></div> : <>
          <header className="admin-chat-head"><div className="admin-chat-person"><span className="admin-user-avatar big"><UserRound size={18}/></span><div><b>{selected.name || "Citizen"}</b><small>{selected.contact || "No contact details"} · {selected.conversationId}</small></div></div><button onClick={toggleStatus} className="admin-status-btn">{selected.status === "open" ? <><CheckCircle2 size={14}/> Close chat</> : "Re-open chat"}</button></header>
          <div className="admin-chat-messages">{selected.messages?.map((m) => <div key={m._id || `${m.at}-${m.text}`} className={`admin-msg ${m.sender === "admin" ? "out" : "in"}`}><div>{m.text}<small>{new Date(m.at).toLocaleString([], { hour: "2-digit", minute: "2-digit" })}</small></div></div>)}</div>
          {selected.status === "open" ? <form onSubmit={send} className="admin-chat-composer"><input value={text} onChange={(e) => setText(e.target.value)} placeholder="Reply to the citizen…"/><button disabled={!text.trim()}><Send size={17}/></button></form> : <div className="chat-closed">Conversation closed.</div>}
        </>}
      </section>
    </div>
  </div>;
}
