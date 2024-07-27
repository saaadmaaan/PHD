window.onload = function() {
    let music = document.getElementById('backgroundMusic');
    let playButton = document.getElementById('playButton');
    let bouncingText = document.getElementById('bouncingText');
    let waveCanvas = document.getElementById('waveCanvas');
    let ctx = waveCanvas.getContext('2d');

    // Web Audio API setup
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let source = audioContext.createMediaElementSource(music);
    let analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;

    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);

    function resizeCanvas() {
        waveCanvas.width = window.innerWidth;
        waveCanvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function drawWave() {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for(let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        let average = sum / bufferLength;
        let scale = 1 + average / 256; // Adjust scale factor to make it less sensitive
        let translateY = average / 2; // Adjust translate factor to make it less sensitive
        bouncingText.style.transform = `translateY(${translateY}px)`;

        ctx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
        ctx.fillStyle = 'rgba(0, 255, 153, 0.5)';
        ctx.beginPath();
        let waveHeight = waveCanvas.height / 2;
        let waveWidth = waveCanvas.width;
        ctx.moveTo(0, waveHeight);

        for (let x = 0; x < waveWidth; x++) {
            let y = waveHeight + Math.sin((x + average) / 20) * 50 * scale;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(waveWidth, waveCanvas.height);
        ctx.lineTo(0, waveCanvas.height);
        ctx.closePath();
        ctx.fill();
        requestAnimationFrame(drawWave);
    }

    // Try to play the music automatically
    music.play().then(() => {
        playButton.style.display = 'none';
        audioContext.resume().then(() => {
            drawWave();
        });
    }).catch(() => {
        // If autoplay fails, show the play button
        playButton.style.display = 'flex';
    });
}

function startMusic() {
    let music = document.getElementById('backgroundMusic');
    let playButton = document.getElementById('playButton');

    music.play();
    playButton.style.display = 'none';

    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let source = audioContext.createMediaElementSource(music);
    let analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;

    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);

    function drawWave() {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for(let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        let average = sum / bufferLength;
        let scale = 1 + average / 256; // Adjust scale factor to make it less sensitive
        let translateY = average / 2; // Adjust translate factor to make it less sensitive
        bouncingText.style.transform = `translateY(${translateY}px)`;

        ctx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
        ctx.fillStyle = 'rgba(0, 255, 153, 0.5)';
        ctx.beginPath();
        let waveHeight = waveCanvas.height / 2;
        let waveWidth = waveCanvas.width;
        ctx.moveTo(0, waveHeight);

        for (let x = 0; x < waveWidth; x++) {
            let y = waveHeight + Math.sin((x + average) / 20) * 50 * scale;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(waveWidth, waveCanvas.height);
        ctx.lineTo(0, waveCanvas.height);
        ctx.closePath();
        ctx.fill();
        requestAnimationFrame(drawWave);
    }

    audioContext.resume().then(() => {
        drawWave();
    });
}