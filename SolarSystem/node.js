/** --------------------------------------------------------------------------
 * GESTIONE DEI NODI
 * --------------------------------------------------------------------------- */ 
 const planetsInfo = [
  {
    "name" : "Sun",
    "scaling" : 116,
    "translation" : 0,
    "orbitRotation" : 0,
    "sphereRotation" : 1993,
    "texture" : "../texture/Suntexture.jpg",
    "orbitRad" : 0,
  },
  {
    "name" : "Me",
    "scaling" : 20,
    "translation" : 0,
    "orbitRotation" : 0,
    "sphereRotation" : 200,
    "texture" : "../texture/myStar.png",
    "orbitRad" : 0,
  },
  {
    "name" : "Mercury",
    "scaling" : 0.5,
    "translation" : 126,
    "orbitRotation" : 43.6,
    "sphereRotation" : 3.02,
    "texture" :"../texture/Mercurytexture.jpg",
    "orbitRad" : 1,
  },
  {
    "name" : "Venus",
    "scaling" : 1,
    "translation" : 135,
    "orbitRotation" : 35.02,
    "sphereRotation" : 3.02,
    "texture" : "../texture/VenusTexture.jpg",
    "orbitRad" : 1.071,
  },
  {
    "name" : "Earth",
    "scaling" : 1,
    "translation" : 141,
    "orbitRotation" : 29.78,
    "sphereRotation" : 465.1,
    "texture" : "../texture/EarthTexture.jpg",
    "orbitRad" : 1.12,
  },
  {
    "name" : "Mars",
    "scaling" : 0.5,   
    "translation" : 154.3,
    "orbitRotation" : 24.08,
    "sphereRotation" : 241.1,
    "texture" : "../texture/MarsTexture.jpg",
    "orbitRad" : 1.2248,
  },
  {
    "name" : "Jupiter",
    "scaling" : 11.5,
    "translation" : 257,
    "orbitRotation" : 12.06,
    "sphereRotation" : 12580,
    "texture" : "../texture/JupiterTexture.jpg",
    "orbitRad" : 2.041,
  },
  {
    "name" : "Saturn",
    "scaling" : 9.6,
    "translation" : 363.3,
    "orbitRotation" : 9.64,
    "sphereRotation" : 9870,
    "texture" : "../texture/SaturnTexture.jpg",
    "orbitRad" : 2.8835,
  },
  {
    "name" : "Uranus",
    "scaling" : 4.1,
    "translation" : 598.5,
    "orbitRotation" : 6.81,
    "sphereRotation" : 2590,
    "texture" : "../texture/UranusTexture.jpg",
    "orbitRad" : 4.75,
  },
  {
    "name" : "Neptune",
    "scaling" : 4,
    "translation" : 869.6,
    "orbitRotation" : 4.67,
    "sphereRotation" : 13.01,
    "texture" : "../texture/NeptuneTexture.jpg",
    "orbitRad" : 6.902,
  }
];

const moon = {
  "name" : "Moon",
  "scaling" : 0.16,
  "translation" : 1.23,
  "orbitRotation" : 1,
  "sphereRotation" : 1,
  "texture" : "../texture/Moontexture.jpg",
  "orbitRad" : 0,
}

const SaturnRings = {
  "name" : "SaturnRings",
  "scaling" : 1,
  "translation" : 0,
  "orbitRotation" : 1,
  "sphereRotation" : 1,
  "texture" : "../texture/SaturnRingTexture.png",
  "orbitRad" : 0,
}


var Node = function() {
  this.children = [];
  this.localMatrix = m4.identity();
  this.worldMatrix = m4.identity();
};

Node.prototype.setParent = function(parent) {
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
Node.prototype.updateWorldMatrix = function(parentWorldMatrix) {
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
  this.children.forEach(function(child) {
    child.updateWorldMatrix(worldMatrix);
  });
};

function createSolarSystem(planets, orbits, programInfo, sphereBufferInfo, ringBufferInfo, solarSystemNode){
  planetsInfo.forEach(function(planet){
    createOrbit(planet, planets, orbits, programInfo, sphereBufferInfo, ringBufferInfo, solarSystemNode);
  });
}

function createOrbit(info, planets, orbits, programInfo, sphereBufferInfo, ringBufferInfo, solarSystemNode){
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
  
  if(info.name == "Earth")  
    createOrbit(moon, planets, orbits, programInfo, sphereBufferInfo, ringBufferInfo, orbit);

  if(info.name == "Saturn"){
    createOrbit(SaturnRings, planets, orbits, programInfo, ringBufferInfo, ringBufferInfo, orbit);
  }
}

//Disegna le orbite gialle dei pianeti
function setOrbits(programInfo, orbitBufferInfo, solarSystemNode){
  var orbitList = [];

  planetsInfo.forEach(function(planet){
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

function planetsSpin(planets){
  planets.forEach(function(planet){
    m4.multiply(m4.yRotation(planet.rotation * -controls.rotationSpeed), planet.localMatrix, planet.localMatrix);
  });
}

function orbitsSpin(orbits){
  orbits.forEach(function(orbit){
    m4.multiply(m4.yRotation(orbit.rotation * -controls.rotationSpeed), orbit.localMatrix, orbit.localMatrix);
  });
}

async function getsphereBufferInfo(gl){
  const responseSphere = await fetch('../obj/sphere500.obj');  
  const textSphere = await responseSphere.text();
  const dataSphere = parseOBJ(textSphere);
return webglUtils.createBufferInfoFromArrays(gl, dataSphere); 
}

async function getorbitBufferInfo(gl){
  const responseOrbit = await fetch('../obj/orbitNew.obj');  
  const textOrbit = await responseOrbit.text();
  const dataOrbit = parseOBJ(textOrbit);
  return webglUtils.createBufferInfoFromArrays(gl, dataOrbit); 
}

async function getringBufferInfo(gl){
  const responseOrbit = await fetch('../obj/anelli.obj');  
  const textOrbit = await responseOrbit.text();
  const dataOrbit = parseOBJ(textOrbit);
  return webglUtils.createBufferInfoFromArrays(gl, dataOrbit); 
}