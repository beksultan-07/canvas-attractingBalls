const config = {
    dotMinRad: 6,
    dotMaxRad: 20,
    bigDotRad: 30,
    massFactor: 0.002,
    dotColor: "rgba(250, 10, 30, 0.9)",
    sphereRad: 200,
    mousSize: 60,
    smooth: 0.9,
};

const TWO_PI = Math.PI * 2;

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let screenWidth, screenHeight, mouse, dots;

class Dot {
    constructor(r) {
        this.pos = { x: mouse.x, y: mouse.y };
        this.spead = { x: 0, y: 0 };
        this.rad = r || getRandom(config.dotMinRad, config.dotMaxRad);
        this.mass = this.rad * config.massFactor;
        this.color = config.dotColor;
    }

    draw(x, y) {
        this.pos.x = x || this.pos.x + this.spead.x;
        this.pos.y = y || this.pos.y + this.spead.y;
        createCircle(this.pos.x, this.pos.y, this.rad, true, this.color);
        createCircle(this.pos.x, this.pos.y, this.rad, false, config.dotColor);
    }
}

function updateDots() {
    for (let i = 0; i < dots.length; i++) {
        const acc = { x: 0, y: 0 };

        for (let j = 0; j < dots.length; j++) {
            if (j === i) continue;

            let [a, b] = [dots[i], dots[j]];

            let delta = { x: b.pos.x - a.pos.x, y: b.pos.y - a.pos.y };
            let dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
            let force = ((dist - config.sphereRad) / dist) * b.mass;

            if (j === 0) {
                const alpha = config.mousSize / dist;
                a.color = `rgba(250, 10, 30, ${alpha})`;
                dist < config.mousSize
                    ? (force = (dist - config.mousSize) * b.mass)
                    : (force = a.mass);
            }

            acc.x += delta.x * force;
            acc.y += delta.y * force;
        }

        dots[i].spead.x =
            dots[i].spead.x * config.smooth + acc.x * dots[i].mass;
        dots[i].spead.y =
            dots[i].spead.y * config.smooth + acc.y * dots[i].mass;
    }

    dots.forEach((dot) =>
        dots[0] === dot ? dot.draw(mouse.x, mouse.y) : dot.draw()
    );
}

function createCircle(x, y, rad, fill, color) {
    context.fillStyle = context.strokeStyle = color;
    context.beginPath();

    context.arc(x, y, rad, 0, TWO_PI);
    context.closePath();
    fill ? context.fill() : context.stroke();
}

function init() {
    screenWidth = canvas.width = innerWidth;
    screenHeight = canvas.height = innerHeight;

    mouse = { x: screenWidth / 2, y: screenHeight / 2, isDown: false };

    dots = [];

    dots.push(new Dot(config.bigDotRad));
}

function loop() {
    context.clearRect(0, 0, screenWidth, screenHeight);

    if (mouse.down) dots.push(new Dot());

    updateDots();

    window.requestAnimationFrame(loop);
}

init();
loop();

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

canvas.onmousemove = (event) => {
    [mouse.x, mouse.y] = [event.offsetX, event.offsetY];
};

canvas.onmousedown = () => (mouse.down = true);
canvas.onmouseup = () => (mouse.down = false);
