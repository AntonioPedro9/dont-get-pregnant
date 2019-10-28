// getting the window size
let width = window.innerWidth;
let height = window.innerHeight;

let warning = document.getElementById("warning");
let scoreBoard = document.getElementById("scoreBoard");

// global variables
let canvas, ovule, diameter, sperm, spermatozoom, chronometer, pontuation;



// reload the page if the window size change
window.addEventListener("resize", () => {
    location.reload();
});



// reload the page if the orientation change
window.addEventListener("orientationchange", () => {
    location.reload();
});



// show the warning if the device orientation is portrait
if (window.orientation == 0 || window.orientation == 180) { warning.style.display = "block" }



function createOvule() {

    // the diameter is based on the screen height
    diameter = height/8;

    ovule = createSprite(height/8, height/2, diameter, diameter);

    ovule.draw = () => {
        fill(255, 128);
        stroke(255);
        strokeWeight(diameter/8);

        ellipse(0, 0, random(diameter, diameter + 4));
        ellipse(0, 0, random(diameter/8, diameter/8 + 4));
    }

    // set a circular collision zone
    ovule.setCollider("circle", 0, 0, diameter/2);

    ovule.maxSpeed = 8;
}



function createSpermatozoom() {

    // create a new spermatozoom based on the frame cout
    if (frameCount % 20 == 0) {

        let diameterX = height/16;
        let diameterY = height/32;

        spermatozoom = createSprite(width, random(height) /* places the spermatozoom on a rondom place at screen */, diameterX, diameterY);

        spermatozoom.draw = () => {

            // spermatozoom body
            fill(255);
            noStroke();
            ellipse(0, 0, random(diameterX, diameterX + 4), random(diameterY, diameterY + 4));

            // spermatozoom tail
            fill(255, 128);
            ellipse(height/16, 0, random(diameterX * 2, diameterX * 2 + 4), random(diameterY/16, diameterY/16 + 4));
        }

        // spermatozoom speed is based on the screen width
        let speed = random(-width/256, -width/128);
        spermatozoom.velocity.x = speed;

        // spermatozoom desapears after some time
        spermatozoom.life = 512;

        // add spermatozoom to sperm array
        sperm.add(spermatozoom);
    }
}



function score() {
    pontuation = 0;
    scoreBoard.innerHTML = pontuation;

    // pontuation is based on how many seconds you survive
    chronometer = setInterval( () => { 
        pontuation += 1; 
        scoreBoard.innerHTML = pontuation;
    }, 1000);
}



function gameRules() {

    // aply gravity acceleration to the ovule
    ovule.addSpeed(0.2, 90);

    // define screen limits
    if (ovule.position.y > height - diameter/2 - 4) {
        ovule.position.y = height - diameter/2 - 4;
        ovule.velocity.y = 0;
    }
    else if (ovule.position.y < 0 + diameter/2 + 4) {
        ovule.position.y = 0 + diameter/2 + 4;
        ovule.velocity.y = 0;
    }

    // move ovule up
    if (keyIsPressed || mouseIsPressed) {
        ovule.addSpeed(-0.8, 90);
    }

    // game over trigger
    if (sperm.overlap(ovule)) {
        gameOver();
    }
}



function gameOver() {
    
    // remove all sprites
    ovule.remove();
    sperm.removeSprites();

    // reset the score
    pontuation = 0;
    clearInterval(chronometer);

    // restart the game
    setup();
}



function setup() {
    canvas = createCanvas(width, height);
    canvas.parent("container");

    // create a spermatozoom array
    sperm = new Group();

    createOvule();
    score();
}



function draw() {
    background(233, 30, 99);

    createSpermatozoom();
    gameRules();

    drawSprites();
}
