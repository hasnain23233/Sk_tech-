"use client";

import { useEffect, useRef, useState, FormEvent, KeyboardEvent } from "react";
import { FaArrowUp, FaCommentDots } from "react-icons/fa";

/* ─────────────────────────────────────────
   Brand tokens — pulled straight from the homepage
   purple #8B2FC9   pink #FF2D95   ink #1B1023
───────────────────────────────────────── */
const GRAD = "linear-gradient(135deg,#8B2FC9,#FF2D95)";
const INK = "#1B1023";
const PANEL = "rgba(255,255,255,0.06)";
const PANEL_BORDER = "rgba(255,255,255,0.12)";
const MIST = "rgba(255,255,255,0.55)";
const DISPLAY = "var(--font-display, inherit)";
const BODY = "var(--font-body, inherit)";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi, I'm the SK Tech Agency assistant. Ask me about our services, a project you have in mind, or anything else — I'm here to help.",
};

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: makeId(),
      role: "user",
      content: trimmed,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages
            .filter((m) => m.id !== "welcome")
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "The assistant couldn't reply.");
      }

      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e as unknown as FormEvent);
    }
  }

  return (
    <div
      className="flex h-full flex-col"
      style={{ background: INK, fontFamily: BODY }}
    >
      {/* header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: `1px solid ${PANEL_BORDER}` }}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{ background: GRAD }}
        >
          <FaCommentDots size={14} color="#fff" />
        </div>
        <div>
          <p
            className="text-sm font-bold leading-tight"
            style={{ color: "#fff", fontFamily: DISPLAY }}
          >
            SK Tech Agency
          </p>
          <p className="flex items-center gap-1.5 text-[12px]" style={{ color: MIST }}>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "#4ADE80" }}
            />
            Usually replies in minutes
          </p>
        </div>
      </div>

      {/* message stream */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}

          {isLoading && (
            <div
              className="flex w-fit items-center gap-1.5 self-start rounded-2xl rounded-bl-sm px-4 py-3.5"
              style={{ background: PANEL, border: `1px solid ${PANEL_BORDER}` }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: "#FF87BE",
                    animation: "skDotBounce 1.1s ease-in-out infinite",
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          )}

          {error && (
            <div
              className="w-fit self-start rounded-2xl rounded-bl-sm px-4 py-3 text-sm"
              style={{
                background: "rgba(255,182,72,0.1)",
                border: "1px solid rgba(255,182,72,0.35)",
                color: "#FFB648",
              }}
            >
              {error}
            </div>
          )}
        </div>
      </div>

      {/* composer */}
      <form
        onSubmit={sendMessage}
        className="px-4 py-4 sm:px-6"
        style={{ borderTop: `1px solid ${PANEL_BORDER}`, background: "rgba(0,0,0,0.15)" }}
      >
        <div
          className="mx-auto flex max-w-2xl items-end gap-2 rounded-2xl p-2"
          style={{ background: PANEL, border: `1px solid ${PANEL_BORDER}` }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask about a project, a service, or anything else…"
            className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm focus:outline-none"
            style={{ color: "#fff" }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-opacity duration-200"
            style={{
              background: GRAD,
              opacity: isLoading || !input.trim() ? 0.35 : 1,
              cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
            }}
          >
            <FaArrowUp size={14} color="#fff" />
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-2xl text-[11px]" style={{ color: MIST }}>
          Enter to send · Shift + Enter for a new line
        </p>
      </form>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes skDotBounce {
              0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
              30% { transform: translateY(-4px); opacity: 1; }
            }
          `,
        }}
      />
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed"
        style={
          isUser
            ? {
                background: GRAD,
                color: "#fff",
                borderBottomRightRadius: 4,
                boxShadow: "0 8px 20px rgba(139,47,201,0.3)",
              }
            : {
                background: PANEL,
                border: `1px solid ${PANEL_BORDER}`,
                color: "rgba(255,255,255,0.9)",
                borderBottomLeftRadius: 4,
              }
        }
      >
        {message.content}
      </div>
    </div>
  );
}