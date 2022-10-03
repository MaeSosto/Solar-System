/** --------------------------------------------------------------------------
 * GESTIONE DELLA CAMERA
 * --------------------------------------------------------------------------- */
var dr = 5.0 * Math.PI / 180.0;

var GUI = {
  D: 700,
  fieldOfViewRadians: degToRad(60),
  YcameraAngleRadians: degToRad(3.14),
  XcameraAngleRadians: degToRad(3.14),
  ZcameraAngleRadians: degToRad(3.14),
  planet: 0,
}

//Controlli della Gui modificabili
var controlsGui = function () {
  this.Distance = 1;
  this.Y = degToRad(3.14);
  this.X = degToRad(3.14);
  this.Z = degToRad(3.14);
  this.Planet = "Sun";
  this.Speed = 0.00001;
}

//Disegna la gui
function define_gui() {
  controlsGui = new controlsGui();
  setValue();
  var gui = new dat.GUI();
  gui.add(controlsGui, 'X', 0, 6.28).onChange(setValue);
  gui.add(controlsGui, 'Y', 0, 6.28).onChange(setValue);
  gui.add(controlsGui, 'Z', 0, 6.28).onChange(setValue);
  gui.add(controlsGui, 'Distance', 1, 1000).onChange(setValue);
  gui.add(controlsGui, 'Speed', 0.0000010000000000000002, 0.001).onChange(setValue);
  gui.add(controlsGui, 'Planet', ["Sun", "Mercury", "Venus", "Earth", "Moon", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Me"]).onChange(setValue);
}

//Imposta i valori settati dalla gui all'oggetto camera
function setValue() {
  GUI.D = fixDistance(controlsGui.Planet) + controlsGui.Distance;
  GUI.YcameraAngleRadians = controlsGui.Y;
  GUI.XcameraAngleRadians = controlsGui.X;
  GUI.ZcameraAngleRadians = controlsGui.Z;
  GUI.planet = getNumPlanet(controlsGui.Planet);
  controls.rotationSpeed = controlsGui.Speed;
}

//Dal numero del pianeta prendo la sua dimensione del raggio
function fixDistance(planet) {
  var numPlanet = getNumPlanet(planet);
  if (numPlanet == 0) //Sole
    return (planetsInfo[numPlanet].orbitRad + planetsInfo[numPlanet].scaling + 200);
  if (numPlanet == 5) //moon
    return (moon.orbitRad + moon.scaling);
  if (numPlanet > 8) //pianeti dopo saturno
    return (planetsInfo[numPlanet - 2].orbitRad + planetsInfo[numPlanet - 2].scaling + 8);
  if (numPlanet > 5) //pianeti dopo la luna
    return (planetsInfo[numPlanet - 1].orbitRad + planetsInfo[numPlanet - 1].scaling + 5);
  //tutti gli altri pianeti
  return (planetsInfo[numPlanet].orbitRad + planetsInfo[numPlanet].scaling);
}