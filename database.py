import sqlite3
from config import DATABASE_NAME

# Инициализация базы данных
def init_db():
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    
    # Таблица пользователей
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        username TEXT,
        first_name TEXT,
        last_name TEXT,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')
    
    # Таблица настроек пользователей
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_settings (
        user_id INTEGER PRIMARY KEY,
        target_language TEXT DEFAULT "en",
        language_level TEXT DEFAULT "A1",
        interface_language TEXT DEFAULT "ru",
        daily_reminder INTEGER DEFAULT 0,
        reminder_time TEXT DEFAULT "18:00",
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )''')

    # Таблица изученных слов
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS learned_words (
        id INTEGER PRIMARY KEY,
        user_id INTEGER,
        word TEXT,
        translation TEXT,
        language TEXT,
        example TEXT,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_repeated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        repetition_count INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )''')
    
    # Таблица прогресса пользователей
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_progress (
        user_id INTEGER PRIMARY KEY,
        xp_points INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        words_learned INTEGER DEFAULT 0,
        lessons_completed INTEGER DEFAULT 0,
        tests_completed INTEGER DEFAULT 0,
        daily_streak INTEGER DEFAULT 0,
        last_activity DATE,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )''')
    
    conn.commit()
    conn.close()

# Регистрация нового пользователя
def register_user(user_id, username, first_name, last_name):
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    
    # Проверяем, существует ли пользователь
    cursor.execute("SELECT user_id FROM users WHERE user_id = ?", (user_id,))
    if cursor.fetchone() is None:
        # Добавляем нового пользователя
        cursor.execute(
            "INSERT INTO users (user_id, username, first_name, last_name) VALUES (?, ?, ?, ?)",
            (user_id, username, first_name, last_name)
        )
        # Создаем настройки и прогресс по умолчанию
        cursor.execute("INSERT INTO user_settings (user_id) VALUES (?)", (user_id,))
        cursor.execute("INSERT INTO user_progress (user_id, last_activity) VALUES (?, date('now'))", (user_id,))
        conn.commit()
    
    conn.close()

# Получение настроек пользователя
def get_user_settings(user_id):
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM user_settings WHERE user_id = ?", (user_id,))
    settings = cursor.fetchone()
    
    conn.close()
    return settings

# Обновление настроек пользователя
def update_user_settings(user_id, setting_name, setting_value):
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    
    cursor.execute(f"UPDATE user_settings SET {setting_name} = ? WHERE user_id = ?", 
                  (setting_value, user_id))
    conn.commit()
    
    conn.close()

# Добавление нового слова для изучения
def add_word(user_id, word, translation, language, example=""):
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO learned_words (user_id, word, translation, language, example) VALUES (?, ?, ?, ?, ?)",
        (user_id, word, translation, language, example)
    )
    conn.commit()
    
    # Обновляем статистику
    cursor.execute("UPDATE user_progress SET words_learned = words_learned + 1 WHERE user_id = ?", (user_id,))
    conn.commit()
    
    conn.close()

# Получение прогресса пользователя
def get_user_progress(user_id):
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM user_progress WHERE user_id = ?", (user_id,))
    progress = cursor.fetchone()
    
    conn.close()
    return progress

# Обновление прогресса пользователя (начисление XP)
def update_user_xp(user_id, xp_amount):
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    
    # Обновляем XP и проверяем необходимость повышения уровня
    cursor.execute("UPDATE user_progress SET xp_points = xp_points + ? WHERE user_id = ?", 
                  (xp_amount, user_id))
    
    # Обновляем дату последней активности
    cursor.execute("UPDATE user_progress SET last_activity = date('now') WHERE user_id = ?", 
                  (user_id,))
    
    conn.commit()
    conn.close()

# Обновление счетчика выполненных уроков
def update_completed_lessons(user_id):
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    
    cursor.execute("UPDATE user_progress SET lessons_completed = lessons_completed + 1 WHERE user_id = ?", 
                  (user_id,))
    conn.commit()
    
    conn.close() 