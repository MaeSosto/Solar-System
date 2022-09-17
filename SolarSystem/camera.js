/** --------------------------------------------------------------------------
 * GESTIONE DELLA CAMERA
 * --------------------------------------------------------------------------- */ 
 var dr = 5.0 * Math.PI/180.0;
 
 var camera = {
  D : 700,
  fieldOfViewRadians : degToRad(60),
  YcameraAngleRadians : degToRad(3.14),
  XcameraAngleRadians : degToRad(3.14),
  ZcameraAngleRadians : degToRad(3.14),
  planet: 1,
 }

 var controlsGui = function(){
  this.D = 1;
  this.fieldOfViewRadians = degToRad(60);
  this.YcameraAngleRadians = degToRad(3.14);
  this.XcameraAngleRadians = degToRad(3.14);
  this.ZcameraAngleRadians = degToRad(3.14);
  this.planet = 1;
 }

 function setValue(){
  camera.D = fixDistance(controlsGui.planet) + controlsGui.D;
  camera.YcameraAngleRadians = controlsGui.YcameraAngleRadians;
  camera.XcameraAngleRadians = controlsGui.XcameraAngleRadians;
  camera.ZcameraAngleRadians = controlsGui.ZcameraAngleRadians;
  camera.planet = getNumPlanet(controlsGui.planet);
 }
 
function define_gui(){
  controlsGui = new controlsGui();
  setValue();
  var gui = new dat.GUI();
  gui.add(controlsGui, 'XcameraAngleRadians', 0, 6.28).onChange(setValue);
  gui.add(controlsGui, 'YcameraAngleRadians', 0, 6.28).onChange(setValue);
  gui.add(controlsGui, 'ZcameraAngleRadians', 0, 6.28).onChange(setValue);
  gui.add(controlsGui, 'D', 1, 1000).onChange(setValue);
  gui.add(controls,'rotationSpeed', 0.0000010000000000000002, 0.001).onChange(setValue);
  gui.add(controlsGui, 'planet',["Sun", "Mercury", "Venus", "Earth", "Moon", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"]).onChange(setValue);
}

function getNumPlanet(planet){
  switch (planet){
    case 'Sun':
      return 0;
    case 'Mercury':
      return 2;
    case 'Venus':
      return 3;
    case 'Earth':
      return 4;
    case 'Moon':
      return 5;
    case 'Mars':
      return 6;
    case 'Jupiter':
      return 7;
    case 'Saturn':
      return 8;
    //il 9 sono gli anelli di saturno
    case 'Uranus':
      return 10;
    case 'Neptune':
      return 11;
    default:
      return 0;
  }
}

//Dal numero del pianeta prendo la sua dimensione del raggio
function fixDistance(planet){
  var numPlanet = getNumPlanet(planet);
  if(numPlanet == 0) //Sole
    return (planetsInfo[numPlanet].orbitRad +planetsInfo[numPlanet].scaling + 200);
  if(numPlanet == 5) //moon
    return (moon.orbitRad +moon.scaling );
  if(numPlanet > 7) //pianeti dopo saturno
    return (planetsInfo[numPlanet-2].orbitRad +planetsInfo[numPlanet-2].scaling + 8);
  if(numPlanet > 5) //pianeti dopo la luna
    return (planetsInfo[numPlanet-1].orbitRad +planetsInfo[numPlanet-1].scaling + 5);
  //tutti gli altri pianeti
  return (planetsInfo[numPlanet].orbitRad +planetsInfo[numPlanet].scaling);
}