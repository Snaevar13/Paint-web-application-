$(function() {
	var canvas = document.getElementById("Whiteboard");
	var context = canvas.getContext("2d");
	var tempcontext = undefined;

	var moving = false;
	var drawing = false;
	var selectedindex = 2;

	var shapes = [];
	var redo = [];

	var tool = undefined;
	var toolID = 0;
	var imgData;
	var imgArray = [];

	// --------------------------------- Bætti þessu við
	var imgData;
	var imgArray = [];

	$("#Save").on("click", function() {
		//context.save();
		imgData = context.getImageData(0,0,450,450);
		imgArray.push(imgData);

		if($("#SaveName").val().length === 0) {
			$("#List").append("<option value=" + imgArray.length +">Save "+ imgArray.length +"</option>");
		} else {
			$("#List").append("<option value=" + imgArray.length +">"+ $("#SaveName").val() +"</option>");
		}
	})

	$("#Load").on("click", function() {
		
		if(imgArray.length !== 0) {
			shapes = [];
			redo = [];
			var selecteditemvalue = $("#List").val() - 1;
			context.putImageData(imgArray[selecteditemvalue],0,0);
			var Img = new Image(imgArray[selecteditemvalue]);
			shapes.push(Img);
		}
	})

	// --------------------------------- End

	$("#Pen").on("click", function() {
		toolID = 0;
		console.log("Pen button clicked");
	})

	$("#Line").on("click", function() {
		toolID = 1;
		console.log("Line button clicked");
	})

	$("#Rectangle").on("click", function() {
		toolID = 2;
		console.log("Rectangle button clicked");
	})

	$("#Circle").on("click", function() {
		toolID = 3;
		console.log("Circle button clicked");
	})

	$("#Text").on("click", function() {
		toolID = 4;
		console.log("Text button clicked");
	})

	$("#Select").on("click", function() {
		toolID = 5;
		console.log("Select button clicked");
	})

	function createTool() {
		if ( toolID === 0 ) {
			return new Pen();
		} else if ( toolID === 1 ) {
			return new Line();
		} else if ( toolID === 2 ) {
			return new Rectangle();
		} else if ( toolID === 3 ) {
			return new Circle();
		} else {
			return new Text();
		}
	}

	canvas.onmousedown = function(e) {
		tool = createTool();
		var x = e.clientX - this.offsetLeft;
		var y = e.clientY - this.offsetTop;

		if ( toolID !== 5)
		{	
			drawing = true;
			if ( toolID !== 4 ) {
				tool.add(new Point(x, y), $("#Color").val(), $("#Width").val(), $("#Size").val());
			} else {
				tool.add(new Point(x, y), $("#InputText").val(), $("#Color").val(), $("#Width").val(), $("#Size").val(), $("#Font").val());
			}
		} else if (toolID === 5) {
			moving = true;
			for ( var i = 0; i < shapes.length; i++ ) {
				selecttest(shapes[i], x, y);
			}
		}

		if ( toolID === 4 ) {
			clearBoard();
			drawShapes();
			tool.draw(context);
		}
	}

	//-------------------------Bætti þessu við
	canvas.onmousemove = function(e) {
		var x = e.clientX - this.offsetLeft;
		var y = e.clientY - this.offsetTop;

		if ( drawing ) {
			redo = [];
			if ( toolID !== 5)
			{
				if ( toolID !== 4 ) {
					tool.add(new Point(x, y), $("#Color").val(), $("#Width").val(), $("#Size").val());
				} else {
					tool.add(new Point(x, y), $("#InputText").val(), $("#Color").val(), $("#Width").val(), $("#Size").val(), $("#Font").val());
				}
				
			}
			clearBoard();
			drawShapes();
			if(toolID !== 5 && tool !== undefined && drawing == true) {
				tool.draw(context);
			}		
  		}
  		else if ( moving ) {
	  		if(moving && tempcontext !== undefined && tempcontext.tooltypeID == 1) {
	  			differencex = x 
	  			- tempcontext.points[0].x;
	  			differencey = y - tempcontext.points[0].y;
	  			for(var i = 0; i < tempcontext.points.length; i++) {
	  				if(i == 0) {
	  					//we do nothing
	  					tempcontext.points[0].x = x;
	  					tempcontext.points[0].y = y;
	  				}
	  				else {
	  					tempcontext.points[i].x = tempcontext.points[i].x + differencex;
	  					tempcontext.points[i].y = tempcontext.points[i].y + differencey;
	  				}
	  			}
			}
			else if(moving && tempcontext !== undefined && tempcontext.tooltypeID == 2) {
				tempcontext.end.x = x + (tempcontext.end.x - tempcontext.start.x);
				tempcontext.end.y = y + (tempcontext.end.y - tempcontext.start.y);
				tempcontext.start.x = x;
				tempcontext.start.y = y;
			}
			else if(moving && tempcontext !== undefined && tempcontext.tooltypeID == 3) {
				tempcontext.end.x = x + (tempcontext.end.x - tempcontext.start.x);
				tempcontext.end.y = y + (tempcontext.end.y - tempcontext.start.y);
				tempcontext.start.x = x;
				tempcontext.start.y = y;
			}
			else if(moving && tempcontext !== undefined && tempcontext.tooltypeID == 4) {
				tempcontext.start.x = x;
				tempcontext.start.y = y;
			}
			else if(moving && tempcontext !== undefined && tempcontext.tooltypeID == 5) {
				tempcontext.start.x = x;
				tempcontext.start.y = y;
			}
			clearBoard();
			drawShapes();
		}
	}
	//-------------------------End

	canvas.onmouseup = function(e) {
		if( toolID !== 5) {
			if ( toolID !== 4 ) {
				shapes.push(tool);
			} else if ( $("#InputText").val().length !== 0 ) {
				shapes.push(tool);
			}
		}
		if(moving == true) {
			tempcontext = undefined;
		}
		drawing = false;
		moving = false;
	}

	function clearBoard() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.beginPath();
	}

	function drawShapes() {
		for ( var i = 0; i < shapes.length; i++ ) {
			if(shapes[i].draw(context)) {
				break;
			}
		}
	}

	function selecttest(cntxt, x, y) {
		if (cntxt.tooltypeID == 1) {
			for(var i = 0; i < cntxt.points.length; i++) {
				var xInBounds = cntxt.points[i].x - x;
				var yInBounds = cntxt.points[i].y - y;
				if(xInBounds < 10 && xInBounds > -10 && yInBounds < 10 && yInBounds > -10){
					console.log("im on a pen");
					tempcontext = cntxt;
					selectedindex = i;
					return true;
				}
			}
		} else if (cntxt.tooltypeID == 2) {
			var inline = ( (x - cntxt.start.x) / (cntxt.start.x - cntxt.end.x) ) - ( (y - cntxt.start.y) / (cntxt.start.y - cntxt.end.y) );
			if(inline < 0.05 && inline > -0.1) {
				console.log("im on a line");
				tempcontext = cntxt;
				return true;
			}
		} else if(cntxt.tooltypeID == 3) {
			if(cntxt.start.x <= x && cntxt.start.y <= y && cntxt.end.x >= x && cntxt.end.y >= y ) {
			console.log("im inside a rect");
			tempcontext = cntxt;
			return true;
			}
		} else if (cntxt.tooltypeID == 4 ) {
			if(((x - cntxt.start.x)*(x - cntxt.start.x)) + ((y - cntxt.start.y)*(y - cntxt.start.y)) < (cntxt.rad*cntxt.rad)) {
				console.log("im inside a circle");
				tempcontext = cntxt;
				return true;
			}
		} else if (cntxt.tooltypeID == 5) {
			var textwidth = context.measureText(cntxt.txt).width;
			var endx = cntxt.start.x + textwidth;
			var endy = cntxt.start.y + 10;		
			if(cntxt.start.x <= x && cntxt.start.y <= y && endx >= x && endy >= y ) {
				console.log("im inside a text");
				tempcontext = cntxt;
				return true;
			}
		} else {
			return false;
		}
	}

	$("#Undo").on("click", function(e) {
		if ( shapes[shapes.length - 1] != null ) {
			var undoShape = shapes.pop();
			redo.push(undoShape);
			clearBoard();
			drawShapes();
			tool = undefined;
		}
	});

	$("#Clr").on("click", function(e) {
		clearBoard();
		shapes = [];X
		redo = [];
		tool = undefined;
	});

	$("#Redo").on("click", function(e) {
		if ( redo[redo.length - 1] != null ) {
			var redoShape = redo.pop();
			shapes.push(redoShape);
			clearBoard();
			drawShapes();
			tool = undefined;
		}
	});
});