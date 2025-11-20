// Video Player Controls for Tugas 4
document.addEventListener('DOMContentLoaded', function() {
    const videoPlayer = document.getElementById("videoku");

    // Check if video element exists
    if (!videoPlayer) {
        console.error('Video element not found!');
        return;
    }

    // Video control functions
    function togglePlayPause() {
        if (videoPlayer.paused)
            videoPlayer.play();
        else
            videoPlayer.pause();
    }

    function setVideoSize(size) {
        switch(size) {
            case 'big':
                videoPlayer.width = 800;
                console.log('Video size changed to big: ' + videoPlayer.width + 'px');
                break;
            case 'small':
                videoPlayer.width = 400;
                console.log('Video size changed to small: ' + videoPlayer.width + 'px');
                break;
            case 'normal':
                videoPlayer.width = 600;
                console.log('Video size changed to normal: ' + videoPlayer.width + 'px');
                break;
            default:
                console.error('Invalid size: ' + size);
        }
    }

    // Make functions globally accessible for onclick handlers
    window.tekanPause = togglePlayPause;
    window.menjadiBig = () => setVideoSize('big');
    window.menjadiSmall = () => setVideoSize('small');
    window.menjadiNormal = () => setVideoSize('normal');

    // Keyboard controls
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case ' ':
                event.preventDefault();
                togglePlayPause();
                break;
            case 'ArrowUp':
                setVideoSize('big');
                break;
            case 'ArrowDown':
                setVideoSize('small');
                break;
            case 'ArrowRight':
                setVideoSize('normal');
                break;
        }
    });

    // Log initial video state
    console.log('Video player initialized with width: ' + videoPlayer.width + 'px');
});