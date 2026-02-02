document.addEventListener("DOMContentLoaded", function () {
    const noButton = document.getElementById('no');
    const yesButton = document.getElementById('yes');
    const celebrationContainer = document.getElementById('celebration-container');
    const backgroundMusic = document.getElementById("background-music");

    // --- EXISTING "NO" BUTTON BEHAVIOR ---
    noButton.addEventListener('mouseenter', function () {
        noButton.classList.add('shake');
        generateEvilFaces();
    });

    noButton.addEventListener('mouseleave', function () {
        noButton.classList.remove('shake');
    });

    function generateEvilFaces() {
        for (let i = 0; i < 5; i++) {
            let evilFace = document.createElement('div');
            evilFace.innerHTML = '😈';
            evilFace.classList.add('evil-face');
            document.body.appendChild(evilFace);
            
            // Random position
            let x = Math.random() * window.innerWidth;
            let y = Math.random() * window.innerHeight;
            
            evilFace.style.left = `${x}px`;
            evilFace.style.top = `${y}px`;
            
            setTimeout(() => {
                evilFace.remove();
            }, 1000);
        }
    }

    // --- NEW "YES" BUTTON BEHAVIOR ---
    yesButton.addEventListener('click', function () {
        // 1. Play Music (if allowed)
        if (backgroundMusic) {
            backgroundMusic.play().catch(e => console.log("Audio autoplay blocked:", e));
        }

        // 2. Show Celebration Overlay
        celebrationContainer.classList.remove('hidden');

        // 3. Start Fireworks
        startFireworks();

        // 4. Start Floating Hearts after a delay
        setTimeout(startFloatingHearts, 2000);
    });

    // --- FIREWORKS ANIMATION (Canvas) ---
    function startFireworks() {
        const canvas = document.getElementById("fireworks-canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particles = [];
        const colors = ['#ff69b4', '#ff1493', '#fff', '#ffd700', '#ff4500']; // Pink, DeepPink, White, Gold, OrangeRed

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                // Random velocity
                this.velocity = {
                    x: (Math.random() - 0.5) * 8, // Spread horizontally
                    y: (Math.random() - 0.5) * 8  // Spread vertically
                };
                this.alpha = 1; // Opacity
                this.friction = 0.96; // Slow down over time
                this.gravity = 0.05; // Pull down slightly
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();
            }

            update() {
                this.velocity.x *= this.friction;
                this.velocity.y *= this.friction;
                this.velocity.y += this.gravity;
                this.x += this.velocity.x;
                this.y += this.velocity.y;
                this.alpha -= 0.01; // Fade out
            }
        }

        class Firework {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.particles = [];
                for (let i = 0; i < 50; i++) {
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    this.particles.push(new Particle(x, y, color));
                }
            }

            update() {
                this.particles.forEach((particle, index) => {
                    if (particle.alpha <= 0) {
                        this.particles.splice(index, 1);
                    } else {
                        particle.update();
                    }
                });
            }

            draw() {
                this.particles.forEach((particle) => {
                    particle.draw();
                });
            }
        }

        let fireworks = [];

        function animate() {
            // Clear canvas with a slight trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Randomly spawn fireworks
            if (Math.random() < 0.05) { // 5% chance per frame
                const x = Math.random() * canvas.width;
                const y = Math.random() * (canvas.height / 2); // Top half of screen
                fireworks.push(new Firework(x, y));
            }
            
            // Also spawn fireworks on click for fun (optional, if user clicks background)
            // But main trigger is the initial burst.
            
            fireworks.forEach((firework, index) => {
                firework.update();
                firework.draw();
                if (firework.particles.length === 0) {
                    fireworks.splice(index, 1);
                }
            });

            requestAnimationFrame(animate);
        }

        // Initial Burst
        for(let i=0; i<5; i++) {
            setTimeout(() => {
                const x = Math.random() * canvas.width;
                const y = Math.random() * (canvas.height / 2);
                fireworks.push(new Firework(x, y));
            }, i * 300);
        }

        animate();
    }


    // --- FLOATING HEARTS (DOM) ---
    function startFloatingHearts() {
        setInterval(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.bottom = '-50px';
            heart.style.fontSize = Math.random() * 20 + 20 + 'px'; // 20-40px
            heart.style.animation = `floatUp ${Math.random() * 3 + 4}s linear forwards`; // 4-7s duration
            heart.style.opacity = Math.random();
            heart.style.zIndex = '999';
            
            document.body.appendChild(heart);
            
            // Add CSS animation keyframes dynamically if not present, 
            // but we can rely on inline styles for simple movement or just add to style.css.
            // Let's add the keyframes via JS to be safe if not in CSS.
            if (!document.getElementById('float-style')) {
                const style = document.createElement('style');
                style.id = 'float-style';
                style.innerHTML = `
                    @keyframes floatUp {
                        to {
                            bottom: 110vh;
                            transform: rotate(360deg);
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            // Cleanup
            setTimeout(() => {
                heart.remove();
            }, 8000);
        }, 500); // New heart every 500ms
    }

});
