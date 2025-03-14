function switchScreen(screenId) {
    console.log("Switching screen")
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    updateQuestionPreview()
}

function updateQuestionPreview(){
    if(hoveringOver1 != -1){
        $(question_preview).html(questionAndAnswers[hoveringOver1]["question"] + "<br>" + "⭐".repeat(brightness1[hoveringOver1]))
    }
    else if(hoveringOver2 != -1){
        $(question_preview).html(questionAndAnswers[hoveringOver2 + 3]["question"] + "<br>" + "⭐".repeat(brightness2[hoveringOver2]))
    }else{
        $(question_preview).html("")
    }
}

var screen1Listener = (e) => {
    console.log(e.code)
    if(e.code == 'ArrowUp' || e.code == 'ArrowDown'){
        let delta = 0
        if(e.code == 'ArrowUp') 
            delta = 1
        else if (e.code == 'ArrowDown')
            delta = -1
    
        if(hoveringOver1 != -1){
            updateBrightness(brightness1, hoveringOver1, delta)
        }else if(hoveringOver2 != -1){
            updateBrightness(brightness2, hoveringOver2, delta)
        }
        updateQuestionPreview()
    }
    else if(e.code == 'KeyR'){
        let confirmReset = confirm("Are you sure you want to reset your progress?");
        if (confirmReset) {
            // Reset answered arrays to match current dimensions
            answered1 = new Array(LAYER1_COUNT).fill(null).map((_, idx) => 
                new Array(questionAndAnswers[idx]["answers"].length).fill(false)
            );
            answered2 = new Array(LAYER2_COUNT).fill(null).map((_, idx) => 
                new Array(questionAndAnswers[idx + LAYER1_COUNT]["answers"].length).fill(false)
            );

            // Save the reset arrays to localStorage
            localStorage.setItem("answered1", JSON.stringify(answered1));
            localStorage.setItem("answered2", JSON.stringify(answered2));

            // Reset brightness values
            brightness1 = answered1.map(answers => answers.filter(Boolean).length);
            brightness2 = answered2.map(answers => answers.filter(Boolean).length);

            updateQuestionPreview()

            alert("Progress has been reset.");
            console.log("Progress reset:", { answered1, answered2, brightness1, brightness2 });
        }
    }
    
}
var screen2Listener

function prepareScreen1(){
    if(screen2Listener)
        screen.removeEventListener('keyup', screen2Listener);
    canvas.addEventListener('keyup', screen1Listener)
    canvas.focus()
    $(question_preview).text("")
}

/* Anchored at bottom middle by default */
function createScaledCanvas(image, scaleFactor) {
    console.log("Making scaled canvas");
    console.log(image.width);
    
    // Set the new scaled dimensions
    const scaledWidth = image.width / scaleFactor;
    const scaledHeight = image.height / scaleFactor;

    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = scaledWidth
    offscreenCanvas.height = scaledHeight
    const offscreenCtx = offscreenCanvas.getContext("2d");

    // Draw the image into the expanded canvas
    offscreenCtx.drawImage(image, 0, 0, scaledWidth, scaledHeight);

    // offscreenCtx.strokeStyle = 'red';  // Set the border color
    // offscreenCtx.lineWidth = 2;        // Set the border width
    // offscreenCtx.strokeRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);  // Draw the border

    return offscreenCanvas;
}


const switch_to_2_btn = document.querySelector("#screen1 button")
const switch_to_1_btn = document.querySelector("#screen2 button")
const question_preview = document.querySelector('.questionPreview')

// Parallax Setup
const canvas = document.getElementById("parallaxCanvas");
const ctx = canvas.getContext("2d");
canvas.tabIndex = 1; 
canvas.focus();

const WIDTH = window.innerWidth, HEIGHT = window.innerHeight
console.log(window.innerWidth, HEIGHT)
canvas.width = WIDTH;
canvas.height = HEIGHT;

const bgImage = new Image();
const treeLayer1 = new Image();
const treeLayer2 = new Image();

let imagesLoaded = 0
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 3) { // Total images: bg + 2 layers
        requestAnimationFrame(draw); // Start the draw loop
    }
}

let treeLayer1Canvas, treeLayer2Canvas, layer1XPositions, layer2XPositions;

function isMouseInImageBounds(mouseX, mouseY, x, y, width, height) {
    return mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY <= y + height;
}

