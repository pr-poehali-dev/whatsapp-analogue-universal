import React from 'react';
import Icon from '@/components/ui/icon';
import { callHistory, contacts } from '@/data/mockData';

interface CallsProps {
  onCall: (contactId: string) => void;
}

const Calls: React.FC<CallsProps> = ({ onCall }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="wa-header px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-xl font-bold">Звонки</h1>
          <div className="flex items-center gap-3">
            <button className="text-white/80 hover:text-white transition-colors">
              <Icon name="Search" size={22} />
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex">
          {['Все', 'Пропущенные'].map((tab, i) => (
            <button
              key={tab}
              className={`flex-1 py-2 text-sm font-semibold transition-colors border-b-2 ${
                i === 0
                  ? 'text-white border-white'
                  : 'text-white/60 border-transparent hover:text-white/80'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        {/* New call button */}
        <div className="flex items-center gap-3 px-4 py-3 wa-hover cursor-pointer border-b border-[var(--wa-divider)]">
          <div className="w-12 h-12 rounded-full bg-[var(--wa-light-green)] flex items-center justify-center">
            <Icon name="PhonePlus" size={22} className="text-[var(--wa-dark-green)]" />
          </div>
          <span className="text-[var(--wa-dark-green)] font-semibold">Новый звонок</span>
        </div>

        <div className="px-4 py-2 text-xs font-semibold text-[var(--wa-text-muted)] uppercase tracking-wider bg-[var(--wa-panel)]">
          Последние
        </div>

        {callHistory.map(call => {
          const contact = contacts.find(c => c.id === call.contactId);
          return (
            <div
              key={call.id}
              className="flex items-center gap-3 px-4 py-3 wa-hover group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--wa-dark-green)] to-[var(--wa-green)] flex items-center justify-center text-2xl flex-shrink-0">
                {contact?.avatar}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-[15px] ${call.missed ? 'text-red-500' : 'text-gray-900'}`}>
                  {contact?.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {call.type === 'incoming' ? (
                    <Icon
                      name="PhoneIncoming"
                      size={14}
                      className={call.missed ? 'text-red-400' : 'text-[var(--wa-dark-green)]'}
                    />
                  ) : (
                    <Icon name="PhoneOutgoing" size={14} className="text-[var(--wa-dark-green)]" />
                  )}
                  <span className={`text-sm ${call.missed ? 'text-red-400' : 'text-[var(--wa-text-muted)]'}`}>
                    {call.missed ? 'Пропущенный' : call.type === 'incoming' ? 'Входящий' : 'Исходящий'}
                    {call.duration && ` · ${call.duration}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--wa-text-muted)]">{call.time}</span>
                <button
                  onClick={() => onCall(call.contactId)}
                  className="p-2 rounded-full text-[var(--wa-dark-green)] hover:bg-[var(--wa-light-green)] transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Icon name="Phone" size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB */}
      <div className="absolute bottom-20 right-4 md:bottom-6 md:right-6">
        <button
          onClick={() => {}}
          className="w-14 h-14 rounded-full bg-[var(--wa-green)] text-white shadow-lg hover:bg-[var(--wa-dark-green)] transition-colors flex items-center justify-center animate-scale-in"
        >
          <Icon name="PhonePlus" size={24} />
        </button>
      </div>
    </div>
  );
};

export default Calls;
