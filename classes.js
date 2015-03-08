function Point(x, y) { 
	this.x = x;
	this.y = y;
}

function Pen() {
	this.points = [];
	this.color;
	this.linewidth;
	this.tooltypeID = 1;
}

Pen.prototype.add = function(p, c, lw, s) {
	this.points.push(p);
	this.color = c;

	if(s < 8) {
		$("#Size").val(8);
	} else if(s > 24) {
		$("#Size").val(24);
	} 

	if(lw < 1) {
		this.linewidth = 1;
		$("#Width").val(1);
	} else if(lw > 12) {
		this.linewidth = 12;
		$("#Width").val(12);
	} else {
		this.linewidth = lw;
	}
}

Pen.prototype.draw = function(context) {
	context.beginPath();
	context.lineWidth = this.linewidth;
	context.strokeStyle = this.color;
	for ( var i = 0; i < this.points.length; i++ ) {
		var current = this.points[i];
		if ( i === 0 ) {
			context.moveTo(current.x, current.y);
		} else {
			context.lineTo(current.x, current.y);
			context.stroke();
		}
	}
	context.closePath();
}

function Line() {
	this.start;
	this.end;
	this.color;
	this.linewidth;
	this.tooltypeID = 2;
}

Line.prototype.add = function(p, c, lw, s) {
	if ( this.start === undefined ) {
		this.start = p;
		this.end = p;
	} else {
		this.end = p;
	}
	this.color = c;

	if(s < 8) {
		$("#Size").val(8);
	} else if(s > 24) {
		$("#Size").val(24);
	}

	if(lw < 1) {
		this.linewidth = 1;
		$("#Width").val(1);
	} else if(lw > 12) {
		this.linewidth = 12;
		$("#Width").val(12);
	} else {
		this.linewidth = lw;
	}
}

Line.prototype.draw = function(context) {
	context.beginPath();
	context.strokeStyle = this.color;
	context.lineWidth = this.linewidth;
    context.moveTo(this.start.x, this.start.y);
    context.lineTo(this.end.x, this.end.y);
    context.stroke();
    context.closePath();
}

function Rectangle() {
	this.start;
	this.end;
	this.color;
	this.linewidth;
	this.width;
	this.height;
	this.tooltypeID = 3;
}

Rectangle.prototype.add = function(p, c, lw, s) {
	if ( this.start === undefined ) {
		this.start = p;
		this.end = p;
	} else {
		this.end = p;
	}
	this.color = c;

	if(s < 8) {
		$("#Size").val(8);
	} else if(s > 24) {
		$("#Size").val(24);
	} 

	if(lw < 1) {
		this.linewidth = 1;
		$("#Width").val(1);
	} else if(lw > 12) {
		this.linewidth = 12;
		$("#Width").val(12);
	} else {
		this.linewidth = lw;
	}
	this.width = this.end.x - this.start.x;
	this.height = this.end.y - this.start.y;
}

Rectangle.prototype.draw = function(context) {
	context.beginPath();
	context.strokeStyle = this.color;
	context.lineWidth = this.linewidth;
	context.strokeRect(this.start.x, this.start.y, this.width, this.height);
	context.closePath();
}

function Circle() {
	this.start;
	this.end;
	this.color;
	this.linewidth;
	this.rad;
	this.tooltypeID = 4;
}

Circle.prototype.add = function(p, c, lw, s) {
	if ( this.start === undefined ) {
		this.start = p;
		this.end = p;
	} else {
		this.end = p;
	}
	this.color = c;

	if(s < 8) {
		$("#Size").val(8);
	} else if(s > 24) {
		$("#Size").val(24);
	}

	if(lw < 1) {
		this.linewidth = 1;
		$("#Width").val(1);
	} else if(lw > 12) {
		this.linewidth = 12;
		$("#Width").val(12);
	} else {
		this.linewidth = lw;
	}

	var xs = this.end.x - this.start.x;
	var ys = this.end.y - this.start.y;
	
	xs = xs * xs;
	ys = ys * ys;

	this.rad = Math.sqrt( xs + ys );

}

Circle.prototype.draw = function(context) {
	context.beginPath();
	context.strokeStyle = this.color;
	context.lineWidth = this.linewidth;
	context.arc(this.start.x, this.start.y, this.rad, 0, (2 * Math.PI));
	context.stroke();
	context.closePath();
}

function Text() {
	this.start;
	this.end;
	this.txt;
	this.font;
	this.size;
	this.color;
	this.tooltypeID = 5;
}

Text.prototype.add = function(p, txt, c, lw, s, f) {
	this.start = p;
	this.txt = txt;

	if(s < 8) {
		this.size = 8;
		$("#Size").val(8);

	} else if(s > 24) {
		this.size = 24;
		$("#Size").val(24);
	} else {
		this.size = s;
	}

	if(lw < 1) {
		$("#Width").val(1);
	} else if(lw > 12) {
		$("#Width").val(12);
	} 

	this.color = c;
	this.font = f;
}

Text.prototype.draw = function(context) {
	context.beginPath();
	context.fillStyle = this.color;
	context.font = this.size + "px " + this.font;
	context.fillText(this.txt, this.start.x, this.start.y);
	context.closePath();
}

function Image(data)  {
	this.imageData = data;
}

Image.prototype.draw = function(context) {
	context.putImageData(this.imageData,0,0);
}