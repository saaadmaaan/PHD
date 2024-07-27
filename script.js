// Selecting elements
const playButton = document.getElementById('playButton');
const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');
const backgroundMusic = document.getElementById('backgroundMusic');
const helloText = document.getElementById('helloText');

let audioContext, analyser, dataArray;
let angle = 0;
let textAngle = 0;

// Resizing canvas to fit the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Function to start the music and animations
function startMusic() {
    setupAudioContext();
    backgroundMusic.play().then(() => {
        console.log("Music started");
        playButton.style.display = 'none';
        helloText.style.display = 'block'; // Show text when music starts
        animate();
    }).catch(error => {
        console.error("Error playing music:", error);
        playButton.style.display = 'flex'; // Show play button if autoplay fails
    });
}

// Function to stop the music and hide the text
function stopMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    helloText.style.display = 'none'; // Hide text when music stops
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

// Rotating disc visualizer
function drawVisualizer(audioData) {
    const spikeHeight = audioData * 2; // Adjust the multiplier as needed
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw rotating disc
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);

    const gradient = ctx.createRadialGradient(0, 0, radius / 2, 0, 0, radius);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.7)');
    gradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.7)');
    gradient.addColorStop(1, 'rgba(0, 0, 255, 0.7)');

    ctx.beginPath();
    ctx.arc(0, 0, radius + spikeHeight, 0, Math.PI * 2, false);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();

    ctx.restore();

    // Increase the angle for spinning effect
    angle += 0.01;
}

// Spinning text animation
function animateText() {
    textAngle += 0.02; // Adjust the rotation speed

    // Update text rotation
    helloText.style.transform = `translate(-50%, -50%) rotate(${textAngle}rad)`;
}

// Main animation loop
function animate() {
    const audioData = getAudioData();
    drawVisualizer(audioData);
    animateText();
    requestAnimationFrame(animate);
}

// Try to autoplay music
startMusic();

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
});
