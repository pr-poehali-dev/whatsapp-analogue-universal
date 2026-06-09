import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { contacts } from '@/data/mockData';

interface CreateGroupProps {
  onClose: () => void;
}

const CreateGroup: React.FC<CreateGroupProps> = ({ onClose }) => {
  const [step, setStep] = useState<'select' | 'name'>('select');
  const [selected, setSelected] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-white animate-slide-up">
      {/* Header */}
      <div className="wa-header px-4 py-3 flex items-center gap-4">
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
          <Icon name="X" size={22} />
        </button>
        <div className="flex-1">
          <h2 className="text-white font-bold text-lg">
            {step === 'select' ? 'Новая группа' : 'Название группы'}
          </h2>
          {step === 'select' && (
            <p className="text-white/70 text-xs">Добавьте участников: {selected.length}</p>
          )}
        </div>
        {step === 'select' && selected.length > 0 && (
          <button
            onClick={() => setStep('name')}
            className="text-white bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
          >
            Далее
          </button>
        )}
      </div>

      {step === 'select' ? (
        <div className="flex-1 overflow-y-auto">
          {/* Selected chips */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-[var(--wa-divider)] bg-[var(--wa-panel)]">
              {selected.map(id => {
                const c = contacts.find(x => x.id === id);
                return (
                  <button
                    key={id}
                    onClick={() => toggle(id)}
                    className="flex items-center gap-1.5 bg-[var(--wa-green)] text-white px-3 py-1.5 rounded-full text-sm animate-scale-in"
                  >
                    <span>{c?.avatar}</span>
                    <span>{c?.name.split(' ')[0]}</span>
                    <Icon name="X" size={13} />
                  </button>
                );
              })}
            </div>
          )}

          {contacts.map(contact => (
            <div
              key={contact.id}
              onClick={() => toggle(contact.id)}
              className="flex items-center gap-3 px-4 py-3 wa-hover cursor-pointer border-b border-[var(--wa-divider)]"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--wa-dark-green)] to-[var(--wa-green)] flex items-center justify-center text-2xl flex-shrink-0">
                {contact.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{contact.name}</p>
                <p className="text-sm text-[var(--wa-text-muted)] truncate">{contact.status}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selected.includes(contact.id)
                  ? 'bg-[var(--wa-green)] border-[var(--wa-green)]'
                  : 'border-gray-300'
              }`}>
                {selected.includes(contact.id) && <Icon name="Check" size={14} className="text-white" />}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[var(--wa-light-green)] flex items-center justify-center">
              <Icon name="Users" size={40} className="text-[var(--wa-dark-green)]" />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--wa-green)] text-white flex items-center justify-center">
              <Icon name="Camera" size={16} />
            </button>
          </div>

          <div className="w-full border-b-2 border-[var(--wa-green)] flex items-center gap-3 pb-2">
            <input
              autoFocus
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              placeholder="Название группы"
              className="flex-1 text-xl text-gray-900 outline-none bg-transparent placeholder-gray-300"
            />
            <span className="text-sm text-[var(--wa-text-muted)]">{25 - groupName.length}</span>
          </div>

          <div className="w-full">
            <p className="text-sm text-[var(--wa-text-muted)] mb-3">Участники: {selected.length}</p>
            <div className="flex flex-wrap gap-2">
              {selected.map(id => {
                const c = contacts.find(x => x.id === id);
                return (
                  <div key={id} className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full text-sm text-gray-700">
                    <span>{c?.avatar}</span>
                    <span>{c?.name.split(' ')[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            disabled={!groupName.trim()}
            onClick={onClose}
            className="w-16 h-16 rounded-full bg-[var(--wa-green)] text-white flex items-center justify-center shadow-lg disabled:opacity-40 hover:bg-[var(--wa-dark-green)] transition-colors"
          >
            <Icon name="Check" size={28} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateGroup;
