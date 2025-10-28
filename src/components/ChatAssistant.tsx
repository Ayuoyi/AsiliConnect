import React, { useState } from "react";

const ChatAssistant = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch(`${process.env.REACT_APP_AI_PROXY || "http://localhost:3001"}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await resp.json();
      if (data?.ok && data.reply) {
        setMessages((m) => [...m, { role: "assistant", content: data.reply.content }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4">Assistant</h2>
        <div className="bg-card border border-border rounded p-4 mb-4">
          {messages.length === 0 && <div className="text-sm text-muted-foreground">Ask about products, orders or the marketplace.</div>}
          <div className="space-y-3 mt-3">
            {messages.map((m, i) => (
              <div key={i} className={`p-3 rounded ${m.role === "user" ? "bg-muted text-right" : "bg-primary/5"}`}>
                <div className="text-sm">{m.content}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput((e.target as HTMLInputElement).value)} placeholder="Ask a question..." className="flex-1 p-2 border rounded" />
          <button onClick={send} className="px-4 py-2 bg-primary text-white rounded" disabled={loading}>{loading ? "..." : "Send"}</button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
