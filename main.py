import logging
import asyncio
import random
import sys
from aiogram import Bot, Dispatcher, types
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.filters import Command
from aiogram.filters.callback_data import CallbackData
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, KeyboardButton, ReplyKeyboardMarkup

from config import BOT_TOKEN, AVAILABLE_LANGUAGES
from database import init_db, register_user, get_user_settings, update_user_settings, add_word, update_user_xp, update_completed_lessons
from keyboards import get_main_menu, get_language_selection, get_level_selection, get_settings_menu, get_lessons_menu, get_flashcards_menu, get_flashcard_review_controls
from content import lessons, default_flashcards, motivational_phrases

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Определение состояний для машины состояний
class BotStates(StatesGroup):
    # Основные состояния
    START = State()
    MAIN_MENU = State()
    
    # Состояния для настроек
    SETTINGS = State()
    SELECTING_LANGUAGE = State()
    SELECTING_LEVEL = State()
    
    # Состояния для уроков
    LESSONS_MENU = State()
    VIEWING_LESSON = State()
    QUIZ = State()
    
    # Состояния для карточек
    FLASHCARDS_MENU = State()
    ADDING_CARD_WORD = State()
    ADDING_CARD_TRANSLATION = State()
    ADDING_CARD_EXAMPLE = State()
    REVIEWING_CARDS = State()
    
    # Состояния для прогресса
    VIEWING_PROGRESS = State()

