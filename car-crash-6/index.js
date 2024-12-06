const icon = document.getElementById('icon');
const appScreen = document.getElementById('appScreen');
const toggleGesturesButton = document.getElementById('toggleGestures');
const phoneScreen = document.getElementById('phoneScreen');
const allApps = document.querySelectorAll('.app');

let gesturesEnabled = false;
let isAppOpen = false;
let isAnimating = false;
let currentApp = null;
let swipeStartY = 0;

const appAnimationSettings = {
  duration: 300,
  easing: 'ease-in-out',
  scaleStart: 0,
  scaleEnd: 1,
  borderRadiusStart: '25px', // Начальный заокругленный угол
  borderRadiusEnd: '25px', // Конечный заокругленный угол
};

const gesturesSettings = {
  swipeThreshold: 30,
  swipeStart: 0,
};

toggleGesturesButton.addEventListener('click', toggleGestures);

function toggleGestures() {
  gesturesEnabled = !gesturesEnabled;
  toggleGesturesButton.textContent = gesturesEnabled ? 'Выключить жесты' : 'Включить жесты';
}
function animateApp(open, appElement) {
    if (isAnimating && open === isAppOpen) return;
  
    isAnimating = true;
    isAppOpen = open;
    currentApp = open ? appElement : null;
  
    const iconRect = icon.getBoundingClientRect();
    const appRect = appElement.getBoundingClientRect();
    const translateX = iconRect.left - appRect.left;
    const translateY = iconRect.top - appRect.top;
  
    // Set transition properties for transform and border-radius
    appElement.style.transition = `transform ${appAnimationSettings.duration}ms ${appAnimationSettings.easing}, border-radius ${appAnimationSettings.duration}ms ${appAnimationSettings.easing}`;
    appElement.style.willChange = 'transform, border-radius';
  
    if (open) {
      appElement.classList.add('show');
      appElement.style.transform = `scale(${appAnimationSettings.scaleStart}) translate(${translateX}px, ${translateY}px)`;
      appElement.style.borderRadius = appAnimationSettings.borderRadiusStart; // Start border-radius
      setTimeout(() => {
        appElement.style.transform = `scale(${appAnimationSettings.scaleEnd})`;
        appElement.style.borderRadius = appAnimationSettings.borderRadiusEnd; // End border-radius
      }, 10);
    } else {
      appElement.style.transform = `scale(${appAnimationSettings.scaleEnd})`;
      appElement.style.borderRadius = appAnimationSettings.borderRadiusEnd; // Maintain end border-radius during closing
      setTimeout(() => {
        appElement.style.transform = `scale(${appAnimationSettings.scaleStart}) translate(${translateX}px, ${translateY}px)`;
        appElement.style.borderRadius = appAnimationSettings.borderRadiusStart; // Reset border-radius
      }, 10);
    }
  
    appElement.ontransitionend = () => {
      if (!open) {
        appElement.classList.remove('show');
      }
      isAnimating = false;
    };
  }

function openApp(appElement) {
  if (currentApp && currentApp !== appElement) {
    animateApp(false, currentApp);
  }
  animateApp(true, appElement);
}

function closeApp(appElement) {
  if (currentApp && currentApp !== appElement) {
   
    animateApp(false, currentApp);
    return;
  }
  animateApp(false, appElement);
}

icon.addEventListener('click', () => {
  if (!isAppOpen && !isAnimating) openApp(appScreen);
});

phoneScreen.addEventListener('click', () => {
  if (gesturesEnabled && isAppOpen) {
    closeApp(appScreen);
  }
});

phoneScreen.addEventListener('mousemove', handleMouseMove);
phoneScreen.addEventListener('touchstart', handleTouchStart);
phoneScreen.addEventListener('touchmove', handleTouchMove);
phoneScreen.addEventListener('touchend', handleTouchEnd);

function handleMouseMove(e) {
  if (gesturesEnabled) {
    const threshold = 5;
    if (e.movementY < -threshold && !isAppOpen) {
      openApp(currentApp || appScreen);
    } else if (e.movementY > threshold && isAppOpen) {
      closeApp();
    }
  }
}

function handleTouchStart(e) {
  if (gesturesEnabled) {
    swipeStartY = e.touches[0].clientY;
  }
}

function handleTouchMove(e) {
  if (gesturesEnabled) {
    const touchMoveY = e.touches[0].clientY;
    const movementY = swipeStartY - touchMoveY;

    if (movementY > gesturesSettings.swipeThreshold && !isAppOpen) {
      openApp(currentApp || appScreen);
    } else if (movementY < -gesturesSettings.swipeThreshold && isAppOpen) {
      closeApp();
    }
  }
}

function handleTouchEnd() {}

function animateOtherElements() {
  const otherElements = document.querySelectorAll('.otherElement');
  otherElements.forEach(element => {
    element.style.transition = `transform ${appAnimationSettings.duration}ms ${appAnimationSettings.easing}`;
    element.style.transform = 'scale(1.1)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 100);
  });
}

function addCSSAnimations() {
  const appElement = document.querySelector('.app');
  appElement.classList.add('animateApp');
}

const style = document.createElement('style');
style.innerHTML = `
  .animateApp {
    animation: fadeInOut ${appAnimationSettings.duration}ms ease-in-out forwards;
  }

  @keyframes fadeInOut {
    0% { opacity: 1; transform: scale(0.3); border-radius: 25px; }
    100% { opacity: 1; transform: scale(1); border-radius: 25px; }
  }
`;
document.head.appendChild(style);

allApps.forEach(app => {
  app.addEventListener('click', () => {
    if (!isAnimating) {
      if (!isAppOpen) {
        openApp(app);
      } else {
        closeApp(app);
      }
    }
  });
});

appLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Управление жестами на телефоне
phoneScreen.addEventListener('touchstart', function(e) {
  if (gesturesEnabled) {
    swipeStartY = e.touches[0].clientY;
  }
});

phoneScreen.addEventListener('touchmove', function(e) {
  if (gesturesEnabled) {
    const touchMoveY = e.touches[0].clientY;
    const movementY = swipeStartY - touchMoveY;

    if (movementY > gesturesSettings.swipeThreshold && !isAppOpen) {
      openApp(currentApp || appScreen);
    } else if (movementY < -gesturesSettings.swipeThreshold && isAppOpen) {
      closeApp();
    }
  }
});
