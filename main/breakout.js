// Breakout by Kevin Hudson June 2018


var canvas1 = document.getElementById('canvas').getContext('2d');


var WIDTH = 500;
var HEIGHT = 500;
var numOfTiles, tileList, score, intervalVar, hitCount, isPaused, running = false;
canvas1.font = '20px Calibri';

canvas1.save();
canvas1.fillStyle = 'white';
canvas1.fillRect(0, 0, WIDTH, HEIGHT);
canvas1.restore();


canvas1.save();
canvas1.fillStyle = 'red';
canvas1.fillText('Click anywhere to Start', 150, 150);
canvas1.restore();



var tile = {
  height: 20,
  width: 40,
  color: 'orange'
};

var ball = {
  x: 0,
  y: 0,
  sizePixel: 5,
  color: 'blue',
  spdX: -5,
  spdY: -5
};

var base = {
  x: 0,
  y: 400,
  height: 10,
  width: 150,
  color: 'red',
  pressingLeft: false,
  pressingRight: false,
  lives: 3
};

soundEffects = function(src) {

  this.soundEffects = document.createElement("audio");
  this.soundEffects.src = src;
  this.soundEffects.setAttribute("id", "soundFX");
  this.soundEffects.setAttribute("preload", "auto");
  //this.soundEffects.setAttribute("volume","0.1");
  this.soundEffects.setAttribute("controls", "none");
  this.soundEffects.style.display = "none";
  document.body.appendChild(this.soundEffects);
  this.play = function() {
    document.getElementById("soundFX").volume = 1;
    this.soundEffects.play();

  }
  this.stop = function() {

    this.soundEffects.pause();
    this.soundEffects.currentTime = 0;
  }
}

deathAudio = new soundEffects('soundfx/death2.wav');
paddleBounce = new soundEffects('soundfx/sfx_sounds_Blip6.wav');
ballBounce = new soundEffects('soundfx/sfx_sounds_Blip1.wav');
pauseSoundIn = new soundEffects('soundfx/sfx_sounds_pause7_in.wav');
pauseSoundOut = new soundEffects('soundfx/sfx_sounds_pause7_out.wav');

document.getElementById('canvas').onmousedown = function() {
  if (running) {
    running = false;
    ball.spdX = -5;
    ball.spdY = -5;
    clearInterval(intervalVar);
  }
  startGame();
};

/*document.onkeydown = function(event) {
  if (event.keycode == 32) {
      isPaused = true;
    } else {
      isPaused = false;
    }
  };*/



document.onkeydown = function(event) {
  if (event.keyCode == 32 ) {

    if (isPaused ) {
      pauseSoundIn.play();
      isPaused = false;
    } else {
      isPaused = true;
      pauseSoundOut.play();
    }

  }
  if ((event.keyCode == 37) || event.keyCode == 65) {
    base.pressingLeft = true;
    base.pressingRight = false;
  } else if ((event.keyCode == 39) || event.keyCode == 68) {
    base.pressingRight = true;
    base.pressingLeft = false;
  }
};


document.onkeyup = function(event) {
  if ((event.keyCode == 37) || event.keyCode == 65) {
    base.pressingLeft = false;

  } else if ((event.keyCode == 39) || event.keyCode == 68) {
    base.pressingRight = false;
  }
};

drawTile = function(t, i) {
  canvas1.save();
  canvas1.fillStyle = tile.color;
  canvas1.fillRect(t.x, t.y, tile.width, tile.height);
  canvas1.restore();
};

drawBall = function() {
  canvas1.save();
  canvas1.fillStyle = ball.color;
  canvas1.beginPath();
  canvas1.arc(ball.x, ball.y, ball.sizePixel, 0, 2 * Math.PI);
  canvas1.fill();
  canvas1.restore();
};

drawBase = function() {

  canvas1.save();
  canvas1.fillStyle = base.color;
  canvas1.fillRect(base.x, base.y, base.width, base.height);
  canvas1.restore();
};

