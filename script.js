//НАВИГАЦИЯ
function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function toggleMobileNav() {
  document.getElementById('mobileNav').classList.toggle('is-open');
}

//FAQ АККОРДЕОН 
function toggleFaq(btn) {
  const item = btn.closest('.faq__item');
  const isOpen = item.classList.contains('is-open');
  document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('is-open'));
  if (!isOpen) item.classList.add('is-open');
}

//СЛАЙДЕР ОТЗЫВОВ
let currentSlide = 0;

function getCardsPerView() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function updateSlider() {
  const track = document.getElementById('reviewsTrack');
  if (!track) return;
  const totalCards = track.querySelectorAll('.review-card').length;
  const cardsPerView = getCardsPerView();
  const totalPages = Math.ceil(totalCards / cardsPerView);
  if (currentSlide >= totalPages) currentSlide = Math.max(0, totalPages - 1);
  track.style.transform = `translateX(calc(-${currentSlide * 100}% - ${currentSlide * 20}px))`;

  const dotsContainer = document.getElementById('reviewDots');
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = `reviews__dot ${i === currentSlide ? 'is-active' : ''}`;
      dot.onclick = () => goToSlide(i);
      dotsContainer.appendChild(dot);
    }
  }
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');
  if (prevBtn) prevBtn.style.opacity = currentSlide === 0 ? '.3' : '1';
  if (nextBtn) nextBtn.style.opacity = currentSlide >= totalPages - 1 ? '.3' : '1';
}

function goToSlide(n) {
  const totalCards = document.querySelectorAll('.review-card').length;
  const totalPages = Math.ceil(totalCards / getCardsPerView());
  currentSlide = Math.max(0, Math.min(n, totalPages - 1));
  updateSlider();
}

function slideReviews(dir) {
  goToSlide(currentSlide + dir);
}

window.addEventListener('resize', updateSlider);

// ВАЛИДАЦИЯ ФОРМЫ
const validators = {
  name: (value) => {
    if (value.trim().length < 2) {
      return { valid: false, message: 'Минимум 2 символа' };
    }
    return { valid: true, message: '' };
  },
  phone: (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (!/^(\+?7|8)\d{10}$/.test(cleaned)) {
      return { valid: false, message: 'Формат: +7 (XXX) XXX-XX-XX' };
    }
    return { valid: true, message: '' };
  },
  email: (value) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      return { valid: false, message: 'Пример: name@example.com' };
    }
    return { valid: true, message: '' };
  }
};

// Валидация отдельного поля
function validateField(input) {
  const type = input.getAttribute('data-validate');
  if (!type) return true;

  const value = input.value;
  const field = input.closest('.form__field');
  const errorDiv = field ? field.querySelector('.form__error') : null;

  if (!value.trim()) {
    input.classList.add('form__input--error');
    input.classList.remove('form__input--valid');
    if (errorDiv) errorDiv.textContent = 'Обязательное поле';
    return false;
  }

  const validation = validators[type](value);

  if (validation.valid) {
    input.classList.remove('form__input--error');
    input.classList.add('form__input--valid');
    if (errorDiv) errorDiv.textContent = '';
    return true;
  } else {
    input.classList.add('form__input--error');
    input.classList.remove('form__input--valid');
    if (errorDiv) errorDiv.textContent = validation.message;
    return false;
  }
}

// Проверка всей формы
function isFormValid(form) {
  const inputs = form.querySelectorAll('.form__input[data-validate]');
  const checkbox = form.querySelector('.form__checkbox');
  let allValid = true;

  inputs.forEach(input => {
    const type = input.getAttribute('data-validate');
    const value = input.value;
    if (!value.trim() || !validators[type](value).valid) {
      allValid = false;
    }
  });

  if (!checkbox || !checkbox.checked) {
    allValid = false;
  }

  return allValid;
}

// Обновление состояния кнопки
function updateSubmitButton(form) {
  const btn = form.querySelector('.form__submit');
  if (!btn) return;
  btn.disabled = !isFormValid(form);
}

// Инициализация валидации
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    const inputs = form.querySelectorAll('.form__input[data-validate]');
    const checkbox = form.querySelector('.form__checkbox');

    inputs.forEach(input => {
      input.addEventListener('input', () => {
        validateField(input);
        updateSubmitButton(form);
      });
      input.addEventListener('blur', () => {
        validateField(input);
      });
    });

    if (checkbox) {
      checkbox.addEventListener('change', () => updateSubmitButton(form));
    }

    updateSubmitButton(form);
  });
});

//ОТПРАВКА ФОРМЫ
function submitForm(btn) {
  const form = btn.closest('form');
  if (!form) return;

  // Проверяем все поля ещё раз
  const inputs = form.querySelectorAll('.form__input[data-validate]');
  let allValid = true;
  inputs.forEach(input => {
    if (!validateField(input)) allValid = false;
  });

  const checkbox = form.querySelector('.form__checkbox');
  if (!checkbox || !checkbox.checked) {
    alert('Необходимо согласие на обработку данных');
    return;
  }

  if (!allValid) {
    alert('Пожалуйста, заполните все поля корректно');
    return;
  }

  // Успешная отправка — кнопка становится зелёной БЕЗ галочки
  btn.textContent = 'Отправлено';
  btn.classList.add('form__submit--success');
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Отправить';
    btn.classList.remove('form__submit--success');
    btn.disabled = false;

    // Очищаем форму
    inputs.forEach(input => {
      input.value = '';
      input.classList.remove('form__input--valid', 'form__input--error');
      const field = input.closest('.form__field');
      if (field) {
        const errorDiv = field.querySelector('.form__error');
        if (errorDiv) errorDiv.textContent = '';
      }
    });

    const textarea = form.querySelector('.form__textarea');
    if (textarea) textarea.value = '';

    if (checkbox) checkbox.checked = false;

    updateSubmitButton(form);
  }, 3000);
}

//Инициализация слайдера 
updateSlider();
