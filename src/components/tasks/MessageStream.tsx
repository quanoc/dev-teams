import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User } from 'lucide-react'
import { useTaskStore } from '@/stores/taskStore'
import { formatRelativeTime, cn } from '@/lib/utils'
import type { Message } from '@/types'

const AGENT_COLORS: Record<string, string> = {
  main:         'bg-zinc-700 text-zinc-100',
  requirement:  'bg-violet-500 text-white',
  architecture: 'bg-teal-500 text-white',
  code:         'bg-blue-500 text-white',
  review:       'bg-amber-500 text-white',
  test:         'bg-green-500 text-white',
  deploy:       'bg-red-500 text-white',
}

function MessageBubble({ msg }: { msg: Message }) {
  const isHuman = msg.sender === 'human'
  return (
    <div className={cn('flex gap-2.5', isHuman && 'flex-row-reverse')}>
      {/* Avatar */}
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs',
        isHuman ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' :
        msg.agentId ? AGENT_COLORS[msg.agentId] : 'bg-gray-200 text-gray-600'
      )}>
        {isHuman ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
      </div>

      {/* Bubble */}
      <div className={cn('flex flex-col gap-1 max-w-[85%]', isHuman && 'items-end')}>
        <div className="text-[10px] text-gray-400 dark:text-zinc-500 px-1">
          {msg.senderName} · {formatRelativeTime(msg.createdAt)}
        </div>
        <div className={cn(
          'text-xs leading-relaxed px-3 py-2 rounded-xl',
          isHuman
            ? 'bg-brand-purple text-white rounded-tr-sm'
            : 'bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-tl-sm border border-gray-100 dark:border-zinc-700'
        )}>
          {msg.content}
        </div>
      </div>
    </div>
  )
}

interface MessageStreamProps {
  taskId: string
}

export function MessageStream({ taskId }: MessageStreamProps) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const task = useTaskStore((s) => s.tasks.find((t) => t.id === taskId))
  const sendMessage = useTaskStore((s) => s.sendMessage)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [task?.messages.length])

  function handleSend() {
    const content = input.trim()
    if (!content) return
    sendMessage(taskId, content, '我')
    setInput('')
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const messages = task?.messages ?? []

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
        <div className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">协作消息流</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="text-xs text-gray-300 dark:text-zinc-600 text-center py-8">暂无消息</div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-zinc-800">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="发送消息… (Enter 发送)"
            rows={2}
            className="flex-1 text-xs resize-none rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 placeholder-gray-300 dark:placeholder-zinc-600 px-3 py-2 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/30 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-3 rounded-lg bg-brand-purple text-white hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
