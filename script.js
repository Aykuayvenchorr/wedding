
 // ========================================
 // АНИМАЦИЯ ПОЯВЛЕНИЯ СЕКЦИЙ
 // ========================================

const blocks = document.querySelectorAll(".fade-in");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    });

    blocks.forEach((block) => observer.observe(block));
} else {
    blocks.forEach((block) => block.classList.add("visible"));
}


// ========================================
// КОНВЕРТ И ПЕРСОНАЛЬНЫЕ ИМЕНА
// ========================================

const envelopeScreen = document.querySelector("#envelopeScreen");
const guestNamesElement = document.querySelector("#guest-names");
const letterNames = document.querySelector(".letter-names");
const heroVideo = document.querySelector(".hero-video");

// Коды гостей и имена для отображения на конверте
const envelopeGuests = {
    "nikita-yuliya": "Никита\nи\nЮлия",
    "nikita-kate": "Никита\nи\nЕкатерина",
    "ayrat-diana": "Айрат\nи\nДиана",
    "zyuzya": "Дмитрий",
    "ilya-sasha": "Илья\nи\nАлександра",
    "viktor-kate": "Виктор\nи\nЕкатерина",
    "sasha-lera": "Александр\nи\nВалерия",
    "igor-margo": "Игорь\nи\nМаргарита",
    "dan-liza": "Даниил\nи\nЕлизавета",
    "family-shev": "Сергей\nи\nОльга",
    "family-ovch": "Иван\nи\nЛюдмила",
    "nat-sasha": "Александр\nи\nНаталия",
    "irina": "Ирина",
    "grig": "Григорий",
    "zaur": "Заур",
    "natalya": "Наталья",
    "alexey-darya": "Алексей\nи\nДарья",
    "artem-marina": "Артем\nи\nМарина",
    "alex-kate": "Александр\nи\nЕкатерина",
    "sergey-kseniya": "Сергей\nи\nКсения"
};

// Получаем код приглашения из адреса страницы
const inviteParams = new URLSearchParams(window.location.search);
const inviteCode = inviteParams.get("invite");

// Подставляем имена до запуска анимации
if (
    guestNamesElement &&
    inviteCode &&
    Object.prototype.hasOwnProperty.call(envelopeGuests, inviteCode)
) {
    guestNamesElement.textContent = envelopeGuests[inviteCode];
}


// ========================================
// ПОДГОТОВКА ЭФФЕКТА РУКОПИСНОГО ТЕКСТА
// ========================================

function prepareHandwriting(element) {
    if (!element) {
        return [];
    }

    const text = element.textContent.trim();
    element.replaceChildren();

    const letters = [];

    [...text].forEach((character) => {
        // Сохраняем переносы строк между именами
        if (character === "\n") {
            element.appendChild(document.createElement("br"));
            return;
        }

        const span = document.createElement("span");

        if (character === " ") {
            span.innerHTML = "&nbsp;";
        } else {
            span.textContent = character;
        }

        span.style.animationDelay = `${letters.length * 0.05}s`;
        span.style.animationPlayState = "paused";

        element.appendChild(span);
        letters.push(span);
    });

    return letters;
}

// Сначала готовим персональные имена гостей,
// затем имена жениха и невесты
const guestLetters = prepareHandwriting(guestNamesElement);
const nameLetters = prepareHandwriting(letterNames);


// ========================================
// КЛИК ПО КОНВЕРТУ
// ========================================

