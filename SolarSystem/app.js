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

  //Creazione del sistema solare
  var objects = [];
  var orbits =[];
  //Solar system node
  var solarSystemNode = new Node();

  createSolarSystem(objects, orbits, programInfo, sphereBufferInfo,orbitBufferInfo, solarSystemNode);
  setOrbits(objects, programInfo, orbitBufferInfo, solarSystemNode);

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
    //m4.multiply(m4.yRotation(earthOrbitNode.drawInfo.rotation), earthOrbitNode.localMatrix, earthOrbitNode.localMatrix);
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
