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

let sonicSpeedX = 0; // Horizontal speed
let sonicSpeedY = 0; // Vertical speed
let isJumping = false; // To track if the character is jumping
let isOnGround = true; // To detect if the character is on the ground
const gravity = 0.5; // Simulate gravity
const jumpStrength = 15; // How strong the jump is
const moveSpeed = 5; // Horizontal movement speed

let leftPressed = false;
let rightPressed = false;
let upPressed = false;

let score = 0; // Score variable to track collected rings


// Start the background music when the game starts
backgroundMusic.play();


// Handle keyboard input
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'ArrowUp' && isOnGround) {
        upPressed = true;
        jumpSound.play(); // Play jump sound when jump is triggered
    }
});

document.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'ArrowUp') {
        upPressed = false;
    }
});

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
    }
}

// Reset the ring position after it is collected
function resetRing() {
    ring.style.display = 'block'; // Show the ring again
    ring.style.top = `${Math.random() * (gameContainer.offsetHeight - 50)}px`; // Random vertical position
    ring.style.left = `${Math.random() * (gameContainer.offsetWidth - 50)}px`; // Random horizontal position
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

        // Check if Sonic is falling and colliding with the platform
        if (sonicSpeedY > 0 && 
            sonicRect.bottom <= platformRect.top && 
            sonicRect.right > platformRect.left && 
            sonicRect.left < platformRect.right) {
            
            // Update Sonic's position and speed
            newY = platformRect.top - sonic.offsetHeight; // Place Sonic on top of the platform
            sonicSpeedY = 0; // Reset vertical speed
            isOnGround = true; // Sonic is on the ground
        }
    });

    // Reset isOnGround if not on any platform
    if (!isOnGround) {
        sonicSpeedY += gravity; // Apply gravity if not on the ground
    }

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
