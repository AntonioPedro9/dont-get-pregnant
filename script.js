let width = window.innerWidth;
let height = window.innerHeight;
let warning = document.getElementById("warning");
let scoreBoard = document.getElementById("scoreBoard");
let canvas, ovule, diameter, sperm, spermatozoom, chronometer, pontuation;

// reload the page if the window size change
window.addEventListener("resize", () => {
    location.reload();
});

// reload the page if the orientation change
window.addEventListener("orientationchange", () => {
    location.reload();
});

// device orientation warning
if (window.orientation == 0 || window.orientation == 180) { warning.style.display = "block" }
else { warning.style.display = "none" }

function setup() {
    canvas = createCanvas(width, height);
    canvas.parent("container");

    sperm = new Group();

    createOvule();
    score();
}

function draw() {
    background(233, 30, 99);

    createSpermatozoom();
    checkScreenLimits();

    ovule.addSpeed(0.2, 90);

    if (keyIsPressed) {
        ovule.addSpeed(-0.8, 90);
    }

    if (sperm.overlap(ovule)) {
        gameOver();
    }

    drawSprites();
}

function createOvule() {

    diameter = height/8;

    ovule = createSprite(height/8, height/2, diameter);

    ovule.draw = function() {
        fill(255, 128);
        stroke(255);
        strokeWeight(diameter/8);

        ellipse(0, 0, random(diameter, diameter + 4));
        ellipse(0, 0, random(diameter/8, diameter/8 + 4));
    }
    ovule.velocity.y = 0;
    ovule.maxSpeed = 8;
}

function createSpermatozoom() {
    if (frameCount % 20 == 0) {

        let diameterX = height/16;
        let diameterY = height/32;

        spermatozoom = createSprite(width, random(height), diameterX, diameterY);

        spermatozoom.draw = function() {
            fill(255);
            noStroke();
            ellipse(0, 0, random(diameterX, diameterX + 4), random(diameterY, diameterY + 4));

            fill(255, 128);
            ellipse(height/16, 0, random(diameterX * 2, diameterX * 2 + 4), random(diameterY/16, diameterY/16 + 4));
        }
        spermatozoom.velocity.x = random(-4, -8);
        spermatozoom.life = 512;

        sperm.add(spermatozoom);
    }
}

function score() {
    pontuation = 0;
    scoreBoard.innerHTML = pontuation;

    chronometer = setInterval( () => { 
        pontuation += 1; 
        scoreBoard.innerHTML = pontuation;
    }, 1000);
}

function checkScreenLimits() {
    if (ovule.position.y > height - diameter/2 - 4) {
        ovule.position.y = height - diameter/2 - 4;
        ovule.velocity.y = 0;
    }
    else if (ovule.position.y < 0 + diameter/2 + 4) {
        ovule.position.y = 0 + diameter/2 + 4;
        ovule.velocity.y = 0;
    }
}

function gameOver() {
    
    ovule.remove();
    sperm.removeSprites();

    pontuation = 0;
    clearInterval(chronometer);

    setup();
}
