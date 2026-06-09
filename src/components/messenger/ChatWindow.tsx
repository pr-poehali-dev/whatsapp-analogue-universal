import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { chats, contacts } from '@/data/mockData';
import type { Message } from '@/data/mockData';

interface ChatWindowProps {
  chatId: string | null;
  onBack: () => void;
  onCall: (contactId: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, onBack, onCall }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [recording, setRecording] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const chat = chats.find(c => c.id === chatId);
  const contact = chat ? contacts.find(c => c.id === chat.contactId) : null;

  useEffect(() => {
    if (chat) setMessages(chat.messages);
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!chatId || !chat) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center h-full bg-[var(--wa-panel)] text-center px-8">
        <div className="w-24 h-24 rounded-full bg-[var(--wa-light-green)] flex items-center justify-center mb-6">
          <Icon name="MessageCircle" size={44} className="text-[var(--wa-dark-green)]" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Добро пожаловать!</h2>
        <p className="text-[var(--wa-text-muted)] max-w-xs">Выберите чат слева, чтобы начать общение</p>
        <div className="mt-8 flex items-center gap-2 text-xs text-[var(--wa-text-muted)]">
          <Icon name="Lock" size={12} />
          <span>Сквозное шифрование</span>
        </div>
      </div>
    );
  }

  const name = chat.isGroup ? chat.groupName : contact?.name;
  const avatar = chat.isGroup ? '👥' : contact?.avatar;
  const subtitle = chat.isGroup
    ? `${chat.members?.length ?? 0} участника`
    : contact?.online ? 'онлайн' : contact?.lastSeen ?? '';

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg: Message = {
      id: `m${Date.now()}`,
      text: input.trim(),
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isOut: true,
      status: 'sent',
    };
    setMessages(prev => [...prev, msg]);
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const groupedMessages = messages.reduce<{ date: string; msgs: Message[] }[]>((acc, msg) => {
    const date = 'Сегодня';
    const last = acc[acc.length - 1];
    if (!last || last.date !== date) acc.push({ date, msgs: [msg] });
    else last.msgs.push(msg);
    return acc;
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="wa-header px-3 py-2 flex items-center gap-3 shadow-sm">
        <button
          onClick={onBack}
          className="md:hidden text-white/80 hover:text-white mr-1 transition-colors"
        >
          <Icon name="ArrowLeft" size={22} />
        </button>

        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--wa-green)] to-[var(--wa-teal)] flex items-center justify-center text-xl">
            {avatar}
          </div>
          {contact?.online && !chat.isGroup && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--wa-green)] rounded-full border-2 border-[var(--wa-header)]" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-[15px] truncate">{name}</p>
          <p className="text-white/70 text-xs truncate">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 text-white/80">
          <button
            onClick={() => onCall(chat.contactId)}
            className="hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
          >
            <Icon name="Phone" size={20} />
          </button>
          <button className="hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10">
            <Icon name="MoreVertical" size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-3 py-4 space-y-1"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23075E54' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: '#efeae2',
        }}
      >
        {groupedMessages.map(group => (
          <div key={group.date}>
            <div className="flex justify-center mb-3">
              <span className="bg-white/80 text-[var(--wa-text-muted)] text-xs px-3 py-1 rounded-full shadow-sm">
                {group.date}
              </span>
            </div>
            {group.msgs.map((msg, i) => (
              <div
                key={msg.id}
                className={`flex mb-1 animate-fade-in ${msg.isOut ? 'justify-end' : 'justify-start'}`}
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <div
                  className={`max-w-[75%] md:max-w-[60%] px-3 py-2 rounded-2xl shadow-sm ${
                    msg.isOut
                      ? 'wa-bubble-out rounded-tr-sm'
                      : 'wa-bubble-in rounded-tl-sm'
                  }`}
                >
                  <p className="text-[14.5px] text-gray-800 leading-snug">{msg.text}</p>
                  <div className={`flex items-center gap-1 mt-1 ${msg.isOut ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[11px] text-[var(--wa-text-muted)]">{msg.time}</span>
                    {msg.isOut && (
                      <Icon
                        name={msg.status === 'read' ? 'CheckCheck' : 'Check'}
                        size={14}
                        className={msg.status === 'read' ? 'text-blue-500' : 'text-[var(--wa-text-muted)]'}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-[var(--wa-panel)] px-3 py-2 flex items-end gap-2">
        <button className="text-[var(--wa-text-muted)] hover:text-[var(--wa-dark-green)] transition-colors p-2 flex-shrink-0">
          <Icon name="Smile" size={24} />
        </button>

        <div className="flex-1 bg-white rounded-2xl flex items-end px-4 py-2 shadow-sm min-h-[44px]">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Сообщение"
            rows={1}
            className="flex-1 resize-none outline-none text-[15px] text-gray-800 placeholder-[var(--wa-text-muted)] bg-transparent max-h-32 overflow-y-auto"
            style={{ lineHeight: '1.4' }}
          />
          <button className="ml-2 text-[var(--wa-text-muted)] hover:text-[var(--wa-dark-green)] transition-colors flex-shrink-0">
            <Icon name="Paperclip" size={20} />
          </button>
        </div>

        {input.trim() ? (
          <button
            onClick={sendMessage}
            className="w-12 h-12 rounded-full bg-[var(--wa-green)] text-white flex items-center justify-center shadow-md hover:bg-[var(--wa-dark-green)] transition-colors flex-shrink-0 animate-scale-in"
          >
            <Icon name="Send" size={20} />
          </button>
        ) : (
          <button
            onMouseDown={() => setRecording(true)}
            onMouseUp={() => setRecording(false)}
            onTouchStart={() => setRecording(true)}
            onTouchEnd={() => setRecording(false)}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md flex-shrink-0 transition-all ${
              recording
                ? 'bg-red-500 scale-110'
                : 'bg-[var(--wa-green)] hover:bg-[var(--wa-dark-green)]'
            } text-white`}
          >
            <Icon name="Mic" size={22} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
