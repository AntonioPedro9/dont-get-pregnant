let w = window.innerWidth;
let h = window.innerHeight;
let warning = document.getElementById("warning");
let scoreBoard = document.getElementById("scoreBoard");
let canvas, ovule, sperm, spermatozoom, chronometer, pontuation;

// Device orientation warning:
if (window.orientation == 0 || window.orientation == 180) { warning.style.display = "block"; }
else { warning.style.display = "none"; }

// Reload the page if the window size change:
window.addEventListener("resize", () => { location.reload(); });

// Reload the page if the orientation change:
window.addEventListener("orientationchange", () => { location.reload(); });

function setup() {

    canvas = createCanvas(w, h);
    canvas.parent("container");

    sperm = new Group();

    // Ovule Object:
    ovule = createSprite(h/8, h/2, h/8, h/8);

    ovule.draw = function() {
        fill(255, 128);
        stroke(255);
        strokeWeight(h/64);

        ellipse(0, 0, random(h/8, h/8 + 4), random(h/8, h/8 + 4));
        ellipse(0, 0, random(h/64, h/64 + 4), random(h/64, h/64 + 4));
    }
    ovule.velocity.y = 0;
    ovule.maxSpeed = 8;

    // Score functions:
    pontuation = 0;
    scoreBoard.innerHTML = pontuation;

    chronometer = setInterval( () => { 
        pontuation = pontuation + 1; 
        scoreBoard.innerHTML = pontuation;
    }, 1000);
}

function draw() {

    background(233, 30, 99);

    // Creating spermatozoom:
    if (frameCount % 20 == 0) {

        // Spermatozoom Object:
        spermatozoom = createSprite(w, random(h), h/16, h/32);

        spermatozoom.draw = function() {

            // Spermatozoom body:
            fill(255);
            noStroke();
            ellipse(0, 0, random(h/16, h/16 + 4), random(h/32, h/32 + 4));

            // Spermatozoom tail:
            fill(255, 128);
            ellipse(h/16, 0, random(h/8, h/8 + 4), random(h/512, h/512 + 4));
        }
        spermatozoom.velocity.x = random(-4, -8);
        spermatozoom.life = 512;

        sperm.add(spermatozoom);
    }

    // Defining screen limits:
    if (ovule.position.y >= h - h/16 - 4) {
        ovule.position.y = h - h/16 - 4;
        ovule.velocity.y = 0;
    }
    else if (ovule.position.y <= 0 + h/16 + 4) {
        ovule.position.y = 0 + h/16 + 4;
        ovule.velocity.y = 0;
    }

    // Adding gravity acceleration:
    ovule.addSpeed(0.2, 90);

    // Adding vertical acerleration:
    if (mouseIsPressed || keyIsPressed) {
        ovule.addSpeed(-0.8, 90);
    }

    // Game over function trigger:
    if (sperm.overlap(ovule)) {
        gameOver();
    }

    drawSprites();
}

function gameOver() {

    ovule.remove();
    sperm.removeSprites();

    pontuation = 0;
    clearInterval(chronometer);

    // Restart the game:
    setup();
}