# Инициализация бота и диспетчера
async def main():
    # Проверка наличия токена бота
    if not BOT_TOKEN:
        logger.error("Ошибка: BOT_TOKEN не найден в переменных окружения!")
        logger.error("Пожалуйста, установите BOT_TOKEN в файле .env")
        return sys.exit(1)
        
    # Инициализация бота
    bot = Bot(token=BOT_TOKEN)
    storage = MemoryStorage()
    dp = Dispatcher(storage=storage)
    
    # Инициализация базы данных
    init_db()
    
    logger.info("Бот запущен!")
    
    # Регистрация обработчиков
    
    # Обработчик команды /start
    @dp.message(Command("start"))
    async def cmd_start(message: types.Message):
        # Регистрация пользователя
        user = message.from_user
        register_user(user.id, user.username, user.first_name, user.last_name)
        
        await message.answer(
            f"👋 Привет, {user.first_name}!\n\n"
            "Я твой персональный бот для изучения иностранных языков. "
            "Я помогу тебе изучать новые слова, проходить уроки и отслеживать твой прогресс.\n\n"
            "Давай выберем язык, который ты хочешь изучать:",
            reply_markup=get_language_selection()
        )
        await BotStates.SELECTING_LANGUAGE.set()
    
    # Обработчик выбора языка
    @dp.callback_query(lambda c: c.data.startswith('select_language:'))
    async def process_language_selection(callback_query: types.CallbackQuery, state: FSMContext):
        language_code = callback_query.data.split(':')[1]
        
        # Сохраняем выбранный язык в настройках пользователя
        update_user_settings(callback_query.from_user.id, "target_language", language_code)
        
        await callback_query.answer()
        await callback_query.message.edit_text(
            f"Отлично! Ты выбрал {AVAILABLE_LANGUAGES[language_code]}.\n\n"
            "Теперь выбери свой уровень владения языком:",
            reply_markup=get_level_selection()
        )
        
        await state.set_state(BotStates.SELECTING_LEVEL)
    
    # Обработчик выбора уровня
    @dp.callback_query(lambda c: c.data.startswith('select_level:'))
    async def process_level_selection(callback_query: types.CallbackQuery, state: FSMContext):
        level = callback_query.data.split(':')[1]
        
        # Сохраняем выбранный уровень в настройках пользователя
        update_user_settings(callback_query.from_user.id, "language_level", level)
        
        # Начисляем XP за настройку профиля
        update_user_xp(callback_query.from_user.id, 10)
        
        # Отправляем приветственное сообщение и главное меню
        settings = get_user_settings(callback_query.from_user.id)
        target_language = settings[1]  # target_language из результата запроса
        
        # Подтверждаем колбэк, чтобы убрать "часики"
        await callback_query.answer()
        
        # Удаляем сообщение с выбором уровня
        await callback_query.message.delete()
        
        # Отправляем новое сообщение с клавиатурой напрямую
        main_menu = get_main_menu()
        await callback_query.message.bot.send_message(
            callback_query.from_user.id,
            f"🎉 Отлично! Твой профиль настроен.\n\n"
            f"Выбранный язык: {AVAILABLE_LANGUAGES[target_language]}\n"
            f"Уровень: {level}\n\n"
            "Теперь ты можешь начать изучение языка. Выбери раздел из меню ниже:",
            reply_markup=main_menu
        )
        
        await state.set_state(BotStates.MAIN_MENU)
    
    # Обработчик для главного меню
    @dp.message(BotStates.MAIN_MENU)
    async def process_main_menu(message: types.Message, state: FSMContext):
        if message.text == "🏫 Уроки":
            settings = get_user_settings(message.from_user.id)
            target_language = settings[1]  # target_language из результата запроса
            
            await message.answer(
                "Выбери урок для изучения:",
                reply_markup=get_lessons_menu(target_language)
            )
            await state.set_state(BotStates.LESSONS_MENU)
            
        elif message.text == "📝 Мои карточки":
            await message.answer(
                "Раздел карточек для запоминания слов:",
                reply_markup=get_flashcards_menu()
            )
            await state.set_state(BotStates.FLASHCARDS_MENU)
            
        elif message.text == "📊 Прогресс":
            # В реальном боте здесь должно быть получение прогресса из БД
            await message.answer(
                "📊 Твой прогресс:\n\n"
                "✅ Уроков пройдено: 0\n"
                "📚 Слов выучено: 0\n"
                "🎯 Тестов пройдено: 0\n"
                "⭐ Очков опыта: 10\n"
                "🔥 Ежедневная серия: 1 день\n\n"
                "Продолжай заниматься, чтобы улучшить свои результаты!"
            )
            
        elif message.text == "⚙️ Настройки":
            await message.answer(
                "Настройки бота:",
                reply_markup=get_settings_menu()
            )
            await state.set_state(BotStates.SETTINGS)
            
        elif message.text == "❓ Помощь":
            await message.answer(
                "🤖 Как пользоваться ботом:\n\n"
                "🏫 *Уроки* — изучай грамматику и новые слова\n"
                "📝 *Мои карточки* — сохраняй и повторяй новые слова\n"
                "📊 *Прогресс* — отслеживай свои достижения\n"
                "⚙️ *Настройки* — настрой бота под себя\n\n"
                "Если у тебя возникли вопросы или проблемы, свяжись с разработчиком.",
                parse_mode="Markdown"
            )
    
    # Обработчик для меню уроков
    @dp.callback_query(lambda c: c.data.startswith('lesson:'))
    async def process_lesson_selection(callback_query: types.CallbackQuery, state: FSMContext):
        lesson_data = callback_query.data.split(':')
        language = lesson_data[1]
        lesson_id = int(lesson_data[2])
        
        # Получаем информацию об уроке
        lesson = lessons[language][lesson_id]
        
        # Сохраняем информацию о текущем уроке
        await state.update_data(current_lesson=lesson, language=language, lesson_id=lesson_id)
        
        await callback_query.answer()
        await callback_query.message.edit_text(
            f"{lesson['content']}\n\n"
            "Когда закончишь изучение, нажми кнопку ниже, чтобы пройти тест:",
            parse_mode="Markdown",
            reply_markup=InlineKeyboardMarkup(
                inline_keyboard=[[
                    InlineKeyboardButton(
                        text="📝 Пройти тест", 
                        callback_data=f"start_quiz:{language}:{lesson_id}"
                    )
                ]]
            )
        )
        
        await state.set_state(BotStates.VIEWING_LESSON)
    
    # Обработчик для начала теста
    @dp.callback_query(lambda c: c.data.startswith('start_quiz:'))
    async def start_quiz(callback_query: types.CallbackQuery, state: FSMContext):
        data = await state.get_data()
        lesson = data['current_lesson']
        
        # Сохраняем информацию о тесте
        await state.update_data(
            quiz_questions=lesson['quiz'],
            current_question=0,
            correct_answers=0
        )
        
        await callback_query.answer()
        
        # Показываем первый вопрос
        await show_question(callback_query.message, state)
        
        await state.set_state(BotStates.QUIZ)
    
    # Функция для отображения вопроса теста
    async def show_question(message: types.Message, state: FSMContext):
        data = await state.get_data()
        quiz_questions = data['quiz_questions']
        current_question = data['current_question']
        
        if current_question < len(quiz_questions):
            question = quiz_questions[current_question]
            
            # Создаем клавиатуру с вариантами ответов
            keyboard = []
            for i, option in enumerate(question['options']):
                keyboard.append([InlineKeyboardButton(
                    text=option, 
                    callback_data=f"quiz_answer:{i}"
                )])
            
            question_text = f"Вопрос {current_question + 1}/{len(quiz_questions)}:\n\n{question['question']}"
            
            await message.edit_text(
                question_text,
                reply_markup=InlineKeyboardMarkup(inline_keyboard=keyboard)
            )
    
    # Обработчик ответов на вопросы теста
    @dp.callback_query(lambda c: c.data.startswith('quiz_answer:'))
    async def process_answer(callback_query: types.CallbackQuery, state: FSMContext):
        user_answer = int(callback_query.data.split(':')[1])
        
        data = await state.get_data()
        quiz_questions = data['quiz_questions']
        current_question = data['current_question']
        correct_answers = data['correct_answers']
        
        question = quiz_questions[current_question]
        correct = question['correct']
        
        # Проверяем ответ
        if user_answer == correct:
            correct_answers += 1
            await callback_query.answer("✅ Правильно!")
        else:
            await callback_query.answer(f"❌ Неправильно. Правильный ответ: {question['options'][correct]}")
        
        # Обновляем данные состояния
        current_question += 1
        await state.update_data(
            current_question=current_question,
            correct_answers=correct_answers
        )
        
        # Переходим к следующему вопросу или завершаем тест
        if current_question < len(quiz_questions):
            await show_question(callback_query.message, state)
        else:
            # Тест завершен, показываем результаты
            score_percent = int(correct_answers / len(quiz_questions) * 100)
            xp_earned = correct_answers * 5  # 5 XP за каждый правильный ответ
            
            # Обновляем статистику пользователя
            update_user_xp(callback_query.from_user.id, xp_earned)
            update_completed_lessons(callback_query.from_user.id)
            
            # Выбираем случайную мотивационную фразу
            motivation = random.choice(motivational_phrases)
            
            result_text = (
                f"📝 Тест завершен!\n\n"
                f"Правильных ответов: {correct_answers}/{len(quiz_questions)}\n"
                f"Результат: {score_percent}%\n"
                f"Заработано XP: {xp_earned}\n\n"
                f"🔥 {motivation}"
            )
            
            await callback_query.message.edit_text(
                result_text,
                reply_markup=InlineKeyboardMarkup(
                    inline_keyboard=[[
                        InlineKeyboardButton(
                            text="🔙 Вернуться к урокам", 
                            callback_data="back_to_lessons"
                        )
                    ]]
                )
            )
    
    # Обработчик возврата к урокам
    @dp.callback_query(lambda c: c.data == "back_to_lessons")
    async def back_to_lessons(callback_query: types.CallbackQuery, state: FSMContext):
        settings = get_user_settings(callback_query.from_user.id)
        target_language = settings[1]  # target_language из результата запроса
        
        await callback_query.answer()
        await callback_query.message.edit_text(
            "Выбери урок для изучения:",
            reply_markup=get_lessons_menu(target_language)
        )
        
        await state.set_state(BotStates.LESSONS_MENU)
    
    # Обработчик возврата в главное меню
    @dp.callback_query(lambda c: c.data == "back_to_main")
    async def back_to_main(callback_query: types.CallbackQuery, state: FSMContext):
        await callback_query.answer()
        await callback_query.message.delete()
        
        await callback_query.message.answer(
            "Выбери раздел из меню ниже:",
            reply_markup=get_main_menu()
        )
        
        await state.set_state(BotStates.MAIN_MENU)
    
    # Обработчик для меню карточек
    @dp.callback_query(lambda c: c.data == "add_card")
    async def start_adding_card(callback_query: types.CallbackQuery, state: FSMContext):
        await callback_query.answer()
        await callback_query.message.answer(
            "Введи слово или фразу на изучаемом языке:",
        )
        
        await state.set_state(BotStates.ADDING_CARD_WORD)
    
    # Обработчик ввода слова для карточки
    @dp.message(BotStates.ADDING_CARD_WORD)
    async def process_card_word(message: types.Message, state: FSMContext):
        await state.update_data(card_word=message.text)
        
        await message.answer("Теперь введи перевод этого слова:")
        await state.set_state(BotStates.ADDING_CARD_TRANSLATION)
    
    # Обработчик ввода перевода для карточки
    @dp.message(BotStates.ADDING_CARD_TRANSLATION)
    async def process_card_translation(message: types.Message, state: FSMContext):
        await state.update_data(card_translation=message.text)
        
        await message.answer("Введи пример использования (или нажми /skip, чтобы пропустить):")
        await state.set_state(BotStates.ADDING_CARD_EXAMPLE)
    
    # Обработчик ввода примера для карточки или пропуска
    @dp.message(BotStates.ADDING_CARD_EXAMPLE)
    async def process_card_example(message: types.Message, state: FSMContext):
        data = await state.get_data()
        word = data['card_word']
        translation = data['card_translation']
        
        example = "" if message.text == "/skip" else message.text
        
        # Получаем настройки пользователя для определения языка
        settings = get_user_settings(message.from_user.id)
        target_language = settings[1]  # target_language из результата запроса
        
        # Добавляем карточку в базу данных
        add_word(message.from_user.id, word, translation, target_language, example)
        
        # Начисляем XP за добавление карточки
        update_user_xp(message.from_user.id, 2)
        
        await message.answer(
            f"✅ Карточка добавлена!\n\n"
            f"Слово: {word}\n"
            f"Перевод: {translation}\n"
            f"Пример: {example or '(не указан)'}\n\n"
            f"Что хочешь сделать дальше?",
            reply_markup=get_flashcards_menu()
        )
        
        await state.set_state(BotStates.FLASHCARDS_MENU)
    
    # Обработчик для начала повторения карточек
    @dp.callback_query(lambda c: c.data == "review_cards")
    async def start_reviewing_cards(callback_query: types.CallbackQuery, state: FSMContext):
        # В реальном боте здесь должна быть логика получения карточек из БД
        # Для примера используем дефолтные карточки
        settings = get_user_settings(callback_query.from_user.id)
        target_language = settings[1]  # target_language из результата запроса
        
        # Используем дефолтные карточки для демонстрации
        cards = default_flashcards.get(target_language, default_flashcards["en"])
        
        if not cards:
            await callback_query.answer()
            await callback_query.message.answer(
                "У тебя пока нет карточек для повторения. Попробуй добавить новые карточки."
            )
            return
        
        # Сохраняем карточки в состоянии
        await state.update_data(review_cards=cards, current_card_index=0)
        
        await callback_query.answer()
        await show_flashcard(callback_query.message.bot, callback_query.from_user.id, state)
        
        await state.set_state(BotStates.REVIEWING_CARDS)
    
    # Функция для отображения карточки
    async def show_flashcard(bot, user_id, state):
        data = await state.get_data()
        cards = data['review_cards']
        index = data['current_card_index']
        
        if index < len(cards):
            card = cards[index]
            
            card_text = (
                f"Карточка {index + 1}/{len(cards)}:\n\n"
                f"📝 *{card['word']}*\n\n"
                f"👆 Нажми кнопку ниже, когда вспомнишь перевод"
            )
            
            keyboard = InlineKeyboardMarkup(
                inline_keyboard=[[
                    InlineKeyboardButton(
                        text="👀 Показать перевод", 
                        callback_data="show_translation"
                    )
                ]]
            )
            
            await bot.send_message(
                user_id,
                card_text,
                parse_mode="Markdown",
                reply_markup=keyboard
            )
    
    # Обработчик для показа перевода
    @dp.callback_query(lambda c: c.data == "show_translation")
    async def show_card_translation(callback_query: types.CallbackQuery, state: FSMContext):
        data = await state.get_data()
        cards = data['review_cards']
        index = data['current_card_index']
        
        card = cards[index]
        
        translation_text = (
            f"Карточка {index + 1}/{len(cards)}:\n\n"
            f"📝 *{card['word']}*\n"
            f"🔤 Перевод: *{card['translation']}*\n\n"
            f"📚 Пример: _{card['example']}_\n\n"
            f"Помнишь ли ты эту карточку?"
        )
        
        await callback_query.answer()
        await callback_query.message.edit_text(
            translation_text,
            parse_mode="Markdown",
            reply_markup=get_flashcard_review_controls()
        )
    
    # Обработчик ответа на карточку
    @dp.callback_query(lambda c: c.data.startswith('card_response:'))
    async def process_card_response(callback_query: types.CallbackQuery, state: FSMContext):
        response = callback_query.data.split(':')[1]
        
        data = await state.get_data()
        index = data['current_card_index']
        
        # В реальном боте здесь должна быть логика обновления интервала повторения
        
        # Начисляем XP за повторение
        if response == "success":
            update_user_xp(callback_query.from_user.id, 1)
            await callback_query.answer("✅ Отлично! +1 XP")
        else:
            await callback_query.answer("Эта карточка появится снова для повторения")
        
        # Переходим к следующей карточке
        index += 1
        await state.update_data(current_card_index=index)
        
        # Удаляем сообщение с текущей карточкой
        await callback_query.message.delete()
        
        # Показываем следующую карточку или завершаем сессию
        if index < len(data['review_cards']):
            await show_flashcard(callback_query.message.bot, callback_query.from_user.id, state)
        else:
            # Мотивационное сообщение о завершении повторения
            motivation = random.choice(motivational_phrases)
            
            await callback_query.message.answer(
                f"🎉 Повторение завершено!\n\n"
                f"Ты повторил {len(data['review_cards'])} карточек.\n\n"
                f"🔥 {motivation}",
                reply_markup=get_flashcards_menu()
            )
            await state.set_state(BotStates.FLASHCARDS_MENU)
    
    # Обработчик для завершения повторения карточек
    @dp.callback_query(lambda c: c.data == "finish_review")
    async def finish_reviewing_cards(callback_query: types.CallbackQuery, state: FSMContext):
        data = await state.get_data()
        reviewed_count = data['current_card_index']
        
        await callback_query.answer()
        await callback_query.message.delete()
        
        await callback_query.message.answer(
            f"🎉 Повторение завершено досрочно.\n\n"
            f"Ты повторил {reviewed_count} карточек из {len(data['review_cards'])}.",
            reply_markup=get_flashcards_menu()
        )
        
        await state.set_state(BotStates.FLASHCARDS_MENU)
    
    # Обработчик команды /help
    @dp.message(Command("help"))
    async def cmd_help(message: types.Message):
        await message.answer(
            "🤖 Как пользоваться ботом:\n\n"
            "🏫 *Уроки* — изучай грамматику и новые слова\n"
            "📝 *Мои карточки* — сохраняй и повторяй новые слова\n"
            "📊 *Прогресс* — отслеживай свои достижения\n"
            "⚙️ *Настройки* — настрой бота под себя\n\n"
            "Команды:\n"
            "/start — начать обучение\n"
            "/help — показать эту справку\n"
            "/reset — сбросить настройки (начать сначала)",
            parse_mode="Markdown"
        )
    
    # Обработчик команды /reset
    @dp.message(Command("reset"))
    async def cmd_reset(message: types.Message, state: FSMContext):
        # В реальном боте здесь должен быть сброс настроек пользователя
        await state.clear()
        
        await message.answer(
            "🔄 Настройки сброшены. Для начала обучения заново используй команду /start"
        )
    
    # Запуск бота
    try:
        await dp.start_polling(bot)
    finally:
        await bot.session.close()

if __name__ == '__main__':
    # Запуск бота
    asyncio.run(main()) 