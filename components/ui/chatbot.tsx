"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Paperclip, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CONFIDENCE_THRESHOLD = 0.8; // Kita naikkan ambang batas menjadi 80%
const COMPLEX_KEYWORDS = [
  "jelaskan",
  "ceritakan",
  "uraikan",
  "bandingkan",
  "menurutmu",
  "opini",
  "kenapa",
  "bagaimana",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Halo! Saya adalah asisten virtual SMP N 1 Tulung Selapan. Ada yang bisa saya bantu?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let finalResponse = "";

    try {
      // 1. Panggil backend model lokal
      const localModelRes = await fetch(
        process.env.NEXT_PUBLIC_MODEL_API_URL || "http://localhost:5000/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: userMessage.content }),
        }
      );

      if (!localModelRes.ok) {
        throw new Error("Local model API request failed");
      }

      const localModelData = await localModelRes.json();
      const { confidence, intent, response: localResponse } = localModelData;
      console.log(
        "Local AI response - Intent:",
        intent,
        "| Confidence:",
        confidence
      );

      // 2. Tentukan apakah perlu fallback ke Groq
      const isKnownUnknown = intent === "tidak_mengerti";
      const isUncertain =
        confidence < CONFIDENCE_THRESHOLD && intent !== "sapaan";
      const isComplexQuery = COMPLEX_KEYWORDS.some((keyword) =>
        userMessage.content.toLowerCase().startsWith(keyword)
      );

      if (isKnownUnknown || isUncertain || isComplexQuery) {
        console.log(
          `>>> Fallback to Groq. Reason: ${
            isKnownUnknown
              ? "Intent tidak_mengerti"
              : isUncertain
              ? "Confidence low"
              : "Complex query"
          }`
        );

        // Panggil Groq API
        const groqRes = await fetch("/api/chat/groq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage.content,
            history: messages,
          }),
        });

        if (!groqRes.ok) {
          throw new Error("Groq API request failed");
        }
        const groqData = await groqRes.json();
        finalResponse = groqData.response;
      } else {
        // Jika tidak perlu fallback, gunakan respons dari model lokal
        console.log(">>> Using local model response.");
        finalResponse = localResponse;
      }
    } catch (error) {
      console.error("Chatbot logic error:", error);
      finalResponse = "Maaf, terjadi sedikit gangguan. Coba lagi ya.";
    }

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: finalResponse },
    ]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="sm"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">Asisten Virtual</h3>
                  <p className="text-xs opacity-90">SMP N 1 Tulung Selapan</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-blue-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-end gap-2 ${
                      message.role === "user" ? "justify-end" : ""
                    }`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="/robot-assistant.png"
                          alt="Assistant"
                        />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-xs rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-end gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/robot-assistant.png" alt="Assistant" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="max-w-xs rounded-lg px-4 py-2 bg-gray-200 text-gray-900">
                      <p className="text-sm">...</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ketik pesan Anda..."
                  className="flex-grow"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Kirim
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
