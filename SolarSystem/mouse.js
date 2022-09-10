/** --------------------------------------------------------------------------
 * GESTIONE DEL MOUSE
 * --------------------------------------------------------------------------- */ 
var  mouse = {
  amortization : 0.95,
  drag : false,
  old_x : 0,
  old_y : 0,
  dX : 0,
  dY : 0
}

var mouseDown=function(e) {
  mouse.drag=true;
  mouse.old_x=e.pageX, mouse.old_y=e.pageY;
  e.preventDefault();
  return false;
};

var mouseUp=function(e){
  mouse.drag=false;
};

var mouseMove=function(e) {
  if (!mouse.drag) return false; 
  mouse.dX=(e.pageX-mouse.old_x)*2*Math.PI/canvas.width, 
  mouse.dY=(e.pageY-mouse.old_y)*2*Math.PI/canvas.height; 
  camera.YcameraAngleRadians-=mouse.dX;
  camera.XcameraAngleRadians-=mouse.dY;
  mouse.old_x=e.pageX, mouse.old_y=e.pageY; 
  e.preventDefault();
};

var wheelZoom = function(event){
  if (event.deltaY < 0) {
    camera.D += Math.abs(event.deltaY);
  } else if (event.deltaY > 0) {
    camera.D -= Math.abs(event.deltaY);
  }
  event.preventDefault();
}

function mouseSettings(canvas){
  canvas.onmousedown=mouseDown;
  canvas.onmouseup=mouseUp;
  canvas.mouseout=mouseUp;
  canvas.onmousemove=mouseMove;
  canvas.addEventListener('wheel', wheelZoom, false);
}