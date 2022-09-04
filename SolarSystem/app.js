// -------------- GESTIONE DEI NODI ---------------------------------
//Struttura del nodo 
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

var  controls = {
  D : 300,
  theta : 1.57,
  thetaDeg : degToRad(1.57),
  phi  : 1.57,
  phiDeg: degToRad(1.57),
  fovy : 40.0,  // Field-of-view in Y direction angle (in degrees)
  enable : true,
  
}

var  aspect;       // Viewport aspect ratio
var dr = 5.0 * Math.PI/180.0;
var mvMatrix, cameraMatrix, pMatrix;
var mView, mProj;
var cameraPosition;
var at = [0, 0, 0];
var up = [0, 0, 1];

function define_gui(){
  var gui = new dat.GUI();

  // gui.add(controls,"XcameraAngleRadians").min(-365).max(365).step(1).onChange(function() {
  //     console.log(controls)});
  // gui.add(controls,"far").min(1).max(100).step(1).onChange(function() {
  //     render();});
  // gui.add(controls,"D").min(0).max(10).step(1).onChange(function() {
  //     render();});
  gui.add(controls,"theta").min(0).max(6.28).step(dr).onChange(function() {
    controls.thetaDeg = radToDeg(controls.theta);
    console.log("THETA"+controls.thetaDeg);});
  gui.add(controls,"phi").min(0).max(6.28).step(dr).onChange(function() {
    controls.phiDeg = radToDeg(controls.phi);
    console.log("PHI"+controls.phiDeg);});
  // gui.add(controls,"phi").min(0).max(3.14).step(dr).onChange();
  // gui.add(controls,"fovy").min(10).max(120).step(5).onChange(function() {
  //         render();});

  gui.add(controls, "enable")
}



function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  define_gui();

  var createFlattenedVertices = function(gl, vertices) {
    var last;
    return webglUtils.createBufferInfoFromArrays(
        gl,
        primitives.makeRandomVertexColors(
            primitives.deindexVertices(vertices),
            {
              vertsPerColor: 1,
              rand: function(ndx, channel) {
                if (channel === 0) {
                  last = 128 + Math.random() * 128 | 0;
                }
                return channel < 3 ? last : 255;
              }
            })
      );
  };

  var sphereBufferInfo = createFlattenedVertices(gl, primitives.createSphereVertices(10, 12, 6));

  // setup GLSL program
  var programInfo = webglUtils.createProgramInfo(gl, ["vertex-shader-3d", "fragment-shader-3d"]);

  var cameraAngleRadians = degToRad(0);
  var fieldOfViewRadians = degToRad(60);
  var cameraHeight = 50;

  var objectsToDraw = [];
  var objects = [];

  // -------------- CREO IL SISTEMA SOLARE ---------------------------------

  //Solar system
  var solarSystemNode = new Node();
  
  //Sun
  var sunNode = new Node();
  sunNode.localMatrix = m4.translation(0, 0, 0);  // sun a the center
  sunNode.localMatrix = m4.scaling(2, 2, 2);
  sunNode.drawInfo = {
    uniforms: {
      u_colorOffset: [0.6, 0.6, 0, 1], // yellow
      u_colorMult:   [0.4, 0.4, 0, 1],
    },
    programInfo: programInfo,
    bufferInfo: sphereBufferInfo,
  };

  //Earth Orbit
  var earthOrbitNode = new Node();
  earthOrbitNode.localMatrix = m4.translation(100, 0, 0);  // earth orbit 100 units from the sun

  //Earth
  var earthNode = new Node();
  //earthNode.localMatrix = m4.scaling(2, 2, 2);   // make the earth twice as large
  earthNode.drawInfo = {
    uniforms: {
      u_colorOffset: [1, 1, 1, 1],  // blue-green
      u_colorMult:   [0.8, 0.5, 0.2, 1],
    },
    programInfo: programInfo,
    bufferInfo: sphereBufferInfo,
  };

  //Moon Orbit
  var moonOrbitNode = new Node();
  moonOrbitNode.localMatrix = m4.translation(20, 0, 0);  // moon 20 units from the earth

  //Moon
  var moonNode = new Node();
  //moonNode.localMatrix = m4.translation(20, 0, 0);  // moon 20 units from the earth
  moonNode.localMatrix = m4.scaling(0.4, 0.4, 0.4);
  moonNode.drawInfo = {
    uniforms: {
      u_colorOffset: [0.6, 0.6, 0.6, 1],  // gray
      u_colorMult:   [0.1, 0.1, 0.1, 1],
    },
    programInfo: programInfo,
    bufferInfo: sphereBufferInfo,
  };


  //Assegno la gerarchia
  sunNode.setParent(solarSystemNode);
  earthOrbitNode.setParent(solarSystemNode);
  earthNode.setParent(earthOrbitNode);
  moonOrbitNode.setParent(earthOrbitNode);
  moonNode.setParent(moonOrbitNode);

  var objects = [
    sunNode,
    earthNode,
    moonNode,
  ];

  var objectsToDraw = [
    sunNode.drawInfo,
    earthNode.drawInfo,
    moonNode.drawInfo,
  ];

  requestAnimationFrame(drawScene);

  // Draw the scene.
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
    var projectionMatrix =
        m4.perspective(fieldOfViewRadians, aspect, 1, 2000);
   
    cameraPosition = [
      controls.D*Math.sin(controls.phi)*Math.cos(controls.theta), 
      controls.D*Math.sin(controls.phi)*Math.sin(controls.theta),
      controls.D*Math.cos(controls.phi)
  ];
    
    var target = [0, 0, 0];
    var up = [0, 0, 1];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    //Orbit spin
    m4.multiply(m4.yRotation(-0.01), earthOrbitNode.localMatrix, earthOrbitNode.localMatrix);
    m4.multiply(m4.yRotation(-0.01), moonOrbitNode.localMatrix, moonOrbitNode.localMatrix);
    //Earth spin
    m4.multiply(m4.yRotation(-0.01), sunNode.localMatrix, sunNode.localMatrix);
    //Earth spin
    m4.multiply(m4.yRotation(-0.05), earthNode.localMatrix, earthNode.localMatrix);
    //Moon spin
    m4.multiply(m4.yRotation(-0.03), moonNode.localMatrix, moonNode.localMatrix);

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

    objectsToDraw.forEach(function(object) {
      var programInfo = object.programInfo;
      var bufferInfo = object.bufferInfo;
      var bindBuffers = false;

      if (programInfo !== lastUsedProgramInfo) {
        lastUsedProgramInfo = programInfo;
        gl.useProgram(programInfo.program);

        // We have to rebind buffers when changing programs because we
        // only bind buffers the program uses. So if 2 programs use the same
        // bufferInfo but the 1st one uses only positions the when the
        // we switch to the 2nd one some of the attributes will not be on.
        bindBuffers = true;
      }

      // Setup all the needed attributes.
      if (bindBuffers || bufferInfo !== lastUsedBufferInfo) {
        lastUsedBufferInfo = bufferInfo;
        webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);
      }

      // Set the uniforms.
      webglUtils.setUniforms(programInfo, object.uniforms);

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
    });

    requestAnimationFrame(drawScene);
  }
}

main();
