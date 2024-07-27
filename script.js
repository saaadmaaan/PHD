// Selecting elements
const playButton = document.getElementById('playButton');
const backgroundMusic = document.getElementById('backgroundMusic');
const helloText = document.getElementById('helloText');

let audioContext, analyser, dataArray;
let textAngle = 0;

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

// Setup Web Audio API
function setupAudioContext() {
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

// Function to get the audio frequency data
function getAudioData() {
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    return sum / dataArray.length;
}

// Spinning text animation
function animateText() {
    const audioData = getAudioData();
    textAngle += 0.02; // Adjust the rotation speed

    // Update text rotation
    helloText.style.transform = `translate(-50%, -50%) rotate(${textAngle}rad)`;
}

// Main animation loop
function animate() {
    animateText();
    requestAnimationFrame(animate);
}

// Try to autoplay music
startMusic();

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
