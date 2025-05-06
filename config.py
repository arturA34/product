import os
from dotenv import load_dotenv

# Загружаем переменные окружения из .env файла
load_dotenv()

# Конфигурационный файл бота
BOT_TOKEN = os.getenv("BOT_TOKEN")  # Токен из переменных окружения

# Настройки базы данных (для простоты используем SQLite)
DATABASE_NAME = os.getenv("DATABASE_NAME", "language_bot.db")

# Доступные языки для изучения
AVAILABLE_LANGUAGES = {
    "en": "Английский",
    "es": "Испанский",
    "de": "Немецкий",
    "fr": "Французский"
}

# Уровни владения языком
LANGUAGE_LEVELS = ["A1", "A2", "B1", "B2", "C1"] 