/** --------------------------------------------------------------------------
 * GESTIONE DEI NODI
 * --------------------------------------------------------------------------- */
const planetsInfo = [{
    //0
    "name": "Sun",
    "scaling": 116,
    "translation": 0,
    "orbitRotation": 0,
    "sphereRotation": 1993,
    "texture": "../texture/Suntexture.jpg",
    "orbitRad": 0,
    "info": "<b>Sun</b> <br> Radius: 696.340 km <br> Distance: 0 <br> Planet rotation: 1993 m/s <br> Orbit rotation: 0",
  },
  {
    //1
    "name": "Me",
    "scaling": 20,
    "translation": 0,
    "orbitRotation": 0,
    "sphereRotation": 200,
    "texture": "../texture/myStar.png",
    "orbitRad": 0,
    "info": "<b>Me</b> <br> Eccomi fare pausa merenda mentre sviluppo questo progetto",
  },
  {
    //2
    "name": "Mercury",
    "scaling": 0.5,
    "translation": 126,
    "orbitRotation": 43.6,
    "sphereRotation": 3.02,
    "texture": "../texture/Mercurytexture.jpg",
    "orbitRad": 1,
    "info": "<b>Mercury</b> <br> Radius: 2.439,7 km <br> Distance: 4.878 km <br> Planet rotation: 3,0256 m/s <br> Orbit rotation: 47,36 km/s",
  },
  {
    //3
    "name": "Venus",
    "scaling": 1,
    "translation": 135,
    "orbitRotation": 35.02,
    "sphereRotation": 3.02,
    "texture": "../texture/VenusTexture.jpg",
    "orbitRad": 1.071,
    "info": "<b>Venus</b> <br> Radius: 6.051,8 km <br> Distance: 108.200.000 km <br> Planet rotation: 1,81 m/s <br> Orbit rotation: 35,02 km/s",
  },
  {
    //4
    "name": "Earth",
    "scaling": 1,
    "translation": 141,
    "orbitRotation": 29.78,
    "sphereRotation": 465.1,
    "texture": "../texture/EarthTexture.jpg",
    "orbitRad": 1.12,
    "info": "<b>Earth</b> <br> Radius: 6.371 km <br> Distance: 147.098.074 km <br> Planet rotation: 465,11 m/s <br> Orbit rotation: 29,78 km/s",
  },
  { //5
    "name": "Mars",
    "scaling": 0.5,
    "translation": 154.3,
    "orbitRotation": 24.08,
    "sphereRotation": 241.1,
    "texture": "../texture/MarsTexture.jpg",
    "orbitRad": 1.2248,
    "info": "<b>Mars</b> <br> Radius: 3.389,5 km <br> Distance: 254.000.000 km <br> Planet rotation: 241,17 m/s <br> Orbit rotation: 24,07 km/s",
  },
  {
    //6
    "name": "Jupiter",
    "scaling": 11.5,
    "translation": 257,
    "orbitRotation": 12.06,
    "sphereRotation": 12580,
    "texture": "../texture/JupiterTexture.jpg",
    "orbitRad": 2.041,
    "info": "<b>Jupiter</b> <br> Radius: 69.911 km <br> Distance: 778.412.020 km <br> Planet rotation: 12.580 m/s <br> Orbit rotation: 13,06 km/s",
  },
  {
    //7
    "name": "Saturn",
    "scaling": 9.6,
    "translation": 363.3,
    "orbitRotation": 9.64,
    "sphereRotation": 9870,
    "texture": "../texture/SaturnTexture.jpg",
    "orbitRad": 2.8835,
    "info": "<b>Saturn</b> <br> Radius: 69.911 km <br> Distance: 1.426670.000 km <br> Planet rotation: 9870 m/s <br> Orbit rotation: 6,81 km/s",
  },
  {
    //8
    "name": "Uranus",
    "scaling": 4.1,
    "translation": 598.5,
    "orbitRotation": 6.81,
    "sphereRotation": 2590,
    "texture": "../texture/UranusTexture.jpg",
    "orbitRad": 4.75,
    "info": "<b>Uranus</b> <br> Radius: 25.362 km km <br> Distance: 2.870.660.000 km <br> Planet rotation: 2590 m/s <br> Orbit rotation: 5,43 km/s",
  },
  { //9
    "name": "Neptune",
    "scaling": 4,
    "translation": 869.6,
    "orbitRotation": 4.67,
    "sphereRotation": 13.01,
    "texture": "../texture/NeptuneTexture.jpg",
    "orbitRad": 6.902,
    "info": "<b>Neptune</b> <br> Radius: 24.622 km <br> Distance: 4.498.400.000 km <br> Planet rotation: 13,11 m/s <br> Orbit rotation: 4,67 km/s",
  }
];

const moon = {
  "name": "Moon",
  "scaling": 0.16,
  "translation": 1.23,
  "orbitRotation": 1,
  "sphereRotation": 1,
  "texture": "../texture/Moontexture.jpg",
  "orbitRad": 0,
  "info": "<b>Moon</b> <br> Radius: 1.737,4 km <br> Distance from Earth: 382.500 km <br> Planet rotation: 4,627 m/s <br> Orbit rotation: 1 km/s",
}

