import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { apiRegister, apiLogin, type User } from '@/lib/api';
import { CITIES } from '@/data/cities';

interface AuthScreenProps {
  onAuth: (user: User, token: string) => void;
}

type Mode = 'welcome' | 'login' | 'register';

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuth }) => {
  const [mode, setMode] = useState<Mode>('welcome');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [showCityList, setShowCityList] = useState(false);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    city: '',
    region: '',
    password: '',
    password2: '',
  });

  const set = (key: string, val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    setError('');
  };

  const filteredCities = CITIES.filter(c =>
    c.city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const selectCity = (city: string, region: string) => {
    setForm(f => ({ ...f, city, region }));
    setCitySearch(city);
    setShowCityList(false);
  };

  const handleLogin = async () => {
    if (!form.phone || !form.password) { setError('Заполните все поля'); return; }
    setLoading(true);
    try {
      const res = await apiLogin(form.phone, form.password);
      if (res.error) { setError(res.error); return; }
      if (res.token && res.user) onAuth(res.user, res.token);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!form.first_name || !form.last_name || !form.phone || !form.city || !form.password) {
      setError('Заполните все поля'); return;
    }
    if (form.password !== form.password2) { setError('Пароли не совпадают'); return; }
    if (form.password.length < 4) { setError('Пароль минимум 4 символа'); return; }
    setLoading(true);
    try {
      const res = await apiRegister({
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        city: form.city,
        region: form.region,
        password: form.password,
      });
      if (res.error) { setError(res.error); return; }
      if (res.token && res.user) onAuth(res.user, res.token);
    } finally {
      setLoading(false);
    }
  };

  // ── WELCOME ─────────────────────────────────────────
  if (mode === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[var(--wa-teal)] to-[#0a2a26] px-6 animate-fade-in">
        <div className="mb-8 relative">
          <div className="w-28 h-28 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-6xl backdrop-blur-sm shadow-2xl">
            💬
          </div>
          <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[var(--wa-green)] flex items-center justify-center shadow-lg">
            <Icon name="Check" size={18} className="text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Мессенджер</h1>
        <p className="text-white/60 text-center mb-10 text-sm leading-relaxed max-w-xs">
          Общайтесь с людьми из вашего города.<br />Крым и вся Россия.
        </p>

        <div className="w-full max-w-xs space-y-3">
          <button
            onClick={() => setMode('register')}
            className="w-full py-4 rounded-2xl bg-[var(--wa-green)] text-white font-semibold text-lg shadow-lg hover:bg-[#1db954] transition-all active:scale-95"
          >
            Создать аккаунт
          </button>
          <button
            onClick={() => setMode('login')}
            className="w-full py-4 rounded-2xl bg-white/10 text-white font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all active:scale-95 backdrop-blur-sm"
          >
            Войти
          </button>
        </div>

        <p className="text-white/30 text-xs mt-10 text-center">
          Нажимая «Создать аккаунт», вы соглашаетесь с условиями использования
        </p>
      </div>
    );
  }

  // ── LOGIN ───────────────────────────────────────────
  if (mode === 'login') {
    return (
      <div className="min-h-screen flex flex-col bg-white animate-fade-in">
        <div className="wa-header px-4 py-4 flex items-center gap-4">
          <button onClick={() => { setMode('welcome'); setError(''); }} className="text-white/80 hover:text-white">
            <Icon name="ArrowLeft" size={22} />
          </button>
          <h1 className="text-white text-xl font-bold">Вход</h1>
        </div>

        <div className="flex-1 px-6 py-8 max-w-md mx-auto w-full">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-[var(--wa-light-green)] flex items-center justify-center text-4xl">
              👤
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mb-8">
            Введите номер телефона и пароль
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--wa-dark-green)] uppercase tracking-wider mb-1.5">
                Номер телефона
              </label>
              <div className="flex items-center gap-2 border-2 border-[var(--wa-divider)] rounded-xl px-4 py-3 focus-within:border-[var(--wa-green)] transition-colors">
                <Icon name="Phone" size={18} className="text-[var(--wa-text-muted)]" />
                <input
                  type="tel"
                  placeholder="+7 900 000-00-00"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  className="flex-1 outline-none text-gray-900 placeholder-gray-300 text-[15px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--wa-dark-green)] uppercase tracking-wider mb-1.5">
                Пароль
              </label>
              <div className="flex items-center gap-2 border-2 border-[var(--wa-divider)] rounded-xl px-4 py-3 focus-within:border-[var(--wa-green)] transition-colors">
                <Icon name="Lock" size={18} className="text-[var(--wa-text-muted)]" />
                <input
                  type="password"
                  placeholder="Введите пароль"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="flex-1 outline-none text-gray-900 placeholder-gray-300 text-[15px]"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-fade-in">
              <Icon name="AlertCircle" size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-8 w-full py-4 rounded-2xl bg-[var(--wa-green)] text-white font-semibold text-lg shadow-md hover:bg-[var(--wa-dark-green)] transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Входим...
              </>
            ) : 'Войти'}
          </button>

          <p className="text-center text-sm text-gray-400 mt-6">
            Нет аккаунта?{' '}
            <button onClick={() => { setMode('register'); setError(''); }} className="text-[var(--wa-dark-green)] font-semibold">
              Зарегистрироваться
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ── REGISTER ────────────────────────────────────────
  const crymCities = filteredCities.filter(c => c.region === 'Крым');
  const ruCities   = filteredCities.filter(c => c.region === 'Россия');

  return (
    <div className="min-h-screen flex flex-col bg-white animate-fade-in">
      <div className="wa-header px-4 py-4 flex items-center gap-4">
        <button onClick={() => { setMode('welcome'); setError(''); }} className="text-white/80 hover:text-white">
          <Icon name="ArrowLeft" size={22} />
        </button>
        <h1 className="text-white text-xl font-bold">Регистрация</h1>
      </div>

      <div className="flex-1 px-6 py-6 max-w-md mx-auto w-full overflow-y-auto">
        <p className="text-center text-gray-500 text-sm mb-6">
          Укажите свои данные. Пользователи из вашего города смогут найти вас.
        </p>

        <div className="space-y-4">
          {/* Имя + Фамилия */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--wa-dark-green)] uppercase tracking-wider mb-1.5">Имя</label>
              <div className="flex items-center gap-2 border-2 border-[var(--wa-divider)] rounded-xl px-3 py-3 focus-within:border-[var(--wa-green)] transition-colors">
                <input
                  type="text"
                  placeholder="Иван"
                  value={form.first_name}
                  onChange={e => set('first_name', e.target.value)}
                  className="flex-1 outline-none text-gray-900 placeholder-gray-300 text-[15px] min-w-0"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--wa-dark-green)] uppercase tracking-wider mb-1.5">Фамилия</label>
              <div className="flex items-center gap-2 border-2 border-[var(--wa-divider)] rounded-xl px-3 py-3 focus-within:border-[var(--wa-green)] transition-colors">
                <input
                  type="text"
                  placeholder="Иванов"
                  value={form.last_name}
                  onChange={e => set('last_name', e.target.value)}
                  className="flex-1 outline-none text-gray-900 placeholder-gray-300 text-[15px] min-w-0"
                />
              </div>
            </div>
          </div>

          {/* Телефон */}
          <div>
            <label className="block text-xs font-semibold text-[var(--wa-dark-green)] uppercase tracking-wider mb-1.5">Номер телефона</label>
            <div className="flex items-center gap-2 border-2 border-[var(--wa-divider)] rounded-xl px-4 py-3 focus-within:border-[var(--wa-green)] transition-colors">
              <Icon name="Phone" size={18} className="text-[var(--wa-text-muted)]" />
              <input
                type="tel"
                placeholder="+7 900 000-00-00"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                className="flex-1 outline-none text-gray-900 placeholder-gray-300 text-[15px]"
              />
            </div>
          </div>

          {/* Город */}
          <div className="relative">
            <label className="block text-xs font-semibold text-[var(--wa-dark-green)] uppercase tracking-wider mb-1.5">
              Город
            </label>
            <div className="flex items-center gap-2 border-2 border-[var(--wa-divider)] rounded-xl px-4 py-3 focus-within:border-[var(--wa-green)] transition-colors">
              <Icon name="MapPin" size={18} className="text-[var(--wa-text-muted)]" />
              <input
                type="text"
                placeholder="Начните вводить город..."
                value={citySearch}
                onChange={e => { setCitySearch(e.target.value); setShowCityList(true); set('city', ''); }}
                onFocus={() => setShowCityList(true)}
                className="flex-1 outline-none text-gray-900 placeholder-gray-300 text-[15px]"
                autoComplete="off"
              />
              {form.city && <Icon name="CheckCircle" size={18} className="text-[var(--wa-green)]" />}
            </div>

            {showCityList && filteredCities.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 bg-white border border-[var(--wa-divider)] rounded-2xl shadow-xl mt-1 max-h-52 overflow-y-auto animate-scale-in">
                {crymCities.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs font-bold text-[var(--wa-dark-green)] uppercase tracking-wider bg-[var(--wa-panel)] rounded-t-2xl">
                      🌊 Крым
                    </div>
                    {crymCities.map(c => (
                      <button
                        key={c.city}
                        onMouseDown={() => selectCity(c.city, c.region)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 wa-hover text-left"
                      >
                        <Icon name="MapPin" size={14} className="text-[var(--wa-text-muted)]" />
                        <span className="text-gray-800 text-[15px]">{c.city}</span>
                      </button>
                    ))}
                  </>
                )}
                {ruCities.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs font-bold text-[var(--wa-text-muted)] uppercase tracking-wider bg-[var(--wa-panel)]">
                      🇷🇺 Россия
                    </div>
                    {ruCities.map(c => (
                      <button
                        key={c.city}
                        onMouseDown={() => selectCity(c.city, c.region)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 wa-hover text-left"
                      >
                        <Icon name="MapPin" size={14} className="text-[var(--wa-text-muted)]" />
                        <span className="text-gray-800 text-[15px]">{c.city}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Пароль */}
          <div>
            <label className="block text-xs font-semibold text-[var(--wa-dark-green)] uppercase tracking-wider mb-1.5">Пароль</label>
            <div className="flex items-center gap-2 border-2 border-[var(--wa-divider)] rounded-xl px-4 py-3 focus-within:border-[var(--wa-green)] transition-colors">
              <Icon name="Lock" size={18} className="text-[var(--wa-text-muted)]" />
              <input
                type="password"
                placeholder="Минимум 4 символа"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                className="flex-1 outline-none text-gray-900 placeholder-gray-300 text-[15px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--wa-dark-green)] uppercase tracking-wider mb-1.5">Повторите пароль</label>
            <div className="flex items-center gap-2 border-2 border-[var(--wa-divider)] rounded-xl px-4 py-3 focus-within:border-[var(--wa-green)] transition-colors">
              <Icon name="Lock" size={18} className="text-[var(--wa-text-muted)]" />
              <input
                type="password"
                placeholder="Повторите пароль"
                value={form.password2}
                onChange={e => set('password2', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRegister()}
                className="flex-1 outline-none text-gray-900 placeholder-gray-300 text-[15px]"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-fade-in">
            <Icon name="AlertCircle" size={16} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="mt-6 w-full py-4 rounded-2xl bg-[var(--wa-green)] text-white font-semibold text-lg shadow-md hover:bg-[var(--wa-dark-green)] transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Регистрируем...
            </>
          ) : 'Зарегистрироваться'}
        </button>

        <p className="text-center text-sm text-gray-400 mt-4 mb-8">
          Уже есть аккаунт?{' '}
          <button onClick={() => { setMode('login'); setError(''); }} className="text-[var(--wa-dark-green)] font-semibold">
            Войти
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
