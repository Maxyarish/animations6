const icon = document.getElementById('icon');
const appScreen = document.getElementById('appScreen');
const toggleGesturesButton = document.getElementById('toggleGestures');
const phoneScreen = document.getElementById('phoneScreen');

let gesturesEnabled = false;
let isAppOpen = false;
let isAnimating = false;

toggleGesturesButton.addEventListener('click', () => {
    gesturesEnabled = !gesturesEnabled;
    toggleGesturesButton.textContent = gesturesEnabled ? 'Выключить жесты' : 'Включить жесты';
});

function animateApp(open) {
   if (isAnimating && open === isAppOpen) return;

    isAnimating = true;
    isAppOpen = open;

    const iconRect = icon.getBoundingClientRect();
    const appRect = appScreen.getBoundingClientRect();
    const translateX = `${iconRect.left - appRect.left}px`;
    const translateY = `${iconRect.top - appRect.top}px`;

    appScreen.style.transition = 'transform 0.4s ease-in-out, opacity 0.5s ease-in-out';

    const currentScale = window.getComputedStyle(appScreen).transform.includes('matrix')
      ? window.getComputedStyle(appScreen).transform
        : 'scale(1)';

    if (open) {
        appScreen.classList.add('show');
        appScreen.style.transform = currentScale; 
        requestAnimationFrame(() => {
            appScreen.style.transform = 'scale(1)';
            appScreen.style.opacity = '1';
            appScreen.style.borderRadius = '25px';
        });
    } else {
        appScreen.style.transform = currentScale; 
        requestAnimationFrame(() => {
            appScreen.style.transform = `scale(0) translate(${translateX}, ${translateY})`;
            appScreen.style.opacity = '1';
            appScreen.style.borderRadius = '25px';
        });
    }

    appScreen.ontransitionend = () => {
        isAnimating = false;
        if (!open) {
            appScreen.classList.remove('show');
        }
    };
}


function openApp() {
    animateApp(true);
}

function closeApp() {
    animateApp(false);
}

icon.addEventListener('click', () => {
    if (!isAppOpen && !isAnimating) openApp();
});

phoneScreen.addEventListener('mousemove', (e) => {
    if (gesturesEnabled) {
        const threshold = 1;
        if (e.movementY < -threshold && !isAppOpen) {
            openApp();
        } else if (e.movementY > threshold && isAppOpen) {
            closeApp(); 
        }
    }
});