"use client"

import { useState } from "react"
import ChatWindow from "@/app/components/Chatwindow"

const GRAD = "linear-gradient(135deg,#8B2FC9,#FF2D95)"

const ChatWidget = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {open && (
        <div className="mb-4 h-[560px] w-[360px] max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border border-neutral-200 bg-ink shadow-2xl shadow-neutral-900/20 sm:w-[400px]">
          <div className="flex items-center justify-between border-b border-line px-4 py-3 bg-[#1b1023]">
            <span className="font-display text-sm font-medium text-white">
              SK Techs Assistant
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-7 w-7 items-center justify-center rounded-full text-mist transition-colors hover:bg-panel hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="h-[calc(100%-49px)]">
            <ChatWindow />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105"
        style={{ background: GRAD, boxShadow: "0 8px 22px rgba(139,47,201,0.35)" }}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.2 0-2.33-.26-3.35-.73L4 21l1.73-5.15A8.5 8.5 0 1 1 21 11.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  )
}

export default ChatWidget