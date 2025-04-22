// Определяем текущую страницу
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Общие элементы DOM для всех страниц
let foodForm, foodNameInput, caloriesInput, foodList, totalCaloriesSpan, emptyState;
let profileForm, genderSelect, ageInput, heightInput, weightInput, activitySelect, goalSelect;
let profileView, editProfileBtn, cancelEditBtn;
let genderView, ageView, heightView, weightView, activityView, goalView;
let recommendedCaloriesSpan, bmiValueDiv, bmiCategoryDiv, weightRecommendationDiv;
let caloriesProgressBar, caloriesInfoP;
let photoForm, foodPhotoInput, photoPreview, analyzeBtn, analysisResult, loadingContainer;

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

// Инициализация элементов в зависимости от страницы
function initializePage() {
    // Общая инициализация для всех страниц
    
    // Инициализация для страницы учета калорий (index.html)
    if (currentPage === 'index.html' || currentPage === '') {
        foodForm = document.getElementById('food-form');
        foodNameInput = document.getElementById('food-name');
        caloriesInput = document.getElementById('calories');
        foodList = document.getElementById('food-list');
        totalCaloriesSpan = document.getElementById('total-calories');
        emptyState = document.getElementById('empty-state');
        caloriesProgressBar = document.getElementById('calories-progress-bar');
        caloriesInfoP = document.getElementById('calories-info');
        
        // Загружаем продукты
        UI.displayFoodItems();
        
        // Обработчик отправки формы добавления продукта
        foodForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Получаем значения из формы
            const name = foodNameInput.value.trim();
            const calories = caloriesInput.value;
            
            // Валидация
            if (name === '' || calories === '') {
                UI.showNotification('Пожалуйста, заполните все поля', 'error');
                return;
            }
            
            // Создаем новый объект продукта
            const foodItem = new FoodItem(name, calories);
            
            // Добавляем продукт в UI и Storage
            UI.addFoodItemToList(foodItem);
            Storage.addFoodItem(foodItem);
            
            // Скрываем пустое состояние, если это первый продукт
            emptyState.style.display = 'none';
            
            // Обновляем общее количество калорий
            UI.updateTotalCalories();
            
            // Очищаем поля ввода
            UI.clearInputs();
            
            // Показываем уведомление
            UI.showNotification('Продукт добавлен', 'success');
        });
        
        // Обработчик удаления продукта
        if (foodList) {
            foodList.addEventListener('click', (e) => {
                UI.deleteFoodItem(e.target);
            });
        }
    }
    
    // Инициализация для страницы профиля (profile.html)
    else if (currentPage === 'profile.html') {
        // Элементы формы
        profileForm = document.getElementById('profile-form');
        genderSelect = document.getElementById('gender');
        ageInput = document.getElementById('age');
        heightInput = document.getElementById('height');
        weightInput = document.getElementById('weight');
        activitySelect = document.getElementById('activity');
        goalSelect = document.getElementById('goal');
        
        // Элементы просмотра
        profileView = document.getElementById('profile-view');
        editProfileBtn = document.getElementById('edit-profile-btn');
        cancelEditBtn = document.getElementById('cancel-edit-btn');
        genderView = document.getElementById('gender-view');
        ageView = document.getElementById('age-view');
        heightView = document.getElementById('height-view');
        weightView = document.getElementById('weight-view');
        activityView = document.getElementById('activity-view');
        goalView = document.getElementById('goal-view');
        
        // Элементы рекомендаций
        recommendedCaloriesSpan = document.getElementById('recommended-calories');
        bmiValueDiv = document.getElementById('bmi-value');
        bmiCategoryDiv = document.getElementById('bmi-category');
        weightRecommendationDiv = document.getElementById('weight-recommendation');
        
        // Загружаем данные профиля
        UI.displayProfileData();
        
        // Обработчик для кнопки редактирования
        editProfileBtn.addEventListener('click', () => {
            UI.showProfileEditMode();
        });
        
        // Обработчик для кнопки отмены
        cancelEditBtn.addEventListener('click', () => {
            UI.showProfileViewMode();
        });
        
        // Обработчик для формы профиля
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Получаем значения из формы
            const gender = genderSelect.value;
            const age = ageInput.value;
            const height = heightInput.value;
            const weight = weightInput.value;
            const activity = activitySelect.value;
            const goal = goalSelect.value;
            
            // Валидация
            if (!gender || !age || !height || !weight || !activity || !goal) {
                UI.showNotification('Пожалуйста, заполните все поля', 'error');
                return;
            }
            
            // Создаем новый профиль
            const profile = new Profile(gender, age, height, weight, activity, goal);
            
            // Сохраняем профиль
            Storage.saveProfile(profile);
            
            // Отображаем обновленный профиль
            UI.displayProfileData();
            
            // Показываем режим просмотра
            UI.showProfileViewMode();
            
            // Показываем уведомление
            UI.showNotification('Профиль обновлен', 'success');
        });
    }
    
    // Инициализация для страницы анализа фото (photo-analysis.html)
    else if (currentPage === 'photo-analysis.html') {
        photoForm = document.getElementById('photo-form');
        foodPhotoInput = document.getElementById('food-photo');
        photoPreview = document.getElementById('photo-preview');
        analyzeBtn = document.querySelector('.analyze-btn');
        analysisResult = document.getElementById('analysis-result');
        loadingContainer = document.getElementById('loading-container');
        
        // Обработчик для загрузки фото
        foodPhotoInput.addEventListener('change', UI.handlePhotoUpload);
        
        // Обработчик клика по превью фото
        photoPreview.addEventListener('click', () => {
            foodPhotoInput.click();
        });
        
        // Обработчик отправки формы анализа фото
        photoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Проверяем, что фото выбрано
            if (!foodPhotoInput.files.length) {
                UI.showNotification('Пожалуйста, выберите фото', 'error');
                return;
            }
            
            // Выполняем анализ фото
            UI.analyzeFood();
        });
    }
    
    // Добавляем эффекты при фокусе на поля ввода для всех страниц
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
}

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