// Assign onload handlers
bgImage.onload = imageLoaded;
treeLayer1.onload = function() {
    treeLayer1Canvas = createScaledCanvas(treeLayer1, 2.5, 0.5, 1);
    layer1XPositions = new Array(LAYER1_COUNT).fill(0).map((_, idx) => 
        idx * spacing + (WIDTH - ((LAYER1_COUNT-1) * spacing + treeLayer1Canvas.width)) / 2);
    imageLoaded();
};
treeLayer2.onload = function() {
    treeLayer2Canvas = createScaledCanvas(treeLayer2, 4.5, 0.5, 1);
    layer2XPositions = new Array(LAYER2_COUNT).fill(0).map((_, idx) => 
        idx * spacing + (WIDTH - ((LAYER2_COUNT-1) * spacing + treeLayer2Canvas.width)) / 2);
    imageLoaded();
};

// Set image sources after assigning onload handlers
bgImage.src = "background.jpg";
treeLayer1.src = "lighthouse.png";
treeLayer2.src = "lighthouse.png";

let scrollSpeed = 0;
window.addEventListener("mousemove", (event) => {
    let moveFactor = event.clientX / canvas.width;
    scrollSpeed = (moveFactor - 0.5) * 10;
});

let LAYER1_COUNT = 3, LAYER2_COUNT = 2;
ImageBoundsLayer1 = new Array(LAYER1_COUNT)
ImageBoundsLayer2 = new Array(LAYER2_COUNT)
const HOVER_ZOOM = 1.15
let hoveringOver1 = -1
let hoveringOver2 = -1
let spacing = WIDTH * 0.45;

let brightness1 = new Array(LAYER1_COUNT).fill(0) 
let brightness2 = new Array(LAYER2_COUNT).fill(0) 
let brightnessMap = {
    "0": "brightness(0.35)",
    "1": "brightness(0.44)",
    "2": "brightness(0.53)",
    "3": "brightness(0.62)",
    "4": "brightness(0.71)",
    "5": "brightness(0.8)",
    "6": "brightness(1)"
}


// processAnswers.js
let questionAndAnswers, answered1, answered2
async function loadQuestions() {
    questionAndAnswers = await processTextFile('answers.txt');
}

loadQuestions().then(() => {
    console.log(questionAndAnswers);

    // Retrieve stored answers or initialize new ones
    let storedAnswered1 = JSON.parse(localStorage.getItem("answered1"));
    let storedAnswered2 = JSON.parse(localStorage.getItem("answered2"));

    let validStorage = 
        storedAnswered1 && storedAnswered2 &&
        storedAnswered1.length === LAYER1_COUNT &&
        storedAnswered2.length === LAYER2_COUNT &&
        storedAnswered1.every((arr, idx) => arr.length === questionAndAnswers[idx]["answers"].length) &&
        storedAnswered2.every((arr, idx) => arr.length === questionAndAnswers[idx + LAYER1_COUNT]["answers"].length);

    console.log(storedAnswered1)
    console.log(storedAnswered2)
    console.log(questionAndAnswers)
    if (!validStorage) {
        // Reset answered arrays to match current dimensions
        answered1 = new Array(LAYER1_COUNT).fill(null).map((_, idx) => 
            new Array(questionAndAnswers[idx]["answers"].length).fill(false)
        );
        answered2 = new Array(LAYER2_COUNT).fill(null).map((_, idx) => 
            new Array(questionAndAnswers[idx + LAYER1_COUNT]["answers"].length).fill(false)
        );

        // Save the new empty arrays to localStorage
        localStorage.setItem("answered1", JSON.stringify(answered1));
        localStorage.setItem("answered2", JSON.stringify(answered2));
        alert("Stored answers do not match the current question set or do not exist. Progress has been resetted");
    } else {
        // Use stored values if valid
        answered1 = storedAnswered1;
        answered2 = storedAnswered2;
    }

    // Update brightness based on the count of true values
    brightness1 = answered1.map(answers => answers.filter(Boolean).length);
    brightness2 = answered2.map(answers => answers.filter(Boolean).length);

    console.log("Brightness1:", brightness1);
    console.log("Brightness2:", brightness2);
});

/* Dragging ! */
let isDragging = false;
let dragOffsetX = 0;
let lastMouseX = 0;
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
});

