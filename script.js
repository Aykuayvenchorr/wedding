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

const envelopeScreen =
    document.querySelector("#envelopeScreen");

const openInvitation =
    document.querySelector("#openInvitation");


openInvitation.addEventListener("click", () => {

    envelopeScreen.classList.add("opened");

});