from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton
from config import AVAILABLE_LANGUAGES, LANGUAGE_LEVELS

# Главное меню
def get_main_menu():
    """Создает клавиатуру главного меню"""
    buttons = [
        [KeyboardButton(text="🏫 Уроки")],
        [KeyboardButton(text="📝 Мои карточки"), KeyboardButton(text="📊 Прогресс")],
        [KeyboardButton(text="⚙️ Настройки"), KeyboardButton(text="❓ Помощь")]
    ]
    keyboard = ReplyKeyboardMarkup(keyboard=buttons, resize_keyboard=True, one_time_keyboard=False)
    return keyboard

# Выбор языка для изучения
def get_language_selection():
    buttons = []
    for lang_code, lang_name in AVAILABLE_LANGUAGES.items():
        buttons.append([
            InlineKeyboardButton(
                text=lang_name,
                callback_data=f"select_language:{lang_code}"
            )
        ])
    return InlineKeyboardMarkup(inline_keyboard=buttons)

# Выбор уровня владения языком
def get_level_selection():
    buttons = []
    for level in LANGUAGE_LEVELS:
        buttons.append([
            InlineKeyboardButton(
                text=level,
                callback_data=f"select_level:{level}"
            )
        ])
    return InlineKeyboardMarkup(inline_keyboard=buttons)

# Меню настроек
def get_settings_menu():
    buttons = [
        [InlineKeyboardButton(text="🔤 Изменить язык изучения", callback_data="change_target_language")],
        [InlineKeyboardButton(text="📊 Изменить уровень", callback_data="change_level")],
        [InlineKeyboardButton(text="🔔 Настройка уведомлений", callback_data="notification_settings")],
        [InlineKeyboardButton(text="🔙 Назад", callback_data="back_to_main")]
    ]
    return InlineKeyboardMarkup(inline_keyboard=buttons)

# Меню уроков
def get_lessons_menu(target_language):
    buttons = []
    
    # Здесь можно динамически добавлять уроки в зависимости от языка
    if target_language == "en":
        buttons.append([InlineKeyboardButton(text="Урок 1: Знакомство", callback_data="lesson:en:1")])
        buttons.append([InlineKeyboardButton(text="Урок 2: Базовые фразы", callback_data="lesson:en:2")])
        buttons.append([InlineKeyboardButton(text="Урок 3: Числа", callback_data="lesson:en:3")])
    elif target_language == "es":
        buttons.append([InlineKeyboardButton(text="Урок 1: Saludos", callback_data="lesson:es:1")])
        buttons.append([InlineKeyboardButton(text="Урок 2: Presentaciones", callback_data="lesson:es:2")])
    
    buttons.append([InlineKeyboardButton(text="🔙 Назад", callback_data="back_to_main")])
    return InlineKeyboardMarkup(inline_keyboard=buttons)

# Меню карточек
def get_flashcards_menu():
    buttons = [
        [InlineKeyboardButton(text="📚 Повторить карточки", callback_data="review_cards")],
        [InlineKeyboardButton(text="➕ Добавить новую карточку", callback_data="add_card")],
        [InlineKeyboardButton(text="📋 Мои карточки", callback_data="my_cards")],
        [InlineKeyboardButton(text="🔙 Назад", callback_data="back_to_main")]
    ]
    return InlineKeyboardMarkup(inline_keyboard=buttons)

# Управление повторением карточек
def get_flashcard_review_controls():
    buttons = [
        [
            InlineKeyboardButton(text="❌ Не знаю", callback_data="card_response:fail"),
            InlineKeyboardButton(text="✅ Знаю", callback_data="card_response:success")
        ],
        [InlineKeyboardButton(text="🔙 Завершить повторение", callback_data="finish_review")]
    ]
    return InlineKeyboardMarkup(inline_keyboard=buttons) 