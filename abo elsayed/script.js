const root = document.documentElement;
        const navLinks = document.getElementById("navLinks");
        const menuToggle = document.getElementById("menuToggle");
        const themeToggle = document.getElementById("themeToggle");
        const savedTheme = localStorage.getItem("portfolio-theme");

        if (savedTheme) {
            root.dataset.theme = savedTheme;
            themeToggle.innerHTML = savedTheme === "dark"
                ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
                : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
        }

        menuToggle.addEventListener("click", () => {
            const open = navLinks.classList.toggle("is-open");
            menuToggle.setAttribute("aria-expanded", String(open));
        });

        navLinks.addEventListener("click", (event) => {
            if (event.target.matches("a")) {
                navLinks.classList.remove("is-open");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });

        themeToggle.addEventListener("click", () => {
            const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
            root.dataset.theme = nextTheme;
            localStorage.setItem("portfolio-theme", nextTheme);
            themeToggle.innerHTML = nextTheme === "dark"
                ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
                : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("in-view");
                const counter = entry.target.querySelector("[data-count]");
                if (counter && !counter.dataset.done) {
                    counter.dataset.done = "true";
                    animateCounter(counter);
                }
            });
        }, { threshold: 0.18 });

        document.querySelectorAll(".reveal, .panel").forEach((element) => observer.observe(element));

        function animateCounter(element) {
            const target = Number(element.dataset.count);
            const duration = 1000;
            const start = performance.now();
            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const current = Math.floor(progress * target);
                element.textContent = `${current}+`;
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        }

        const modalTriggers = document.querySelectorAll("[data-modal]");
        const modals = document.querySelectorAll(".modal");
        let lastFocusedElement = null;

        modalTriggers.forEach((trigger) => {
            trigger.addEventListener("click", () => openModal(trigger.dataset.modal));
        });

        modals.forEach((modal) => {
            modal.addEventListener("click", (event) => {
                if (event.target === modal || event.target.closest(".modal-close")) closeModal(modal);
            });
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                const openModalElement = document.querySelector(".modal.is-open");
                if (openModalElement) closeModal(openModalElement);
            }
        });

        function openModal(id) {
            const modal = document.getElementById(id);
            if (!modal) return;
            lastFocusedElement = document.activeElement;
            modal.classList.add("is-open");
            document.body.style.overflow = "hidden";
            modal.querySelector(".modal-close").focus();
        }

        function closeModal(modal) {
            modal.classList.remove("is-open");
            document.body.style.overflow = "";
            if (lastFocusedElement) lastFocusedElement.focus();
        }

        const contactForm = document.getElementById("contactForm");
        const toast = document.getElementById("toast");
        let toastTimeout;

        if (contactForm) {
            contactForm.addEventListener("submit", function (e) {
                e.preventDefault();

                if (toast) {
                    toast.classList.add("show");
                    clearTimeout(toastTimeout);
                    toastTimeout = setTimeout(() => {
                        toast.classList.remove("show");
                    }, 4000);
                }

                contactForm.reset();
            });
        }
