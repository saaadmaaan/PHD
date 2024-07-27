// Selecting elements
const playButton = document.getElementById('playButton');
const bouncingText = document.getElementById('bouncingText');
const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');
const backgroundMusic = document.getElementById('backgroundMusic');

let circle = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    radius: 100
};

let audioContext, analyser, dataArray;

// Resizing canvas to fit the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Function to start the music and animations
function startMusic() {
    console.log("Play button clicked");
    setupAudioContext();
    backgroundMusic.play().then(() => {
        console.log("Music started");
        playButton.style.display = 'none';
        animate();
    }).catch(error => {
        console.error("Error playing music:", error);
    });
}

// Setup Web Audio API
function setupAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(backgroundMusic);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
}

// Function to get the audio frequency data
function getAudioData() {
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    return sum / dataArray.length;
}

// Bouncing circle animation
function animateCircle(audioData) {
    const spikeHeight = audioData * 0.5; // Adjust the multiplier as needed
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
    ctx.strokeStyle = 'rgba(0, 255, 153, 0.7)';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();

    const spikes = 50;
    const step = Math.PI * 2 / spikes;
    ctx.beginPath();
    for (let i = 0; i < spikes; i++) {
        const theta = i * step;
        const x = circle.x + (circle.radius + spikeHeight) * Math.cos(theta);
        const y = circle.y + (circle.radius + spikeHeight) * Math.sin(theta);
        ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(0, 255, 153, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Bouncing text animation
function animateText(audioData) {
    const bounceHeight = audioData * 0.5; // Adjust the multiplier as needed
    bouncingText.style.transform = `translateY(${bounceHeight}px)`;
}

// Main animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const audioData = getAudioData();
    animateCircle(audioData);
    animateText(audioData);
    requestAnimationFrame(animate);
}

// Event listener for the play button
playButton.addEventListener('click', () => {
    // Resuming AudioContext is required due to some browser's autoplay policies
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            startMusic();
        });
    } else {
        startMusic();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    circle.x = window.innerWidth / 2;
    circle.y = window.innerHeight / 2;
});
