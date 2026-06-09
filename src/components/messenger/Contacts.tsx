import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { contacts } from '@/data/mockData';

interface ContactsProps {
  onCall: (contactId: string) => void;
  onOpenChat: (contactId: string) => void;
}

const Contacts: React.FC<ContactsProps> = ({ onCall, onOpenChat }) => {
  const [search, setSearch] = useState('');

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const grouped = filtered.reduce<Record<string, typeof contacts>>((acc, c) => {
    const letter = c.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(c);
    return acc;
  }, {});

  const letters = Object.keys(grouped).sort();

  return (
    <div className="flex flex-col h-full">
      <div className="wa-header px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-xl font-bold">Контакты</h1>
          <button className="text-white/80 hover:text-white transition-colors">
            <Icon name="UserPlus" size={22} />
          </button>
        </div>
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

      <div className="flex-1 overflow-y-auto bg-white">
        {/* New contact */}
        <div className="flex items-center gap-3 px-4 py-3 wa-hover cursor-pointer border-b border-[var(--wa-divider)]">
          <div className="w-12 h-12 rounded-full bg-[var(--wa-light-green)] flex items-center justify-center">
            <Icon name="UserPlus" size={22} className="text-[var(--wa-dark-green)]" />
          </div>
          <span className="text-[var(--wa-dark-green)] font-semibold">Новый контакт</span>
        </div>

        {letters.map(letter => (
          <div key={letter}>
            <div className="px-4 py-1.5 bg-[var(--wa-panel)] text-xs font-bold text-[var(--wa-dark-green)] uppercase tracking-wider">
              {letter}
            </div>
            {grouped[letter].map(contact => (
              <div
                key={contact.id}
                className="flex items-center gap-3 px-4 py-3 wa-hover cursor-pointer group"
                onClick={() => onOpenChat(contact.id)}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--wa-dark-green)] to-[var(--wa-green)] flex items-center justify-center text-2xl">
                    {contact.avatar}
                  </div>
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[var(--wa-green)] rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-[15px]">{contact.name}</p>
                  <p className="text-sm text-[var(--wa-text-muted)] truncate">{contact.status}</p>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={e => { e.stopPropagation(); onCall(contact.id); }}
                    className="p-2 rounded-full hover:bg-[var(--wa-light-green)] text-[var(--wa-dark-green)] transition-colors"
                  >
                    <Icon name="Phone" size={18} />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); onOpenChat(contact.id); }}
                    className="p-2 rounded-full hover:bg-[var(--wa-light-green)] text-[var(--wa-dark-green)] transition-colors"
                  >
                    <Icon name="MessageCircle" size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-[var(--wa-text-muted)]">
            <Icon name="Users" size={32} className="mb-2 opacity-40" />
            <p className="text-sm">Контакты не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;
