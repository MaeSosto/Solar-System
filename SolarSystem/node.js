/** --------------------------------------------------------------------------
 * GESTIONE DEI NODI
 * --------------------------------------------------------------------------- */ 
 var Node = function() {
    this.children = [];
    this.localMatrix = m4.identity();
    this.worldMatrix = m4.identity();
  };

  var Node = function(scaling, translation) {
    this.children = [];
    this.localMatrix = m4.identity();
    this.worldMatrix = m4.identity();
    this.scaling = scaling;
    this.translation = translation;
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


  function createSolarSystem(objects, orbits, programInfo, sphereBufferInfo, orbitBufferInfo, solarSystemNode){
    //tranlaction: da quanto si sposta sull'asse y (quanto è lontano dal sole)
    //scaling: quanto è grande il raggio del pianeta
    //che texture deve usare il pianeta

    //Sun
    var sunSphere = new Node();
    sunSphere.localMatrix = m4.scaling(116, 116, 116);
    sunSphere.drawInfo = {
      uniforms: {
        u_texture: createTexture("../texture/SunTexture.jpg"),
      },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
    };

    sunSphere.setParent(solarSystemNode);
    objects.push(sunSphere);

    //Mercury
    createOrbit(0.5, 126, createTexture("../texture/Mercurytexture.jpg"), objects, orbits, programInfo, sphereBufferInfo, solarSystemNode);

    //Venus
    createOrbit(1, 135, createTexture("../texture/VenusTexture.jpg"), objects, orbits, programInfo, sphereBufferInfo, solarSystemNode);

    //Earth
    var EarthOrbit = createOrbit(1, 141, createTexture("../texture/EarthTexture.jpg"), objects, orbits, programInfo, sphereBufferInfo, solarSystemNode);
    
    //Moon
    createOrbit(0.16, 1.23, createTexture("../texture/MoonTexture.jpg"), objects, orbits, programInfo, sphereBufferInfo, EarthOrbit);

    //Mars
    createOrbit(0.5, 154.3, createTexture("../texture/MarsTexture.jpg"), objects, orbits, programInfo, sphereBufferInfo, solarSystemNode);

    //Jupiter
    createOrbit(11.5, 257, createTexture("../texture/JupiterTexture.jpg"), objects, orbits, programInfo, sphereBufferInfo, solarSystemNode);

    //Saturn
    createOrbit(9.6, 363.3, createTexture("../texture/SaturnTexture.jpg"), objects, orbits, programInfo, sphereBufferInfo, solarSystemNode);

    //Uranus
    createOrbit(4.1, 598.5, createTexture("../texture/UranusTexture.jpg"), objects, orbits, programInfo, sphereBufferInfo, solarSystemNode);

    //Naptune
    createOrbit(4, 869.6, createTexture("../texture/NeptuneTexture.jpg"), objects, orbits, programInfo, sphereBufferInfo, solarSystemNode);

    
    setOrbits(objects, programInfo, orbitBufferInfo, solarSystemNode);
  }

  function createOrbit(scaling, translation, texture, objects, orbits, programInfo, sphereBufferInfo, solarSystemNode){
    //Orbit
    var orbit = new Node();
    orbit.localMatrix = m4.translation(translation, 0, 0); 

    //Sphere
    var sphere = new Node();
    sphere.localMatrix = m4.scaling(scaling, scaling, scaling);   
    sphere.drawInfo = {
      uniforms: {
        u_texture: texture,
      },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
    };

    orbit.setParent(solarSystemNode);
    sphere.setParent(orbit);
    objects.push(sphere);
    orbits.push(orbit);

    return orbit;
  }

  function setOrbits(objects, programInfo, orbitBufferInfo, solarSystemNode){
    var orbitsRad =[
      1, //Mercury
      1.07, //Venus
      1.12, //Earth
      1.22, //Mars
      2.04, //Jupiter
      2.88, //Saturn
      4.75, //Urnanus
      6.9 //Neptune
    ]
  
    orbitsRad.forEach(function(val){
      var orbit = new Node();
      orbit.localMatrix = m4.scaling(val, val, val);  
      orbit.drawInfo = {
        uniforms: {
          u_texture: createTexture("../texture/yellow.jpg"),
        },
        programInfo: programInfo,
        bufferInfo: orbitBufferInfo,
      };
      orbit.setParent(solarSystemNode);
      objects.push(orbit);
    });
  }

  async function getsphereBufferInfo(gl){
  const responseSphere = await fetch('../obj/sphere.obj');  
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