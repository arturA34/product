# Примеры учебных материалов и контента для бота
# В реальном проекте здесь может быть подключение к внешней базе данных с контентом

# Уроки
lessons = {
    "en": {  # Английский язык
        1: {
            "title": "Знакомство",
            "content": """
*Урок 1: Знакомство*

Приветствия:
• Hello! - Привет!
• Hi! - Привет!
• Good morning! - Доброе утро!
• Good afternoon! - Добрый день!
• Good evening! - Добрый вечер!

Знакомство:
• My name is ... - Меня зовут ...
• What's your name? - Как тебя зовут?
• Nice to meet you! - Приятно познакомиться!
• I'm from ... - Я из ...
• Where are you from? - Откуда ты?

Прощание:
• Goodbye! - До свидания!
• Bye! - Пока!
• See you later! - Увидимся позже!
• Have a nice day! - Хорошего дня!
            """,
            "quiz": [
                {
                    "question": "Как сказать 'Доброе утро' на английском?",
                    "options": ["Good night", "Good morning", "Good day", "Good evening"],
                    "correct": 1
                },
                {
                    "question": "Как спросить 'Как тебя зовут?' на английском?",
                    "options": ["How are you?", "Where are you from?", "What's your name?", "Who are you?"],
                    "correct": 2
                },
                {
                    "question": "Как сказать 'Приятно познакомиться' на английском?",
                    "options": ["Nice day!", "Nice to meet you!", "Good to know you", "Hello to you!"],
                    "correct": 1
                }
            ]
        },
        2: {
            "title": "Базовые фразы",
            "content": """
*Урок 2: Базовые фразы*

Вопросы о самочувствии:
• How are you? - Как дела?
• I'm fine, thank you. - У меня все хорошо, спасибо.
• I'm good. - У меня все хорошо.
• I'm OK. - Я в порядке.
• Not bad. - Неплохо.
• I'm tired. - Я устал.

Просьбы и благодарности:
• Please. - Пожалуйста (при просьбе).
• Thank you. / Thanks. - Спасибо.
• You're welcome. - Пожалуйста (в ответ на благодарность).
• Excuse me. - Извините (при обращении).
• Sorry. - Извините (при извинении).

Полезные фразы:
• I don't understand. - Я не понимаю.
• Could you repeat, please? - Не могли бы вы повторить, пожалуйста?
• Could you speak more slowly? - Не могли бы вы говорить медленнее?
• What does ... mean? - Что означает ...?
• How do you say ... in English? - Как сказать ... по-английски?
            """,
            "quiz": [
                {
                    "question": "Как спросить 'Как дела?' на английском?",
                    "options": ["How do you do?", "How are you?", "How is it going?", "How do you feel?"],
                    "correct": 1
                },
                {
                    "question": "Как сказать 'Спасибо' на английском?",
                    "options": ["Please", "Welcome", "Thank you", "Sorry"],
                    "correct": 2
                }
            ]
        },
        3: {
            "title": "Числа",
            "content": """
*Урок 3: Числа*

Числа от 1 до 10:
• 1 - one
• 2 - two
• 3 - three
• 4 - four
• 5 - five
• 6 - six
• 7 - seven
• 8 - eight
• 9 - nine
• 10 - ten

Числа от 11 до 20:
• 11 - eleven
• 12 - twelve
• 13 - thirteen
• 14 - fourteen
• 15 - fifteen
• 16 - sixteen
• 17 - seventeen
• 18 - eighteen
• 19 - nineteen
• 20 - twenty

Десятки:
• 10 - ten
• 20 - twenty
• 30 - thirty
• 40 - forty
• 50 - fifty
• 60 - sixty
• 70 - seventy
• 80 - eighty
• 90 - ninety
• 100 - one hundred
            """,
            "quiz": [
                {
                    "question": "Как сказать '15' на английском?",
                    "options": ["fifty", "fiveteen", "fifteen", "five"],
                    "correct": 2
                },
                {
                    "question": "Как сказать '70' на английском?",
                    "options": ["seventy", "seventen", "seventeen", "seven"],
                    "correct": 0
                }
            ]
        }
    },
    "es": {  # Испанский язык
        1: {
            "title": "Saludos (Приветствия)",
            "content": """
*Урок 1: Saludos (Приветствия)*

Приветствия:
• ¡Hola! - Привет!
• ¡Buenos días! - Доброе утро!
• ¡Buenas tardes! - Добрый день!
• ¡Buenas noches! - Добрый вечер/Спокойной ночи!

Знакомство:
• Me llamo ... - Меня зовут ...
• ¿Cómo te llamas? - Как тебя зовут?
• Mucho gusto. - Приятно познакомиться.
• Soy de ... - Я из ...
• ¿De dónde eres? - Откуда ты?

Прощание:
• ¡Adiós! - До свидания!
• ¡Hasta luego! - До встречи!
• ¡Hasta mañana! - До завтра!
• ¡Que tengas un buen día! - Хорошего дня!
            """,
            "quiz": [
                {
                    "question": "Как сказать 'Доброе утро' на испанском?",
                    "options": ["Buenas noches", "Buenos días", "Buenas tardes", "Buen día"],
                    "correct": 1
                },
                {
                    "question": "Как спросить 'Как тебя зовут?' на испанском?",
                    "options": ["¿Cómo estás?", "¿De dónde eres?", "¿Cómo te llamas?", "¿Quién eres?"],
                    "correct": 2
                }
            ]
        }
    }
}

