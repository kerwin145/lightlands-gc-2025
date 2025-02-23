function switchScreen(screenId) {
    console.log("Switching screen")
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

const switch_to_2_btn = document.querySelector("#screen1 button")
const switch_to_1_btn = document.querySelector("#screen2 button")

// Add listeners
switch_to_2_btn.addEventListener("click", ()=>switchScreen('screen2'))
switch_to_1_btn.addEventListener("click", ()=>switchScreen('screen1'))

// Parallax Setup
const canvas = document.getElementById("parallaxCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bgImage = new Image();
const treeLayer1 = new Image();
const treeLayer2 = new Image();

bgImage.src = "background.jpg";
treeLayer1.src = "lighthouse.jpg";
treeLayer2.src = "lighthouse.jpg";

let scrollSpeed = 0;

window.addEventListener("mousemove", (event) => {
    let moveFactor = event.clientX / canvas.width;
    scrollSpeed = (moveFactor - 0.5) * 10;
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let bgX = -scrollSpeed * 0.2;
    let tree1X = -scrollSpeed * 0.5;
    let tree2X = -scrollSpeed * 1.0;

    ctx.drawImage(bgImage, bgX, 0, canvas.width, canvas.height);
    ctx.drawImage(treeLayer1, tree1X, 0, canvas.width, canvas.height);
    ctx.drawImage(treeLayer2, tree2X, 0, canvas.width, canvas.height);

    requestAnimationFrame(draw);
}

bgImage.onload = () => {
    treeLayer1.onload = () => {
        treeLayer2.onload = () => {
            draw();
        };
    };
};
