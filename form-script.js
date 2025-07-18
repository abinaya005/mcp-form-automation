const form = document.getElementById('multiStepForm');
const steps = Array.from(document.querySelectorAll('.form-step'));
const progressIndicators = Array.from(document.querySelectorAll('.step-indicator'));
const stepMessage = document.getElementById('stepMessage');
const stepOverlay = document.getElementById('stepOverlay');
const typingPopup = document.getElementById('typingPopup');
const formContainer = document.getElementById('formContainer');
const reviewBox = document.getElementById('reviewBox');
const subscribeBtn = document.getElementById('subscribeBtn');
const newsletterCheckbox = document.getElementById('newsletter');
const subscribePopup = document.getElementById('subscribePopup');

let currentStep = 0;
let overlayTimeout = null;
let popupTimeout = null;
let subscribePopupTimeout = null;

function updateStep(step) {
  if (step < 0 || step >= steps.length) return;

  progressIndicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === step);
    indicator.classList.toggle('completed', index < step);
  });

  stepOverlay.textContent = `Step ${step + 1}`;
  stepOverlay.classList.add('show');
  clearTimeout(overlayTimeout);
  overlayTimeout = setTimeout(() => {
    stepOverlay.classList.remove('show');
  }, 2000);

  steps.forEach((s, i) => {
    s.classList.toggle('hidden', i !== step);
  });

  currentStep = step;
  stepMessage.textContent = stepOverlay.classList.contains('show') ? '' : `Step ${step + 1} of ${steps.length}`;

  if (step === steps.length - 1) {
    fillReview();
  }
}

function fillReview() {
  const formData = new FormData(form);
  reviewBox.innerHTML = `
    <strong>Name:</strong> ${formData.get('name') || '-'}<br/>
    <strong>DOB:</strong> ${formData.get('dob') || '-'}<br/>
    <strong>Email:</strong> ${formData.get('email') || '-'}<br/>
    <strong>Phone:</strong> ${formData.get('phone') || '-'}<br/>
    <strong>Interest:</strong> ${formData.get('interests') || '-'}<br/>
    <strong>Newsletter (Subscribe):</strong> ${formData.get('newsletter') ? 'Yes' : 'No'}
  `;
}

// Newsletter toggle
subscribeBtn.addEventListener('click', () => {
  const isActive = subscribeBtn.classList.toggle('active');
  newsletterCheckbox.checked = isActive;
  subscribeBtn.setAttribute('aria-pressed', isActive.toString());

  clearTimeout(subscribePopupTimeout);
  subscribePopup.textContent = isActive ? 'Subscribed to newsletter' : 'Unsubscribed from newsletter';
  subscribePopup.classList.add('show');
  subscribePopupTimeout = setTimeout(() => {
    subscribePopup.classList.remove('show');
  }, 1800);
});

// Typing popup
form.addEventListener('input', () => {
  clearTimeout(popupTimeout);
  typingPopup.classList.add('show');
  popupTimeout = setTimeout(() => {
    typingPopup.classList.remove('show');
  }, 1200);
});

// Validation
function validateStep(step) {
  const inputs = steps[step].querySelectorAll('input, select');
  for (let input of inputs) {
    if (input.hasAttribute('required') && !input.value) {
      alert(`Please fill in the ${input.name || input.id || 'field'}.`);
      input.focus();
      return false;
    }
  }
  return true;
}

// Next buttons
document.querySelectorAll('.next-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      updateStep(currentStep + 1);
    }
  });
});

// Back buttons
document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    updateStep(currentStep - 1);
  });
});

// Handle Enter key
form.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (currentStep === steps.length - 1) {
      if (validateStep(currentStep)) {
        form.requestSubmit();
      }
    } else {
      if (validateStep(currentStep)) {
        updateStep(currentStep + 1);
      }
    }
  }
});

// Submit with confetti 🎊
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateStep(currentStep)) return;

  formContainer.style.display = 'none';
  const thankYouScreen = document.getElementById('thankYouScreen');
  thankYouScreen.classList.add('show');
  thankYouScreen.focus();

  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 30000 };

  (function frame() {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return;
    const particleCount = 50 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: { x: Math.random(), y: Math.random() - 0.2 }
    }));
    requestAnimationFrame(frame);
  })();
});

updateStep(0);
