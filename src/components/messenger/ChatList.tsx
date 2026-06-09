import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { chats, contacts } from '@/data/mockData';
import type { Chat } from '@/data/mockData';

interface ChatListProps {
  selectedChatId: string | null;
  onSelectChat: (id: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ selectedChatId, onSelectChat }) => {
  const [search, setSearch] = useState('');

  const getContact = (contactId: string) =>
    contacts.find(c => c.id === contactId);

  const filtered = chats.filter(chat => {
    const name = chat.isGroup
      ? chat.groupName
      : getContact(chat.contactId)?.name || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const pinned = filtered.filter(c => c.pinned);
  const regular = filtered.filter(c => !c.pinned);

  const renderChatItem = (chat: Chat) => {
    const contact = getContact(chat.contactId);
    const name = chat.isGroup ? chat.groupName : contact?.name;
    const avatar = chat.isGroup ? '👥' : contact?.avatar;
    const isOnline = !chat.isGroup && contact?.online;

    return (
      <div
        key={chat.id}
        onClick={() => onSelectChat(chat.id)}
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 ${
          selectedChatId === chat.id ? 'bg-[var(--wa-selected)]' : 'wa-hover'
        }`}
      >
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--wa-dark-green)] to-[var(--wa-green)] flex items-center justify-center text-2xl shadow-sm">
            {avatar}
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[var(--wa-green)] rounded-full border-2 border-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-semibold text-[15px] text-gray-900 truncate flex items-center gap-1">
              {chat.pinned && <Icon name="Pin" size={12} className="text-[var(--wa-text-muted)] rotate-45" />}
              {name}
            </span>
            <span className={`text-xs flex-shrink-0 ml-2 ${chat.unread > 0 ? 'text-[var(--wa-dark-green)] font-medium' : 'text-[var(--wa-text-muted)]'}`}>
              {chat.lastTime}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--wa-text-muted)] truncate">{chat.lastMessage}</p>
            {chat.unread > 0 && (
              <span className="ml-2 flex-shrink-0 min-w-5 h-5 rounded-full bg-[var(--wa-green)] text-white text-xs font-semibold flex items-center justify-center px-1">
                {chat.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="wa-header px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-xl font-bold tracking-wide">Чаты</h1>
          <div className="flex items-center gap-3">
            <button className="text-white/80 hover:text-white transition-colors">
              <Icon name="Camera" size={22} />
            </button>
            <button className="text-white/80 hover:text-white transition-colors">
              <Icon name="Search" size={22} />
            </button>
            <button className="text-white/80 hover:text-white transition-colors">
              <Icon name="MoreVertical" size={22} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
          <Icon name="Search" size={16} className="text-white/70" />
          <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-white placeholder-white/60 text-sm flex-1 outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {/* Filter pills */}
        <div className="flex gap-2 px-4 py-2 bg-white border-b border-[var(--wa-divider)]">
          {['Все', 'Личные', 'Группы'].map((f, i) => (
            <button
              key={f}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                i === 0
                  ? 'bg-[var(--wa-green)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {pinned.length > 0 && (
          <>
            <div className="px-4 py-2 text-xs font-semibold text-[var(--wa-text-muted)] uppercase tracking-wider bg-[var(--wa-panel)]">
              Закреплённые
            </div>
            {pinned.map(renderChatItem)}
          </>
        )}

        {regular.length > 0 && (
          <>
            {pinned.length > 0 && (
              <div className="px-4 py-2 text-xs font-semibold text-[var(--wa-text-muted)] uppercase tracking-wider bg-[var(--wa-panel)]">
                Все чаты
              </div>
            )}
            {regular.map(renderChatItem)}
          </>
        )}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-[var(--wa-text-muted)]">
            <Icon name="MessageCircle" size={32} className="mb-2 opacity-40" />
            <p className="text-sm">Чаты не найдены</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <div className="absolute bottom-20 right-4 md:bottom-6 md:right-6">
        <button className="w-14 h-14 rounded-full bg-[var(--wa-green)] text-white shadow-lg hover:bg-[var(--wa-dark-green)] transition-colors flex items-center justify-center animate-scale-in">
          <Icon name="MessageSquarePlus" size={26} />
        </button>
      </div>
    </div>
  );
};

export default ChatList;
