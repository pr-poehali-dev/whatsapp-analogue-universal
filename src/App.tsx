import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import Icon from '@/components/ui/icon';
import ChatList from '@/components/messenger/ChatList';
import ChatWindow from '@/components/messenger/ChatWindow';
import Contacts from '@/components/messenger/Contacts';
import Calls from '@/components/messenger/Calls';
import Profile from '@/components/messenger/Profile';
import CallScreen from '@/components/messenger/CallScreen';
import CreateGroup from '@/components/messenger/CreateGroup';
import AuthScreen from '@/components/messenger/AuthScreen';
import { chats, contacts } from '@/data/mockData';
import { apiMe, apiLogout, type User } from '@/lib/api';

type Tab = 'chats' | 'calls' | 'contacts' | 'profile';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chats');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [callContactId, setCallContactId] = useState<string | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Auth state
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('wa_token');
    if (!token) { setAuthChecked(true); return; }
    apiMe(token)
      .then(res => {
        if (res.user) setAuthUser(res.user);
        else localStorage.removeItem('wa_token');
      })
      .catch(() => localStorage.removeItem('wa_token'))
      .finally(() => setAuthChecked(false));

    setAuthChecked(true);
  }, []);

  const handleAuth = (user: User, token: string) => {
    localStorage.setItem('wa_token', token);
    setAuthUser(user);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('wa_token');
    if (token) await apiLogout(token);
    localStorage.removeItem('wa_token');
    setAuthUser(null);
  };

  const handleSelectChat = (id: string) => {
    setSelectedChatId(id);
    setShowChat(true);
  };

  const handleOpenChatForContact = (contactId: string) => {
    const chat = chats.find(c => c.contactId === contactId);
    if (chat) {
      setSelectedChatId(chat.id);
      setActiveTab('chats');
      setShowChat(true);
    }
  };

  const handleCall = (contactId: string) => {
    const actualId = contactId === 'group' || contactId === 'group2'
      ? contacts[0].id
      : contactId;
    setCallContactId(actualId);
  };

  if (!authChecked && !authUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--wa-teal)]">
        <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // Show auth if not logged in
  if (!authUser) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  const tabs: { id: Tab; icon: string; label: string; badge?: number }[] = [
    { id: 'chats', icon: 'MessageCircle', label: 'Чаты', badge: chats.reduce((a, c) => a + c.unread, 0) },
    { id: 'calls', icon: 'Phone', label: 'Звонки' },
    { id: 'contacts', icon: 'Users', label: 'Контакты' },
    { id: 'profile', icon: 'User', label: 'Профиль' },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[var(--wa-panel)] flex flex-col" style={{ fontFamily: "'Golos Text', sans-serif" }}>
      <Toaster />

      {callContactId && (
        <CallScreen contactId={callContactId} onEnd={() => setCallContactId(null)} />
      )}

      {showCreateGroup && (
        <CreateGroup onClose={() => setShowCreateGroup(false)} />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="hidden md:flex flex-col w-[380px] flex-shrink-0 border-r border-[var(--wa-divider)] relative overflow-hidden">
          <div className={`absolute inset-0 flex flex-col transition-opacity duration-200 ${activeTab === 'chats' ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}>
            <ChatList selectedChatId={selectedChatId} onSelectChat={handleSelectChat} />
          </div>
          <div className={`absolute inset-0 flex flex-col transition-opacity duration-200 ${activeTab === 'calls' ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}>
            <Calls onCall={handleCall} />
          </div>
          <div className={`absolute inset-0 flex flex-col transition-opacity duration-200 ${activeTab === 'contacts' ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}>
            <Contacts onCall={handleCall} onOpenChat={handleOpenChatForContact} />
          </div>
          <div className={`absolute inset-0 flex flex-col transition-opacity duration-200 ${activeTab === 'profile' ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'}`}>
            <Profile user={authUser} onLogout={handleLogout} />
          </div>

          <nav className="mt-auto border-t border-[var(--wa-divider)] bg-[var(--wa-teal)] flex relative z-20">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center py-3 gap-1 transition-all relative ${
                  activeTab === tab.id ? 'text-white' : 'text-white/50 hover:text-white/80'
                }`}
              >
                {activeTab === tab.id && (
                  <span className="absolute top-0 inset-x-0 h-0.5 bg-[var(--wa-green)] rounded-b" />
                )}
                <div className="relative">
                  <Icon name={tab.icon} fallback="Circle" size={22} />
                  {tab.badge && tab.badge > 0 ? (
                    <span className="absolute -top-1.5 -right-2 min-w-4 h-4 rounded-full bg-[var(--wa-green)] text-white text-[10px] font-bold flex items-center justify-center px-0.5">
                      {tab.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* ── DESKTOP CHAT WINDOW ── */}
        <main className="hidden md:flex flex-col flex-1 overflow-hidden">
          <ChatWindow chatId={selectedChatId} onBack={() => {}} onCall={handleCall} />
        </main>

        {/* ── MOBILE LAYOUT ── */}
        <div className="flex md:hidden flex-col flex-1 overflow-hidden relative">
          <div className={`absolute inset-0 flex flex-col transition-transform duration-300 ${showChat && activeTab === 'chats' ? '-translate-x-full' : 'translate-x-0'}`}>
            <div className={`absolute inset-0 ${activeTab === 'chats' ? 'z-10' : 'z-0 pointer-events-none'}`}>
              <ChatList selectedChatId={selectedChatId} onSelectChat={handleSelectChat} />
            </div>
            <div className={`absolute inset-0 ${activeTab === 'calls' ? 'z-10' : 'z-0 pointer-events-none'}`}>
              <Calls onCall={handleCall} />
            </div>
            <div className={`absolute inset-0 ${activeTab === 'contacts' ? 'z-10' : 'z-0 pointer-events-none'}`}>
              <Contacts onCall={handleCall} onOpenChat={handleOpenChatForContact} />
            </div>
            <div className={`absolute inset-0 ${activeTab === 'profile' ? 'z-10' : 'z-0 pointer-events-none'}`}>
              <Profile user={authUser} onLogout={handleLogout} />
            </div>
          </div>

          <div className={`absolute inset-0 z-20 flex flex-col transition-transform duration-300 ${showChat && activeTab === 'chats' ? 'translate-x-0' : 'translate-x-full'}`}>
            <ChatWindow chatId={selectedChatId} onBack={() => setShowChat(false)} onCall={handleCall} />
          </div>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden border-t border-[var(--wa-divider)] bg-[var(--wa-teal)] flex">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setShowChat(false); }}
            className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-all relative ${
              activeTab === tab.id ? 'text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            {activeTab === tab.id && (
              <span className="absolute top-0 inset-x-0 h-0.5 bg-[var(--wa-green)] rounded-b" />
            )}
            <div className="relative">
              <Icon name={tab.icon} fallback="Circle" size={22} />
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-1.5 -right-2 min-w-4 h-4 rounded-full bg-[var(--wa-green)] text-white text-[10px] font-bold flex items-center justify-center px-0.5">
                  {tab.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
