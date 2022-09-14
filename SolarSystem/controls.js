/** --------------------------------------------------------------------------
 * GESTIONE DEL MOUSE
 * --------------------------------------------------------------------------- */ 

var  controls = {
  amortization : 0.95,
  drag : false,
  old_x : 0,
  old_y : 0,
  dX : 0,
  dY : 0,
  rotation : true,
  rotationSpeed: 0.00001,
}

var mouseDown=function(e) {
  controls.drag=true;
  controls.old_x=e.pageX, controls.old_y=e.pageY;
  e.preventDefault();
  return false;
};

var mouseUp=function(e){
  controls.drag=false;
};

var mouseMove=function(e) {
  if (!controls.drag) return false; 
  controls.dX=(e.pageX-controls.old_x)*2*Math.PI/canvas.width, 
  controls.dY=(e.pageY-controls.old_y)*2*Math.PI/canvas.height; 
  camera.YcameraAngleRadians-=controls.dX;
  camera.XcameraAngleRadians-=controls.dY;
  controls.old_x=e.pageX, controls.old_y=e.pageY; 
  e.preventDefault();
};

var wheelZoom = function(event){
  //console.log(camera.D);
  if (event.deltaY < 0 /*&& camera.D<= 1000*/) {
    camera.D += Math.abs(event.deltaY);
  } else if (event.deltaY > 0 /*&& camera.D>= 100*/) {
    camera.D -= Math.abs(event.deltaY);
  }
  event.preventDefault();
}

function doKeyUp(e){
  //Space key
  if (e.keyCode == 32) 
  controls.rotation = !controls.rotation;
  //M key
  if (e.keyCode == 77 && controls.rotationSpeed < 0.001) 
  controls.rotationSpeed *= 10;
  //L key 
  if (e.keyCode == 76 && controls.rotationSpeed > 0.0000010000000000000002) 
  controls.rotationSpeed /= 10;
}

function controlsSettings(canvas){
  canvas.onmousedown=mouseDown;
  canvas.onmouseup=mouseUp;
  canvas.mouseout=mouseUp;
  canvas.onmousemove=mouseMove;
  canvas.addEventListener('wheel', wheelZoom, false);
  window.addEventListener('keyup', doKeyUp, false);
}