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

  //Disegno la control gui
  define_gui();

  //Imposto le funzionalità del mouse
  controlsSettings(canvas);

  //Carica le informazioni degli oggetti nei buffer
  const sphereBufferInfo = await getSphereBufferInfo(gl); 
  const orbitBufferInfo = await getOrbitBufferInfo(gl);
  const ringBufferInfo = await getringBufferInfo(gl);
  const quadBufferInfo = primitives.createXYQuadBufferInfo(gl);

  // setup GLSL program
  const programInfo = webglUtils.createProgramInfo(gl, ["vertex-shader-3d", "fragment-shader-3d"]);
  const skyboxProgramInfo = webglUtils.createProgramInfo(gl, ["skybox-vertex-shader", "skybox-fragment-shader"]);

  //Imposto la texture per lo skybox
  const skyboxTexture = createSkyboxTexture();

  //Creazione del sistema solare
  var planets = [];
  var orbits = [];

  //Solar system node
  const solarSystemNode = new Node();
  createSolarSystem(planets, orbits, programInfo, sphereBufferInfo, ringBufferInfo, solarSystemNode);
  const orbitsCircle = setOrbits(programInfo, orbitBufferInfo, solarSystemNode);
  planets = planets.concat(orbitsCircle);

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
    var projectionMatrix = m4.perspective(GUI.fieldOfViewRadians, aspect, 1, 2000);

    //Scrivo le informazioni dei pianeti
    document.getElementById('info').innerHTML = getInfoPlanet(GUI.planet);

    //Prendo la world matrix del pianeta che voglio visualizzare
    var planetWorldmatrix = planets[GUI.planet].worldMatrix;
    var planetPosition = [
      planetWorldmatrix[12],
      planetWorldmatrix[13],
      planetWorldmatrix[14],
    ];

    // Compute a matrix for the camera
    var cameraMatrix = m4.identity(); //m4.multiply( m4.xRotation(camera.XcameraAngleRadians), m4.zRotation(camera.ZcameraAngleRadians));
    cameraMatrix = m4.translate(cameraMatrix, planetPosition[0], planetPosition[1], planetPosition[2]);
    cameraMatrix = m4.multiply(cameraMatrix, m4.xRotation(GUI.XcameraAngleRadians));
    cameraMatrix = m4.multiply(cameraMatrix, m4.yRotation(GUI.YcameraAngleRadians));
    cameraMatrix = m4.multiply(cameraMatrix, m4.zRotation(GUI.ZcameraAngleRadians));
    cameraMatrix = m4.translate(cameraMatrix, 0, 0, GUI.D * 1.5);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    var viewDirectionMatrix = m4.copy(viewMatrix);
    viewDirectionMatrix[12] = 0;
    viewDirectionMatrix[13] = 0;
    viewDirectionMatrix[14] = 0;

    var viewDirectionProjectionMatrix = m4.multiply(projectionMatrix, viewDirectionMatrix);
    var viewDirectionProjectionInverseMatrix = m4.inverse(viewDirectionProjectionMatrix);

    //Disegno lo skybox
    // let our quad pass the depth test at 1.0
    gl.depthFunc(gl.LEQUAL);
    gl.useProgram(skyboxProgramInfo.program);
    webglUtils.setBuffersAndAttributes(gl, skyboxProgramInfo, quadBufferInfo);
    webglUtils.setUniforms(skyboxProgramInfo, {
      u_viewDirectionProjectionInverse: viewDirectionProjectionInverseMatrix,
      u_skybox: skyboxTexture,
    });
    webglUtils.drawBufferInfo(gl, quadBufferInfo);

    const sharedUniforms = {
      u_lightDirection: m4.normalize([50, 0, 0]),
      u_view: viewMatrix,
      u_projection: viewProjectionMatrix,
      u_diffuse: [2, 2, 2, 2]
    };

    //Controllo se i pianeti devono ruotare e in tal caso chiamo le funzioni che permettono la rotazione dei pianeti sulla propria asse e sulla propria orbita
    if (controls.rotation) {
      orbitsSpin(orbits);
      planetsSpin(planets);
    }

    // Aggiorno tutte le matrici del grafo a partite dal nodo radice che è il sole
    //sunNode.updateWorldMatrix();
    solarSystemNode.updateWorldMatrix();

    // Compute all the matrices for rendering
    planets.forEach(function (object) {
      object.drawInfo.uniforms.u_matrix = m4.multiply(viewProjectionMatrix, object.worldMatrix);
    });

    // ------ Draw the objects --------

    var lastUsedProgramInfo = null;
    var lastUsedBufferInfo = null;

    planets.forEach(function (object) {
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