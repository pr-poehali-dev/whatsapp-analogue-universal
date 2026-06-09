import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { contacts } from '@/data/mockData';

interface CallScreenProps {
  contactId: string;
  onEnd: () => void;
}

const CallScreen: React.FC<CallScreenProps> = ({ contactId, onEnd }) => {
  const contact = contacts.find(c => c.id === contactId);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [status, setStatus] = useState<'calling' | 'connected'>('calling');

  useEffect(() => {
    const t1 = setTimeout(() => setStatus('connected'), 2000);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (status !== 'connected') return;
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[var(--wa-teal)] to-[#0a2a26] animate-fade-in">
      {/* Waves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-white/10"
            style={{
              width: `${300 + i * 120}px`,
              height: `${300 + i * 120}px`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animation: `pulse ${2 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="pt-16 text-center z-10">
        <p className="text-white/60 text-sm mb-6 tracking-widest uppercase">
          {status === 'calling' ? 'Вызов...' : formatTime(seconds)}
        </p>
        <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center text-6xl mb-4 mx-auto shadow-2xl border-2 border-white/20 backdrop-blur-sm">
          {contact?.avatar ?? '👤'}
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{contact?.name ?? 'Неизвестный'}</h2>
        <p className="text-white/60 text-sm">{contact?.phone}</p>
      </div>

      {/* Controls */}
      <div className="pb-16 w-full px-8 z-10">
        <div className="flex justify-around items-center mb-8">
          {[
            { icon: muted ? 'MicOff' : 'Mic', label: muted ? 'Вкл. микр.' : 'Выкл. микр.', action: () => setMuted(!muted), active: muted },
            { icon: 'Video', label: 'Видео', action: () => {}, active: false },
            { icon: speaker ? 'Volume2' : 'VolumeX', label: speaker ? 'Динамик вкл.' : 'Динамик выкл.', action: () => setSpeaker(!speaker), active: speaker },
          ].map(btn => (
            <button
              key={btn.label}
              onClick={btn.action}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${btn.active ? 'bg-white text-[var(--wa-teal)]' : 'bg-white/15 text-white hover:bg-white/25'}`}>
                <Icon name={btn.icon} fallback="Phone" size={24} />
              </div>
              <span className="text-white/70 text-xs">{btn.label}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onEnd}
            className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            <Icon name="PhoneOff" size={32} />
          </button>
        </div>
        <p className="text-center text-white/40 text-xs mt-4">Завершить звонок</p>
      </div>
    </div>
  );
};

export default CallScreen;
