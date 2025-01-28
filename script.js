const statusText = document.getElementById("status-text");
const texts = ["我有退嗎?沒有", "為什麼這樣算我輸", "有沒有邏輯阿"];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
function typeText() {
  const currentText = texts[textIndex];
  if (!isDeleting) {
    statusText.textContent = currentText.slice(0, charIndex);
    charIndex++;
    if (charIndex > currentText.length) {
      isDeleting = true;
      setTimeout(typeText, 1000);
    } else setTimeout(typeText, 100);
  } else {
    statusText.textContent = currentText.slice(0, charIndex);
    charIndex--;
    if (charIndex < 0) {
      isDeleting = false
      textIndex = (textIndex + 1) % texts.length;
      charIndex = 0;
      setTimeout(typeText, 500);
    } else setTimeout(typeText, 50);
  }
}
typeText();