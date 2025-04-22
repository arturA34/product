// База данных калорийности продуктов
const caloriesDatabase = {
    'яблоко': 52,
    'банан': 89,
    'апельсин': 47,
    'курица': 165,
    'рис': 130,
    'салат': 15,
    'морковь': 41,
    'картофель': 77,
    'молоко': 42,
    'хлеб': 265,
    'сыр': 402,
    'яйцо': 155,
    'томат': 18,
    'огурец': 15,
    'авокадо': 160,
    'говядина': 250,
    'свинина': 242,
    'лосось': 208,
    'тунец': 184,
    'креветки': 99,
    'брокколи': 34,
    'цветная капуста': 25,
    'макароны': 131,
    'спагетти': 158,
    'гречка': 343,
    'овсянка': 68,
    'йогурт': 59,
    'творог': 103,
    'шоколад': 546,
    'сок': 45,
    'кофе': 2,
    'чай': 1,
    'пицца': 266,
    'бургер': 295,
    'суши': 145,
    'хот-дог': 290,
    'мороженое': 207,
    'торт': 257,
    'печенье': 488,
    'арбуз': 30,
    'дыня': 34,
    'виноград': 69,
    'клубника': 32,
    'ананас': 50,
    'orange': 47,
    'apple': 52,
    'banana': 89,
    'chicken': 165,
    'bread': 265,
    'cheese': 402,
    'egg': 155,
    'tomato': 18,
    'cucumber': 15,
    'avocado': 160,
    'beef': 250,
    'pork': 242,
    'salmon': 208,
    'tuna': 184,
    'shrimp': 99,
    'broccoli': 34,
    'cauliflower': 25,
    'pasta': 131,
    'spaghetti': 158,
    'buckwheat': 343,
    'yogurt': 59,
    'cottage cheese': 103,
    'chocolate': 546,
    'juice': 45,
    'coffee': 2,
    'tea': 1,
    'pizza': 266,
    'burger': 295,
    'sushi': 145,
    'hotdog': 290,
    'ice cream': 207,
    'cake': 257,
    'cookie': 488,
    'watermelon': 30,
    'melon': 34,
    'grapes': 69,
    'strawberry': 32,
    'pineapple': 50,
    'salad': 15
};

// Класс для хранения данных о продукте
class FoodItem {
    constructor(name, calories, id = Date.now()) {
        this.id = id;
        this.name = name;
        this.calories = calories;
        this.date = new Date().toISOString().split('T')[0]; // Текущая дата
    }
}

// Класс для хранения данных профиля пользователя
class Profile {
    constructor(gender, age, height, weight, activity, goal) {
        this.gender = gender;
        this.age = parseInt(age);
        this.height = parseInt(height);
        this.weight = parseInt(weight);
        this.activity = parseFloat(activity);
        this.goal = goal;
        this.bmi = this.calculateBMI();
        this.recommendedCalories = this.calculateRecommendedCalories();
    }

    calculateBMI() {
        return parseFloat((this.weight / ((this.height / 100) ** 2)).toFixed(1));
    }

    getBMICategory() {
        if (this.bmi < 18.5) {
            return { name: 'Недостаточный вес', class: 'category-underweight' };
        } else if (this.bmi < 25) {
            return { name: 'Нормальный вес', class: 'category-normal' };
        } else if (this.bmi < 30) {
            return { name: 'Избыточный вес', class: 'category-overweight' };
        } else {
            return { name: 'Ожирение', class: 'category-obese' };
        }
    }

    calculateRecommendedCalories() {
        // Формула Харриса-Бенедикта
        let bmr;
        if (this.gender === 'male') {
            bmr = 88.362 + (13.397 * this.weight) + (4.799 * this.height) - (5.677 * this.age);
        } else {
            bmr = 447.593 + (9.247 * this.weight) + (3.098 * this.height) - (4.330 * this.age);
        }

        // Учитываем уровень активности
        let calories = bmr * this.activity;

        // Корректировка по цели
        if (this.goal === 'lose') {
            calories -= 500; // Дефицит для похудения
        } else if (this.goal === 'gain') {
            calories += 500; // Профицит для набора веса
        }

        return Math.round(calories);
    }

