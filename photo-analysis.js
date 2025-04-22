// Элементы DOM для страницы анализа фото
let photoForm, photoInput, previewContainer, photoPreview, analyzeBtn;
let resultContainer, apiKeyInput, loadingContainer;

// ID для Clarifai API
const FOOD_MODEL_ID = 'bd367be194cf45149e75f01d59f77ba7';

// Класс для анализа фотографий еды с помощью Clarifai API
class PhotoAnalyzer {
    constructor() {
        // Инициализация DOM-элементов
        this.photoForm = document.getElementById('photo-form');
        this.photoInput = document.getElementById('photo-input');
        this.photoPreview = document.getElementById('photo-preview');
        this.analyzeBtn = document.getElementById('analyze-btn');
        this.resultContainer = document.getElementById('result-container');
        this.loadingContainer = document.getElementById('loading-container');
        this.apiKeyInput = document.getElementById('api-key');
        
        // Кэширование API-ключа из localStorage
        this.loadApiKey();
        
        // Инициализация обработчиков событий
        this.initEventListeners();
    }
    
    // Инициализация обработчиков событий
    initEventListeners() {
        // Обработчик изменения фото
        this.photoInput.addEventListener('change', this.handlePhotoChange.bind(this));
        
        // Обработчик клика на кнопку анализа
        this.analyzeBtn.addEventListener('click', this.analyzePhoto.bind(this));
        
        // Обработчик изменения API-ключа
        this.apiKeyInput.addEventListener('change', this.saveApiKey.bind(this));
    }
    
    // Загрузка API-ключа из localStorage
    loadApiKey() {
        const apiKey = localStorage.getItem('clarifaiApiKey');
        if (apiKey) {
            this.apiKeyInput.value = apiKey;
        }
    }
    
    // Сохранение API-ключа в localStorage
    saveApiKey() {
        const apiKey = this.apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem('clarifaiApiKey', apiKey);
        }
    }
    
    // Обработка изменения фото
    handlePhotoChange(e) {
        const file = e.target.files[0];
        
        if (!file) {
            return;
        }
        
        // Проверка типа файла
        if (!file.type.match('image.*')) {
            showNotification('Пожалуйста, выберите файл изображения', 'error');
            return;
        }
        
        // Отображение превью фото
        const reader = new FileReader();
        reader.onload = (e) => {
            this.photoPreview.src = e.target.result;
            this.photoPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
    
    // Анализ фото с помощью Clarifai API
    async analyzePhoto() {
        // Получение API-ключа
        const apiKey = this.apiKeyInput.value.trim();
        
        if (!apiKey) {
            showNotification('Пожалуйста, введите API-ключ Clarifai', 'error');
            return;
        }
        
        // Проверка наличия фото
        if (!this.photoInput.files[0]) {
            showNotification('Пожалуйста, выберите фото для анализа', 'error');
            return;
        }
        
        // Показываем индикатор загрузки
        this.loadingContainer.style.display = 'flex';
        this.resultContainer.innerHTML = '';
        
        try {
            // Получение Base64 кодированного изображения
            const base64Image = this.photoPreview.src.split(',')[1];
            
            // Конфигурация для API Clarifai
            const app = new Clarifai.App({ apiKey });
            
            // Выполнение запроса к API для распознавания еды
            const response = await app.models.predict('food-item-v1', { base64: base64Image });
            
            // Обработка результатов
            this.displayResults(response);
        } catch (error) {
            console.error('Ошибка при анализе фото:', error);
            showNotification('Ошибка при анализе фото. Проверьте API-ключ и попробуйте еще раз.', 'error');
        } finally {
            // Скрываем индикатор загрузки
            this.loadingContainer.style.display = 'none';
        }
    }
    
    // Отображение результатов анализа
    displayResults(response) {
        // Получение данных из ответа API
        const concepts = response.outputs[0].data.concepts;
        
        // Если нет результатов
        if (!concepts || concepts.length === 0) {
            this.resultContainer.innerHTML = '<p>Не удалось распознать еду на фото. Попробуйте другое фото.</p>';
            return;
        }
        
        // Отображение результатов
        let resultsHTML = `
            <h3>Результаты анализа:</h3>
            <div class="result-items">
        `;
        
        // Получаем топ-5 результатов с вероятностью выше 0.5
        const topResults = concepts
            .filter(concept => concept.value > 0.5)
            .slice(0, 5);
        
        if (topResults.length === 0) {
            this.resultContainer.innerHTML = '<p>Не удалось определить еду с достаточной уверенностью. Попробуйте другое фото.</p>';
            return;
        }
        
        // Добавляем результаты в HTML
        topResults.forEach(concept => {
            const confidencePct = Math.round(concept.value * 100);
            resultsHTML += `
                <div class="result-item">
                    <div class="result-header">
                        <span class="result-name">${concept.name}</span>
                        <span class="result-confidence">${confidencePct}%</span>
                    </div>
                    <div class="result-actions">
                        <button class="btn add-to-diary" data-product="${concept.name}">
                            Добавить в дневник
                        </button>
                    </div>
                </div>
            `;
        });
        
        resultsHTML += `</div>`;
        this.resultContainer.innerHTML = resultsHTML;
        
        // Добавление обработчиков для кнопок "Добавить в дневник"
        const addButtons = document.querySelectorAll('.add-to-diary');
        addButtons.forEach(button => {
            button.addEventListener('click', this.addToDiary.bind(this));
        });
    }
    
    // Добавление продукта в дневник питания
    addToDiary(e) {
        const productName = e.target.dataset.product;
        
        // Перенаправление на страницу дневника с параметром продукта
        window.location.href = `index.html?product=${encodeURIComponent(productName)}`;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Проверка, что мы на странице анализа фото
    if (getCurrentPage() === 'photo-analysis') {
        const photoAnalyzer = new PhotoAnalyzer();
    }
}); 