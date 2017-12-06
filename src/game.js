var w = window.innerWidth;
var h = window.innerHeight;
var ovule, sperm;

function setup() {
    createCanvas(w, h);

    // Ovule Object:
    ovule = createSprite(w - h/8, h/2, h/8, h/8);

    ovule.draw = function() {
        fill(255, 128);
        stroke(255);
        strokeWeight(h/64);

        ellipse(0, 0, random(h/8, h/8 + 8), random(h/8, h/8 + 8));
        ellipse(0, 0, random(h/128, h/128 + 8), random(h/128, h/128 + 8));
    }

    ovule.velocity.y = 0;
    ovule.maxSpeed = 16;

    // Sperm array:
    sperm = new Group();
}

function draw() {
    background(233, 30, 99);

    // Adding spermatozoa in the sperm group and displaying it:
    if (frameCount % 20 == 0) {

        // Spermatozoom Object:
        var spermatozoom = createSprite(0, random(h), h/16, h/32);
        spermatozoom.velocity.x = random(4, 6);
        spermatozoom.life = 512;

        spermatozoom.draw = function() {
            fill(255);
            noStroke();
            ellipse(0, 0, random(h/16, h/16 + 16), random(h/32, h/32 + 8));
        }
        sperm.add(spermatozoom);
    }

    // Defining screen limits:
    if (ovule.position.y >= h - h/16 - 8) {
        ovule.position.y = h - h/16 - 8;
        ovule.velocity.y = 0;
    }
    else if (ovule.position.y <= 0 + h/16 + 8) {
        ovule.position.y = 0 + h/16 + 8;
        ovule.velocity.y = 0;
    }

    // Adding gravity acceleration:
    ovule.addSpeed(0.2, 90);

    // Function to move the ovule:
    if (mouseIsPressed || keyIsPressed) {
        ovule.addSpeed(-0.8, 90);
    }

    // Displaying score:
    if (frameCount % 60 == 0) {
        document.getElementById("score").innerHTML = Math.round(frameCount/60);
    }

    // Game over function:
    if (sperm.overlap(ovule)) {

        alert("GAME OVER\n\nRESTART?");
        location.reload();

        removeSprite(ovule);
        removeSprite(spermatozoom);
    }

    drawSprites();
}