const canvas = document.getElementById("interactiveCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let mouse = {
    x: null,
    y: null,
    radius: 50
};

// Listen for mouse movement
window.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Particle class to create animated particles
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 1 + 0.5; // Even smaller particle size
        this.speedX = Math.random() * 2 - 1; // Slower speed
        this.speedY = Math.random() * 2 - 1; // Slower speed
        this.color = "rgba(0, 255, 0, 0.8)"; // Bright green
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Mouse interaction (particles move towards mouse)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
            this.size = Math.random() * 1 + 0.5; // Smaller size
            this.speedX = dx / distance * 0.5; // Even slower speed
            this.speedY = dy / distance * 0.5; // Even slower speed
        }

        // Draw particle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create particles in the background
function createParticles(event) {
    let xPos = event.x;
    let yPos = event.y;
    for (let i = 0; i < 3; i++) { // Reduced the number of particles generated
        particles.push(new Particle(xPos, yPos));
    }
}

// Function to create random shapes in the background (very slow moving)
class Shape {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 30 + 10; // Smaller shapes
        this.shapeType = Math.floor(Math.random() * 3);
        this.speedX = 0.05; // Very slow movement speed
        this.speedY = 0.05; // Very slow movement speed
    }

    update() {
        // Move the shape slowly in the background
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset position to keep the shape within the screen
        if (this.x > canvas.width) this.x = 0;
        if (this.y > canvas.height) this.y = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y < 0) this.y = canvas.height;

        ctx.fillStyle = "rgba(0, 255, 0, 0.3)"; // Light green for shapes
        ctx.strokeStyle = "rgba(0, 255, 0, 0.5)"; // Green line color

        if (this.shapeType === 0) { // Draw a circle
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.shapeType === 1) { // Draw a rectangle
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.size, this.size);
            ctx.fill();
        } else if (this.shapeType === 2) { // Draw a line
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.size, this.y + this.size);
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
}

let shapes = [];
for (let i = 0; i < 5; i++) { // Create a few shapes
    shapes.push(new Shape());
}

// Animate particles and background
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw shapes slowly
    for (let shape of shapes) {
        shape.update();
    }

    // Update particles
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }

    // Remove particles that are too small
    particles = particles.filter(particle => particle.size > 0.2);

    requestAnimationFrame(animateParticles);
}

// Handle canvas resizing
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Trigger particle creation on mouse move
window.addEventListener("mousemove", createParticles);

animateParticles(); 