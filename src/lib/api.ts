const AUTH_URL = 'https://functions.poehali.dev/202003b4-eb39-4321-bb37-a9d469e847b3';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
  region: string;
  avatar_emoji: string;
  status_text: string;
  online?: boolean;
}

async function post(body: object) {
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiRegister(data: {
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
  region: string;
  password: string;
}): Promise<{ token?: string; user?: User; error?: string }> {
  return post({ action: 'register', ...data });
}

export async function apiLogin(phone: string, password: string): Promise<{ token?: string; user?: User; error?: string }> {
  return post({ action: 'login', phone, password });
}

export async function apiMe(token: string): Promise<{ user?: User; error?: string }> {
  return post({ action: 'me', token });
}

export async function apiLogout(token: string): Promise<void> {
  await post({ action: 'logout', token });
}

export async function apiGetUsers(city?: string): Promise<{ users: User[] }> {
  const url = city ? `${AUTH_URL}?city=${encodeURIComponent(city)}` : AUTH_URL;
  const res = await fetch(url);
  return res.json();
}
