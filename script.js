// ========================================
// АНИМАЦИЯ ПОЯВЛЕНИЯ СЕКЦИЙ
// ========================================

const blocks = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }

    });

});

blocks.forEach((block) => {
    observer.observe(block);
});


// ========================================
// КОНВЕРТ
// ========================================

const envelopeScreen =
    document.querySelector("#envelopeScreen");

const openInvitation =
    document.querySelector("#openInvitation");

const letterDate =
    document.querySelector(".letter-date");

const letterNames =
    document.querySelector(".letter-names");


// ========================================
// ПОДГОТОВКА ТЕКСТА
// ========================================

function prepareHandwriting(element) {

    const text = element.textContent.trim();

    element.textContent = "";

    const letters = [];

    [...text].forEach((character) => {

        const span = document.createElement("span");

        if (character === " ") {
            span.innerHTML = "&nbsp;";
        } else {
            span.textContent = character;
        }

        // Задаём задержку каждой букве заранее
        span.style.animationDelay =
            `${letters.length * 0.12}s`;

        // Пока ничего не пишем
        span.style.animationPlayState = "paused";

        element.appendChild(span);

        letters.push(span);
    });

    return letters;
}


// Запоминаем буквы отдельно
const dateLetters =
    prepareHandwriting(letterDate);

const nameLetters =
    prepareHandwriting(letterNames);


// ========================================
// КНОПКА «ОТКРЫТЬ ПРИГЛАШЕНИЕ»
// ========================================

openInvitation.addEventListener("click", () => {

    // Защита от повторного нажатия
    openInvitation.disabled = true;


    // Останавливаем движение конверта
    envelopeScreen.classList.add("opened");


    // Небольшая пауза перед написанием
    setTimeout(() => {

        // Запускаем анимацию букв
        envelopeScreen.classList.add("writing");


        // ========================================
        // СНАЧАЛА ПИШЕМ ДАТУ
        // ========================================

        dateLetters.forEach((letter) => {
            letter.style.animationPlayState = "running";
        });


        // ========================================
        // ПОСЛЕ ДАТЫ ПИШЕМ ИМЕНА
        // ========================================

        const dateDuration =
            dateLetters.length * 120 + 300;


        setTimeout(() => {

            nameLetters.forEach((letter) => {
                letter.style.animationPlayState = "running";
            });

        }, dateDuration);


    }, 300);


    // ========================================
    // УБИРАЕМ ЭКРАН ПОСЛЕ АНИМАЦИИ
    // ========================================

    setTimeout(() => {

        envelopeScreen.classList.add("hide");

    }, 6000);

});