isGameOver = function() {
  if (base.lives < 0) {
    clearInterval(intervalVar);

    deathAudio.play();
    canvas1.save();
    canvas1.fillStyle = 'red';
    canvas1.fillText('Game Over! Click to restart the game', 120, 250);
    canvas1.restore();

  } else if (score == 275) {
    clearInterval(intervalVar);
    canvas1.save();
    canvas1.fillStyle = 'green';
    canvas1.fillText('YOU WIN!! GREAT JOB! Click anywhere to begin again..', 140, 250);
    canvas1.restore();
  }

}

updateBallPosition = function() {
  ball.x += ball.spdX;
  ball.y += ball.spdY;
  if (ball.x > WIDTH || ball.x < 0) {
    hitCount++;
    ballBounce.play();
    if (hitCount % 10 == 0) {
      if (ball.spdX < 0) {
        ball.spdX = -(Math.abs(ball.spdX) + 1);
      } else {
        ball.spdX += 1;
      }
    }
    ball.spdX = -ball.spdX;
  }
  if (ball.y < 0) {
    hitCount++;
    ballBounce.play();
    if (hitCount % 10 == 0) {
      if (ball.spdY < 0) {
        ball.spdY = -(Math.abs(ball.spdY) + 1);
      } else {
        ball.spdY += 1;
      }
    }
    ball.spdY = -ball.spdY;

  }
  if (ball.y > HEIGHT) {
    hitCount++;
    ballBounce.play();
    if (hitCount % 10 == 0) {
      if (ball.spdY < 0) {
        ball.spdY = -(Math.abs(ball.spdY) + 1);
      } else {
        ball.spdY += 1;
      }
    }
    ball.spdY = -ball.spdY;
    base.lives--;
  }
};

updateBasePosition = function() {
  if (base.pressingLeft) {
    base.x = base.x - 5;
  } else if (base.pressingRight) {
    base.x = base.x + 5;
  }
  if (base.x < 0) {
    base.x = 0;
  }
  if (base.x > WIDTH - base.width) {
    base.x = WIDTH - base.width;
  }

};

//collision handling for the ball and base paddle
testCollision = function(base, ball) {

  return ((base.x < ball.x + 2 * ball.sizePixel) &&
    (ball.x < base.x + base.width) &&
    (base.y < ball.y + 2 * ball.sizePixel) &&
    (ball.y < base.y + base.height));


};
// collision handling for the tile and ball
testCollisionTile = function(t, ball) {

  return ((t.x < ball.x + 2 * ball.sizePixel) &&
    (ball.x < t.x + tile.width) &&
    (t.y < ball.y + 2 * ball.sizePixel) &&
    (ball.y < t.y + tile.height));

};

// main update function to move objects and clear the game
update = function() {
  if (!isPaused) {
    canvas1.clearRect(0, 0, WIDTH, HEIGHT);
    canvas1.fillStyle = 'white';
    canvas1.fillRect(0, 0, WIDTH, HEIGHT);
    tileList.forEach(drawTile);
    drawBall();
    drawBase();
    if (testCollision(base, ball)) {
      paddleBounce.play();
      ball.spdY = -ball.spdY;
    }
    for (key in tileList) {
      if (testCollisionTile(tileList[key], ball)) {
        delete tileList[key];
        ballBounce.play();
        ball.spdY = -ball.spdY;
        score += 5;
      }
    }

    canvas1.save();
    canvas1.fillStyle = 'green';
    canvas1.fillText("Score: " + score, 5, 495);
    canvas1.fillText("Lives: " + base.lives, 430, 495);
    canvas1.restore();
    isGameOver();
    updateBasePosition();
    updateBallPosition();
  } else {

    canvas1.save();
    canvas1.fillStyle = 'blue';
    canvas1.fillText("Game Paused", 200, 250);
    canvas1.restore();
  }
};




startGame = function() {

  base.x = 150;
  ball.x = base.x + 100;
  ball.y = base.y - 100;
  numOfTiles = 0;
  var tileX = 5;
  var tileY = 5;
  tileList = [];
  isPaused = false;
  score = 0;
  base.lives = 3;
  hitCount = 0;
  running = true;
  for (var i = 1; i < 6; i++) {
    tileX = 5;
    for (var j = 1; j < 12; j++) {
      tileList[numOfTiles] = {
        x: tileX,
        y: tileY
      };
      numOfTiles++;
      tileX += 45;
    }
    tileY += 25;
  }
  intervalVar = setInterval(update, 20);
};
