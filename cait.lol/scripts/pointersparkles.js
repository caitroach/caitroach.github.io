document.addEventListener('click', function(e) {
    createSparkles(e.clientX, e.clientY);
});

function createSparkles(x, y) {
    const colors = ['#FFD700', '#FF8C00', '#FF4500', '#FFFFFF', '#FF69B4', '#00CED1']; // Array of colors
    for (let i = 0; i < 20; i++) { // Generate 20 sparkles per click
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        // Set initial position to the click coordinates
        sparkle.style.top = `${y}px`;
        sparkle.style.left = `${x}px`;

        // Set a random color
        sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Set random movement distances using CSS variables
        const randomX = (Math.random() - 0.5) * 200; // -100 to 100
        const randomY = (Math.random() - 0.5) * 200;
        sparkle.style.setProperty('--random-x', `${randomX}px`);
        sparkle.style.setProperty('--random-y', `${randomY}px`);

        // Set a random size
        const size = Math.random() * 10 + 5;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;

        document.body.appendChild(sparkle);

        // Remove the sparkle element after its animation finishes
        sparkle.addEventListener('animationend', () => {
            sparkle.remove();
        });
    }
}
