"""
Регистрация и авторизация пользователей мессенджера.
Действия через поле action: register | login | logout | me | users
"""
import json
import os
import hashlib
import secrets
import psycopg2
from psycopg2.extras import RealDictCursor

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
}


def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def hash_password(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()


def make_token() -> str:
    return secrets.token_hex(32)


def ok(data: dict, status: int = 200) -> dict:
    return {
        'statusCode': status,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False, default=str)
    }


def err(msg: str, status: int = 400) -> dict:
    return {
        'statusCode': status,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps({'error': msg}, ensure_ascii=False)
    }


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')

    # GET — список пользователей (по городу)
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        city = params.get('city')
        conn = get_db()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        try:
            if city:
                cur.execute(
                    f"SELECT id, first_name, last_name, phone, city, region, avatar_emoji, status_text, online, last_seen FROM {schema}.users WHERE city = %s ORDER BY online DESC, first_name",
                    (city,)
                )
            else:
                cur.execute(
                    f"SELECT id, first_name, last_name, phone, city, region, avatar_emoji, status_text, online, last_seen FROM {schema}.users ORDER BY city, first_name LIMIT 200"
                )
            rows = [dict(r) for r in cur.fetchall()]
            return ok({'users': rows})
        finally:
            cur.close()
            conn.close()

    # POST — все действия через поле action
    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        action = body.get('action', '')

        # ── REGISTER ──────────────────────────────────────
        if action == 'register':
            first_name = (body.get('first_name') or '').strip()
            last_name  = (body.get('last_name') or '').strip()
            phone      = (body.get('phone') or '').strip().replace(' ', '').replace('-', '')
            city       = (body.get('city') or '').strip()
            region     = (body.get('region') or 'Крым').strip()
            password   = body.get('password') or ''

            if not all([first_name, last_name, phone, city, password]):
                return err('Заполните все поля')
            if len(password) < 4:
                return err('Пароль минимум 4 символа')

            token = make_token()
            conn = get_db()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            try:
                cur.execute(f"SELECT id FROM {schema}.users WHERE phone = %s", (phone,))
                if cur.fetchone():
                    return err('Этот номер уже зарегистрирован')

                cur.execute(
                    f"""INSERT INTO {schema}.users
                        (first_name, last_name, phone, city, region, password_hash, session_token, online)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, true)
                        RETURNING id, first_name, last_name, phone, city, region, avatar_emoji, status_text""",
                    (first_name, last_name, phone, city, region, hash_password(password), token)
                )
                user = dict(cur.fetchone())
                conn.commit()
                return ok({'token': token, 'user': user})
            finally:
                cur.close()
                conn.close()

        # ── LOGIN ─────────────────────────────────────────
        if action == 'login':
            phone    = (body.get('phone') or '').strip().replace(' ', '').replace('-', '')
            password = body.get('password') or ''

            if not phone or not password:
                return err('Введите номер телефона и пароль')

            token = make_token()
            conn = get_db()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            try:
                cur.execute(
                    f"SELECT * FROM {schema}.users WHERE phone = %s AND password_hash = %s",
                    (phone, hash_password(password))
                )
                row = cur.fetchone()
                if not row:
                    return err('Неверный номер или пароль')

                cur.execute(
                    f"UPDATE {schema}.users SET session_token = %s, online = true, last_seen = NOW() WHERE id = %s",
                    (token, row['id'])
                )
                conn.commit()
                user = {k: row[k] for k in ['id', 'first_name', 'last_name', 'phone', 'city', 'region', 'avatar_emoji', 'status_text']}
                return ok({'token': token, 'user': user})
            finally:
                cur.close()
                conn.close()

        # ── ME (получить профиль по токену) ───────────────
        if action == 'me':
            token = (body.get('token') or '').strip()
            if not token:
                return err('Не авторизован', 401)

            conn = get_db()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            try:
                cur.execute(
                    f"SELECT id, first_name, last_name, phone, city, region, avatar_emoji, status_text, online FROM {schema}.users WHERE session_token = %s",
                    (token,)
                )
                row = cur.fetchone()
                if not row:
                    return err('Сессия истекла', 401)
                return ok({'user': dict(row)})
            finally:
                cur.close()
                conn.close()

        # ── LOGOUT ────────────────────────────────────────
        if action == 'logout':
            token = (body.get('token') or '').strip()
            if token:
                conn = get_db()
                cur = conn.cursor()
                try:
                    cur.execute(f"UPDATE {schema}.users SET session_token = NULL, online = false WHERE session_token = %s", (token,))
                    conn.commit()
                finally:
                    cur.close()
                    conn.close()
            return ok({'ok': True})

        return err('Неизвестное действие')

    return err('Метод не поддерживается', 405)
