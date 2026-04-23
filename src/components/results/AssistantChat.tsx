import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, User, Bot, Loader2, MessageCircle } from "lucide-react";
import { ChatMessage, ScamAnalysis } from "../../types";
import { chatWithAssistant } from "../../services/geminiService";

interface AssistantChatProps {
  analysis: ScamAnalysis;
}

export function AssistantChat({ analysis }: AssistantChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatWithAssistant(analysis, messages, input);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Désolé, j'ai rencontré une erreur technique. Pouvez-vous reformuler votre question ?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10 glass-card rounded-panel md:col-span-2">
      <div className="flex items-center gap-3 mb-8 text-brand">
        <div className="w-10 h-10 rounded-xl bg-brand/5 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-brand" />
        </div>
        <h4 className="font-bold text-lg uppercase tracking-tight">Assistant de Sécurité</h4>
      </div>

      <div className="bg-alabaster/30 rounded-3xl border border-brand/5 p-6 flex flex-col h-[500px]">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 scrollbar-thin scrollbar-thumb-brand/10"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <Bot className="w-12 h-12 mb-4" />
              <p className="text-sm font-medium">Posez-moi vos questions sur cette analyse.<br />Je suis là pour vous rassurer.</p>
            </div>
          )}
          
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-accent/10 border border-accent/20' : 'bg-brand/10 border border-brand/20'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-accent" /> : <Bot className="w-4 h-4 text-brand" />}
                </div>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-brand text-white rounded-tr-none' : 'bg-white border border-brand/5 text-ink rounded-tl-none'}`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-brand" />
              </div>
              <div className="bg-white border border-brand/5 p-4 rounded-2xl rounded-tl-none">
                <Loader2 className="w-4 h-4 animate-spin text-brand" />
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            className="w-full bg-white border border-brand/10 rounded-2xl py-4 pl-6 pr-14 text-sm focus:ring-brand/20 focus:border-brand transition-all font-medium"
            placeholder="Posez votre question ici..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
