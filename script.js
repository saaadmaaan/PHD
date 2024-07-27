// script.js
document.querySelector('.text').addEventListener('click', () => {
    const textElement = document.querySelector('.text');
    textElement.style.animation = 'none';
    textElement.offsetHeight; /* trigger reflow */
    textElement.style.animation = '';
    textElement.style.animation = 'jump 3s ease-in-out infinite';
    
});
