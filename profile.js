// Элементы DOM для страницы профиля
let profileForm, nameInput, ageInput, genderSelect;
let heightInput, weightInput, activitySelect;
let viewMode, editMode, editBtn, saveBtn, cancelBtn;
let bmiValueEl, bmiCategoryEl, dailyCaloriesEl;

// Класс для управления профилем пользователя
class UserProfile {
    constructor() {
        // Инициализация DOM-элементов
        this.viewModeContainer = document.getElementById('view-mode');
        this.editModeContainer = document.getElementById('edit-mode');
        this.editButton = document.getElementById('edit-profile-btn');
        this.saveButton = document.getElementById('save-profile-btn');
        
        // Элементы просмотра
        this.viewName = document.getElementById('view-name');
        this.viewAge = document.getElementById('view-age');
        this.viewGender = document.getElementById('view-gender');
        this.viewHeight = document.getElementById('view-height');
        this.viewWeight = document.getElementById('view-weight');
        this.viewActivity = document.getElementById('view-activity');
        this.viewBMI = document.getElementById('view-bmi');
        this.viewBMICategory = document.getElementById('view-bmi-category');
        this.viewCalorieNorm = document.getElementById('view-calorie-norm');
        
        // Элементы формы редактирования
        this.editForm = document.getElementById('profile-form');
        this.nameInput = document.getElementById('name');
        this.ageInput = document.getElementById('age');
        this.genderSelect = document.getElementById('gender');
        this.heightInput = document.getElementById('height');
        this.weightInput = document.getElementById('weight');
        this.activitySelect = document.getElementById('activity');
        
        // Инициализация обработчиков событий
        this.initEventListeners();
        
        // Загрузка профиля пользователя
        this.loadProfile();
    }
    
