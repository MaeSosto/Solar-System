/** --------------------------------------------------------------------------
 * GESTIONE DELLA CAMERA
 * --------------------------------------------------------------------------- */ 
 var dr = 5.0 * Math.PI/180.0;
 
 var camera = {
   D : 200,
   fieldOfViewRadians : degToRad(60),
   YcameraAngleRadians : degToRad(3.14),
   XcameraAngleRadians : degToRad(3.14),
   ZcameraAngleRadians : degToRad(3.14),
 }
 
 function define_gui(){
   var gui = new dat.GUI();
   gui.add(camera,"YcameraAngleRadians").min(0).max(6.28).step(dr).onChange();
   gui.add(camera,"XcameraAngleRadians").min(0).max(6.28).step(dr).onChange();
   gui.add(camera,"ZcameraAngleRadians").min(0).max(6.28).step(dr).onChange();
 }