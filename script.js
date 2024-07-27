// Selecting elements
const playButton = document.getElementById('playButton');
const backgroundVideo = document.getElementById('backgroundVideo');
const backgroundMusic = document.getElementById('backgroundMusic');
const elts = {
    text1: document.getElementById('text1'),
    text2: document.getElementById('text2')
};

const texts = [
    "Fuck",
    "You"
];

const morphTime = 5; // Increase morph time to slow down the effect
const cooldownTime = 0.5;

let textIndex = texts.length - 1;
let time = new Date();
let morph = 0;
let cooldown = cooldownTime;

elts.text1.textContent = texts[textIndex % texts.length];
elts.text2.textContent = texts[(textIndex + 1) % texts.length];

function doMorph() {
    morph -= cooldown;
    cooldown = 0;

    let fraction = morph / morphTime;

    if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
    }

    setMorph(fraction);
}

function setMorph(fraction) {
    elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    fraction = 1 - fraction;
    elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    elts.text1.textContent = texts[textIndex % texts.length];
    elts.text2.textContent = texts[(textIndex + 1) % texts.length];
}

function doCooldown() {
    morph = 0;

    elts.text2.style.filter = "";
    elts.text2.style.opacity = "100%";

    elts.text1.style.filter = "";
    elts.text1.style.opacity = "0%";
}

function animate() {
    requestAnimationFrame(animate);

    let newTime = new Date();
    let shouldIncrementIndex = cooldown > 0;
    let dt = (newTime - time) / 1000;
    time = newTime;

    cooldown -= dt;

    if (cooldown <= 0) {
        if (shouldIncrementIndex) {
            textIndex++;
        }

        doMorph();
    } else {
        doCooldown();
    }
}

animate();

// Function to start the music and animations
function startMusic() {
    console.log('Attempting to start music');
    setupAudioContext();
    backgroundMusic.play().then(() => {
        console.log("Music started");
        backgroundVideo.play(); // Ensure video plays
        playButton.style.display = 'none';
        document.getElementById('container').style.display = 'block'; // Show text container when music starts
    }).catch(error => {
        console.error("Error playing music:", error);
        playButton.style.display = 'flex'; // Show play button if autoplay fails
    });
}

// Setup Web Audio API
let audioContext, analyser, dataArray;

function setupAudioContext() {
    console.log('Setting up audio context');
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(backgroundMusic);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }
}

// Try to autoplay music
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, trying to start music');
    startMusic();
});

// Event listener for the play button
playButton.addEventListener('click', () => {
    console.log('Play button clicked');
    setupAudioContext();
    // Resuming AudioContext is required due to some browser's autoplay policies
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('Audio context resumed');
            startMusic();
        });
    } else {
        startMusic();
    }
});
