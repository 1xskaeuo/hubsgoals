// Данные задач
let tasks = [];

// Элементы интерфейса
const taskInput = document.getElementById('taskInput');
const difficultySelect = document.getElementById('difficultySelect');
const deadlineInput = document.getElementById('deadlineInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasksList');
const deadlinesList = document.getElementById('deadlinesList');
const allTasksList = document.getElementById('allTasksList');
const tasksCount = document.querySelector('.tasks-count');
const viewAllBtn = document.getElementById('viewAllTasks');
const allTasksModal = document.getElementById('allTasksModal');
const closeAllTasks = document.getElementById('closeAllTasks');
const filterBtns = document.querySelectorAll('.filter-btn');

// Элементы модальных окон
const profileAvatar = document.getElementById('profileAvatar');
const profileModal = document.getElementById('profileModal');
const closeProfile = document.getElementById('closeProfile');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const logoutBtn = document.getElementById('logoutBtn');
const themeBtns = document.querySelectorAll('.theme-btn');
const uploadBtn = document.getElementById('uploadBtn');
const avatarUpload = document.getElementById('avatarUpload');
const avatarPreview = document.getElementById('avatarPreview');
const profileAvatarLarge = document.getElementById('profileAvatarLarge');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');

// Добавление новой задачи
// Функция добавления новой задачи
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const difficultySelect = document.getElementById('difficultySelect');
    const deadlineInput = document.getElementById('deadlineInput');
    
    const taskText = taskInput.value.trim();
    const difficulty = difficultySelect.value;
    const deadline = deadlineInput.value;
    
    if (!taskText) {
        alert('Введите текст задачи');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        difficulty: difficulty,
        deadline: deadline,
        completed: false,
        createdAt: new Date()
    };
    
    tasks.push(newTask);
    updateTasksDisplay();
    
    // Очищаем поля ввода
    taskInput.value = '';
    difficultySelect.value = '';
    deadlineInput.value = '';
}

// Сохранение задач в localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Загрузка задач из localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    updateTasksDisplay();
}

