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

        // Задержка между буквами
        span.style.animationDelay =
            `${letters.length * 0.05}s`;

        // Пока текст не пишется
        span.style.animationPlayState = "paused";

        element.appendChild(span);

        letters.push(span);
    });

    return letters;
}


// Запоминаем буквы
const dateLetters =
    prepareHandwriting(letterDate);

const nameLetters =
    prepareHandwriting(letterNames);


// ========================================
// КЛИК ПО ЭКРАНУ
// ========================================

envelopeScreen.addEventListener("click", () => {

    // Не даём запустить анимацию повторно
    if (envelopeScreen.classList.contains("opened")) {
        return;
    }


    // ========================================
    // ОСТАНАВЛИВАЕМ КОНВЕРТ
    // ========================================

    envelopeScreen.classList.add("opened");


    // ========================================
    // ЗАПУСКАЕМ ВИДЕО ОСНОВНОГО ПРИГЛАШЕНИЯ
    // ========================================

    if (heroVideo) {

        heroVideo.play().catch((error) => {
            console.log("Видео не запустилось:", error);
        });

    }


    // ========================================
    // НАЧИНАЕМ ПИСАТЬ
    // ========================================

    setTimeout(() => {

        envelopeScreen.classList.add("writing");


        // ====================================
        // ДАТА
        // ====================================

        dateLetters.forEach((letter) => {
            letter.style.animationPlayState = "running";
        });


        // Длительность написания даты
        const dateDuration =
            dateLetters.length * 50 + 100;


        // ====================================
        // ИМЕНА
        // ====================================

        setTimeout(() => {

            nameLetters.forEach((letter) => {
                letter.style.animationPlayState = "running";
            });


            // Небольшая пауза после написания
            const namesDuration =
                nameLetters.length * 50 + 700;


            // ====================================
            // ОТКРЫВАЕМ ОСНОВНОЕ ПРИГЛАШЕНИЕ
            // ====================================

            setTimeout(() => {

                envelopeScreen.classList.add("hide");

            }, namesDuration);


        }, dateDuration);


    }, 200);

});