const SaturnRings = {
  "name": "SaturnRings",
  "scaling": 1,
  "translation": 0,
  "orbitRotation": 1,
  "sphereRotation": 1,
  "texture": "../texture/SaturnRingTexture.png",
  "orbitRad": 0,
}

//Oggetto Node
var Node = function () {
  this.children = [];
  this.localMatrix = m4.identity();
  this.worldMatrix = m4.identity();
};

//Imposta il genitore del dato nodo nella gerachia di nodi
Node.prototype.setParent = function (parent) {
  //ci scolleghiamo dal nostro vecchio parent 
  if (this.parent) {
    var ndx = this.parent.children.indexOf(this);
    if (ndx >= 0) {
      this.parent.children.splice(ndx, 1);
    }
  }

  //Ci aggiungiamo al nuovo parent
  if (parent) {
    parent.children.push(this);
  }
  this.parent = parent;
};

//funzione ricorsiva che moltiplica tutti i sottonodi del parentWolrdMatrix 
Node.prototype.updateWorldMatrix = function (parentWorldMatrix) {
  if (parentWorldMatrix) {
    //Ho passato la matrice del parent
    //quindi moltiplico parentWorldMatrix con la localMatrix e la metto in worldMatrix
    m4.multiply(parentWorldMatrix, this.localMatrix, this.worldMatrix);
  } else {
    // Non ho passato nessuna matrice del parent quindi copio la localMatrix in worldMatrix
    m4.copy(this.localMatrix, this.worldMatrix);
  }

  //Per ogni figlio faccio la ricorsione
  var worldMatrix = this.worldMatrix;
  this.children.forEach(function (child) {
    child.updateWorldMatrix(worldMatrix);
  });
};

//Crea le gerarchie presenti nel sistema solare
function createSolarSystem(planets, orbits, programInfo, sphereBufferInfo, ringBufferInfo, solarSystemNode) {
  planetsInfo.forEach(function (planet) {
    createOrbit(planet, planets, orbits, programInfo, sphereBufferInfo, ringBufferInfo, solarSystemNode);
  });
}

//Crea la gerarchia presente tra una sfera e la sua orbita
function createOrbit(info, planets, orbits, programInfo, sphereBufferInfo, ringBufferInfo, solarSystemNode) {
  //Orbit
  var orbit = new Node();
  orbit.localMatrix = m4.translation(0, 0, info.translation);
  orbit.rotation = info.orbitRotation;

  //Sphere
  var sphere = new Node();
  sphere.localMatrix = m4.scaling(info.scaling, info.scaling, info.scaling);
  sphere.rotation = info.sphereRotation;
  sphere.drawInfo = {
    uniforms: {
      u_texture: createTexture(info.texture),
    },
    programInfo: programInfo,
    bufferInfo: sphereBufferInfo,
  };

  orbit.setParent(solarSystemNode);
  sphere.setParent(orbit);
  planets.push(sphere);
  orbits.push(orbit);

  if (info.name == "Earth")
    createOrbit(moon, planets, orbits, programInfo, sphereBufferInfo, ringBufferInfo, orbit);

  if (info.name == "Saturn") {
    createOrbit(SaturnRings, planets, orbits, programInfo, ringBufferInfo, ringBufferInfo, orbit);
  }
}

//Disegna le orbite gialle dei pianeti
function setOrbits(programInfo, orbitBufferInfo, solarSystemNode) {
  var orbitList = [];

  planetsInfo.forEach(function (planet) {
    var orbit = new Node();
    orbit.localMatrix = m4.scaling(planet.orbitRad, planet.orbitRad, planet.orbitRad);
    orbit.rotation = 0;
    orbit.drawInfo = {
      uniforms: {
        u_texture: createTexture("../texture/yellow.jpg"),
      },
      programInfo: programInfo,
      bufferInfo: orbitBufferInfo,
    };
    orbit.setParent(solarSystemNode);
    orbitList.push(orbit);
  });
  return orbitList;
}

//Rotea ogni oggetto sulla sua asse con velocità specificata in planet.rotation
function planetsSpin(planets) {
  planets.forEach(function (planet) {
    m4.multiply(m4.yRotation(planet.rotation * -controls.rotationSpeed), planet.localMatrix, planet.localMatrix);
  });
}

//Rotea ogni oggetto sulla sua orbita con velocità specificata in obit.rotation
function orbitsSpin(orbits) {
  orbits.forEach(function (orbit) {
    m4.multiply(m4.yRotation(orbit.rotation * -controls.rotationSpeed), orbit.localMatrix, orbit.localMatrix);
  });
}

//Dato il nome di un pianeta restituisce il corrispondente numero presente nella lista planetsInfo
function getNumPlanet(planet) {
  switch (planet) {
    case 'Sun':
      return 0;
    case 'Me':
      return 1;
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

//Restituisce le informazioni di un pianeta contenute in planetsInfo dato il suo numero nel menu a tendina
function getInfoPlanet(numPlanet) {
  if (numPlanet == 5)
    return moon.info;
  if (numPlanet > 8) //pianeti dopo saturno
    return planetsInfo[numPlanet - 2].info;
  if (numPlanet > 5) //pianeti dopo la luna
    return planetsInfo[numPlanet - 1].info;
  //tutti gli altri pianeti
  return planetsInfo[numPlanet].info;
}