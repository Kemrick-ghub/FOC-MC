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

// Konami code detection variables
let konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑ ↑ ↓ ↓ ← → ← → B A
let konamiIndex = 0;
let isKonamiCodeActive = false;

// Easter egg character element
const easterEggCharacter = document.createElement('div');
easterEggCharacter.id = 'easter-egg';
easterEggCharacter.style.position = 'absolute';
easterEggCharacter.style.top = '50%';
easterEggCharacter.style.left = '-100px'; // Initially hidden off-screen
easterEggCharacter.style.fontSize = '30px';
easterEggCharacter.style.fontFamily = 'Arial, sans-serif';
easterEggCharacter.style.color = 'red';
easterEggCharacter.style.zIndex = '9999';
easterEggCharacter.style.transition = 'left 0.5s ease-out'; // Smooth transition for the peeking effect
document.body.appendChild(easterEggCharacter);

// Handle Konami Code input
document.addEventListener('keydown', function(e) {
    if (e.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Konami code completed successfully, trigger Easter egg
            isKonamiCodeActive = true;
            activateEasterEgg();
            konamiIndex = 0; // Reset the sequence after activation
        }
    } else {
        konamiIndex = 0; // Reset if a wrong key is pressed
    }
});

// Function to activate the Easter egg
function activateEasterEgg() {
    if (isKonamiCodeActive) {
        // Move the Easter egg character into view
        easterEggCharacter.style.left = '10px'; // Peeking from the left side

        // Display the message
        easterEggCharacter.textContent = "Fun is ∞!";

        // Change the ring color to red
        ring.style.backgroundColor = 'red';

         // Change the background color to black
        gameContainer.style.backgroundColor = 'black';
        document.body.style.backgroundColor = 'black'; // Change the entire page background to black
        gameContainer.style.backgroundColor = 'grey';

        // Make the character disappear after 2 seconds
        setTimeout(function() {
            easterEggCharacter.style.left = '-100px'; // Move off-screen
            setTimeout(function() {
                easterEggCharacter.textContent = ''; // Clear the message
                isKonamiCodeActive = false;
            }, 500); // Wait for the animation to finish before clearing the message
        }, 2000); // Keep the message visible for 2 seconds

        // Reset ring color after 5 seconds
        setTimeout(function() {
            ring.style.backgroundColor = ''; // Reset to original color
            gameContainer.style.backgroundColor = '#70C5CE'; // Reset background color
        }, 5000); // 5 seconds to reset the ring color back to normal
    }
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

        if (sonicRect.bottom <= platformRect.top && sonicRect.right > platformRect.left && sonicRect.left < platformRect.right) {
            newY = platformRect.top - sonic.offsetHeight;
            sonicSpeedY = 0;
            isOnGround = true;
        }
    });

    // Check if Sonic is out of bounds (no longer inside game container)
    if (sonic.offsetLeft < 0 || sonic.offsetLeft + sonic.offsetWidth > gameContainer.offsetWidth || sonic.offsetTop < 0 || sonic.offsetTop + sonic.offsetHeight > gameContainer.offsetHeight) {
        // Sonic is out of bounds, disable further triggering of Easter egg
        if (isKonamiCodeActive) {
            activateEasterEgg();
        }
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
