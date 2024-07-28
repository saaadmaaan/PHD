// Selecting elements
const playButton = document.getElementById('playButton');
const backgroundVideo = document.getElementById('backgroundVideo');
const textVideo = document.getElementById('textVideo');

function startVideo() {
    console.log('Attempting to start video');
    backgroundVideo.play().then(() => {
        console.log("Video started");
        textVideo.play(); // Ensure text video plays
        playButton.style.display = 'none';
        document.getElementById('video-text-container').style.display = 'flex'; // Show text container when video starts
    }).catch(error => {
        console.error("Error playing video:", error);
        playButton.style.display = 'flex'; // Show play button if autoplay fails
    });
}

// Try to autoplay video
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, trying to start video');
    startVideo();
});

// Event listener for the play button
playButton.addEventListener('click', () => {
    console.log('Play button clicked');
    startVideo();
});
