var canvas;
var gl;

/** --------------------------------------------------------------------------
 * MAIN FUNCTION
 * --------------------------------------------------------------------------- */ 
async function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  canvas = document.querySelector("#canvas");
  gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  define_gui();

  //Imposto le funzionalità del mouse
  mouseSettings(canvas);

  //Carica le informazioni degli oggetti nei buffer
  var sphereBufferInfo = await getSphereBufferInfo(gl); //webglUtils.createBufferInfoFromArrays(gl, dataSphere); 
  var orbitBufferInfo = await getOrbitBufferInfo(gl);
  
  // setup GLSL program
  var programInfo = webglUtils.createProgramInfo(gl, ["vertex-shader-3d", "fragment-shader-3d"]);

  var objects = [];

/** --------------------------------------------------------------------------
 * CREAZIONE DEL SISTEMA SOLARE
 * --------------------------------------------------------------------------- */ 
  {
    //Solar system
    var solarSystemNode = new Node();
    
    //Sun
    var sunSphere = new Node();
    sunSphere.localMatrix = m4.translation(0, 0, 0);  // sun a the center
    sunSphere.localMatrix = m4.scaling(116, 116, 116);
    sunSphere.drawInfo = {
      uniforms: {
        u_texture: createTexture("../texture/SunTexture.jpg"),
        //u_colorMult:   [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
    };

    //Mercury Node
    var mercuryOrbitNode = new Node();
    mercuryOrbitNode.localMatrix = m4.translation(126, 0, 0); 

    //Mercury
    var mercurySphere = new Node();
    mercurySphere.localMatrix = m4.scaling(0.5, 0.5, 0.5);
    mercurySphere.drawInfo = {
      uniforms: {
        u_texture: createTexture("../texture/Mercurytexture.jpg"),
        //u_colorMult:   [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
    };

    //Mercury Orbit
    var mercuryOrbit = new Node();
    mercuryOrbit.localMatrix = m4.scaling(1, 1, 1);   // make the earth twice as large
    mercuryOrbit.drawInfo = {
      uniforms: {
        u_texture: createTexture("../texture/yellow.jpg"),
        u_colorMult:   [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: orbitBufferInfo,
    };

    //Venus Node
    var venusOrbitNode = new Node();
    venusOrbitNode.localMatrix = m4.translation(135, 0, 0); 

    //Venus
    var venusSphere = new Node();
    venusSphere.drawInfo = {
      uniforms: {
        u_texture: createTexture("../texture/VenusTexture.jpg"),
        //u_colorMult:   [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
    };

    //Venus Orbit
    var venusOrbit = new Node();
    venusOrbit.localMatrix = m4.scaling(1.07, 1.07, 1.07);   // make the earth twice as large
    venusOrbit.drawInfo = {
      uniforms: {
        u_texture: createTexture("../texture/yellow.jpg"),
        u_colorMult:   [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: orbitBufferInfo,
    };

    //Earth Node
    var earthOrbitNode = new Node();
    earthOrbitNode.localMatrix = m4.translation(141, 0, 0);  // earth orbit 100 units from the sun

    //Earth
    var earthSphere = new Node();
    //earthNode.localMatrix = m4.scaling(2, 2, 2);   // make the earth twice as large
    earthSphere.drawInfo = {
      uniforms: {
        u_texture: createTexture("../texture/EarthTexture.jpg"),
        //u_colorMult:   [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
    };

    //Earth Orbit
    var earthOrbit = new Node();
    earthOrbit.localMatrix = m4.scaling(1.12, 1.12, 1.12);   // make the earth twice as large
    earthOrbit.drawInfo = {
      uniforms: {
        u_texture: createTexture("../texture/yellow.jpg"),
        u_colorMult:   [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: orbitBufferInfo,
    };

    //Moon Orbit
    var moonOrbitNode = new Node();
    moonOrbitNode.localMatrix = m4.translation(1.23, 0, 0);  // moon 20 units from the earth

    //Moon
    var moonSphere = new Node();
    //moonNode.localMatrix = m4.translation(20, 0, 0);  // moon 20 units from the earth
    moonSphere.localMatrix = m4.scaling(0.16, 0.16, 0.16);
    moonSphere.drawInfo = {
      uniforms: {
        u_texture: createTexture("../texture/MoonTexture.jpg"),
        u_colorMult:   [0.1, 0.1, 0.1, 1],
      },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
    };

    //Mars Node
    var marsOrbitNode = new Node();
    marsOrbitNode.localMatrix = m4.translation(154.3, 0, 0); 

    //Mars
    var marsSphere = new Node();
    marsSphere.localMatrix = m4.scaling(0.5, 0.5, 0.5);   
    marsSphere.drawInfo = {
      uniforms: {
        u_texture: createTexture("../texture/MarsTexture.jpg"),
        //u_colorMult:   [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
    };

    //Mars Orbit
    var marsOrbit = new Node();
    marsOrbit.localMatrix = m4.scaling(1.22, 1.22, 1.22);   // make the earth twice as large
    marsOrbit.drawInfo = {
      uniforms: {
        u_texture: createTexture("../texture/yellow.jpg"),
        u_colorMult:   [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: orbitBufferInfo,
    };

    //Jupiter Node
    var jupiterOrbitNode = new Node();
    jupiterOrbitNode.localMatrix = m4.translation(257, 0, 0); 

    //Jupiter
    var jupiterSphere = new Node();
    jupiterSphere.localMatrix = m4.scaling(11.5, 11.5, 11.5);   
    jupiterSphere.drawInfo = {
      uniforms: {
        u_texture: createTexture("../texture/JupiterTexture.jpg"),
        //u_colorMult:   [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
    };

    //Jupiter Orbit
    var jupiterOrbit = new Node();
    jupiterOrbit.localMatrix = m4.scaling(2.04, 2.04, 2.04);   // make the earth twice as large
    jupiterOrbit.drawInfo = {
      uniforms: {
        u_texture: createTexture("../texture/yellow.jpg"),
        u_colorMult:   [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: orbitBufferInfo,
    };

    //Saturn Node
    var saturnOrbitNode = new Node();
    saturnOrbitNode.localMatrix = m4.translation(363.3, 0, 0); 

    //Saturn
    var saturnSphere = new Node();
    saturnSphere.localMatrix = m4.scaling(9.6, 9.6, 9.6);   
    saturnSphere.drawInfo = {
      uniforms: {
        u_texture: createTexture("../texture/SaturnTexture.jpg"),
        //u_colorMult:   [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
    };

    //Uranus Orbit
    var uranusOrbit = new Node();
    uranusOrbit.localMatrix = m4.scaling(2.88, 2.88, 2.88);   // make the earth twice as large
    uranusOrbit.drawInfo = {
      uniforms: {
        u_texture: createTexture("../texture/yellow.jpg"),
        u_colorMult:   [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: orbitBufferInfo,
    };

    //Uranus Node
    var uranusOrbitNode = new Node();
    uranusOrbitNode.localMatrix = m4.translation(598.5, 0, 0); 

    //Uranus
    var uranusSphere = new Node();
    uranusSphere.localMatrix = m4.scaling(4.1, 4.1, 4.1);   
    uranusSphere.drawInfo = {
      uniforms: {
        u_texture: createTexture("../texture/UranusTexture.jpg"),
        //u_colorMult:   [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
    };

    //Uranus Orbit
    var saturnOrbit = new Node();
    saturnOrbit.localMatrix = m4.scaling(4.75, 4.75, 4.75);   // make the earth twice as large
    saturnOrbit.drawInfo = {
      uniforms: {
        u_texture: createTexture("../texture/yellow.jpg"),
        u_colorMult:   [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: orbitBufferInfo,
    };

    //Neptune Node
    var neptuneOrbitNode = new Node();
    neptuneOrbitNode.localMatrix = m4.translation(869.6, 0, 0); 

    //Neptune
    var neptuneSphere = new Node();
    neptuneSphere.localMatrix = m4.scaling(4, 4, 4);   
    neptuneSphere.drawInfo = {
      uniforms: {
        u_texture: createTexture("../texture/NeptuneTexture.jpg"),
        //u_colorMult:   [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: sphereBufferInfo,
    };

    //Neptune Orbit
    var neptuneOrbit = new Node();
    neptuneOrbit.localMatrix = m4.scaling(6.90, 6.90, 6.90);   // make the earth twice as large
    neptuneOrbit.drawInfo = {
      uniforms: {
        u_texture: createTexture("../texture/yellow.jpg"),
        u_colorMult:   [0.8, 0.5, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: orbitBufferInfo,
    };

    //Assegno la gerarchia
    sunSphere.setParent(solarSystemNode);
    mercuryOrbitNode.setParent(solarSystemNode);
    mercurySphere.setParent(mercuryOrbitNode);
    mercuryOrbit.setParent(solarSystemNode);
    venusOrbitNode.setParent(solarSystemNode);
    venusSphere.setParent(venusOrbitNode);
    venusOrbit.setParent(solarSystemNode);
    earthOrbitNode.setParent(solarSystemNode);
    earthSphere.setParent(earthOrbitNode);
    earthOrbit.setParent(solarSystemNode);
    moonOrbitNode.setParent(earthOrbitNode);
    moonSphere.setParent(moonOrbitNode);
    marsOrbitNode.setParent(solarSystemNode);
    marsSphere.setParent(marsOrbitNode);
    marsOrbit.setParent(solarSystemNode);
    jupiterOrbitNode.setParent(solarSystemNode);
    jupiterSphere.setParent(jupiterOrbitNode);
    jupiterOrbit.setParent(solarSystemNode);
    saturnOrbitNode.setParent(solarSystemNode);
    saturnSphere.setParent(saturnOrbitNode);
    saturnOrbit.setParent(solarSystemNode);
    uranusOrbitNode.setParent(solarSystemNode);
    uranusSphere.setParent(uranusOrbitNode);
    uranusOrbit.setParent(solarSystemNode);
    neptuneOrbitNode.setParent(solarSystemNode);
    neptuneSphere.setParent(neptuneOrbitNode);
    neptuneOrbit.setParent(solarSystemNode);
    

    var objects = [
      sunSphere,
      mercurySphere,
      mercuryOrbit,
      venusSphere,
      venusOrbit,
      earthSphere,
      earthOrbit,
      moonSphere,
      marsOrbit,
      marsSphere,
      jupiterSphere,
      jupiterOrbit,
      saturnSphere,
      saturnOrbit,
      uranusSphere,
      uranusOrbit,
      neptuneSphere,
      neptuneOrbit,
    ];
  }

  requestAnimationFrame(drawScene);

/** --------------------------------------------------------------------------
 * ANIMATION FRAME
 * --------------------------------------------------------------------------- */ 
  function drawScene(time) {
    time *= 0.0005;

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Clear the canvas AND the depth buffer.
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix = m4.perspective(camera.fieldOfViewRadians, aspect, 1, 2000);

    // Compute a matrix for the camera
    var cameraMatrix = m4.multiply( m4.xRotation(camera.XcameraAngleRadians), m4.zRotation(camera.ZcameraAngleRadians));
    cameraMatrix = m4.multiply(cameraMatrix, m4.yRotation(camera.YcameraAngleRadians))
    cameraMatrix = m4.translate(cameraMatrix, 0, 0, camera.D * 1.5);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);
    
    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    const sharedUniforms = {
      u_lightDirection: m4.normalize([50, 0, 0]),
      u_view: viewMatrix,
      u_projection: viewProjectionMatrix,
      u_diffuse: [2, 2, 2, 2]
    };


    // //Orbit spin
    // m4.multiply(m4.yRotation(-0.001), earthOrbitNode.localMatrix, earthOrbitNode.localMatrix);
    // m4.multiply(m4.yRotation(-0.001), moonOrbitNode.localMatrix, moonOrbitNode.localMatrix);
    // //Sun spin
    // m4.multiply(m4.yRotation(-0.001), sunSphere.localMatrix, sunSphere.localMatrix);
    // //Earth spin
    // m4.multiply(m4.yRotation(-0.05), earthSphere.localMatrix, earthSphere.localMatrix);
    // //Moon spin
    // m4.multiply(m4.yRotation(-0.03), moonNode.localMatrix, moonNode.localMatrix);

    // Aggiorno tutte le matrici del grafo a partite dal nodo radice che è il sole
    //sunNode.updateWorldMatrix();
    solarSystemNode.updateWorldMatrix();

    // Compute all the matrices for rendering
    objects.forEach(function(object) {
      object.drawInfo.uniforms.u_matrix = m4.multiply(viewProjectionMatrix, object.worldMatrix);
    });

    // ------ Draw the objects --------

    var lastUsedProgramInfo = null;
    var lastUsedBufferInfo = null;

    objects.forEach(function(object){
      var programInfo = object.drawInfo.programInfo;
      var bufferInfo = object.drawInfo.bufferInfo;
      var bindBuffers = false;
      
      // Setup all the needed attributes.
      if (bindBuffers || bufferInfo !== lastUsedBufferInfo) {
        lastUsedBufferInfo = bufferInfo;
        webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);
      
        if (programInfo !== lastUsedProgramInfo) {
          lastUsedProgramInfo = programInfo;
          gl.useProgram(programInfo.program);
          bindBuffers = true;
        }
      }

       // Set the uniforms.
       webglUtils.setUniforms(programInfo, object.drawInfo.uniforms);

       // calls gl.uniform
       webglUtils.setUniforms(programInfo, sharedUniforms);
     
 
       // Draw
       gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
    });

    requestAnimationFrame(drawScene);
  }
}

main();
