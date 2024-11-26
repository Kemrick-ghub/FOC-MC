// Get the character (sonic), ground, platforms, ring, and the score display element
const sonic = document.getElementById('sonic');
const gameContainer = document.querySelector('.game-container');
const platforms = document.querySelectorAll('.platform');
const ring = document.getElementById('ring');
const scoreDisplay = document.getElementById('ring-count'); // Get the score display element

// Get the audio elements
const backgroundMusic = document.getElementById('background-music');
const jumpSound = document.getElementById('jump-sound');
const ringSound = document.getElementById('ring-sound');
const spinDashSound = new Audio('spin-dash-sound.mp3'); 
spinDashSound.volume = 0.5; // Adjust the volume if necessary
const explosionSound = new Audio('explosion-sound.mp3'); 
explosionSound.volume = 0.8; // Adjust the volume if necessary

let sonicSpeedX = 0; // Horizontal speed
let sonicSpeedY = 0; // Vertical speed
let isJumping = false; // To track if the character is jumping
let isOnGround = true; // To detect if the character is on the ground
const gravity = 0.5; // Simulate gravity
const jumpStrength = 15; // How strong the jump is
const moveSpeed = 5; // Horizontal movement speed
const maxSpinDashSpeed = 20; // Max speed for spin dash
let spinDashSpeed = 0; // Current spin dash charge

let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;
let spacePressed = false;

let score = 0; // Score variable to track collected rings
const explosionThreshold = 10; // Set the score threshold for explosion

// Timer variables
let timeLeft = 1000; // Start the timer at 10 seconds
let timerInterval;
let isTimerPaused = false; // Flag to control if the timer is paused

// Create a new div for the timer display
const timerDisplay = document.createElement('div');
timerDisplay.style.position = 'absolute';
timerDisplay.style.top = '10px';
timerDisplay.style.left = '50%';
timerDisplay.style.transform = 'translateX(-50%)';
timerDisplay.style.fontSize = '30px';
timerDisplay.style.color = 'white';
timerDisplay.style.zIndex = '9999';
timerDisplay.textContent = `Time: ${timeLeft.toFixed(2)}`;
document.body.appendChild(timerDisplay);

// Create the explosion message element
const explosionMessage = document.createElement('div');
explosionMessage.style.position = 'absolute';
explosionMessage.style.top = '50%';
explosionMessage.style.left = '50%';
explosionMessage.style.transform = 'translate(-50%, -50%)';
explosionMessage.style.fontSize = '40px';
explosionMessage.style.color = 'red';
explosionMessage.style.fontWeight = 'bold';
explosionMessage.style.zIndex = '10000';
explosionMessage.style.opacity = 0; // Initially hidden
document.body.appendChild(explosionMessage);

// Start the background music when the game starts
backgroundMusic.play();

// Handle keyboard input
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        leftPressed = true;
        spinDashDirection = -1; // Set the spin dash direction to left
    } else if (e.key === 'ArrowRight') {
        rightPressed = true;
        spinDashDirection = 1; // Set the spin dash direction to right
    } else if (e.key === 'ArrowUp' && isOnGround) {
        upPressed = true;
        jumpSound.play(); // Play jump sound when jump is triggered
    } else if (e.key === 'ArrowDown') {
        downPressed = true; // Start charging the spin dash
    }
});

document.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'ArrowUp') {
        upPressed = false;
    } else if (e.key === 'ArrowDown') {
        downPressed = false; // Stop charging when down is released
    } else if (e.key === ' ') {
        spacePressed = false; // Space bar released
    }
});

// Timer logic
function startTimer() {
    timerInterval = setInterval(function() {
        if (!isTimerPaused) {
            if (timeLeft > 0) {
                timeLeft -= 0.01;
                timerDisplay.textContent = `Time: ${timeLeft.toFixed(2)}`;
            } else {
                clearInterval(timerInterval);
                alert('Game Over!');
            }
        }
    }, 10); // Update every 10ms for smooth countdown
}

// Start the timer when the game starts
startTimer();

// Function to pause the timer when the Easter egg is triggered
function pauseTimer() {
    isTimerPaused = true;
    timerDisplay.textContent = "Time: ???"; // Change timer display to "???"
}

// Function to resume the timer after Easter egg
function resumeTimer() {
    isTimerPaused = false;
    timerDisplay.textContent = `Time: ${timeLeft.toFixed(2)}`; // Resume normal display
}

