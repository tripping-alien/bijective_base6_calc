/**
 * Bijective Base-6 Matrix Rain Animation
 * High-performance, theme-adaptive canvas animation using bijective digits (1-6) and operators.
 */
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('background-animation');
    if (!canvas) return;

    // Check prefers-reduced-motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    let width, height, columns, drops;
    let animationFrameId;

    // Bijective base-6 symbols (predominantly 1-6 with occasional math operators)
    const chars = "123456123456123456+×÷−=";

    function getCssVariable(varName) {
        return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    }

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 99, g: 102, b: 241 };
    }

    function resetAnimation() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = canvas.width = window.innerWidth * dpr;
        height = canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);

        const colWidth = 24;
        columns = Math.floor(window.innerWidth / colWidth);
        drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = Math.floor(Math.random() * -50); // Stagger initial drop positions
        }

        const bgColor = getCssVariable('--bg-color') || '#090d16';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;

    function draw(currentTime) {
        animationFrameId = requestAnimationFrame(draw);

        const delta = currentTime - lastTime;
        if (delta < interval) return;
        lastTime = currentTime - (delta % interval);

        const bgColor = getCssVariable('--bg-color') || '#090d16';
        const rgb = hexToRgb(bgColor);

        // Gentle fade overlay
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        const rainColor = getCssVariable('--rain-color') || '#818cf8';
        ctx.fillStyle = rainColor;
        ctx.font = '600 15px "JetBrains Mono", "Fira Code", monospace';

        const colWidth = 24;
        for (let i = 0; i < drops.length; i++) {
            if (drops[i] >= 0) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                
                // Head drop glow effect
                if (Math.random() > 0.85) {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(char, i * colWidth, drops[i] * 20);
                    ctx.fillStyle = rainColor;
                } else {
                    ctx.fillText(char, i * colWidth, drops[i] * 20);
                }
            }

            if (drops[i] * 20 > window.innerHeight && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    resetAnimation();
    animationFrameId = requestAnimationFrame(draw);

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resetAnimation, 150);
    });

    // Pause when tab is not visible to save battery
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationFrameId);
        } else {
            lastTime = performance.now();
            animationFrameId = requestAnimationFrame(draw);
        }
    });
});