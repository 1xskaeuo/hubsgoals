 // DOM элементы
 const emailInput = document.getElementById('email');
 const passwordInput = document.getElementById('password');
 const loginBtn = document.getElementById('loginBtn');
 const emailField = document.getElementById('emailField');
 const passwordField = document.getElementById('passwordField');
 const notification = document.getElementById('notification');
 const notificationTitle = document.getElementById('notificationTitle');
 const notificationMessage = document.getElementById('notificationMessage');

 // Функция для получения зарегистрированных пользователей
 function getRegisteredUsers() {
     const users = localStorage.getItem('registeredUsers');
     return users ? JSON.parse(users) : [];
 }

 // Функция для проверки, залогинен ли пользователь
 function isUserLoggedIn() {
     return localStorage.getItem('currentUser') !== null;
 }

 // Показать уведомление
 function showNotification(type, title, message) {
     notification.className = `notification ${type} show`;
     notificationTitle.textContent = title;
     notificationMessage.textContent = message;
     
     setTimeout(() => {
         notification.classList.remove('show');
     }, 5000);
 }

 // Валидация формы
 function validateForm() {
     let isValid = true;
     
     // Валидация email
     if (!emailInput.value.trim()) {
         emailField.classList.add('error');
         isValid = false;
     } else {
         emailField.classList.remove('error');
     }
     
     // Валидация пароля
     if (!passwordInput.value.trim()) {
         passwordField.classList.add('error');
         isValid = false;
     } else {
         passwordField.classList.remove('error');
     }
     
     return isValid;
 }

 // Проверка учетных данных
 function checkCredentials(email, password) {
     const users = getRegisteredUsers();
     const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
     
     if (!user) {
         return false;
     }
     
     return user.password === password;
 }

 // Переключение видимости пароля
 document.getElementById('togglePassword').addEventListener('click', function() {
     const passwordInput = document.getElementById('password');
     const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
     passwordInput.setAttribute('type', type);
     
     // Обновляем текст и иконку
     if (type === 'password') {
         this.innerHTML = `
             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12 5C5 5 1 12 1 12C1 12 5 19 12 19C19 19 23 12 23 12C23 12 19 5 12 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                 <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
             </svg>
             Показать пароль`;
     } else {
         this.innerHTML = `
             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M4.5 3.75L19.5 20.25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                 <path d="M14.522 14.7749C13.7868 15.4439 12.8145 15.7935 11.821 15.7517C10.8275 15.7098 9.88737 15.3794 9.20874 14.8319C8.53011 14.2844 8.15997 13.5635 8.17237 12.8177C8.18477 12.0719 8.57884 11.3611 9.27403 10.8309" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                 <path d="M6.9375 6.43066C3.1125 8.36291 1.5 11.9999 1.5 11.9999C1.5 11.9999 4.5 18.7499 12 18.7499C13.7574 18.7639 15.4929 18.3588 17.0625 17.5692" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                 <path d="M19.5563 15.8535C21.6001 14.0227 22.5001 11.9999 22.5001 11.9999C22.5001 11.9999 19.5001 5.24991 12.0001 5.24991C11.3506 5.24891 10.7026 5.30191 10.0613 5.40791" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                 <path d="M12.7031 8.31641C13.5007 8.46911 14.2279 8.87688 14.7586 9.46991C15.2893 10.0629 15.5914 10.8065 15.615 11.5809" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
             </svg>
             Скрыть пароль`;
     }
 });

 // Обработчик отправки формы
 loginBtn.addEventListener('click', function() {
     if (!validateForm()) {
         return;
     }

     const email = emailInput.value.trim();
     const password = passwordInput.value;

     // Проверяем учетные данные
     if (!checkCredentials(email, password)) {
         showNotification('error', 'Ошибка', 'Неверный email или пароль');
         passwordField.classList.add('error');
         return;
     }

     // Показываем состояние загрузки
     loginBtn.disabled = true;
     loginBtn.textContent = 'Вход...';
     
     // Получаем данные пользователя
     const users = getRegisteredUsers();
     const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
     
     // Сохраняем текущего пользователя
     localStorage.setItem('currentUser', JSON.stringify(user));
     
     // Перенаправляем на главную страницу
     setTimeout(() => {
         window.location.href = 'home.html';
     }, 1000);
 });

 // Убираем ошибки при вводе
 emailInput.addEventListener('input', () => {
     if (emailField.classList.contains('error')) {
         emailField.classList.remove('error');
     }
 });

 passwordInput.addEventListener('input', () => {
     if (passwordField.classList.contains('error')) {
         passwordField.classList.remove('error');
     }
 });

 // Проверка, если пользователь уже залогинен
 // if (isUserLoggedIn()) {
 //     window.location.href = 'home.html';
 // }


 // Добавляем в начало login.js
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Проверяем сохраненную тему
const savedTheme = localStorage.getItem('theme') || 'light-theme';
body.className = savedTheme;

// Обработчик переключения темы
themeToggle.addEventListener('click', () => {
    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark-theme');
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light-theme');
    }
});


