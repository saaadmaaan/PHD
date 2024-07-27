// Selecting elements
const playButton = document.getElementById('playButton');
const backgroundVideo = document.getElementById('backgroundVideo');
const backgroundMusic = document.getElementById('backgroundMusic');
const helloText = document.getElementById('helloText');

let audioContext, analyser, dataArray;

// Function to start the music and animations
function startMusic() {
    setupAudioContext();
    backgroundMusic.play().then(() => {
        console.log("Music started");
        backgroundVideo.play(); // Ensure video plays
        playButton.style.display = 'none';
        helloText.style.display = 'block'; // Show text when music starts
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