if (envelopeScreen) {
    envelopeScreen.addEventListener("click", () => {
        // Не запускаем анимацию повторно
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

        // Начинаем эффект написания
        setTimeout(() => {
            envelopeScreen.classList.add("writing");

            // Этап 1: пишутся имена гостей
            guestLetters.forEach((letter) => {
                letter.style.animationPlayState = "running";
            });

            const guestDuration = guestLetters.length * 50 + 700;

            // Этап 2: пишутся имена пары
            setTimeout(() => {
                nameLetters.forEach((letter) => {
                    letter.style.animationPlayState = "running";
                });

                const namesDuration = nameLetters.length * 50 + 700;

                // Этап 3: скрываем конверт
                setTimeout(() => {
                    envelopeScreen.classList.add("hide");
                }, namesDuration);

            }, guestDuration);

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

    const attendanceNone = document.querySelector("#attendance-none");


    // ========================================
    // СООБЩЕНИЯ ФОРМЫ
    // ========================================

    function hideRsvpMessage() {
        if (!rsvpMessage) return;

        rsvpMessage.hidden = true;
        rsvpMessage.textContent = "";
        rsvpMessage.classList.remove("success", "error");
    }


    // ========================================
    // СПИСОК СОПРОВОЖДАЮЩИХ
    // ========================================

    function updateCompanionsJson() {
        if (!companionsList || !companionsJson) return;

        const rows = companionsList.querySelectorAll(
            ".companion-row"
        );

        const companions = Array.from(rows)
            .map((row) => {
                const nameInput = row.querySelector(".companion-input");
                const categorySelect = row.querySelector(".companion-category");

                return {
                    name: nameInput ? nameInput.value.trim() : "",
                    category: categorySelect ? categorySelect.value : ""
                };
            })
            .filter((person) => person.name !== "");

        companionsJson.value = JSON.stringify(companions);
    }


    // ========================================
    // ВЫБОР СОБЫТИЙ
    // ========================================

    function updateAttendance() {
        const selectedOptions = Array.from(attendanceOptions)
            .filter((option) => option.checked);

        const isAttending = selectedOptions.some(
            (option) => option.value !== "Не смогу прийти"
        );

        if (companionsSection) {
            companionsSection.hidden = !isAttending;
        }

        if (!isAttending && companionsList) {
            companionsList.replaceChildren();
            updateCompanionsJson();
        }

        hideRsvpMessage();
    }

    attendanceOptions.forEach((option) => {
        option.addEventListener("change", () => {
            // При отказе снимаем выбор всех событий
            if (option === attendanceNone && option.checked) {
                attendanceOptions.forEach((item) => {
                    if (item !== attendanceNone) {
                        item.checked = false;
                    }
                });
            } else if (option.checked && attendanceNone) {
                // При выборе события снимаем отказ
                attendanceNone.checked = false;
            }

            updateAttendance();
        });
    });


    // ========================================
    // ДОБАВЛЕНИЕ СОПРОВОЖДАЮЩЕГО
    // ========================================

    function addCompanionField() {
        if (!companionsList) return;

        const row = document.createElement("div");
        row.className = "companion-row";

        // Поле имени
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

        nameInput.addEventListener("input", updateCompanionsJson);
        categorySelect.addEventListener("change", updateCompanionsJson);

        removeButton.addEventListener("click", () => {
            row.remove();
            updateCompanionsJson();
        });

        row.append(nameInput, categorySelect, removeButton);
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

        // Проверяем выбор варианта присутствия
        if (selectedOptions.length === 0) {
            if (rsvpMessage) {
                rsvpMessage.textContent =
                    "Пожалуйста, выберите хотя бы один вариант присутствия.";

                rsvpMessage.classList.add("error");
                rsvpMessage.hidden = false;
            }

            return;
        }

        const isAttending = selectedOptions.some(
            (option) => option.value !== "Не смогу прийти"
        );

        // Проверяем, что все добавленные имена заполнены
        if (isAttending && companionsList) {
            const inputs = companionsList.querySelectorAll(
                ".companion-input"
            );

            const hasEmptyName = Array.from(inputs).some(
                (input) => input.value.trim() === ""
            );

            if (hasEmptyName) {
                if (rsvpMessage) {
                    rsvpMessage.textContent =
                        "Заполните имя каждого сопровождающего или удалите пустое поле.";

                    rsvpMessage.classList.add("error");
                    rsvpMessage.hidden = false;
                }

                return;
            }
        }

        // Обновляем данные перед отправкой
        updateCompanionsJson();

        if (rsvpSubmitButton) {
            rsvpSubmitButton.disabled = true;
            rsvpSubmitButton.textContent = "Отправляем...";
        }

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

            if (companionsList) {
                companionsList.replaceChildren();
            }

            updateCompanionsJson();

            if (companionsSection) {
                companionsSection.hidden = true;
            }

            if (rsvpMessage) {
                rsvpMessage.textContent =
                    "Спасибо за ответ! Мы получили ваше сообщение.";

                rsvpMessage.classList.add("success");
                rsvpMessage.hidden = false;
            }

            if (rsvpSubmitButton) {
                rsvpSubmitButton.textContent = "Ответ отправлен";
            }

        } catch (error) {
            console.error("Ошибка отправки RSVP:", error);

            if (rsvpMessage) {
                rsvpMessage.textContent =
                    "Не удалось отправить ответ. Проверьте интернет-соединение и попробуйте ещё раз.";

                rsvpMessage.classList.add("error");
                rsvpMessage.hidden = false;
            }

            if (rsvpSubmitButton) {
                rsvpSubmitButton.textContent = "Попробовать снова";
            }

        } finally {
            if (rsvpSubmitButton) {
                rsvpSubmitButton.disabled = false;
            }
        }
    });
}
