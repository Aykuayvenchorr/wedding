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

        heroVideo.muted = true;

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


// ========================================
// ФОРМА RSVP — ОТПРАВКА ЧЕРЕЗ FORMSPREE
// ========================================

const rsvpForm = document.querySelector("#rsvp-form");

if (rsvpForm) {

    const attendanceOptions = document.querySelectorAll(
        'input[name="Присутствие"]'
    );

    const companionsSection = document.querySelector(
        "#companions-section"
    );

    const companionsList = document.querySelector(
        "#companions-list"
    );

    const companionsJson = document.querySelector(
        "#companions-json"
    );

    const addCompanionButton = document.querySelector(
        "#add-companion"
    );

    const rsvpMessage = document.querySelector(
        "#rsvp-message"
    );

    const rsvpSubmitButton = document.querySelector(
        "#rsvp-submit"
    );


    // ========================================
    // ПОКАЗЫВАЕМ ИЛИ СКРЫВАЕМ СОПРОВОЖДАЮЩИХ
    // ========================================

    function updateAttendance() {

        const selected = document.querySelector(
            'input[name="Присутствие"]:checked'
        );

        const isAttending =
            selected && selected.value === "Буду";

        companionsSection.hidden = !isAttending;

        if (!isAttending) {
            companionsList.replaceChildren();
            updateCompanionsJson();
        }

        hideRsvpMessage();
    }


    attendanceOptions.forEach((option) => {
        option.addEventListener("change", updateAttendance);
    });


    // ========================================
    // ПРЯЧЕМ СООБЩЕНИЕ
    // ========================================

    function hideRsvpMessage() {
        rsvpMessage.hidden = true;
        rsvpMessage.textContent = "";
        rsvpMessage.classList.remove("success", "error");
    }


    // ========================================
    // СОХРАНЯЕМ СОПРОВОЖДАЮЩИХ В JSON
    // ========================================

    function updateCompanionsJson() {

        const rows = companionsList.querySelectorAll(
            ".companion-row"
        );

        const companions = Array.from(rows)
            .map((row) => {

                const name = row.querySelector(
                    ".companion-input"
                ).value.trim();

                const category = row.querySelector(
                    ".companion-category"
                ).value;

                return {
                    name: name,
                    category: category
                };

            })
            .filter((person) => person.name !== "");

        companionsJson.value = JSON.stringify(companions);
    }


    // ========================================
    // ДОБАВЛЯЕМ СОПРОВОЖДАЮЩЕГО
    // ========================================

    function addCompanionField() {

        const row = document.createElement("div");
        row.className = "companion-row";

        // Имя и фамилия
        const nameInput = document.createElement("input");

        nameInput.type = "text";
        nameInput.className = "companion-input";
        nameInput.placeholder = "Имя и фамилия";

        nameInput.setAttribute(
            "aria-label",
            "Имя и фамилия сопровождающего"
        );


        // Категория гостя
        const categorySelect = document.createElement("select");

        categorySelect.className = "companion-category";

        categorySelect.setAttribute(
            "aria-label",
            "Категория гостя"
        );

        const adultOption = document.createElement("option");

        adultOption.value = "Взрослый";
        adultOption.textContent = "Взрослый";

        const childOption = document.createElement("option");

        childOption.value = "Ребёнок";
        childOption.textContent = "Ребёнок";

        categorySelect.append(adultOption, childOption);


        // Кнопка удаления
        const removeButton = document.createElement("button");

        removeButton.type = "button";
        removeButton.className = "rsvp-remove-button";
        removeButton.textContent = "×";

        removeButton.setAttribute(
            "aria-label",
            "Удалить сопровождающего"
        );


        // Обновляем данные при изменении полей
        nameInput.addEventListener(
            "input",
            updateCompanionsJson
        );

        categorySelect.addEventListener(
            "change",
            updateCompanionsJson
        );


        // Удаляем гостя
        removeButton.addEventListener("click", () => {

            row.remove();
            updateCompanionsJson();

        });


        row.append(
            nameInput,
            categorySelect,
            removeButton
        );

        companionsList.appendChild(row);

        updateCompanionsJson();

        nameInput.focus();
    }


    addCompanionButton.addEventListener(
        "click",
        addCompanionField
    );


    // ========================================
    // ОТПРАВКА ФОРМЫ
    // ========================================

    rsvpForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        hideRsvpMessage();

        const selected = document.querySelector(
            'input[name="Присутствие"]:checked'
        );

        if (!selected) {
            return;
        }


        // Проверяем, что у каждого добавленного гостя
        // заполнено имя
        if (selected.value === "Буду") {

            const inputs = companionsList.querySelectorAll(
                ".companion-input"
            );

            const hasEmptyName = Array.from(inputs).some(
                (input) => input.value.trim() === ""
            );

            if (hasEmptyName) {

                rsvpMessage.textContent =
                    "Заполните имя каждого сопровождающего или удалите пустое поле.";

                rsvpMessage.classList.add("error");
                rsvpMessage.hidden = false;

                return;
            }

        }


        // Обновляем список перед отправкой
        updateCompanionsJson();


        // Блокируем кнопку на время отправки
        rsvpSubmitButton.disabled = true;
        rsvpSubmitButton.textContent = "Отправляем...";


        try {

            const response = await fetch(rsvpForm.action, {

                method: "POST",

                body: new FormData(rsvpForm),

                headers: {
                    "Accept": "application/json"
                }

            });


            if (!response.ok) {
                throw new Error("Ошибка отправки формы");
            }


            // Очищаем форму после успешной отправки
            rsvpForm.reset();

            companionsList.replaceChildren();

            updateCompanionsJson();

            companionsSection.hidden = true;


            // Показываем подтверждение
            rsvpMessage.textContent =
                "Спасибо за ответ! Мы получили ваше сообщение.";

            rsvpMessage.classList.add("success");
            rsvpMessage.hidden = false;

            rsvpSubmitButton.textContent = "Ответ отправлен";


        } catch (error) {

            console.error("Ошибка отправки RSVP:", error);

            rsvpMessage.textContent =
                "Не удалось отправить ответ. Проверьте интернет-соединение и попробуйте ещё раз.";

            rsvpMessage.classList.add("error");
            rsvpMessage.hidden = false;

            rsvpSubmitButton.textContent = "Попробовать снова";


        } finally {

            rsvpSubmitButton.disabled = false;

        }

    });

}