// Класс для управления хранилищем данных
class Storage {
    static getFoodItems() {
        let foodItems;
        if (localStorage.getItem('foodItems') === null) {
            foodItems = [];
        } else {
            foodItems = JSON.parse(localStorage.getItem('foodItems'));
        }
        return foodItems;
    }

    static saveFoodItems(foodItems) {
        localStorage.setItem('foodItems', JSON.stringify(foodItems));
    }

    static addFoodItem(foodItem) {
        const foodItems = Storage.getFoodItems();
        foodItems.push(foodItem);
        Storage.saveFoodItems(foodItems);
    }

    static removeFoodItem(id) {
        const foodItems = Storage.getFoodItems();
        foodItems.forEach((foodItem, index) => {
            if (foodItem.id === id) {
                foodItems.splice(index, 1);
            }
        });
        Storage.saveFoodItems(foodItems);
    }

    static getProfile() {
        if (localStorage.getItem('profile') === null) {
            return null;
        } else {
            // Получаем данные из localStorage
            const profileData = JSON.parse(localStorage.getItem('profile'));
            
            // Создаем новый экземпляр профиля с этими данными
            // Важно: это исправляет ошибку с отсутствием методов в объекте из localStorage
            return new Profile(
                profileData.gender,
                profileData.age,
                profileData.height,
                profileData.weight,
                profileData.activity,
                profileData.goal
            );
        }
    }

    static saveProfile(profile) {
        localStorage.setItem('profile', JSON.stringify(profile));
    }
}

// Класс для управления UI
class UI {
    static displayFoodItems() {
        if (!foodList) return;
        
        // Очищаем список
        foodList.innerHTML = '';
        
        const foodItems = Storage.getFoodItems();
        
        // Показать/скрыть пустое состояние
        if (foodItems.length === 0) {
            emptyState.style.display = 'flex';
        } else {
            emptyState.style.display = 'none';
        }
        
        // Фильтруем продукты по сегодняшней дате
        const todayItems = foodItems.filter(item => item.date === new Date().toISOString().split('T')[0]);
        
        // Отображаем продукты
        todayItems.forEach((foodItem) => UI.addFoodItemToList(foodItem));
        
        // Обновляем общее количество калорий
        UI.updateTotalCalories();
    }

