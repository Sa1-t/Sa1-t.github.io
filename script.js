document.addEventListener("DOMContentLoaded", () => {
    const bgm = document.getElementById("bgm");
    const rickBgm = document.getElementById("rick-bgm"); 
    const musicBtn = document.getElementById("music-btn");
    const musicIcon = musicBtn.querySelector("i");
    const musicTooltip = document.getElementById("music-tooltip");
    const rickBtn = document.getElementById("rick-roll-btn"); 
    const typewriterEl = document.getElementById("typewriter");
    const contactForm = document.querySelector(".contact-form");
    const originalTitle = document.title;

    let isPlaying = false,
        isRickRolling = false,
        typingTimer = null;

    const i18n = {
        en: {
            nav_home: "Home",
            nav_contact: "Contact",
            greeting: "Hey there! I'm",
            description:
                "A high school student with an interest in Computer Science",
            contact_title: "Let's Connect",
            contact_sub: "Have a project in mind or just want to chat?",
            form_name: "Name",
            form_email: "Email Address",
            form_message: "What's on your mind? 0.o",
            form_send: "Send Message",
            form_sending: "Sending...",
            form_success: "Sent Successfully!",
            music_play: "Click to Play",
            music_playing: "Now Playing: Denzel Curry - Walkin",
            words: [
                "'Nakiri-gumi'",
                "'If i ever play <span class=\"icon-valorant\"></span> again, i am dog'",
                "'rrrrrrrrrrrrr'",
            ],
        },
        zh: {
            nav_home: "首頁",
            nav_contact: "聯繫",
            greeting: "嗨，我是",
            description: "對資訊領域有興趣的高二學生。",
            contact_title: "與我聯繫",
            contact_sub: "有任何想法或想單純打個招呼嗎？",
            form_name: "姓名",
            form_email: "電子郵件",
            form_message: "想對我說什麼？ 0.o",
            form_send: "送出訊息",
            form_sending: "傳送中...",
            form_success: "已成功送出！",
            music_play: "點擊播放音樂",
            music_playing: "正在播放: Denzel Curry - Walkin",
            words: [
                "'百鬼組'",
                "'再玩一次 <span class=\"icon-valorant\"></span> 我就是狗'",
                "'rrrrrrrrrrrrr'",
            ],
        },
    };

    let lang = localStorage.getItem("lang") || "en",
        wordIdx = 0,
        charIdx = 0,
        isDeleting = false;

    document.addEventListener("visibilitychange", () => {
        document.title = document.hidden
            ? "Where are u going... "
            : originalTitle;
    });

    const playAudio = () => {
        if (isPlaying && !isRickRolling) return;

        // 停止 Rick Roll
        rickBgm.pause();
        rickBgm.currentTime = 0;
        isRickRolling = false;
        musicIcon.classList.remove("rick-orange");

        bgm.play()
            .then(() => {
                isPlaying = true;
                musicIcon.className =
                    "fa-solid fa-compact-disc spin is-playing";
                musicTooltip.textContent = i18n[lang].music_playing;
                ["click", "touchstart", "scroll"].forEach((e) =>
                    window.removeEventListener(e, playAudio),
                );
            })
            .catch(() => {});
    };

    ["click", "touchstart", "scroll"].forEach((e) =>
        window.addEventListener(e, playAudio),
    );


    musicBtn.onclick = (e) => {
        e.stopPropagation();
        if (isPlaying) {
            bgm.pause();
            rickBgm.pause();
            musicIcon.className = "fa-solid fa-music";
            musicIcon.classList.remove("rick-orange");
            musicTooltip.textContent = i18n[lang].music_play;
            isRickRolling = false;
        } else {
            playAudio();
        }
        isPlaying = !isPlaying;
    };

    if (rickBtn) {
        rickBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            bgm.pause();
            rickBgm.play().then(() => {
                isPlaying = true;
                isRickRolling = true;

                musicIcon.className =
                    "fa-solid fa-compact-disc spin is-playing rick-orange";
                musicTooltip.textContent = "Got you!";
            });
        });
    }

    const type = () => {
        const curWords = i18n[lang].words;
        const fullText = curWords[wordIdx];
        if (isDeleting) {
            if (fullText.substring(0, charIdx).endsWith(">")) {
                charIdx = fullText.substring(0, charIdx).lastIndexOf("<");
            } else {
                charIdx--;
            }
        } else {
            if (fullText.substring(charIdx, charIdx + 1) === "<") {
                charIdx = fullText.indexOf(">", charIdx) + 1;
            } else {
                charIdx++;
            }
        }
        typewriterEl.innerHTML = fullText.slice(0, charIdx);
        let speed = isDeleting ? 40 : 80;
        if (!isDeleting && charIdx === fullText.length) {
            isDeleting = true;
            speed = 1500;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % curWords.length;
            speed = 500;
        }
        typingTimer = setTimeout(type, speed);
    };

    const setLang = (l) => {
        lang = l;
        document
            .querySelectorAll("[data-key]")
            .forEach((el) => (el.textContent = i18n[l][el.dataset.key]));

        if (!isRickRolling) {
            musicTooltip.textContent = isPlaying
                ? i18n[lang].music_playing
                : i18n[lang].music_play;
        }

        localStorage.setItem("lang", l);
        clearTimeout(typingTimer);
        wordIdx = 0;
        charIdx = 0;
        isDeleting = false;
        typewriterEl.innerHTML = "";
        type();
    };
    setLang(lang);
    document.getElementById("lang-btn").onclick = () =>
        setLang(lang === "en" ? "zh" : "en");

    const setTheme = (t) => {
        document.body.setAttribute("data-theme", t);
        document.getElementById("theme-btn").querySelector("i").className =
            t === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
        localStorage.setItem("theme", t);
    };
    setTheme(localStorage.getItem("theme") || "dark");
    document.getElementById("theme-btn").onclick = () =>
        setTheme(document.body.dataset.theme === "dark" ? "light" : "dark");

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector(".submit-btn"),
                btnText = btn.querySelector("span");
            btn.disabled = true;
            btnText.textContent = i18n[lang].form_sending;
            try {
                const res = await fetch(contactForm.action, {
                    method: "POST",
                    body: new FormData(contactForm),
                    headers: { Accept: "application/json" },
                });
                if (res.ok) {
                    btnText.textContent = i18n[lang].form_success;
                    contactForm.reset();
                    setTimeout(() => {
                        btnText.textContent = i18n[lang].form_send;
                        btn.disabled = false;
                    }, 5000);
                } else {
                    throw new Error();
                }
            } catch (err) {
                alert("Oops!");
                btn.disabled = false;
                btnText.textContent = i18n[lang].form_send;
            }
        });
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("scroll-show");
                    if (entry.target.tagName === "SECTION") {
                        document
                            .querySelectorAll(".nav-links a")
                            .forEach((a) =>
                                a.classList.toggle(
                                    "active",
                                    a.getAttribute("href").slice(1) ===
                                        entry.target.id,
                                ),
                            );
                    }
                }
            });
        },
        { threshold: 0.2 },
    );
    document
        .querySelectorAll("section, .scroll-hidden")
        .forEach((el) => observer.observe(el));
});


