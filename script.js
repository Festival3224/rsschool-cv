const phrases = [
    "responsive interfaces",
    "accessible web apps",
    "user-friendly experiences"
];

const textElement = document.querySelector(".typed-text");

let phraseIndex = 0;
let letterIndex = 0;

function typeText() {
    const currentPhrase = phrases[phraseIndex];

    if (letterIndex < currentPhrase.length) {
        textElement.textContent += currentPhrase[letterIndex];
        letterIndex++;
        setTimeout(typeText, 100);
    } else {
        setTimeout(deleteText, 1200);
    }
}

function deleteText() {
    if (letterIndex > 0) {
        textElement.textContent = textElement.textContent.slice(0, -1);
        letterIndex--;
        setTimeout(deleteText, 60);
    } else {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeText, 300);
    }
}

typeText();

const codeWindow = document.querySelector(".code-window");
const codeContent = document.querySelector(".code-content");

let codeOffset = 0;
let isCodeLocked = false;


function getMaxCodeScroll() {
    return Math.max(
        0,
        codeContent.scrollHeight - codeWindow.clientHeight
    );
}

function getLockTop() {
    return Math.min(280, window.innerHeight * 0.3);
}

function lockCodeWindow() {
    const rect = codeWindow.getBoundingClientRect();
    const lockTop = getLockTop();

    // Доводим окно точно до позиции фиксации
    window.scrollBy({
        top: rect.top - lockTop,
        behavior: "auto"
    });

    isCodeLocked = true;
}

window.addEventListener(
    "wheel",
    (event) => {
        const rect = codeWindow.getBoundingClientRect();
        const maxCodeScroll = getMaxCodeScroll();
        const lockTop = getLockTop();

        const scrollingDown = event.deltaY > 0;
        const scrollingUp = event.deltaY < 0;

        // DOWN:
        // страница свободно идёт вниз, пока окно
        // не достигнет нашей точки фиксации
        if (
            scrollingDown &&
            !isCodeLocked &&
            codeOffset < maxCodeScroll &&
            rect.top <= lockTop
        ) {
            event.preventDefault();
            lockCodeWindow();
        }

        // UP:
        // при возвращении снизу снова ловим окно
        // в той же точке
        if (
            scrollingUp &&
            !isCodeLocked &&
            codeOffset > 0 &&
            rect.top >= lockTop - 25 &&
            rect.top <= lockTop + 25
        ) {
            event.preventDefault();
            lockCodeWindow();
        }

        if (!isCodeLocked) {
            return;
        }

        // Пока окно зафиксировано,
        // колесо управляет только кодом
        event.preventDefault();

        codeOffset += event.deltaY;

        codeOffset = Math.max(
            0,
            Math.min(maxCodeScroll, codeOffset)
        );

        codeContent.style.transform =
            `translateY(-${codeOffset}px)`;

        // Код дошёл до конца:
        // отпускаем страницу вниз
        if (scrollingDown && codeOffset >= maxCodeScroll) {
            isCodeLocked = false;
        }

        // Вернулись к первой строке:
        // отпускаем страницу вверх
        if (scrollingUp && codeOffset <= 0) {
            isCodeLocked = false;
        }
    },
    { passive: false }
);