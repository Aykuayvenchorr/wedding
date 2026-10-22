// ========================================
// АНИМАЦИЯ ПОЯВЛЕНИЯ СЕКЦИЙ
// ========================================

const blocks = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
});

blocks.forEach((block) => {
    observer.observe(block);
});


// ========================================
// КОНВЕРТ
// ========================================

const envelopeScreen = document.querySelector("#envelopeScreen");
const letterDate = document.querySelector(".letter-date");
const letterNames = document.querySelector(".letter-names");
const heroVideo = document.querySelector(".hero-video");


// ========================================
// ПОДГОТОВКА ТЕКСТА
// ========================================

function prepareHandwriting(element) {
    if (!element) {
        return [];
    }

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

        span.style.animationDelay =
            `${letters.length * 0.05}s`;

        span.style.animationPlayState = "paused";

        element.appendChild(span);
        letters.push(span);
    });

    return letters;
}

const dateLetters = prepareHandwriting(letterDate);
const nameLetters = prepareHandwriting(letterNames);


// ========================================
// КЛИК ПО КОНВЕРТУ
// ========================================

if (envelopeScreen) {
    envelopeScreen.addEventListener("click", () => {
        if (envelopeScreen.classList.contains("opened")) {
            return;
        }

        envelopeScreen.classList.add("opened");

        // Запускаем видео приглашения
        if (heroVideo) {
            heroVideo.muted = true;

            heroVideo.play().catch((error) => {
                console.log("Видео не запустилось:", error);
            });
        }

        // Начинаем анимацию написания
        setTimeout(() => {
            envelopeScreen.classList.add("writing");

            dateLetters.forEach((letter) => {
                letter.style.animationPlayState = "running";
            });

            const dateDuration =
                dateLetters.length * 50 + 100;

            setTimeout(() => {
                nameLetters.forEach((letter) => {
                    letter.style.animationPlayState = "running";
                });

                const namesDuration =
                    nameLetters.length * 50 + 700;

                setTimeout(() => {
                    envelopeScreen.classList.add("hide");
                }, namesDuration);

            }, dateDuration);

        }, 200);
    });
}


// ========================================
// ФОРМА RSVP — FORMSPREE
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
    // СООБЩЕНИЯ ФОРМЫ
    // ========================================

    function hideRsvpMessage() {
        rsvpMessage.hidden = true;
        rsvpMessage.textContent = "";
        rsvpMessage.classList.remove("success", "error");
    }


    // ========================================
    // ОБНОВЛЕНИЕ СПИСКА СОПРОВОЖДАЮЩИХ
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
                    name,
                    category
                };
            })
            .filter((person) => person.name !== "");

        companionsJson.value = JSON.stringify(companions);
    }


    // ========================================
    // ВЫБОР СОБЫТИЙ И СОПРОВОЖДАЮЩИЕ
    // ========================================

    const attendanceNone = document.querySelector("#attendance-none");

    function updateAttendance() {
        const selectedOptions = Array.from(attendanceOptions)
            .filter((option) => option.checked);

        const isAttending = selectedOptions.some(
            (option) => option.value !== "Не смогу прийти"
        );

        companionsSection.hidden = !isAttending;

        if (!isAttending) {
            companionsList.replaceChildren();
            updateCompanionsJson();
        }

        hideRsvpMessage();
    }

    attendanceOptions.forEach((option) => {
        option.addEventListener("change", () => {
            // Отказ исключает выбор любых событий
            if (option === attendanceNone && option.checked) {
                attendanceOptions.forEach((item) => {
                    if (item !== attendanceNone) {
                        item.checked = false;
                    }
                });
            } else if (option.checked && attendanceNone) {
                // Выбрано событие — снимаем отказ
                attendanceNone.checked = false;
            }

            updateAttendance();
        });
    });


    // ========================================
    // ДОБАВЛЕНИЕ СОПРОВОЖДАЮЩЕГО
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

        nameInput.addEventListener(
            "input",
            updateCompanionsJson
        );

        categorySelect.addEventListener(
            "change",
            updateCompanionsJson
        );

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
        hideRsvpMessage();

        nameInput.focus();
    }

    if (addCompanionButton) {
        addCompanionButton.addEventListener(
            "click",
            addCompanionField
        );
    }


    // ========================================
    // ОТПРАВКА ФОРМЫ
    // ========================================

    rsvpForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        hideRsvpMessage();


        const selectedOptions = Array.from(attendanceOptions)
            .filter((option) => option.checked);

        if (selectedOptions.length === 0) {
            rsvpMessage.textContent =
                "Пожалуйста, выберите хотя бы один вариант присутствия.";

            rsvpMessage.classList.add("error");
            rsvpMessage.hidden = false;

            return;
        }

        // Проверяем заполнение имён сопровождающих
        const isAttending = selectedOptions.some(
            (option) => option.value !== "Не смогу прийти"
        );


        if (isAttending) {
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

        // Обновляем JSON перед отправкой
        updateCompanionsJson();

        rsvpSubmitButton.disabled = true;
        rsvpSubmitButton.textContent = "Отправляем...";

        try {
            const response = await fetch(rsvpForm.action, {
                method: "POST",
                body: new FormData(rsvpForm),
                headers: {
                    Accept: "application/json"
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