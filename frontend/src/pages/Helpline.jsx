import { useEffect, useRef, useState } from "react";
import { Headset, Send, ShieldCheck, Clock3, MessageCircle, Sparkles } from "lucide-react";
import { helplineApi } from "../api/client";

const SESSION_KEY = "civix_helpline_session";
const CONVO_KEY = "civix_helpline_conversation";

function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `citizen-${crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export default function Helpline() {
  const [conversation, setConversation] = useState(null);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);

  async function start() {
    setLoading(true); setError("");
    try {
      const data = await helplineApi.start({ sessionId: getSessionId(), name, contact });
      setConversation(data);
      localStorage.setItem(CONVO_KEY, data.conversationId);
      setStarted(true);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  useEffect(() => {
    const existing = localStorage.getItem(CONVO_KEY);
    if (!existing) { setLoading(false); return; }
    helplineApi.get(existing).then((data) => { setConversation(data); setStarted(true); }).catch(() => localStorage.removeItem(CONVO_KEY)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!conversation?.conversationId) return;
    const poll = setInterval(async () => {
      try { setConversation(await helplineApi.get(conversation.conversationId)); } catch {}
    }, 2500);
    return () => clearInterval(poll);
  }, [conversation?.conversationId]);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [conversation?.messages?.length]);

  async function send(e) {
    e.preventDefault();
    if (!text.trim() || !conversation || sending) return;
    setSending(true); setError("");
    try {
      const data = await helplineApi.send(conversation.conversationId, { sessionId: getSessionId(), text });
      setConversation(data); setText("");
    } catch (err) { setError(err.message); } finally { setSending(false); }
  }

  return (
    <main className="helpline-page">
      <div className="helpline-glow" />
      <section className="helpline-shell">
        <div className="helpline-intro">
          <span className="section-eyebrow"><Headset size={13} /> Citizen Helpline</span>
          <h1>Talk to a real <span>support team.</span></h1>
          <p>Have a question about a complaint, need help reporting an issue, or just want an update? Start a private conversation and our team can reply directly.</p>
          <div className="helpline-trust-row">
            <span><ShieldCheck size={15} /> Private conversation</span>
            <span><Clock3 size={15} /> Team replies live</span>
            <span><MessageCircle size={15} /> No phone call needed</span>
          </div>
        </div>

        <div className="helpline-card">
          {!started ? (
            <div className="helpline-start">
              <div className="helpline-avatar"><Headset size={24} /></div>
              <div>
                <p className="helpline-kicker">CIVI-X SUPPORT DESK</p>
                <h2>How can we help?</h2>
                <p className="helpline-muted">Give us a name so the team knows who they’re speaking with. Contact details are optional.</p>
              </div>
              <div className="helpline-form">
                <input className="input-base" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="input-base" placeholder="Email or phone (optional)" value={contact} onChange={(e) => setContact(e.target.value)} />
                <button className="btn-primary w-full" onClick={start} disabled={loading}>{loading ? "Connecting…" : "Start conversation"} <Send size={15} /></button>
              </div>
              {error && <p className="helpline-error">{error}</p>}
            </div>
          ) : (
            <div className="chat-window">
              <div className="chat-header">
                <div className="chat-agent"><span className="chat-agent-avatar"><Headset size={17} /></span><div><b>Civi-X Helpline</b><small><i /> Online support team</small></div></div>
                <span className="chat-id">{conversation.conversationId}</span>
              </div>
              <div className="chat-messages">
                <div className="chat-system"><Sparkles size={13} /> Your conversation is now connected</div>
                {conversation.messages?.map((m) => (
                  <div key={m._id || `${m.at}-${m.text}`} className={`chat-row ${m.sender === "user" ? "user" : "admin"}`}>
                    <div className="chat-bubble">{m.text}<small>{new Date(m.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small></div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>
              {conversation.status === "closed" ? <div className="chat-closed">This conversation has been closed by the support team.</div> : (
                <form className="chat-composer" onSubmit={send}>
                  <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message to the helpline…" maxLength={2000} />
                  <button disabled={sending || !text.trim()} aria-label="Send message"><Send size={18} /></button>
                </form>
              )}
              {error && <p className="helpline-error px-5 pb-4">{error}</p>}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
