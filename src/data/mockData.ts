export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  status: string;
  online: boolean;
  lastSeen?: string;
}

export interface Message {
  id: string;
  text: string;
  time: string;
  isOut: boolean;
  status: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'audio';
}

export interface Chat {
  id: string;
  contactId: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  isGroup?: boolean;
  groupName?: string;
  members?: string[];
  messages: Message[];
  pinned?: boolean;
}

export const contacts: Contact[] = [
  { id: '1', name: 'Алексей Петров', phone: '+7 900 123-45-67', avatar: '👨', status: 'На работе', online: true },
  { id: '2', name: 'Мария Иванова', phone: '+7 900 234-56-78', avatar: '👩', status: 'Свободна для звонков 🎵', online: true },
  { id: '3', name: 'Дмитрий Козлов', phone: '+7 900 345-67-89', avatar: '🧑', status: 'Занят', online: false, lastSeen: 'сегодня в 12:30' },
  { id: '4', name: 'Анна Смирнова', phone: '+7 900 456-78-90', avatar: '👱‍♀️', status: '🌊 Море спокойствия', online: false, lastSeen: 'вчера в 21:15' },
  { id: '5', name: 'Сергей Новиков', phone: '+7 900 567-89-01', avatar: '👨‍💼', status: 'Доступен', online: true },
  { id: '6', name: 'Ольга Федорова', phone: '+7 900 678-90-12', avatar: '👩‍💼', status: 'Читаю книгу 📚', online: false, lastSeen: 'вчера в 18:00' },
  { id: '7', name: 'Иван Морозов', phone: '+7 900 789-01-23', avatar: '🧔', status: 'Всегда на связи', online: true },
  { id: '8', name: 'Елена Волкова', phone: '+7 900 890-12-34', avatar: '👩‍🦰', status: '☕ Кофе и работа', online: true },
];

export const chats: Chat[] = [
  {
    id: 'c1', contactId: '1',
    lastMessage: 'Привет! Как дела?',
    lastTime: '12:45', unread: 2, pinned: true,
    messages: [
      { id: 'm1', text: 'Привет! Как дела?', time: '12:40', isOut: false, status: 'read' },
      { id: 'm2', text: 'Всё отлично, спасибо! А у тебя?', time: '12:42', isOut: true, status: 'read' },
      { id: 'm3', text: 'Тоже хорошо! Когда встретимся?', time: '12:44', isOut: false, status: 'read' },
      { id: 'm4', text: 'Привет! Как дела?', time: '12:45', isOut: false, status: 'delivered' },
    ]
  },
  {
    id: 'c2', contactId: 'group',
    lastMessage: 'Мария: Встреча в 15:00 ✅',
    lastTime: '11:20', unread: 5, isGroup: true,
    groupName: 'Команда Альфа 🚀',
    members: ['1', '2', '3', '5'],
    messages: [
      { id: 'm1', text: 'Доброе утро, команда!', time: '09:00', isOut: false, status: 'read' },
      { id: 'm2', text: 'Доброе! Готовы к спринту?', time: '09:15', isOut: true, status: 'read' },
      { id: 'm3', text: 'Задачи уже распределены', time: '10:30', isOut: false, status: 'read' },
      { id: 'm4', text: 'Мария: Встреча в 15:00 ✅', time: '11:20', isOut: false, status: 'delivered' },
    ]
  },
  {
    id: 'c3', contactId: '2',
    lastMessage: 'Увидимся завтра!',
    lastTime: 'вчера', unread: 0,
    messages: [
      { id: 'm1', text: 'Привет, ты свободна вечером?', time: '19:00', isOut: true, status: 'read' },
      { id: 'm2', text: 'Да, а что случилось?', time: '19:05', isOut: false, status: 'read' },
      { id: 'm3', text: 'Хотел пообедать вместе', time: '19:07', isOut: true, status: 'read' },
      { id: 'm4', text: 'Увидимся завтра!', time: '19:10', isOut: false, status: 'read' },
    ]
  },
  {
    id: 'c4', contactId: 'group2',
    lastMessage: 'Вы: Отличная идея!',
    lastTime: 'вчера', unread: 0, isGroup: true,
    groupName: 'Семья ❤️',
    members: ['4', '6', '8'],
    messages: [
      { id: 'm1', text: 'Как прошёл день?', time: '18:00', isOut: false, status: 'read' },
      { id: 'm2', text: 'Отлично! Устала немного', time: '18:30', isOut: false, status: 'read' },
      { id: 'm3', text: 'Вы: Отличная идея!', time: '18:45', isOut: true, status: 'read' },
    ]
  },
  {
    id: 'c5', contactId: '3',
    lastMessage: 'Посмотрю позже',
    lastTime: 'пн', unread: 0,
    messages: [
      { id: 'm1', text: 'Отправил тебе файлы', time: '10:00', isOut: true, status: 'read' },
      { id: 'm2', text: 'Посмотрю позже', time: '10:30', isOut: false, status: 'read' },
    ]
  },
  {
    id: 'c6', contactId: '5',
    lastMessage: '👍',
    lastTime: 'пн', unread: 0,
    messages: [
      { id: 'm1', text: 'Всё готово с моей стороны', time: '15:00', isOut: true, status: 'read' },
      { id: 'm2', text: '👍', time: '15:05', isOut: false, status: 'read' },
    ]
  },
];

export const callHistory = [
  { id: 'call1', contactId: '1', type: 'incoming', missed: false, time: 'сегодня, 10:30', duration: '5:23' },
  { id: 'call2', contactId: '2', type: 'outgoing', missed: false, time: 'сегодня, 09:15', duration: '2:10' },
  { id: 'call3', contactId: '3', type: 'incoming', missed: true, time: 'вчера, 20:45', duration: '' },
  { id: 'call4', contactId: '5', type: 'outgoing', missed: false, time: 'вчера, 14:20', duration: '12:05' },
  { id: 'call5', contactId: '1', type: 'incoming', missed: false, time: 'пн, 11:00', duration: '3:47' },
  { id: 'call6', contactId: '4', type: 'incoming', missed: true, time: 'пн, 09:30', duration: '' },
];
