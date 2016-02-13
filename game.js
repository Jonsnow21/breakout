document.addEventListener('DOMContentLoaded',domloaded,false);
function domloaded(){
	var canvas = document.getElementById("myCanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var ctx = canvas.getContext("2d");

	var x = canvas.width / 2;
	var y = canvas.height - 30;

	var dx = 4;
	var dy = -4;

	var ballRadius = 10;

	var paddleWidth = 120;
	var paddleHeight = 12;
	var paddleX = ( canvas.width - paddleWidth ) / 2;
	
	var rightPressed = false;
	var leftPressed = false;

	var brickRowCount = 5;
	var brickColumnCount = 15;
	var brickWidth = 75;
	var brickHeight = 20;
	var brickPadding = 10;
	var brickOffsetTop = 50;
	var brickOffsetLeft = 50;

	var score = 0;

	var lives = 3;

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
		if(relativeX > 0 && relativeX < canvas.width) 
		{
        	paddleX = relativeX - paddleWidth / 2;
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
					ctx.fillStyle = "#CC3300";
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
		} 
		else if( y + dy > canvas.height - ballRadius)
		{
			if( x > paddleX && x < paddleX + paddleWidth )
			{
				dy = -dy;
			}
			else
			{
				lives--;
				if( !lives ) 
				{
	                alert("GAME OVER");			                
	                document.location.reload();
				}
	            else 
	            {
	                x = canvas.width/2;			                
	                y = canvas.height-30;
				    dx = 5;
				    dy = -5;
				    paddleX = (canvas.width-paddleWidth)/2;
				}
			}
		}

		if( x + dx > canvas.width - ballRadius || x + dx < ballRadius )
		{
			dx = - dx;
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
		requestAnimationFrame(draw);
	}
	draw();
}
