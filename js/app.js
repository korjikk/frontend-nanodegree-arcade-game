//updates the score bar
function updateScoreBar(gamesLost, gamesWon) {
    if (gamesLost != undefined) {
        document.querySelector('.gamesLostValue').textContent = gamesLost;
    }
    if (gamesWon != undefined) {
        document.querySelector('.gamesWonValue').textContent = gamesWon;
    }
}

//resets the score and put the player to it's initial positon
function resetGame() {
    gamesLost = 0;
    gamesWon = 0;
    updateScoreBar(gamesLost, gamesWon);
    player.setInitialCoordinates();
}

// Enemies our player must avoid
var Enemy = function () {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    //initial coordonates
    this.x = 0;
    this.y = 0;
    //initial speed
    this.speed = 0;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    if (this.y === player.y && Math.floor((this.x + 50) / 100) === player.x / 100) {
        player.setInitialCoordinates();
        gamesLost++;
        updateScoreBar(gamesLost);
    }
    //if the enemy object has crossed the screen
    if (this.x > 505) {
        //reset the position when the object is out of view
        this.x = -100;
        //set a random y positon (random row)
        this.setRandomRowCoordinate();
        //set a new random speed
        this.setRandomSpeed(100, 250);
    }
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    //move the enemy object horizontaly
    this.x += this.speed * dt;

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//sets the speed of the enemy object to a random value between the min and max arguments
Enemy.prototype.setRandomSpeed = function (min, max) {
    //sets speed to a random value within the interval
    this.speed = Math.random() * (max - min) + min;
};

//puts the enemy object on a random 'concrete' row
Enemy.prototype.setRandomRowCoordinate = function () {
    //the array of possible Y values (to situate the "enemy" on one of the three concrete rows)
    var possibleYValues = [60, 145, 230];
    //sets Y to a random value from the possibleYValues array
    this.y = possibleYValues[Math.floor(Math.random() * possibleYValues.length)];
};

// the Player class
var Player = function () {
    // The image/sprite for our player, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
    this.x = 0;
    this.y = 0;
};


Player.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

Player.prototype.setInitialCoordinates = function () {
    this.y = 400;
    this.x = 200;
};

//handles the movement of the player
Player.prototype.handleInput = function (dt) {
    var verticalMove = 85;
    var horizontalMove = 100;

    //check if the water tile is reached
    if (dt === 'up' && this.y - verticalMove < 0) {
        //resets the player coordinates;
        this.setInitialCoordinates();
        gamesWon++;
        updateScoreBar(null, gamesWon);
        return;
    }
    //check if the move would be out of bound
    else if ((dt === 'down' && this.y + verticalMove > 400) ||
        (dt === 'left' && this.x - horizontalMove < 0) || (dt === 'right' && this.x + horizontalMove > 400)
    ) {
        return;
    }
    else {
        switch (dt) {
            case 'up': {
                this.y -= verticalMove;
                break;
            }
            case 'down': {
                this.y += verticalMove;
                break;
            }
            case 'left': {
                this.x -= horizontalMove;

                break;
            }
            case 'right': {
                this.x += horizontalMove;

                break;
            }
        }
    }

};

// Draw the enemy on the screen, required method for game
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//instantiating the enemies objects and pushing them to the allEnemies array;
var allEnemies = [];
//create 4 enemy objects
for (var i = 0; i < 4; i++) {
    var newEnemy = new Enemy();
    //randomly set an Y value, so the enemy object will be on a random 'concrete' row
    newEnemy.setRandomRowCoordinate();
    //set a new random speed
    newEnemy.setRandomSpeed(100, 300);
    //place it off screen
    newEnemy.x = -100;

    allEnemies.push(newEnemy);
}

//instantiate the player object
var player = new Player();
//set the staring coordinates
player.setInitialCoordinates();

//global variables to store the game state
var gamesWon = 0;
var gamesLost = 0;
updateScoreBar(gamesWon, gamesLost);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
