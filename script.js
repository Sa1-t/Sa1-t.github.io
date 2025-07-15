const el = document.getElementById("typewriter");
const text =
    "A senior high school student > w<";
let i = 0;

setTimeout(() => {
    setInterval(() => {
        if (i < text.length) {
            el.textContent += text[i++];
        }
    }, 50);
}, 1500);