# Примеры карточек для изучения слов
default_flashcards = {
    "en": [  # Английский
        {"word": "hello", "translation": "привет", "example": "Hello, how are you?"},
        {"word": "goodbye", "translation": "до свидания", "example": "Goodbye, see you tomorrow!"},
        {"word": "thank you", "translation": "спасибо", "example": "Thank you for your help."},
        {"word": "please", "translation": "пожалуйста", "example": "Please, can you help me?"},
        {"word": "yes", "translation": "да", "example": "Yes, I agree with you."},
        {"word": "no", "translation": "нет", "example": "No, I don't want to go there."},
        {"word": "friend", "translation": "друг", "example": "He is my best friend."},
        {"word": "family", "translation": "семья", "example": "I love my family."},
        {"word": "water", "translation": "вода", "example": "I need some water."},
        {"word": "food", "translation": "еда", "example": "The food was delicious."}
    ],
    "es": [  # Испанский
        {"word": "hola", "translation": "привет", "example": "¡Hola! ¿Cómo estás?"},
        {"word": "adiós", "translation": "до свидания", "example": "¡Adiós! Hasta mañana."},
        {"word": "gracias", "translation": "спасибо", "example": "Muchas gracias por tu ayuda."},
        {"word": "por favor", "translation": "пожалуйста", "example": "Por favor, ¿puedes ayudarme?"},
        {"word": "sí", "translation": "да", "example": "Sí, estoy de acuerdo contigo."},
        {"word": "no", "translation": "нет", "example": "No, no quiero ir allí."},
        {"word": "amigo", "translation": "друг", "example": "Él es mi mejor amigo."},
        {"word": "familia", "translation": "семья", "example": "Amo a mi familia."},
        {"word": "agua", "translation": "вода", "example": "Necesito un poco de agua."},
        {"word": "comida", "translation": "еда", "example": "La comida estaba deliciosa."}
    ]
}

# Мотивационные фразы для поддержки пользователей
motivational_phrases = [
    "Отличная работа! Продолжай в том же духе!",
    "Ты делаешь успехи! Не останавливайся!",
    "Каждый день обучения приближает тебя к цели!",
    "Ты на верном пути! Продолжай практиковаться!",
    "Изучение языка — это марафон, а не спринт. Ты справляешься отлично!",
    "Даже небольшой прогресс — это всё равно прогресс!",
    "Помни: регулярность важнее продолжительности занятий!",
    "Ошибки — это часть обучения. Не бойся их делать!",
    "Твоё усердие обязательно окупится!",
    "Ты уже знаешь больше, чем вчера. Продолжай!"
]

# Достижения (бейджи)
achievements = {
    "beginner": {
        "title": "Новичок",
        "description": "Начните свой путь в изучении языка",
        "requirement": "Зарегистрируйтесь и выберите язык для изучения"
    },
    "first_lesson": {
        "title": "Первый урок",
        "description": "Завершите свой первый урок",
        "requirement": "Пройдите один урок"
    },
    "word_collector": {
        "title": "Коллекционер слов",
        "description": "Начните собирать словарный запас",
        "requirement": "Выучите 10 новых слов"
    },
    "streak_3": {
        "title": "Трёхдневная серия",
        "description": "Занимайтесь регулярно",
        "requirement": "Занимайтесь 3 дня подряд"
    },
    "streak_7": {
        "title": "Недельная серия",
        "description": "Занимайтесь каждый день в течение недели",
        "requirement": "Занимайтесь 7 дней подряд"
    },
    "quiz_master": {
        "title": "Мастер тестов",
        "description": "Проверьте свои знания",
        "requirement": "Пройдите 5 тестов с результатом выше 80%"
    }
} 