// Check for collision with the ring
function checkCollision() {
    const sonicRect = sonic.getBoundingClientRect();
    const ringRect = ring.getBoundingClientRect();

    if (
        sonicRect.x < ringRect.x + ringRect.width &&
        sonicRect.x + sonicRect.width > ringRect.x &&
        sonicRect.y < ringRect.y + ringRect.height &&
        sonicRect.y + sonicRect.height > ringRect.y
    ) {
        ring.style.display = 'none'; // Remove the ring
        score++; // Increase score
        scoreDisplay.textContent = score; // Update the score display
        console.log('Score:', score); // Log score to the console
        ringSound.play(); // Play ring collection sound
        setTimeout(resetRing, 2000); // Reset ring after 2 seconds

        // Check if Sonic should explode after collecting enough rings
        if (score >= explosionThreshold) {
            triggerExplosion();
        }
    }
}

// Reset the ring position after it is collected
function resetRing() {
    ring.style.display = 'block'; // Show the ring again
    ring.style.top = `${Math.random() * (gameContainer.offsetHeight - 50)}px`; // Random vertical position
    ring.style.left = `${Math.random() * (gameContainer.offsetWidth - 50)}px`; // Random horizontal position
}

// Trigger the explosion effect
function triggerExplosion() {
    // Play the explosion sound
    explosionSound.play();

    // Change Sonic's appearance to simulate an explosion
    sonic.style.transition = 'all 0.5s ease-out'; // Smooth transition
    sonic.style.transform = 'scale(2)'; // Make Sonic larger
    sonic.style.opacity = 0; // Make Sonic fade out

    // Display the explosion message
    explosionMessage.textContent = "Sonic Exploded! He lost his legs!";
    explosionMessage.style.opacity = 1; // Make the message visible

    // Reset the game after explosion effect
    setTimeout(function() {
        resetGame();
    }, 1000); // Wait for the explosion effect to finish before resetting
}

// Reset the game
function resetGame() {
    // Reset score and Sonic position
    score = 0;
    scoreDisplay.textContent = score;
    sonic.style.left = '50px'; // Reset Sonic's position (adjust as needed)
    sonic.style.top = '300px'; // Reset Sonic's position (adjust as needed)
    sonic.style.transform = 'scale(1)'; // Reset Sonic's size
    sonic.style.opacity = 1; // Reset Sonic's opacity

    // Hide the explosion effect and reset the ring
    ring.style.display = 'block'; // Show the ring again
    ring.style.top = `${Math.random() * (gameContainer.offsetHeight - 50)}px`; // Random vertical position
    ring.style.left = `${Math.random() * (gameContainer.offsetWidth - 50)}px`; // Random horizontal position

    // Hide the explosion message after 2 seconds
    setTimeout(function() {
        explosionMessage.style.opacity = 0;
    }, 2000); // Hide the message after 2 seconds
}

// Update Sonic's position
function update() {
    // Handle horizontal movement
    if (leftPressed) {
        sonicSpeedX = -moveSpeed;
    } else if (rightPressed) {
        sonicSpeedX = moveSpeed;
    } else {
        sonicSpeedX = 0;
    }

    // Handle jumping
    if (upPressed && isOnGround) {
        sonicSpeedY = -jumpStrength;
        isOnGround = false;
    }

    // Handle Spin Dash charging
    if (downPressed) {
        spinDashSpeed += 1; // Charge the spin dash
        if (spinDashSpeed > maxSpinDashSpeed) spinDashSpeed = maxSpinDashSpeed; // Limit max speed
    }

    if (spacePressed && spinDashSpeed > 0) {
        // Play spin dash sound when charged
        spinDashSound.play();
        sonicSpeedX = spinDashSpeed * (rightPressed ? 1 : -1); // Move Sonic faster in the direction pressed
        spinDashSpeed = 0; // Reset spin dash speed after use
    }

    // Apply gravity
    sonicSpeedY += gravity;

    // Move Sonic
    let newX = sonic.offsetLeft + sonicSpeedX;
    let newY = sonic.offsetTop + sonicSpeedY;

    // Collision with ground
    if (newY >= gameContainer.offsetHeight - sonic.offsetHeight - 20) { // 20px is the ground height
        newY = gameContainer.offsetHeight - sonic.offsetHeight - 20;
        sonicSpeedY = 0;
        isOnGround = true;
    }

    // Collision with platforms
    platforms.forEach(function(platform) {
        let platformRect = platform.getBoundingClientRect();
        let sonicRect = sonic.getBoundingClientRect();

        if (sonicRect.bottom <= platformRect.top && sonicRect.right > platformRect.left && sonicRect.left < platformRect.right) {
            newY = platformRect.top - sonic.offsetHeight;
            sonicSpeedY = 0;
            isOnGround = true;
        }
    });

    // Check for collision with the ring
    checkCollision();

    // Update Sonic position
    sonic.style.left = newX + 'px';
    sonic.style.top = newY + 'px';

    // Continue the animation
    requestAnimationFrame(update);
}

// Start the game loop
update();