    static addFoodItemToList(foodItem) {
        if (!foodList) return;
        
        // Создаем элемент списка
        const li = document.createElement('li');
        li.className = 'food-item';
        li.dataset.id = foodItem.id;
        
        li.innerHTML = `
            <span class="food-name">${foodItem.name}</span>
            <span class="calories-value">${foodItem.calories} ккал</span>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;
        
        // Добавляем элемент в список
        foodList.appendChild(li);
        
        // Анимация добавления
        setTimeout(() => {
            li.style.opacity = '1';
            li.style.transform = 'translateY(0)';
        }, 10);
    }

    static deleteFoodItem(target) {
        // Если нажата кнопка удаления или её иконка
        if (target.classList.contains('delete-btn') || target.parentElement.classList.contains('delete-btn')) {
            const button = target.classList.contains('delete-btn') ? target : target.parentElement;
            const li = button.closest('.food-item');
            const id = parseInt(li.dataset.id);
            
            // Анимация удаления
            li.style.opacity = '0';
            li.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                li.remove();
                
                // Удаляем из хранилища
                Storage.removeFoodItem(id);
                
                // Обновляем общее количество калорий
                UI.updateTotalCalories();
                
                // Проверяем, нужно ли показать пустое состояние
                const foodItems = Storage.getFoodItems();
                const todayItems = foodItems.filter(item => item.date === new Date().toISOString().split('T')[0]);
                if (todayItems.length === 0) {
                    emptyState.style.display = 'flex';
                }
                
                // Показываем уведомление
                UI.showNotification('Продукт удален', 'success');
            }, 300);
        }
    }

    static clearInputs() {
        if (foodNameInput) foodNameInput.value = '';
        if (caloriesInput) caloriesInput.value = '';
    }

    static updateTotalCalories() {
        if (!totalCaloriesSpan) return;
        
        const foodItems = Storage.getFoodItems();
        const todayItems = foodItems.filter(item => item.date === new Date().toISOString().split('T')[0]);
        const total = todayItems.reduce((acc, item) => acc + parseInt(item.calories), 0);
        
        // Анимация обновления числа
        const oldValue = parseInt(totalCaloriesSpan.textContent);
        animateValue(totalCaloriesSpan, oldValue, total, 500);

        // Обновление прогресс-бара, если профиль существует
        const profile = Storage.getProfile();
        if (profile && caloriesProgressBar && caloriesInfoP) {
            const percent = Math.min(Math.round((total / profile.recommendedCalories) * 100), 100);
            caloriesProgressBar.style.width = `${percent}%`;
            caloriesInfoP.textContent = `${percent}% от дневной нормы`;
            
            // Изменение цвета прогресс-бара в зависимости от процента
            if (percent > 100) {
                caloriesProgressBar.style.background = 'linear-gradient(90deg, var(--danger-color), #f77066)';
            } else if (percent > 85) {
                caloriesProgressBar.style.background = 'linear-gradient(90deg, var(--warning-color), #ffb74d)';
            } else {
                caloriesProgressBar.style.background = 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))';
            }
        }
    }
    
    static showNotification(message, type) {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Добавляем уведомление на страницу
        document.body.appendChild(notification);
        
        // Показываем уведомление с анимацией
        setTimeout(() => {
            notification.style.right = '20px';
            notification.style.opacity = '1';
        }, 10);
        
        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.right = '-300px';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    static displayProfileData() {
        // Проверяем, есть ли элементы просмотра профиля
        if (!profileView || !profileForm) return;
        
        const profile = Storage.getProfile();
        
        if (profile) {
            // Обновляем данные в режиме просмотра
            genderView.textContent = profile.getGenderLabel();
            ageView.textContent = `${profile.age} лет`;
            heightView.textContent = `${profile.height} см`;
            weightView.textContent = `${profile.weight} кг`;
            activityView.textContent = profile.getActivityLabel();
            goalView.textContent = profile.getGoalLabel();
            
            // Заполняем форму редактирования
            genderSelect.value = profile.gender;
            ageInput.value = profile.age;
            heightInput.value = profile.height;
            weightInput.value = profile.weight;
            activitySelect.value = profile.activity;
            goalSelect.value = profile.goal;
            
            // Отображаем рекомендации
            UI.displayRecommendations(profile);
            
            // Показываем режим просмотра
            UI.showProfileViewMode();
        } else {
            // Если профиль не найден, показываем режим редактирования
            UI.showProfileEditMode();
        }
    }
    
    static showProfileViewMode() {
        profileView.classList.remove('hidden');
        profileForm.classList.add('hidden');
    }
    
    static showProfileEditMode() {
        profileView.classList.add('hidden');
        profileForm.classList.remove('hidden');
    }

    static displayRecommendations(profile) {
        if (!recommendedCaloriesSpan || !bmiValueDiv || 
            !bmiCategoryDiv || !weightRecommendationDiv) return;
        
        // Обновляем рекомендуемые калории
        const oldValue = parseInt(recommendedCaloriesSpan.textContent);
        animateValue(recommendedCaloriesSpan, oldValue, profile.recommendedCalories, 500);
        
        // Обновляем ИМТ
        bmiValueDiv.textContent = profile.bmi;
        
        const bmiCategory = profile.getBMICategory();
        bmiCategoryDiv.textContent = bmiCategory.name;
        bmiCategoryDiv.className = '';
        bmiCategoryDiv.classList.add('bmi-category', bmiCategory.class);
        
        // Обновляем рекомендации по весу
        weightRecommendationDiv.textContent = profile.getWeightRecommendation();
    }

    static handlePhotoUpload() {
        const file = foodPhotoInput.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Создаем изображение для превью
                const img = document.createElement('img');
                img.src = e.target.result;
                
                // Очищаем превью и добавляем изображение
                photoPreview.innerHTML = '';
                photoPreview.appendChild(img);
                
                // Активируем кнопку анализа
                analyzeBtn.disabled = false;
            }
            
            reader.readAsDataURL(file);
        }
    }

    static analyzeFood() {
        // Показываем индикатор загрузки
        loadingContainer.classList.add('active');
        analysisResult.classList.remove('active');
        
        // Получаем изображение из файла
        const file = foodPhotoInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            
            imgElement.onload = function() {
                // Создаем временный canvas для анализа изображения
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = imgElement.width;
                canvas.height = imgElement.height;
                ctx.drawImage(imgElement, 0, 0);
                
                // Анализируем изображение через упрощенный алгоритм
                setTimeout(() => {
                    try {
                        // Получаем данные изображения
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                        
                        // Анализируем цвета изображения для определения продуктов
                        const colorStats = UI.analyzeColors(imageData);
                        
                        // Определяем возможные продукты на основе цветов
                        const detectedFoods = UI.detectFoodByColor(colorStats);
                        
                        // Отображаем результаты
                        UI.displayAnalysisResults(detectedFoods);
                    } catch (error) {
                        console.error('Ошибка при анализе изображения:', error);
                        UI.showNotification('Произошла ошибка при анализе изображения. Пожалуйста, попробуйте другое фото.', 'error');
                        loadingContainer.classList.remove('active');
                    }
                }, 1000); // Имитация работы алгоритма в течение 1 секунды
            };
        };
        
        reader.readAsDataURL(file);
    }
    
    static analyzeColors(imageData) {
        // Определение основных цветовых групп: красный, зеленый, желтый, коричневый, белый
        let red = 0, green = 0, yellow = 0, brown = 0, white = 0, dark = 0;
        
        // Анализируем выборку пикселей (каждый 20-й для повышения производительности)
        for (let i = 0; i < imageData.length; i += 80) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            
            // Определяем цветовую группу пикселя
            if (r > 200 && g < 100 && b < 100) red++; // Красный
            else if (g > 150 && r < 150 && b < 150) green++; // Зеленый
            else if (r > 200 && g > 150 && b < 100) yellow++; // Желтый
            else if (r > 120 && r < 200 && g > 80 && g < 150 && b < 100) brown++; // Коричневый
            else if (r > 200 && g > 200 && b > 200) white++; // Белый
            else if (r < 80 && g < 80 && b < 80) dark++; // Темный
        }
        
        // Всего проанализированных пикселей
        const total = red + green + yellow + brown + white + dark;
        
        // Возвращаем процентное соотношение цветов
        return {
            red: (red / total) * 100,
            green: (green / total) * 100,
            yellow: (yellow / total) * 100,
            brown: (brown / total) * 100,
            white: (white / total) * 100,
            dark: (dark / total) * 100
        };
    }
    
    static detectFoodByColor(colorStats) {
        // Продукты, которые могут быть определены по цвету
        const redFoods = ['яблоко', 'томат', 'клубника', 'арбуз'];
        const greenFoods = ['салат', 'огурец', 'авокадо', 'брокколи', 'капуста'];
        const yellowFoods = ['банан', 'ананас', 'картофель', 'сыр'];
        const brownFoods = ['хлеб', 'шоколад', 'печенье', 'говядина', 'гречка'];
        const whiteFoods = ['рис', 'молоко', 'творог', 'яйцо'];
        
        // Определяем доминирующие цвета (больше 15%)
        const dominantColors = [];
        if (colorStats.red > 15) dominantColors.push('red');
        if (colorStats.green > 15) dominantColors.push('green');
        if (colorStats.yellow > 15) dominantColors.push('yellow');
        if (colorStats.brown > 15) dominantColors.push('brown');
        if (colorStats.white > 15) dominantColors.push('white');
        
        // Если не определили доминирующие цвета, добавляем наибольший
        if (dominantColors.length === 0) {
            const maxColor = Object.entries(colorStats)
                .reduce((max, [color, value]) => value > max.value ? {color, value} : max, {color: '', value: 0})
                .color;
            
            dominantColors.push(maxColor);
        }
        
        // Собираем продукты на основе доминирующих цветов
        let possibleFoods = [];
        dominantColors.forEach(color => {
            switch(color) {
                case 'red':
                    possibleFoods = possibleFoods.concat(redFoods);
                    break;
                case 'green':
                    possibleFoods = possibleFoods.concat(greenFoods);
                    break;
                case 'yellow':
                    possibleFoods = possibleFoods.concat(yellowFoods);
                    break;
                case 'brown':
                    possibleFoods = possibleFoods.concat(brownFoods);
                    break;
                case 'white':
                    possibleFoods = possibleFoods.concat(whiteFoods);
                    break;
            }
        });
        
        // Выбираем уникальные продукты
        possibleFoods = [...new Set(possibleFoods)];
        
        // Выбираем случайные продукты из возможных (от 2 до 4)
        const numFoods = Math.floor(Math.random() * 3) + 2;
        const selectedFoods = [];
        
        // Если возможных продуктов мало, дополняем случайными из базы данных
        if (possibleFoods.length < numFoods) {
            const allFoodNames = Object.keys(caloriesDatabase);
            while (possibleFoods.length < numFoods * 2) {
                const randomFood = allFoodNames[Math.floor(Math.random() * allFoodNames.length)];
                if (!possibleFoods.includes(randomFood)) {
                    possibleFoods.push(randomFood);
                }
            }

        }
        
        // Выбираем случайные продукты из списка возможных
        for (let i = 0; i < numFoods; i++) {
            const randomIndex = Math.floor(Math.random() * possibleFoods.length);
            const foodName = possibleFoods[randomIndex];
            
            // Добавляем выбранный продукт с его калориями
            selectedFoods.push({
                name: foodName.charAt(0).toUpperCase() + foodName.slice(1), // Делаем первую букву заглавной
                calories: caloriesDatabase[foodName] || 100, // Если калорий нет, ставим 100
                probability: Math.random() * 0.3 + 0.7 // Случайная вероятность от 0.7 до 1.0
            });
            
            // Удаляем выбранный продукт из списка
            possibleFoods.splice(randomIndex, 1);
        }
        
        return selectedFoods;
    }
    
    static displayAnalysisResults(detectedFoods) {
        // Скрываем индикатор загрузки
        loadingContainer.classList.remove('active');
        
        // Создаем HTML для результатов
        let resultsHTML = '<h3>Результаты анализа:</h3>';
        
        if (detectedFoods.length === 0) {
            resultsHTML += `
            <div class="no-results">
                <p>Продукты не распознаны. Попробуйте сделать другое фото или добавить продукт вручную.</p>
            </div>
            `;
        } else {
            detectedFoods.forEach(food => {
                resultsHTML += `
                <div class="food-item-result">
                    <span class="food-name">${food.name}</span>
                    <span class="calories-value">${food.calories} ккал</span>
                    <button class="btn btn-add-analyzed" data-name="${food.name}" data-calories="${food.calories}">
                        <i class="fas fa-plus"></i> Добавить
                    </button>
                </div>
                `;
            });
        }
        
        // Показываем результаты
        analysisResult.innerHTML = resultsHTML;
        analysisResult.classList.add('active');
        
        // Добавляем обработчики для кнопок "Добавить"
        const addButtons = document.querySelectorAll('.btn-add-analyzed');
        addButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const name = e.currentTarget.dataset.name;
                const calories = e.currentTarget.dataset.calories;
                
                // Создаем объект продукта
                const foodItem = new FoodItem(name, calories);
                
                // Добавляем продукт в Storage
                Storage.addFoodItem(foodItem);
                
                // Показываем уведомление
                UI.showNotification('Продукт добавлен из анализа. Перейдите в "Учет калорий" чтобы увидеть его', 'success');
            });
        });
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

// Инициализируем страницу после загрузки DOM
document.addEventListener('DOMContentLoaded', initializePage); document.addEventListener('DOMContentLoaded', initializePage); 
