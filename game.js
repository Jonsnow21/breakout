document.addEventListener('DOMContentLoaded',domloaded,false);
function domloaded(){
	var canvas = document.getElementById("myCanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var ctx = canvas.getContext("2d");

	var x = canvas.width / 2;
	var y = canvas.height - 23;

	var dx = 6;
	var dy = -6;

	var ballRadius = 10;

	var paddleWidth = 120;
	var paddleHeight = 12;
	var paddleX = ( canvas.width - paddleWidth ) / 2;
	
	var rightPressed = false;
	var leftPressed = false;

	var brickWidth = 75;
	var brickHeight = 20;
	var brickRowCount = 5;
	var brickColumnCount = Math.floor(( canvas.width - 100 ) / 75) - 1;
	var brickPadding = 10;
	var brickOffsetTop = 50;
	var brickOffsetLeft = 50;

	var score = 0;

	var lives = 3;

	var isPaused = true;

	var count = 0;

	var soundFx = document.getElementById("soundFx");
	var brickHit = document.getElementById("brickHit");
	var gameOver = document.getElementById("gameOver");

	var bricks = [];
	for( i = 0; i < brickColumnCount; i++ )
	{
		bricks[i] = [];
		for( j = 0; j < brickRowCount; j++ )
		{
			bricks[i][j] = { x : 0, y : 0, status : 1 };
		}
	} 

	document.addEventListener( "keydown", keyDownHandler, false );
	document.addEventListener( "keyup", keyUpHandler, false );
	document.addEventListener( "mousemove", mouseMoveHandler, false );

	function keyDownHandler(e) 
	{
		if( e.keyCode ==  39 ) 
		{
			rightPressed = true;
		}
		else if( e.keyCode == 37 )
		{
			leftPressed = true;
		}
		if (e.keyCode == 80 && isPaused === false) 
		{	
			isPaused = true;
		}
		if( e.keyCode == 13 && isPaused === true )
		{
			isPaused = false;
			soundFx.play();
			draw();
		}
	}

	function keyUpHandler(e)
	{
		if( e.keyCode == 39 )
		{
			rightPressed = false;
		}
		else if( e.keyCode == 37 )
		{
			leftPressed = false;
		}
	}

	function mouseMoveHandler(e)
	{
		var relativeX = e.clientX - canvas.offsetLeft;
		if(relativeX > 0 && relativeX < canvas.width ) 
		{
			if( isPaused === false )
        	{	
        		paddleX = relativeX - paddleWidth / 2;
        	}
    	}
	}

	function drawBall() 
	{
		ctx.beginPath();
		ctx.arc( x, y, ballRadius, 0, Math.PI*2 );
		ctx.fillStyle = "#FF0000";
		ctx.fill();
		ctx.closePath();
	}

	function drawPaddle() 
	{
		ctx.beginPath();
		ctx.rect( paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight );
		ctx.fillStyle = "#33CC33";
		ctx.fill();
		ctx.closePath();
	}

	function drawBricks()
	{
		for( i = 0; i < brickColumnCount; i++ )
		{
			for( j = 0; j < brickRowCount; j++ )
			{
				if( bricks[i][j].status == 1 )
				{
					var brickX = (i * ( brickWidth + brickPadding )) + brickOffsetLeft;
					var brickY = (j * (brickHeight + brickPadding ) )+ brickOffsetTop;
					bricks[i][j].x = brickX;
					bricks[i][j].y = brickY;
					ctx.beginPath();
					ctx.rect( brickX, brickY, brickWidth, brickHeight );
					ctx.fillStyle = "#b30000";
					ctx.fill();
					ctx.closePath();
				}
			}
		}
	}

	function collisionDetection()
	{
		for( i = 0; i < brickColumnCount; i++ )
		{
			for( j = 0; j < brickRowCount; j++ )
			{
				var b = bricks[i][j];
				if( b.status == 1 )
				{
					if( x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight ) 
					{
						dy = -dy;
						brickHit.play();
						b.status = 0;
						score++;
						if( score == brickColumnCount * brickRowCount )
						{
							alert( " You Win, Congratulations!")
							document.location.reload();
						}
					}
				}
			}
		}
	}

	function drawScore(){
		ctx.font = "30px Arial";
		ctx.fillStyle = "#006600";
		ctx.fillText("Score: " + score, 10, 30 );
	}

	function drawLives() 
	{
    	ctx.font = "30px Arial";
    	ctx.fillStyle = "#006600";
    	ctx.fillText("Lives: "+lives, canvas.width-120, 30);
	}

	/*function drawInstruction()
	{
		ctx.font = "30px Arial";
		ctx.fillStyle = "#006600";
		ctx.fillText("Press enter to start and p to pause", canvas.width/2, canvas.height/2);
	}*/

		
	window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
	})();

	function draw() 
	{
		ctx.clearRect( 0, 0, canvas.width, canvas.height );
		drawBricks();
		drawBall();
		drawPaddle();
		drawScore();
		drawLives();
		collisionDetection();
		
		if( y + dy < ballRadius )
		{
			dy = -dy;
			soundFx.play();
		} 
		else if( y > canvas.height )
		{
			if( x > paddleX && x < paddleX + paddleWidth )
			{
				dy = -dy;
				soundFx.play();
				if( ( x < paddleX + paddleWidth / 2 && dx > 0 ) || ( x > paddleX + paddleWidth / 2 && dx < 0 ) )
				{
					dx = -dx;
				}
			}
			else
			{
				lives--;
				if( !lives ) 
				{
					gameOver.play();
	                alert("GAME OVER");			                
	                document.location.reload();
				}
	            else 
	            {
	            	gameOver.play();
	                x = canvas.width/2;			                
	                y = canvas.height-15;
				    dx = 8;
				    dy = -8;
				    paddleX = (canvas.width-paddleWidth)/2;
				    count = 0;
				}
			}
		}

		if( x + dx > canvas.width - ballRadius || x + dx < ballRadius )
		{
			dx = -dx;
			soundFx.play();
		}

		if( rightPressed && paddleX < canvas.width - paddleWidth )
		{
			paddleX += 7;
		}

		if( leftPressed && paddleX > 0 )
		{
			paddleX -= 7;
		}

		x += dx;
		y += dy;

		if (isPaused) {
        	Update();
    	}

    	if( count === 0 && lives < 3 )
    	{
    		isPaused = true;
    	}

    	count++;

		requestAnimationFrame(draw);
	}
	draw();
}

