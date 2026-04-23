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
    <div className="p-6 md:p-10 glass-card rounded-panel md:col-span-2">
      <div className="flex items-center gap-3 mb-6 md:mb-8 text-brand">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-brand/5 flex items-center justify-center">
          <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-brand" />
        </div>
        <h4 className="font-bold text-sm md:text-lg uppercase tracking-tight">Assistant de Sécurité</h4>
      </div>

      <div className="bg-alabaster/30 rounded-2xl md:rounded-3xl border border-brand/5 p-4 md:p-6 flex flex-col h-[400px] md:h-[500px]">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-3 md:space-y-4 mb-4 md:mb-6 pr-2 scrollbar-thin scrollbar-thumb-brand/10"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 p-4">
              <Bot className="w-10 h-10 md:w-12 md:h-12 mb-4" />
              <p className="text-xs md:text-sm font-medium leading-relaxed">Posez-moi vos questions sur cette analyse.<br className="hidden sm:block" /> Je suis là pour vous rassurer.</p>
            </div>
          )}
          
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-accent/10 border border-accent/20' : 'bg-brand/10 border border-brand/20'}`}>
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" /> : <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand" />}
                </div>
                <div className={`max-w-[85%] md:max-w-[80%] p-3 md:p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${msg.role === 'user' ? 'bg-brand text-white rounded-tr-none' : 'bg-white border border-brand/5 text-ink rounded-tl-none'}`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex gap-3 md:gap-4">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand" />
              </div>
              <div className="bg-white border border-brand/5 p-3 md:p-4 rounded-2xl rounded-tl-none">
                <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin text-brand" />
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            className="w-full bg-white border border-brand/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-4 md:pl-6 pr-12 md:pr-14 text-xs md:text-sm focus:ring-brand/20 focus:border-brand transition-all font-medium"
            placeholder="Écrivez votre message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 md:right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-brand text-white rounded-lg md:rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
          >
            <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
