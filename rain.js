/*
 * Created by zhuzi on Fri Jun 02 2017
 */

const canvas = document.getElementById('rain-something');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const AG = 9.81; // Acceleration of gravity
let raf;

const MODE = {
    RAIN: 'RAIN', // rainning mode, just vertical drop
    SNOOKER: 'SNOOKER', // like snooker, with boundary and rebound
};

class RainDrop {
    constructor(emoji, maxHeight = canvas.height, maxWidth = canvas.width, maxVelocity = 5, mode = MODE.RAIN) {
        this.text = emoji;
        this.x = Math.random() * maxWidth;
        this.y = Math.random() * maxHeight;
        this.vx = mode === MODE.RAIN ? 0 : Math.random() * maxVelocity;
        this.vy = mode === MODE.RAIN ? AG : Math.random() * maxVelocity;
        this.font = '20px serif';
        // this.color = '#fff';
    }

    drawDrop(ctx) {
        ctx.font = this.font;
        ctx.fillText(this.text, this.x, this.y);
        // ctx.fillStyle = this.color;
    }

    move(maxHeight, maxWidth) {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x > maxWidth || this.y > maxHeight) {
            this.x = Math.random() * maxWidth;
            this.y = -20;
        }
        // console.log(maxHeight, maxWidth);
        // this.vy *= 0.99;
        // this.vy += 0.25;

        // // boundary
        // if (this.y + this.vy > maxHeight ||
        //     this.y + this.vy < 0) {
        //     this.vy = -this.vy * 0.99;
        // }
        // if (this.x + this.vx > maxWidth ||
        //     this.x + this.vx < 0) {
        //     this.vx = -this.vx * 0.99;
        // }
    }
}

const maxDrops = 100;
const drops = [];

for (let i = 0; i < maxDrops; i++) {
    drops.push(new RainDrop('🙄'));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < maxDrops; i++) {
        drops[i].drawDrop(ctx);
        drops[i].move(canvas.height, canvas.width);
    }

    // window.requestAnimationFrame(draw);
}

// window.requestAnimationFrame(draw);
setInterval(draw, 50);
window.addEventListener('resize', () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});
// canvas.addEventListener('mouseover', function(e) {
//     raf = window.requestAnimationFrame(draw);
// });

// canvas.addEventListener('mouseout', function(e) {
//     window.cancelAnimationFrame(raf);
// });