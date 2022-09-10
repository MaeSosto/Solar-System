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

  async function getsphereBufferInfo(gl){
  const responseSphere = await fetch('../obj/sphere.obj');  
  const textSphere = await responseSphere.text();
  const dataSphere = parseOBJ(textSphere);
  var sphereBufferInfo = webglUtils.createBufferInfoFromArrays(gl, dataSphere); 
  }

  async function getorbitBufferInfo(gl){
  const responseOrbit = await fetch('../obj/orbitNew.obj');  
  const textOrbit = await responseOrbit.text();
  const dataOrbit = parseOBJ(textOrbit);
  var orbitBufferInfo = webglUtils.createBufferInfoFromArrays(gl, dataOrbit); 
  }