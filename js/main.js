document.addEventListener('DOMContentLoaded', function() {
    const cupsGrid = document.querySelector('.cups-grid');
    const tutorialModal = document.getElementById('tutorial-modal');
    const winnerModal = document.getElementById('winner-modal');
    const startGameBtn = document.getElementById('start-game');
    const playAgainBtn = document.getElementById('play-again');
    const privateKeyText = document.getElementById('private-key-text');
    const countdownElement = document.getElementById('countdown');
    
    let winningCup = Math.floor(Math.random() * 20) + 1;
    const privateKey = "0x" + Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('');
    const COOLDOWN_TIME = 5 * 60; // 5 minutes in seconds
    let cooldownTimer = null;
    let lastPlayTime = 0;

    // Show tutorial on page load
    tutorialModal.style.display = 'block';

    function updateCooldownTimer() {
        const now = Math.floor(Date.now() / 1000);
        const timeSinceLastPlay = now - lastPlayTime;
        const timeRemaining = COOLDOWN_TIME - timeSinceLastPlay;
        
        if (timeRemaining <= 0) {
            countdownElement.parentElement.style.display = 'none';
            enableAllSquares();
            if (cooldownTimer) {
                clearInterval(cooldownTimer);
                cooldownTimer = null;
            }
            return;
        }

        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        countdownElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        disableAllSquares();
    }

    function startCooldown() {
        lastPlayTime = Math.floor(Date.now() / 1000);
        countdownElement.parentElement.style.display = 'block';
        cooldownTimer = setInterval(updateCooldownTimer, 1000);
        updateCooldownTimer();
    }

    function disableAllSquares() {
        document.querySelectorAll('.cup').forEach(square => {
            square.style.pointerEvents = 'none';
            square.style.opacity = '0.5';
        });
    }

    function enableAllSquares() {
        document.querySelectorAll('.cup').forEach(square => {
            square.style.pointerEvents = 'auto';
            square.style.opacity = '1';
        });
    }

    // Create squares
    function createCups() {
        cupsGrid.innerHTML = '';
        for (let i = 1; i <= 20; i++) {
            const cup = document.createElement('div');
            cup.className = 'cup';
            cup.innerHTML = '⬜';
            cup.dataset.number = i;
            cup.addEventListener('click', handleCupClick);
            cupsGrid.appendChild(cup);
        }
        enableAllSquares();
    }

    function handleCupClick(e) {
        if (cooldownTimer) return;
        const selectedCup = parseInt(e.target.dataset.number);
        if (selectedCup === winningCup) {
            privateKeyText.textContent = privateKey;
            winnerModal.style.display = 'block';
        } else {
            e.target.style.backgroundColor = '#ff4444';
            e.target.style.cursor = 'not-allowed';
            e.target.removeEventListener('click', handleCupClick);
        }
        startCooldown();
    }

    function resetGame() {
        winningCup = Math.floor(Math.random() * 20) + 1;
        createCups();
        winnerModal.style.display = 'none';
        if (cooldownTimer) {
            clearInterval(cooldownTimer);
            cooldownTimer = null;
        }
        lastPlayTime = 0;
        countdownElement.parentElement.style.display = 'none';
    }

    // Event listeners
    startGameBtn.addEventListener('click', () => {
        tutorialModal.style.display = 'none';
        createCups();
    });

    playAgainBtn.addEventListener('click', resetGame);

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === tutorialModal) {
            tutorialModal.style.display = 'none';
            createCups();
        }
        if (e.target === winnerModal) {
            resetGame();
        }
    });
}); 