    // Инициализация обработчиков событий
    initEventListeners() {
        // Переключение на режим редактирования
        this.editButton.addEventListener('click', () => {
            this.switchToEditMode();
        });
        
        // Сохранение профиля
        this.saveButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.saveProfile();
        });
        
        // Обновление расчетов при изменении данных
        const updateInputs = [this.heightInput, this.weightInput, this.ageInput, this.genderSelect, this.activitySelect];
        updateInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateCalculations();
            });
            input.addEventListener('input', () => {
                this.updateCalculations();
            });
        });
    }
    
    // Загрузка профиля пользователя из localStorage
    loadProfile() {
        // Получение данных пользователя
        const userDataJSON = localStorage.getItem('userData');
        
        if (userDataJSON) {
            // Преобразование JSON в объект
            const userData = JSON.parse(userDataJSON);
            
            // Заполнение полей формы
            this.nameInput.value = userData.name || '';
            this.ageInput.value = userData.age || '';
            this.genderSelect.value = userData.gender || 'male';
            this.heightInput.value = userData.height || '';
            this.weightInput.value = userData.weight || '';
            this.activitySelect.value = userData.activity || 'moderate';
            
            // Обновление режима просмотра
            this.updateViewMode(userData);
            
            // Показ режима просмотра
            this.showViewMode();
        } else {
            // Если профиль не найден, показываем режим редактирования
            this.showEditMode();
        }
    }
    
    // Обновление режима просмотра данными пользователя
    updateViewMode(userData) {
        // Обновление данных в режиме просмотра
        this.viewName.textContent = userData.name || 'Не указано';
        this.viewAge.textContent = userData.age ? `${userData.age} лет` : 'Не указано';
        this.viewGender.textContent = userData.gender === 'male' ? 'Мужской' : 'Женский';
        this.viewHeight.textContent = userData.height ? `${userData.height} см` : 'Не указано';
        this.viewWeight.textContent = userData.weight ? `${userData.weight} кг` : 'Не указано';
        
        // Отображение уровня активности
        const activityLabels = {
            'sedentary': 'Сидячий образ жизни',
            'light': 'Легкая активность',
            'moderate': 'Умеренная активность',
            'active': 'Активный образ жизни',
            'very_active': 'Очень активный образ жизни'
        };
        this.viewActivity.textContent = activityLabels[userData.activity] || 'Не указано';
        
        // Расчет и отображение ИМТ
        if (userData.height && userData.weight) {
            const bmi = this.calculateBMI(userData.height, userData.weight);
            this.viewBMI.textContent = bmi.toFixed(1);
            this.viewBMICategory.textContent = this.getBMICategory(bmi);
            
            // Расчет и отображение нормы калорий
            if (userData.age && userData.gender && userData.activity) {
                const calorieNorm = this.calculateCalorieNorm(
                    userData.gender, 
                    userData.weight, 
                    userData.height, 
                    userData.age, 
                    userData.activity
                );
                this.viewCalorieNorm.textContent = `${Math.round(calorieNorm)} ккал`;
            } else {
                this.viewCalorieNorm.textContent = 'Недостаточно данных';
            }
        } else {
            this.viewBMI.textContent = 'Недостаточно данных';
            this.viewBMICategory.textContent = 'Недостаточно данных';
            this.viewCalorieNorm.textContent = 'Недостаточно данных';
        }
    }
    
    // Переключение на режим просмотра
    showViewMode() {
        this.viewModeContainer.style.display = 'block';
        this.editModeContainer.style.display = 'none';
    }
    
    // Переключение на режим редактирования
    showEditMode() {
        this.viewModeContainer.style.display = 'none';
        this.editModeContainer.style.display = 'block';
    }
    
    // Переключение на режим редактирования с заполнением формы текущими данными
    switchToEditMode() {
        // Показ режима редактирования
        this.showEditMode();
        
        // Обновление расчетов на основе текущих данных
        this.updateCalculations();
    }
    
    // Сохранение профиля пользователя
    saveProfile() {
        // Проверка заполнения обязательных полей
        if (!this.validateForm()) {
            return;
        }
        
        // Получение данных из формы
        const userData = {
            name: this.nameInput.value.trim(),
            age: parseInt(this.ageInput.value),
            gender: this.genderSelect.value,
            height: parseInt(this.heightInput.value),
            weight: parseInt(this.weightInput.value),
            activity: this.activitySelect.value
        };
        
        // Сохранение данных в localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Обновление режима просмотра
        this.updateViewMode(userData);
        
        // Переключение на режим просмотра
        this.showViewMode();
        
        // Показ уведомления об успешном сохранении
        showNotification('Профиль успешно сохранен', 'success');
    }
    
    // Валидация формы
    validateForm() {
        let isValid = true;
        
        // Проверка имени
        if (!this.nameInput.value.trim()) {
            showNotification('Пожалуйста, введите ваше имя', 'error');
            isValid = false;
        }
        
        // Проверка возраста
        if (!this.ageInput.value || isNaN(parseInt(this.ageInput.value)) || parseInt(this.ageInput.value) <= 0) {
            showNotification('Пожалуйста, введите корректный возраст', 'error');
            isValid = false;
        }
        
        // Проверка роста
        if (!this.heightInput.value || isNaN(parseInt(this.heightInput.value)) || parseInt(this.heightInput.value) <= 0) {
            showNotification('Пожалуйста, введите корректный рост в сантиметрах', 'error');
            isValid = false;
        }
        
        // Проверка веса
        if (!this.weightInput.value || isNaN(parseInt(this.weightInput.value)) || parseInt(this.weightInput.value) <= 0) {
            showNotification('Пожалуйста, введите корректный вес в килограммах', 'error');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Обновление расчетных полей на основе введенных данных
    updateCalculations() {
        const height = parseInt(this.heightInput.value);
        const weight = parseInt(this.weightInput.value);
        const age = parseInt(this.ageInput.value);
        const gender = this.genderSelect.value;
        const activity = this.activitySelect.value;
        
        // Обновление ИМТ
        const bmiEl = document.getElementById('bmi');
        const bmiCategoryEl = document.getElementById('bmi-category');
        
        if (height && weight && !isNaN(height) && !isNaN(weight)) {
            const bmi = this.calculateBMI(height, weight);
            bmiEl.value = bmi.toFixed(1);
            bmiCategoryEl.value = this.getBMICategory(bmi);
        } else {
            bmiEl.value = '';
            bmiCategoryEl.value = '';
        }
        
        // Обновление нормы калорий
        const calorieNormEl = document.getElementById('calorie-norm');
        
        if (height && weight && age && gender && activity && 
            !isNaN(height) && !isNaN(weight) && !isNaN(age)) {
            const calorieNorm = this.calculateCalorieNorm(gender, weight, height, age, activity);
            calorieNormEl.value = Math.round(calorieNorm);
        } else {
            calorieNormEl.value = '';
        }
    }
    
    // Расчет ИМТ (индекса массы тела)
    calculateBMI(height, weight) {
        // Преобразование роста из см в метры
        const heightInMeters = height / 100;
        // Формула ИМТ: вес (кг) / (рост (м) * рост (м))
        return weight / (heightInMeters * heightInMeters);
    }
    
    // Определение категории ИМТ
    getBMICategory(bmi) {
        if (bmi < 16) {
            return 'Выраженный дефицит массы';
        } else if (bmi < 18.5) {
            return 'Недостаточная масса';
        } else if (bmi < 25) {
            return 'Нормальная масса';
        } else if (bmi < 30) {
            return 'Избыточная масса';
        } else if (bmi < 35) {
            return 'Ожирение I степени';
        } else if (bmi < 40) {
            return 'Ожирение II степени';
        } else {
            return 'Ожирение III степени';
        }
    }
    
    // Расчет нормы калорий по формуле Миффлина-Сан Жеора
    calculateCalorieNorm(gender, weight, height, age, activity) {
        // Базовый обмен веществ (BMR)
        let bmr;
        
        if (gender === 'male') {
            // Формула для мужчин: 10 * вес + 6.25 * рост - 5 * возраст + 5
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            // Формула для женщин: 10 * вес + 6.25 * рост - 5 * возраст - 161
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        
        // Коэффициенты активности
        const activityMultipliers = {
            'sedentary': 1.2,      // Сидячий образ жизни, минимум физической активности
            'light': 1.375,        // Легкая активность (тренировки 1-3 раза в неделю)
            'moderate': 1.55,      // Умеренная активность (тренировки 3-5 раз в неделю)
            'active': 1.725,       // Активный образ жизни (интенсивные тренировки 6-7 раз в неделю)
            'very_active': 1.9     // Очень активный образ жизни (спортсмены, физическая работа)
        };
        
        // Общая норма калорий с учетом уровня активности
        return bmr * activityMultipliers[activity];
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Проверка, что мы на странице профиля
    if (getCurrentPage() === 'profile') {
        const userProfile = new UserProfile();
    }
}); 