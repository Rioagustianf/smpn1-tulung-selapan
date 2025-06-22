"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CONFIDENCE_THRESHOLD = 0.8;
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

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Halo! Saya adalah asisten virtual SMP N 1 Tulung Selapan. Ada yang bisa saya bantu?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let finalResponse = "";

    try {
      const localModelRes = await fetch(
        process.env.NEXT_PUBLIC_MODEL_API_URL || "http://localhost:5000/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: userMessage.content }),
        }
      );

      if (!localModelRes.ok) throw new Error("Local model API request failed");

      const localModelData = await localModelRes.json();
      const { confidence, intent, response: localResponse } = localModelData;
      console.log(
        "Local AI response - Intent:",
        intent,
        "| Confidence:",
        confidence
      );

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

        const groqRes = await fetch("/api/chat/groq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage.content,
            history: messages.slice(1),
          }),
        });

        if (!groqRes.ok) throw new Error("Groq API request failed");

        const groqData = await groqRes.json();
        finalResponse = groqData.response;
      } else {
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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-blue-600 text-white sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-blue-700"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarImage src="/robot-assistant.png" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm leading-tight">
              Asisten Virtual
            </h3>
            <p className="text-xs opacity-90 leading-tight">
              SMP N 1 Tulung Selapan
            </p>
          </div>
        </div>
      </header>

      {/* Chat Messages Area */}
      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-2xl w-full mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/robot-assistant.png" alt="Assistant" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-br-lg"
                    : "bg-white text-gray-800 rounded-bl-lg shadow-sm border"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
              {message.role === "user" && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-green-500 text-white">
                    U
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start animate-pulse">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/robot-assistant.png" alt="Assistant" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl bg-white text-gray-800 rounded-bl-lg shadow-sm border">
                <p className="text-sm leading-relaxed">Sedang mengetik...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="border-t bg-white p-4 sticky bottom-0 z-10 shrink-0">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Ketik pesan Anda..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow py-2.5 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
            <Button
              type="submit"
              className="h-10 w-10 p-0 rounded-full bg-blue-600 hover:bg-blue-700"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}
