'use client'

import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { MessageBox } from 'react-chat-elements'
import 'react-chat-elements/dist/main.css'

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY

interface ChatMessage {
  sender: 'user' | 'ai'
  text: string
}

export default function ChatWithAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem('chat_history')
    if (stored) {
      setMessages(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
    localStorage.setItem('chat_history', JSON.stringify(messages))
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: input }]
    setMessages(newMessages)
    setInput('')

    try {
      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            ...newMessages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text,
            })),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const aiReply = res.data.choices[0].message.content
      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }])
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to get response from AI.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 bg-gray-50 rounded-lg shadow-lg min-h-[600px]">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">💬 Chat with AI Assistant</h2>

      <div
        ref={scrollRef}
        className="border rounded-md p-4 h-[400px] overflow-y-auto bg-white shadow-inner space-y-4"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%]`}>
              <MessageBox
                position={msg.sender === 'user' ? 'right' : 'left'}
                type="text"
                text={msg.text}
                title={msg.sender === 'user' ? 'You' : 'AI'}
                date={new Date()}
                id={i.toString()}
                focus={false}
                titleColor="#111827"
                forwarded={false}
                replyButton={false}
                removeButton={false}
                status="sent"
                notch={true}
                retracted={false}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <input
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" 
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition"
        >
          Send
        </button>
      </div>
    </div>
  )
}
