import { useState, useRef } from "react";
import { MessageCircle, Send } from "lucide-react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi! I'm CityCare assistant. How can I help?", from: "bot" }]);
  const [input, setInput] = useState("");
  const scrolRef = useRef();

  const sendToBackend = async (text) => {
    setMessages((m) => [...m, { text, from: "user" }]);
    setInput("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/chatbot`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      setMessages((m) => [...m, { text: data.reply || "Sorry, try again." , from: "bot" }]);
    } catch (err) {
      setMessages((m) => [...m, { text: "Server error. Try later.", from: "bot" }]);
    }
    scrolRef.current?.scrollIntoView({behavior:"smooth"});
  };

  const handleSend = () => {
    if (!input.trim()) return;
    sendToBackend(input.trim());
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-80 bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div className="p-3 border-b flex items-center justify-between">
            <div className="font-semibold">CityCare Bot</div>
            <button onClick={() => setOpen(false)} className="text-sm text-gray-500">Close</button>
          </div>
          <div className="p-3 h-56 overflow-auto space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={m.from==="bot" ? "text-left" : "text-right"}>
                <div className={`inline-block px-3 py-1 rounded-lg ${m.from==="bot"?"bg-gray-100 dark:bg-gray-800":"bg-teal-600 text-white"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={scrolRef} />
          </div>
          <div className="p-3 flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter" && handleSend()} className="flex-1 border rounded px-2 py-1 bg-transparent" placeholder="Ask about symptoms, appointments..." />
            <button onClick={handleSend} className="bg-teal-600 text-white px-3 py-1 rounded"><Send size={16} /></button>
          </div>
        </div>
      ) : (
        <button onClick={()=>setOpen(true)} className="bg-teal-600 p-3 rounded-full text-white shadow-lg">
          <MessageCircle size={22} />
        </button>
      )}
    </div>
  );
}
