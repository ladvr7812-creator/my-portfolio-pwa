// ========================================
// SERVICE WORKER REGISTRATION
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('service-worker.js')
            .then(() => console.log('Service Worker registered successfully'))
            .catch(error => console.error('Service Worker registration failed:', error));
    });
}

// ========================================
// OFFLINE/ONLINE INDICATOR
// ========================================
const offlineIndicator = document.createElement('div');
offlineIndicator.className = 'offline-indicator';
offlineIndicator.innerHTML = '🔴 You are offline';
document.body.appendChild(offlineIndicator);

window.addEventListener('online', () => {
    offlineIndicator.innerHTML = '🟢 Back online!';
    offlineIndicator.classList.add('online');
    offlineIndicator.classList.add('show');

    setTimeout(() => {
        offlineIndicator.classList.remove('show');
    }, 3000);
});

window.addEventListener('offline', () => {
    offlineIndicator.innerHTML = '🔴 You are offline';
    offlineIndicator.classList.remove('online');
    offlineIndicator.classList.add('show');
});

// ========================================
// PWA INSTALL PROMPT
// ========================================
let deferredPrompt;

const installButton = document.createElement('button');
installButton.innerHTML = '📱 Install App';
installButton.className = 'install-button';
installButton.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('💡 Install prompt available');
    e.preventDefault();
    deferredPrompt = e;

    installButton.style.display = 'flex';
    document.body.appendChild(installButton);
});

installButton.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`Install prompt: ${outcome}`);
    deferredPrompt = null;
    installButton.style.display = 'none';
});

window.addEventListener('appinstalled', () => {
    console.log('🎉 PWA installed!');
    installButton.style.display = 'none';
});

// ========================================
// SMOOTH SCROLLING
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// CONTACT FORM HANDLING
// ========================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        alert(`Thank you ${name}! 🎉\n\nYour message has been received.\nI'll get back to you at ${email}`);

        contactForm.reset();
    });
}

console.log('🚀 Portfolio loaded successfully!');