/** --------------------------------------------------------------------------
 * GESTIONE DEL MOUSE
 * --------------------------------------------------------------------------- */

var controls = {
  amortization: 0.95,
  drag: false,
  old_x: 0,
  old_y: 0,
  dX: 0,
  dY: 0,
  rotation: true,
  rotationSpeed: 0.00001,
}

//Quando viene premuto il tasto sinistro del mouse
var mouseDown = function (e) {
  controls.drag = true;
  controls.old_x = e.pageX, controls.old_y = e.pageY;
  e.preventDefault();
  return false;
};

//Quando viene rilasciato il tasto sinistro del mouse
var mouseUp = function (e) {
  controls.drag = false;
};

//Moviemnto del mouse
var mouseMove = function (e) {
  if (!controls.drag) return false;
  controls.dX = (e.pageX - controls.old_x) * 2 * Math.PI / canvas.width,
    controls.dY = (e.pageY - controls.old_y) * 2 * Math.PI / canvas.height;
    GUI.YcameraAngleRadians -= controls.dX;
    GUI.XcameraAngleRadians -= controls.dY;
  controls.old_x = e.pageX, controls.old_y = e.pageY;
  e.preventDefault();
};

//Quando viene ruotata la rotella del mouse
var wheelZoom = function (event) {
  //console.log(camera.D);
  if (event.deltaY < 0 /*&& camera.D<= 1000*/ ) {
    GUI.D += Math.abs(event.deltaY);
  } else if (event.deltaY > 0 /*&& camera.D>= 100*/ ) {
    GUI.D -= Math.abs(event.deltaY);
  }
  event.preventDefault();
}
//Quando viene rilasciato un tasto
function doKeyUp(e) {
  //tasto C per fermare la rotazione 
  if (e.keyCode == 67)
    controls.rotation = !controls.rotation;
  //tasto X aumenta velocità
  if (e.keyCode == 88 && controls.rotationSpeed < 0.001)
    controls.rotationSpeed *= 10;
  //tasto Z diminuisce velocità
  if (e.keyCode == 90 && controls.rotationSpeed > 0.0000010000000000000002)
    controls.rotationSpeed /= 10;
}

//Event listener di tutti gli eventi sopra elencati 
function controlsSettings(canvas) {
  canvas.onmousedown = mouseDown;
  canvas.onmouseup = mouseUp;
  canvas.mouseout = mouseUp;
  canvas.onmousemove = mouseMove;
  canvas.addEventListener('wheel', wheelZoom, false);
  window.addEventListener('keyup', doKeyUp, false);
}