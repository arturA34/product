// Элементы DOM для страницы учета калорий
let foodForm, foodNameInput, caloriesInput, foodList, totalCaloriesSpan, emptyState;
let caloriesProgressBar, caloriesInfoP;

// Класс для работы с хранилищем данных
class Storage {
    // Получение продуктов из localStorage
    static getProducts() {
        return JSON.parse(localStorage.getItem('products')) || [];
    }
    
    // Сохранение продуктов в localStorage
    static saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    // Добавление нового продукта
    static addProduct(product) {
        const products = this.getProducts();
        products.push(product);
        this.saveProducts(products);
    }
    
    // Удаление продукта по ID
    static removeProduct(id) {
        const products = this.getProducts();
        const updatedProducts = products.filter(product => product.id !== id);
        this.saveProducts(updatedProducts);
    }
    
    // Очистка всех продуктов
    static clearProducts() {
        this.saveProducts([]);
    }
    
    // Получение дневной нормы калорий из localStorage
    static getCalorieNorm() {
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        return userData.calorieNorm || 0;
    }
}

// Класс для работы с пользовательским интерфейсом
class UI {
    // Отображение продуктов в списке
    static displayProducts() {
        const products = Storage.getProducts();
        const productList = document.getElementById('product-list');
        
        // Очистка списка перед добавлением
        productList.innerHTML = '';
        
        // Добавление продуктов в список
        products.forEach(product => {
            UI.addProductToList(product);
        });
        
        // Обновление счетчика калорий
        UI.updateCalorieCounter();
    }
    
    // Добавление продукта в список
    static addProductToList(product) {
        const productList = document.getElementById('product-list');
        
        // Создание элемента списка
        const row = document.createElement('tr');
        row.dataset.id = product.id;
        
        // Заполнение содержимым
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.calories} ккал</td>
            <td>${product.weight} г</td>
            <td>${product.protein} г</td>
            <td>${product.fats} г</td>
            <td>${product.carbs} г</td>
            <td>
                <button class="delete-btn" title="Удалить">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        // Добавление в список
        productList.appendChild(row);
    }
    
    // Удаление продукта из списка
    static deleteProduct(el) {
        // Нашли кнопку удаления
        if (el.classList.contains('delete-btn') || el.parentElement.classList.contains('delete-btn')) {
            // Находим строку таблицы
            const row = el.closest('tr');
            const id = row.dataset.id;
            
            // Удаляем из DOM
            row.remove();
            
            // Удаляем из хранилища
            Storage.removeProduct(id);
            
            // Обновляем счетчик калорий
            UI.updateCalorieCounter();
            
            // Показываем уведомление
            showNotification('Продукт удален из дневника', 'success');
        }
    }
    
    // Обновление счетчика калорий
    static updateCalorieCounter() {
        const products = Storage.getProducts();
        const calorieNorm = Storage.getCalorieNorm();
        
        // Расчет суммы калорий
        const consumedCalories = products.reduce((total, product) => {
            return total + Number(product.calories);
        }, 0);
        
        // Расчет оставшихся калорий
        const remainingCalories = calorieNorm - consumedCalories;
        
        // Обновление отображения
        document.getElementById('calories-consumed').textContent = consumedCalories;
        
        if (calorieNorm > 0) {
            document.getElementById('calories-norm').textContent = calorieNorm;
            document.getElementById('calories-remaining').textContent = remainingCalories;
            
            // Изменение цвета в зависимости от оставшихся калорий
            const remainingElement = document.getElementById('calories-remaining');
            if (remainingCalories < 0) {
                remainingElement.classList.add('text-danger');
                remainingElement.classList.remove('text-success');
            } else {
                remainingElement.classList.add('text-success');
                remainingElement.classList.remove('text-danger');
            }
        } else {
            document.getElementById('calories-norm').textContent = '—';
            document.getElementById('calories-remaining').textContent = '—';
        }
    }
    
    // Очистка полей формы
    static clearFields() {
        document.getElementById('product-name').value = '';
        document.getElementById('product-calories').value = '';
        document.getElementById('product-weight').value = '';
        document.getElementById('product-protein').value = '';
        document.getElementById('product-fats').value = '';
        document.getElementById('product-carbs').value = '';
    }
}

// Класс для работы с продуктами
class CalorieTracker {
    constructor() {
        // Инициализация DOM-элементов
        this.form = document.getElementById('product-form');
        this.productList = document.getElementById('product-list');
        this.clearBtn = document.getElementById('clear-btn');
        
        // Инициализация обработчиков событий
        this.initEventListeners();
        
        // Отображение продуктов при загрузке
        UI.displayProducts();
        
        // Проверка наличия данных пользователя
        this.checkUserData();
    }
    
    // Инициализация обработчиков событий
    initEventListeners() {
        // Добавление продукта при отправке формы
        this.form.addEventListener('submit', this.addProduct.bind(this));
        
        // Удаление продукта при клике на кнопку удаления
        this.productList.addEventListener('click', (e) => {
            UI.deleteProduct(e.target);
        });
        
        // Очистка всех продуктов
        this.clearBtn.addEventListener('click', this.clearProducts.bind(this));
    }
    
    // Добавление нового продукта
    addProduct(e) {
        e.preventDefault();
        
        // Получение значений из формы
        const name = document.getElementById('product-name').value.trim();
        const calories = document.getElementById('product-calories').value;
        const weight = document.getElementById('product-weight').value;
        const protein = document.getElementById('product-protein').value;
        const fats = document.getElementById('product-fats').value;
        const carbs = document.getElementById('product-carbs').value;
        
        // Валидация
        if (!name) {
            showNotification('Пожалуйста, введите название продукта', 'error');
            return;
        }
        
        if (!calories || isNaN(calories) || Number(calories) < 0) {
            showNotification('Пожалуйста, введите корректное количество калорий', 'error');
            return;
        }
        
        // Создание объекта продукта
        const product = {
            id: Date.now().toString(),
            name,
            calories: Number(calories),
            weight: weight ? Number(weight) : 0,
            protein: protein ? Number(protein) : 0,
            fats: fats ? Number(fats) : 0,
            carbs: carbs ? Number(carbs) : 0
        };
        
        // Добавление в хранилище и в список
        Storage.addProduct(product);
        UI.addProductToList(product);
        
        // Обновление счетчика калорий
        UI.updateCalorieCounter();
        
        // Очистка полей формы
        UI.clearFields();
        
        // Показ уведомления
        showNotification('Продукт добавлен в дневник', 'success');
    }
    
    // Очистка всех продуктов
    clearProducts() {
        if (confirm('Вы уверены, что хотите очистить дневник питания?')) {
            // Очистка хранилища
            Storage.clearProducts();
            
            // Очистка UI
            document.getElementById('product-list').innerHTML = '';
            
            // Обновление счетчика калорий
            UI.updateCalorieCounter();
            
            // Показ уведомления
            showNotification('Дневник питания очищен', 'success');
        }
    }
    
    // Проверка наличия данных пользователя
    checkUserData() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const profileNotice = document.getElementById('profile-notice');
        
        if (!userData || !userData.calorieNorm) {
            // Если данных нет, показываем уведомление
            profileNotice.style.display = 'block';
        } else {
            // Если данные есть, скрываем уведомление
            profileNotice.style.display = 'none';
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Проверка, что мы на главной странице учета калорий
    if (getCurrentPage() === 'index') {
        const calorieTracker = new CalorieTracker();
    }
}); 