var canvas;
var gl;
/** --------------------------------------------------------------------------
 * GESTIONE DEI NODI
 * --------------------------------------------------------------------------- */ 
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

/** --------------------------------------------------------------------------
 * GESTIONE DELLA CAMERA
 * --------------------------------------------------------------------------- */ 
var  aspect;       // Viewport aspect ratio
var dr = 5.0 * Math.PI/180.0;
var mvMatrix, cameraMatrix, pMatrix;
var mView, mProj;
var cameraPosition;
var at = [0, 0, 0];
var up = [0, 0, 1];

var camera = {
  D : 30,
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

/** --------------------------------------------------------------------------
 * GESTIONE DEL MOUSE
 * --------------------------------------------------------------------------- */ 
  var  mouse = {
    amortization : 0.95,
    drag : false,
    old_x : 0,
    old_y : 0,
    dX : 0,
    dY : 0
  }

  var mouseDown=function(e) {
    mouse.drag=true;
    mouse.old_x=e.pageX, mouse.old_y=e.pageY;
    e.preventDefault();
    return false;
  };

  var mouseUp=function(e){
    mouse.drag=false;
  };

  var mouseMove=function(e) {
    if (!mouse.drag) return false; 
    mouse.dX=(e.pageX-mouse.old_x)*2*Math.PI/canvas.width, 
    mouse.dY=(e.pageY-mouse.old_y)*2*Math.PI/canvas.height; 
    camera.YcameraAngleRadians-=mouse.dX;
    camera.XcameraAngleRadians-=mouse.dY;
    mouse.old_x=e.pageX, mouse.old_y=e.pageY; 
    e.preventDefault();
  };

  var wheelZoom = function(event){
    console.log(event.deltaY);
    if (event.deltaY < 0) {
      camera.D += Math.abs(event.deltaY);
    } else if (event.deltaY > 0) {
      camera.D -= Math.abs(event.deltaY);
    }
    event.preventDefault();
  }

  canvas.onmousedown=mouseDown;
  canvas.onmouseup=mouseUp;
  canvas.mouseout=mouseUp;
  canvas.onmousemove=mouseMove;
  canvas.addEventListener('wheel', wheelZoom, false);


  const response = await fetch('../obj/sphere.obj');  
  const text = await response.text();
  const data = parseOBJ(text);
  var sphereBufferInfo = webglUtils.createBufferInfoFromArrays(gl, data); //createFlattenedVertices(gl, primitives.createSphereVertices(10, 12, 6));
  

  // setup GLSL program
  var programInfo = webglUtils.createProgramInfo(gl, ["vertex-shader-3d", "fragment-shader-3d"]);

  var objectsToDraw = [];
  var objects = [];

/** --------------------------------------------------------------------------
 * CREAZIONE DEL SISTEMA SOLARE
 * --------------------------------------------------------------------------- */ 
  //Solar system
  var solarSystemNode = new Node();
  
  //Sun
  var sunNode = new Node();
  sunNode.localMatrix = m4.translation(0, 0, 0);  // sun a the center
  sunNode.localMatrix = m4.scaling(2, 2, 2);
  sunNode.drawInfo = {
    uniforms: {
      u_texture: createTexture("../texture/SunTexture.jpeg"),
      //u_colorMult:   [0.8, 0.5, 0.2, 1],
    },
    programInfo: programInfo,
    bufferInfo: sphereBufferInfo,
  };

  //Earth Orbit
  var earthOrbitNode = new Node();
  earthOrbitNode.localMatrix = m4.translation(10, 0, 0);  // earth orbit 100 units from the sun

  //Earth
  var earthNode = new Node();
  //earthNode.localMatrix = m4.scaling(2, 2, 2);   // make the earth twice as large
  earthNode.drawInfo = {
    uniforms: {
      u_texture: createTexture("../texture/EarthTexture.jpeg"),
      //u_colorMult:   [0.8, 0.5, 0.2, 1],
    },
    programInfo: programInfo,
    bufferInfo: sphereBufferInfo,
  };

  //Moon Orbit
  var moonOrbitNode = new Node();
  moonOrbitNode.localMatrix = m4.translation(12, 0, 0);  // moon 20 units from the earth

  //Moon
  var moonNode = new Node();
  //moonNode.localMatrix = m4.translation(20, 0, 0);  // moon 20 units from the earth
  moonNode.localMatrix = m4.scaling(0.4, 0.4, 0.4);
  moonNode.drawInfo = {
    uniforms: {
      u_texture: createTexture("../texture/MoonTexture.jpg"),
      u_colorMult:   [0.1, 0.1, 0.1, 1],
    },
    programInfo: programInfo,
    bufferInfo: sphereBufferInfo,
  };

  //Assegno la gerarchia
  sunNode.setParent(solarSystemNode);
  earthOrbitNode.setParent(solarSystemNode);
  earthNode.setParent(earthOrbitNode);
  moonOrbitNode.setParent(solarSystemNode);
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

  //fixTexture(objects);

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


    //Orbit spin
    // m4.multiply(m4.yRotation(-0.01), earthOrbitNode.localMatrix, earthOrbitNode.localMatrix);
    // m4.multiply(m4.yRotation(-0.01), moonOrbitNode.localMatrix, moonOrbitNode.localMatrix);
    // //Earth spin
    // m4.multiply(m4.yRotation(-0.01), sunNode.localMatrix, sunNode.localMatrix);
    // //Earth spin
    // m4.multiply(m4.yRotation(-0.05), earthNode.localMatrix, earthNode.localMatrix);
    //Moon spin
    //m4.multiply(m4.yRotation(-0.03), moonNode.localMatrix, moonNode.localMatrix);

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

      // calls gl.uniform
      webglUtils.setUniforms(programInfo, sharedUniforms);
    

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
    });

    requestAnimationFrame(drawScene);
  }
}

main();
