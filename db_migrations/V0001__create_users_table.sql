CREATE TABLE IF NOT EXISTS t_p9511925_whatsapp_analogue_un.users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL DEFAULT 'Крым',
    avatar_emoji VARCHAR(10) DEFAULT '👤',
    status_text VARCHAR(200) DEFAULT 'Привет! Я использую мессенджер',
    online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    password_hash VARCHAR(255) NOT NULL,
    session_token VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON t_p9511925_whatsapp_analogue_un.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_city ON t_p9511925_whatsapp_analogue_un.users(city);
CREATE INDEX IF NOT EXISTS idx_users_session ON t_p9511925_whatsapp_analogue_un.users(session_token);
