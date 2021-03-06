var myCanvas, ctx;
var pencils, currentPencil;

var tools = {};

tools.pencil = function(col, sz) {
  var tool = this;
  this.started = false;
  this.strokeColor = col;
  this.strokeSize = sz;

  this.mousedown = function (ev) {
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = this.strokeSize;
    ctx.beginPath();
    ctx.moveTo(ev._x, ev._y);
    tool.started = true;
    /* play drawing sound */
  };

  this.mousemove = function (ev) {
    if (tool.started) {
      ctx.lineTo(ev._x, ev._y);
      ctx.stroke();
      /* play drawing sound */
    }
  };

  this.mouseup = function (ev) {
    /* pause drawing sound */
    if (tool.started) {
      tool.mousemove(ev);
    }
    tool.started = false;
  };
};

tools.eraser = function (sz) {
  var tool = new tools.pencil('rgba(0,0,0,0)', sz);

  this.mousedown = function (ev) {
    ctx.save();
    ctx.globalCompositeOperation = 'copy';
    tool.mousedown(ev);
    /* play erasing sound */
  };
  
  this.mousemove = tool.mousemove;

  this.mouseup = function (ev) {
    tool.mouseup(ev);
    ctx.restore();
    /* pause erasing sound */
  };
};


var initDraw = function() {
  
    myCanvas = $('#canvas');
  
    ctx = myCanvas[0].getContext('2d');
	ctx.lineCap = 'round';  
	
    currentPencil = new tools.pencil("#000", 8);
  
    myCanvas.mousedown(function(evt){
        evt._x = evt.offsetX;
        evt._y = evt.offsetY;
        currentPencil.mousedown(evt);
        /* play drawing sound */
    });
  
    myCanvas.mouseup(function(evt){
        evt._x = evt.offsetX;
        evt._y = evt.offsetY;
        currentPencil.mouseup(evt);
        /* pause drawing sound */
    });
  
    myCanvas.mousemove(function(evt){
        evt._x = evt.offsetX;
        evt._y = evt.offsetY;
        currentPencil.mousemove(evt);
        /* play higher pitched drawing sound */
    });
  
};

var setTool = function(t) {
    currentPencil = t;
}

var clearAll = function() {
  $("#wall").css("opacity", 1.0);
  
  myCanvas[0].width = myCanvas[0].width;
};