// Обновление отображения задач
function updateTasksDisplay() {
    const tasksList = document.getElementById('tasksList');
    const deadlinesList = document.getElementById('deadlinesList');
    const tasksCount = document.querySelector('.tasks-count');
    
    // Фильтруем активные задачи (не выполненные)
    const activeTasks = tasks.filter(task => !task.completed);
    
    // Обновляем счетчик задач
    tasksCount.textContent = `${activeTasks.length} ${getTaskWord(activeTasks.length)}`;
    
    // Очищаем списки
    tasksList.innerHTML = '';
    deadlinesList.innerHTML = '';
    
    // Если нет активных задач
    if (activeTasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-tasks">
                <div class="empty-icon">📝</div>
                <div>У вас пока нет активных задач</div>
                <div>Добавьте свою первую задачу</div>
            </div>
        `;
    } else {
        // Добавляем активные задачи
        activeTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            tasksList.appendChild(taskElement);
        });
    }
    
    // Фильтруем задачи с дедлайнами
    const tasksWithDeadlines = activeTasks.filter(task => task.deadline);
    
    // Если нет задач с дедлайнами
    if (tasksWithDeadlines.length === 0) {
        deadlinesList.innerHTML = `
            <div class="empty-deadlines">
                <div class="empty-icon">⏰</div>
                <div>Нет задач с дедлайнами</div>
            </div>
        `;
    } else {
        // Сортируем задачи по дедлайну (ближайшие сначала)
        tasksWithDeadlines.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        
        // Добавляем задачи с дедлайнами
        tasksWithDeadlines.forEach(task => {
            const deadlineElement = createDeadlineElement(task);
            deadlinesList.appendChild(deadlineElement);
        });
    }
}


// Создание элемента задачи
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = `task-item ${task.difficulty}`;
    taskElement.dataset.id = task.id;
    
    const deadlineInfo = task.deadline ? getDeadlineInfo(task.deadline) : null;
    
    taskElement.innerHTML = `
        <div class="task-header">
            <span class="task-text">${task.text}</span>
            <span class="task-difficulty">${getDifficultyText(task.difficulty)}</span>
        </div>
        <div class="task-footer">
            ${task.deadline ? `
                <div class="task-timer ${deadlineInfo.class}">
                    <i class="far fa-clock"></i>
                    <span class="timer-text">${deadlineInfo.text}</span>
                </div>
            ` : '<div></div>'}
            <div class="task-actions">
                <button class="task-action-btn complete-btn" title="Завершить"><i class="far fa-check-circle"></i></button>
                <button class="task-action-btn edit-btn" title="Редактировать"><i class="far fa-edit"></i></button>
                <button class="task-action-btn delete-btn" title="Удалить"><i class="far fa-trash-alt"></i></button>
            </div>
        </div>
    `;
    
    return taskElement;
}

// Создание элемента дедлайна
function createDeadlineElement(task) {
    const deadlineInfo = getDeadlineInfo(task.deadline);
    
    const deadlineElement = document.createElement('div');
    deadlineElement.className = `deadline-item ${deadlineInfo.class}`;
    deadlineElement.dataset.id = task.id;
    
    deadlineElement.innerHTML = `
        <div class="deadline-text">
            <i class="fas fa-tasks"></i>
            ${task.text}
            <span class="deadline-timer">${deadlineInfo.text}</span>
        </div>
        <div class="deadline-time">
            <i class="far fa-calendar-alt"></i>
            ${formatDateTime(task.deadline)}
        </div>
    `;
    
    return deadlineElement;
}

// Получение информации о дедлайне
function getDeadlineInfo(deadline) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffMs <= 0) {
        return {
            text: 'Просрочено!',
            class: 'urgent'
        };
    } else if (diffDays === 0 && diffHours < 12) {
        return {
            text: `Осталось ${diffHours}ч ${diffMinutes}м`,
            class: 'urgent'
        };
    } else if (diffDays < 3) {
        return {
            text: `Осталось ${diffDays}д ${diffHours}ч`,
            class: 'warning'
        };
    } else {
        return {
            text: `Осталось ${diffDays} дней`,
            class: 'normal'
        };
    }
}

// Форматирование даты и времени
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Обновление таймеров
function updateTimers() {
    document.querySelectorAll('.timer-text').forEach(timer => {
        const taskElement = timer.closest('.task-item');
        const taskId = parseInt(taskElement.dataset.id);
        const task = tasks.find(t => t.id === taskId);
        
        if (task && task.deadline) {
            const deadlineInfo = getDeadlineInfo(task.deadline);
            timer.textContent = deadlineInfo.text;
            
            // Обновляем класс таймера
            const timerContainer = timer.closest('.task-timer');
            timerContainer.className = `task-timer ${deadlineInfo.class}`;
        }
    });
    
    document.querySelectorAll('.deadline-timer').forEach(timer => {
        const deadlineElement = timer.closest('.deadline-item');
        const taskId = parseInt(deadlineElement.dataset.id);
        const task = tasks.find(t => t.id === taskId);
        
        if (task && task.deadline) {
            const deadlineInfo = getDeadlineInfo(task.deadline);
            timer.textContent = deadlineInfo.text;
            
            // Обновляем класс дедлайна
            deadlineElement.className = `deadline-item ${deadlineInfo.class}`;
        }
    });
}

// Получение текста сложности
function getDifficultyText(difficulty) {
    switch(difficulty) {
        case 'easy': return 'Легкая';
        case 'medium': return 'Средняя';
        case 'hard': return 'Сложная';
        default: return '';
    }
}

// Правильное склонение слова "задача"
function getTaskWordForm(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return 'задач';
    }
    
    if (lastDigit === 1) {
        return 'задача';
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
        return 'задачи';
    }
    
    return 'задач';
}

// Открытие модального окна всех задач
function openAllTasksModal(filter = 'all') {
    allTasksList.innerHTML = '';
    
    let filteredTasks = [...tasks];
    
    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'easy') {
        filteredTasks = tasks.filter(task => task.difficulty === 'easy');
    } else if (filter === 'medium') {
        filteredTasks = tasks.filter(task => task.difficulty === 'medium');
    } else if (filter === 'hard') {
        filteredTasks = tasks.filter(task => task.difficulty === 'hard');
    } else if (filter === 'deadline') {
        filteredTasks = tasks.filter(task => task.deadline);
    }
    
    if (filteredTasks.length === 0) {
        allTasksList.innerHTML = `
            <div class="empty-all-tasks">
                <div class="empty-icon">📝</div>
                <div>Нет задач по выбранному фильтру</div>
            </div>
        `;
    } else {
        // Сортируем: сначала невыполненные, затем выполненные
        filteredTasks.sort((a, b) => {
            if (a.completed === b.completed) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return a.completed ? 1 : -1;
        });
        
        filteredTasks.forEach(task => {
            const taskElement = createAllTaskElement(task);
            allTasksList.appendChild(taskElement);
        });
    }
    
    allTasksModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Создание элемента задачи для модального окна
function createAllTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = `task-item ${task.difficulty} ${task.completed ? 'completed' : ''}`;
    taskElement.dataset.id = task.id;
    
    const deadlineInfo = task.deadline ? getDeadlineInfo(task.deadline) : null;
    
    taskElement.innerHTML = `
        <div class="task-header">
            <span class="task-text">${task.text}</span>
            <span class="task-difficulty">${getDifficultyText(task.difficulty)}</span>
        </div>
        <div class="task-footer">
            ${task.deadline ? `
                <div class="task-timer ${deadlineInfo.class}">
                    <i class="far fa-clock"></i>
                    <span class="timer-text">${deadlineInfo.text}</span>
                </div>
            ` : '<div></div>'}
            <div class="task-time">
                <i class="far fa-calendar-alt"></i>
                ${formatDateTime(task.createdAt)}
            </div>
            <div class="task-actions">
                <button class="task-action-btn toggle-btn" title="${task.completed ? 'Возобновить' : 'Завершить'}">
                    <i class="far ${task.completed ? 'fa-undo-alt' : 'fa-check-circle'}"></i>
                </button>
                <button class="task-action-btn edit-btn" title="Редактировать">
                    <i class="far fa-edit"></i>
                </button>
                <button class="task-action-btn delete-btn" title="Удалить">
                    <i class="far fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `;
    
    return taskElement;
}

// Закрытие модального окна всех задач
function closeAllTasksModal() {
    allTasksModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Обработка кликов по задачам
function handleTaskAction(e) {
    const target = e.target;
    const taskElement = target.closest('.task-item');
    if (!taskElement) return;
    
    const taskId = parseInt(taskElement.dataset.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (target.closest('.complete-btn') || target.closest('.toggle-btn')) {
        // Завершение/возобновление задачи
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        updateTasksDisplay();
        
        // Если это было в модальном окне, обновляем его
        if (allTasksModal.classList.contains('active')) {
            const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;
            openAllTasksModal(currentFilter);
        }
    } else if (target.closest('.edit-btn')) {
        // Редактирование задачи
        editTask(taskIndex);
    } else if (target.closest('.delete-btn')) {
        // Удаление задачи
        if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
            tasks.splice(taskIndex, 1);
            saveTasks();
            updateTasksDisplay();
            
            // Если это было в модальном окне, обновляем его
            if (allTasksModal.classList.contains('active')) {
                const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;
                openAllTasksModal(currentFilter);
            }
        }
    }
}

// Редактирование задачи
function editTask(taskIndex) {
    const task = tasks[taskIndex];
    
    taskInput.value = task.text;
    difficultySelect.value = task.difficulty;
    deadlineInput.value = task.deadline || '';
    
    // Удаляем старую задачу
    tasks.splice(taskIndex, 1);
    saveTasks();
    updateTasksDisplay();
}

// Обработка фильтров
function handleFilterClick(e) {
    const filter = e.target.dataset.filter;
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    openAllTasksModal(filter);
}

// Управление модальными окнами
function setupModalControls() {
    // Профиль
    profileAvatar.addEventListener('click', () => {
        profileModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeProfile.addEventListener('click', () => {
        profileModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Настройки
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeSettings.addEventListener('click', () => {
        settingsModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Выход
    logoutBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
    
    // Закрытие модальных окон при клике вне их
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// Управление темой
function setupThemeSwitcher() {
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (btn.dataset.theme === 'dark') {
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    });
    
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeBtn = document.querySelector(`.theme-btn[data-theme="${savedTheme}"]`);
    if (themeBtn) {
        themeBtn.click();
    }
}

// Управление аватаром
function setupAvatarUpload() {
    uploadBtn.addEventListener('click', () => {
        avatarUpload.click();
    });
    
    avatarUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                avatarPreview.src = event.target.result;
                profileAvatar.src = event.target.result;
                profileAvatarLarge.src = event.target.result;
                localStorage.setItem('avatar', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Проверяем сохраненный аватар
    const savedAvatar = localStorage.getItem('avatar');
    if (savedAvatar) {
        avatarPreview.src = savedAvatar;
        profileAvatar.src = savedAvatar;
        profileAvatarLarge.src = savedAvatar;
    }
}

// Сохранение настроек
function setupSettingsSave() {
    saveSettingsBtn.addEventListener('click', () => {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword && newPassword !== confirmPassword) {
            alert('Пароли не совпадают!');
            return;
        }
        
        if (newPassword) {
            // Здесь должна быть логика смены пароля
            alert('Пароль успешно изменен!');
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
        }
        
        settingsModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Инициализация приложения
function init() {
    loadTasks();
    
    // Настройка обработчиков событий
    setupModalControls();
    setupThemeSwitcher();
    setupAvatarUpload();
    setupSettingsSave();
    
    // Обновляем таймеры каждую минуту
    setInterval(updateTimers, 60000);
    
    // События
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    viewAllBtn.addEventListener('click', () => openAllTasksModal('all'));
    closeAllTasks.addEventListener('click', closeAllTasksModal);
    
    // Клики по задачам (делегирование событий)
    tasksList.addEventListener('click', handleTaskAction);
    deadlinesList.addEventListener('click', handleTaskAction);
    allTasksList.addEventListener('click', handleTaskAction);
    
    // Фильтры
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', init);


// Функция создания элемента задачи для списка дедлайнов
function createDeadlineElement(task) {
    const deadlineElement = document.createElement('div');
    deadlineElement.className = 'deadline-item';
    
    // Определяем статус дедлайна
    const now = new Date();
    const deadlineDate = new Date(task.deadline);
    const timeDiff = deadlineDate - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    let timerClass = 'normal';
    let timerText = '';
    
    if (timeDiff < 0) {
        // Дедлайн прошел
        timerClass = 'urgent';
        timerText = 'Просрочено';
    } else if (hoursDiff < 24) {
        // Меньше 24 часов осталось
        timerClass = 'urgent';
        timerText = `Осталось: ${Math.floor(hoursDiff)} ч`;
    } else if (hoursDiff < 72) {
        // Меньше 3 дней осталось
        timerClass = 'warning';
        timerText = `Осталось: ${Math.floor(hoursDiff / 24)} д`;
    } else {
        // Больше 3 дней осталось
        timerClass = 'normal';
        timerText = `Осталось: ${Math.floor(hoursDiff / 24)} д`;
    }
    
    // Форматируем дату дедлайна
    const deadlineFormatted = deadlineDate.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    deadlineElement.innerHTML = `
        <div class="deadline-text">
            <i class="fas fa-calendar-alt"></i>
            ${task.text}
            <span class="deadline-timer ${timerClass}">
                <i class="fas fa-clock"></i> ${timerText}
            </span>
        </div>
        <div class="deadline-time">
            <i class="fas fa-calendar-check"></i>
            Дедлайн: ${deadlineFormatted}
        </div>
    `;
    
    return deadlineElement;
}

// Вспомогательная функция для правильного склонения слова "задача"
function getTaskWord(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return 'задач';
    }
    
    if (lastDigit === 1) {
        return 'задача';
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
        return 'задачи';
    }
    
    return 'задач';
}

// Назначаем обработчик кнопке добавления задачи
document.getElementById('addTaskBtn').addEventListener('click', addTask);