    getWeightRecommendation() {
        // Расчет идеального веса по формуле ИМТ
        const minNormalBMI = 18.5;
        const maxNormalBMI = 24.9;
        const heightInM = this.height / 100;
        
        const minNormalWeight = Math.round(minNormalBMI * (heightInM ** 2));
        const maxNormalWeight = Math.round(maxNormalBMI * (heightInM ** 2));
        
        let recommendation = `Ваш рекомендуемый вес: ${minNormalWeight}-${maxNormalWeight} кг. `;
        
        if (this.bmi < 18.5) {
            const weightToGain = Math.round(minNormalWeight - this.weight);
            recommendation += `Рекомендуется набрать примерно ${weightToGain} кг.`;
        } else if (this.bmi > 24.9) {
            const weightToLose = Math.round(this.weight - maxNormalWeight);
            recommendation += `Рекомендуется снизить вес примерно на ${weightToLose} кг.`;
        } else {
            recommendation += `Ваш текущий вес в пределах нормы!`;
        }
        
        return recommendation;
    }
    
    // Вспомогательные методы для отображения в интерфейсе
    getActivityLabel() {
        const activityLabels = {
            '1.2': 'Минимальная активность',
            '1.375': 'Легкая активность (1-3 раза в неделю)',
            '1.55': 'Средняя активность (3-5 раз в неделю)',
            '1.725': 'Высокая активность (6-7 раз в неделю)',
            '1.9': 'Очень высокая активность'
        };
        return activityLabels[this.activity] || 'Неизвестно';
    }
    
    getGoalLabel() {
        const goalLabels = {
            'lose': 'Снижение веса',
            'maintain': 'Поддержание веса',
            'gain': 'Набор веса'
        };
        return goalLabels[this.goal] || 'Неизвестно';
    }
    
    getGenderLabel() {
        return this.gender === 'male' ? 'Мужской' : 'Женский';
    }
}

// Класс для работы с localStorage
class Storage {
    // Получение списка продуктов
    static getFoodItems() {
        let foodItems = localStorage.getItem('foodItems');
        return foodItems ? JSON.parse(foodItems) : [];
    }

    // Сохранение списка продуктов
    static saveFoodItems(foodItems) {
        localStorage.setItem('foodItems', JSON.stringify(foodItems));
    }

    // Получение записей дневника питания
    static getJournalEntries() {
        let entries = localStorage.getItem('journalEntries');
        return entries ? JSON.parse(entries) : [];
    }

    // Сохранение записей дневника питания
    static saveJournalEntries(entries) {
        localStorage.setItem('journalEntries', JSON.stringify(entries));
    }

    // Получение данных профиля
    static getProfile() {
        let profile = localStorage.getItem('userProfile');
        return profile ? JSON.parse(profile) : {};
    }

    // Сохранение данных профиля
    static saveProfile(profile) {
        localStorage.setItem('userProfile', JSON.stringify(profile));
    }
}

// Вспомогательная функция для анимации изменения числа
function animateValue(element, start, end, duration) {
    if (!element) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Функция для показа уведомлений
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Добавляем уведомление на страницу
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        
        // Удаляем уведомление после завершения анимации
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Добавляем стили для уведомлений
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        right: -300px;
        top: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    
    .notification.success {
        background-color: #4caf50;
    }
    
    .notification.error {
        background-color: #f44336;
    }
`;
document.head.appendChild(style);

// Добавляем эффекты при фокусе на поля ввода
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
});

// Функция для определения текущей страницы
function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);
    
    if (!filename || filename === '' || filename === 'index.html') {
        return 'index';
    } else if (filename === 'photo-analysis.html') {
        return 'photo-analysis';
    } else if (filename === 'profile.html') {
        return 'profile';
    } else {
        return 'unknown';
    }
}

// Форматирование даты
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
}

// Получение вчерашней даты
function getYesterdayDate() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
}

// Инициализация навигации
document.addEventListener('DOMContentLoaded', () => {
    // Определяем текущую страницу
    const currentPage = getCurrentPage();
    
    // Находим все ссылки в навигации
    const navLinks = document.querySelectorAll('nav a');
    
    // Устанавливаем активный класс для текущей страницы
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if ((currentPage === 'index' && (href === 'index.html' || href === '/')) ||
            (href.includes(currentPage + '.html'))) {
            link.classList.add('active');
        }
    });
}); 