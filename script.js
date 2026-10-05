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

const heroVideo =
    document.querySelector(".hero-video");

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
            `${letters.length * 0.05}s`;

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


    // Запускаем видео заранее.
    // Пользователь уже нажал кнопку, поэтому это действие
    // разрешено мобильным браузером.
    heroVideo.play().catch((error) => {
        console.log("Видео не запустилось:", error);
    });


    // Небольшая пауза перед началом написания
    setTimeout(() => {

        envelopeScreen.classList.add("writing");


        // ========================================
        // ПИШЕМ ДАТУ
        // ========================================

        dateLetters.forEach((letter) => {
            letter.style.animationPlayState = "running";
        });


        // Сколько длится написание даты
        const dateDuration =
            dateLetters.length * 120 + 300;


        // ========================================
        // ПОТОМ ПИШЕМ ИМЕНА
        // ========================================

        setTimeout(() => {

            nameLetters.forEach((letter) => {
                letter.style.animationPlayState = "running";
            });


            // Сколько длится написание имён
            const namesDuration =
                nameLetters.length * 120 + 500;


            // ========================================
            // ПОСЛЕ ОКОНЧАНИЯ ВСЕГО ТЕКСТА
            // ПЕРЕХОДИМ К ПРИГЛАШЕНИЮ
            // ========================================

            setTimeout(() => {

                envelopeScreen.classList.add("hide");

            }, namesDuration);


        }, dateDuration);


    }, 300);

});