function getHoverIndex(imageBounds, mouseX, mouseY){
    for(let i = 0; i < imageBounds.length; i++){
        let bounds = imageBounds[i]
        if (!bounds) 
            break
        if(isMouseInImageBounds(mouseX, mouseY, bounds.x, bounds.y, bounds.width, bounds.height)){
            return i
        }
    }
    return -1
}
canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        deltaX = e.clientX - lastMouseX
        dragOffsetX -= deltaX
        lastMouseX = e.clientX
    }
    hoveringOver1 = getHoverIndex(ImageBoundsLayer1, e.clientX, e.clientY)
    hoveringOver2 = getHoverIndex(ImageBoundsLayer2, e.clientX, e.clientY)
    if(hoveringOver1 !== -1){
        $(question_preview).html(questionAndAnswers[hoveringOver1]["question"] + "<br>" + "⭐".repeat(brightness1[hoveringOver1]))
    }
    else if(hoveringOver2 !== -1){
        $(question_preview).html(questionAndAnswers[hoveringOver2 + 3]["question"] + "<br>" + "⭐".repeat(brightness2[hoveringOver2]))
    }
    else{
        $(question_preview).text("")
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mouseout', () => {
    isDragging = false;
});

canvas.addEventListener('dblclick', (e) => {
    if(hoveringOver1 != -1){
        switchScreen('screen2')
        prepareScreen2(hoveringOver1, brightness1[hoveringOver1], 1)
    }else if(hoveringOver2 != -2){
        switchScreen('screen2')
        prepareScreen2(hoveringOver2, brightness2[hoveringOver2], 2)
    }  
})

function updateBrightness(brightnessArr, idx, val) {
    let curVal = brightnessArr[idx]
    if(val === 1){
        brightnessArr[idx] = Math.min(curVal + 1, 6)
    }
    else if(val === -1){
        brightnessArr[idx] = Math.max(curVal - 1, 0)
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(bgImage, WIDTH * -.25 - dragOffsetX * 0.1, 0, WIDTH * 1.5, HEIGHT)
    if (treeLayer2Canvas) {
        layer2XPositions.forEach((pos, idx) => {
            let x = pos - dragOffsetX * 0.8, y = HEIGHT * 0.65 - treeLayer2Canvas.height
            ctx.save()
            ctx.filter = brightnessMap[brightness2[idx]]
            if(idx == hoveringOver2){
                let extraX = treeLayer2Canvas.width * (HOVER_ZOOM-1)
                let extraY = treeLayer2Canvas.height * (HOVER_ZOOM-1)
                ctx.drawImage(treeLayer2Canvas, x - extraX/2, y - extraY/2, treeLayer2Canvas.width + extraX, treeLayer2Canvas.height + extraY);
            }else{
                ctx.drawImage(treeLayer2Canvas, x, y);
            }
            ctx.restore()
            ImageBoundsLayer2[idx] = {x, y, width:treeLayer2Canvas.width, height: treeLayer2Canvas.height}
        });
    }
    if (treeLayer1Canvas) {
        layer1XPositions.forEach((pos, idx) => {
            let x = pos - dragOffsetX, y = HEIGHT * 0.8 - treeLayer1Canvas.height
            ctx.save()
            ctx.filter = brightnessMap[brightness1[idx]]
            if (idx == hoveringOver1){ // note that the bounds won't be impacted by this transform
                let extraX = treeLayer1Canvas.width * (HOVER_ZOOM-1)
                let extraY = treeLayer1Canvas.height * (HOVER_ZOOM-1)
                ctx.drawImage(treeLayer1Canvas, x - extraX/2, y - extraY/2, treeLayer1Canvas.width + extraX, treeLayer1Canvas.height + extraY);
            }else{
                ctx.drawImage(treeLayer1Canvas, x, y);
            }
            ctx.restore()
            ImageBoundsLayer1[idx] = {x, y, width:treeLayer1Canvas.width, height: treeLayer1Canvas.height}
        });

    }
    // ctx.drawImage(treeLayer2, tree2X, 0, treeLayer2.width/scaleFactorTreeLayer2, treeLayer2.height/scaleFactorTreeLayer2);
}

let lastDrawTime = 0;
const targetFPS = 60;
const frameTime = 1000 / targetFPS; // Time per frame in ms

function gameLoop(timestamp) {
    if (!lastDrawTime) lastDrawTime = timestamp;

    let deltaTime = timestamp - lastDrawTime;

    // Only draw if enough time has passed
    if (deltaTime >= frameTime) {
        lastDrawTime = timestamp;
        draw();
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
prepareScreen1()