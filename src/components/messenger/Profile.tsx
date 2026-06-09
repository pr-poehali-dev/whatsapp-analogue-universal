import React, { useState } from 'react';
import Icon from '@/components/ui/icon';

const Profile: React.FC = () => {
  const [name, setName] = useState('Иван Иванов');
  const [status, setStatus] = useState('Всегда на связи 🌟');
  const [editingName, setEditingName] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);

  const settings = [
    { icon: 'Bell', label: 'Уведомления', desc: 'Звуки, вибрация', color: 'text-orange-500' },
    { icon: 'Lock', label: 'Конфиденциальность', desc: 'Блокировки, время', color: 'text-blue-500' },
    { icon: 'Shield', label: 'Безопасность', desc: 'Двойная аутентификация', color: 'text-green-600' },
    { icon: 'Palette', label: 'Оформление', desc: 'Тема, обои чата', color: 'text-purple-500' },
    { icon: 'Database', label: 'Данные и хранилище', desc: '2.4 ГБ использовано', color: 'text-cyan-600' },
    { icon: 'HelpCircle', label: 'Помощь', desc: 'FAQ, свяжитесь с нами', color: 'text-gray-500' },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="wa-header px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-xl font-bold">Профиль</h1>
          <button className="text-white/80 hover:text-white transition-colors">
            <Icon name="MoreVertical" size={22} />
          </button>
        </div>
      </div>

      <div className="bg-white flex-1">
        {/* Avatar section */}
        <div className="flex flex-col items-center py-8 bg-white border-b border-[var(--wa-divider)]">
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[var(--wa-dark-green)] to-[var(--wa-green)] flex items-center justify-center text-5xl shadow-lg">
              👤
            </div>
            <button className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-[var(--wa-green)] text-white flex items-center justify-center shadow-md hover:bg-[var(--wa-dark-green)] transition-colors">
              <Icon name="Camera" size={17} />
            </button>
          </div>

          {/* Name */}
          {editingName ? (
            <div className="flex items-center gap-2 w-full max-w-xs px-4">
              <input
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={() => setEditingName(false)}
                onKeyDown={e => e.key === 'Enter' && setEditingName(false)}
                className="flex-1 text-center text-xl font-bold text-gray-900 border-b-2 border-[var(--wa-green)] outline-none bg-transparent py-1"
              />
            </div>
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="flex items-center gap-2 group"
            >
              <h2 className="text-xl font-bold text-gray-900">{name}</h2>
              <Icon name="Pencil" size={15} className="text-[var(--wa-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}

          <p className="text-sm text-[var(--wa-text-muted)] mt-1">+7 900 000-00-00</p>
        </div>

        {/* Status */}
        <div className="border-b border-[var(--wa-divider)]">
          <div className="px-4 pt-4 pb-1 flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--wa-dark-green)] uppercase tracking-wider">Статус</span>
            <button onClick={() => setEditingStatus(!editingStatus)} className="text-[var(--wa-dark-green)]">
              <Icon name="Pencil" size={15} />
            </button>
          </div>
          <div className="px-4 pb-4">
            {editingStatus ? (
              <input
                autoFocus
                value={status}
                onChange={e => setStatus(e.target.value)}
                onBlur={() => setEditingStatus(false)}
                onKeyDown={e => e.key === 'Enter' && setEditingStatus(false)}
                className="w-full text-sm text-gray-700 border-b-2 border-[var(--wa-green)] outline-none bg-transparent py-1"
              />
            ) : (
              <p className="text-sm text-gray-700">{status}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 border-b border-[var(--wa-divider)]">
          {[
            { label: 'Чатов', value: '6' },
            { label: 'Контактов', value: '8' },
            { label: 'Звонков', value: '6' },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col items-center py-4 border-r last:border-r-0 border-[var(--wa-divider)]">
              <span className="text-2xl font-bold text-[var(--wa-dark-green)]">{stat.value}</span>
              <span className="text-xs text-[var(--wa-text-muted)] mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div>
          {settings.map((s, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-4 px-4 py-3.5 wa-hover border-b border-[var(--wa-divider)] last:border-b-0 transition-colors"
            >
              <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${s.color}`}>
                <Icon name={s.icon} fallback="Settings" size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[15px] font-medium text-gray-900">{s.label}</p>
                <p className="text-sm text-[var(--wa-text-muted)]">{s.desc}</p>
              </div>
              <Icon name="ChevronRight" size={18} className="text-gray-300" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button className="w-full flex items-center justify-center gap-2 py-5 text-red-500 hover:bg-red-50 transition-colors mt-2">
          <Icon name="LogOut" size={18} />
          <span className="font-medium">Выйти</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;