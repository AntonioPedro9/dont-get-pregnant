// Global variables:
var w = window.innerWidth;
var h = window.innerHeight;
var ovule, sperm, cron, pontuation;

window.addEventListener("orientationchange", function() {
    location.reload();
}, false);

function setup() {

    createCanvas(w, h);

    // Ovule Object:
    ovule = createSprite(h/8, h/2, h/8, h/8);

    ovule.draw = function() {
        fill(255, 128);
        stroke(255);
        strokeWeight(h/64);

        ellipse(0, 0, random(h/8, h/8 + 4), random(h/8, h/8 + 4));
        ellipse(0, 0, random(h/128, h/128 + 4), random(h/128, h/128 + 4));
    }
    ovule.velocity.y = 0;
    ovule.maxSpeed = 8;

    // Sperm array:
    sperm = new Group();

    // Score functions:
    pontuation = 0;
    document.getElementById("scoreBoard").innerHTML = pontuation;

    cron = setInterval( function() { 
        pontuation = pontuation + 1; 
        document.getElementById("scoreBoard").innerHTML = pontuation;
    }, 1000);
}

function draw() {

    background(233, 30, 99);

    if (frameCount % 20 == 0) {

        // Spermatozoom Object:
        var spermatozoom = createSprite(w, random(h), h/16, h/32);
        spermatozoom.velocity.x = random(-4, -8);
        spermatozoom.life = 512;

        spermatozoom.draw = function() {
            fill(255);
            noStroke();
            ellipse(0, 0, random(h/16, h/16 + 4), random(h/32, h/32 + 4));

            fill(255, 128);
            ellipse(h/16, 0, random(h/8, h/8 + 4), random(h/512, h/512 + 4));
        }

        // Adding spermatozoom to sperm group:
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

    // Function to move the ovule:
    if (mouseIsPressed || keyIsPressed) {
        ovule.addSpeed(-0.8, 90);
    }

    // Game over function trigger:
    if (sperm.overlap(ovule)) {
        //gameOver();
    }

    drawSprites();
}

function gameOver() {

    ovule.remove();
    sperm.removeSprites();

    alert("GAME OVER\nSCORE: " + pontuation);

    pontuation = 0;
    clearInterval(cron);

    setup();
}
