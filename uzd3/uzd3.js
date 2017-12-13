var renderer;
var scene = new THREE.Scene();
var camera;
var control;
var cameraControls;

var rockObject;

var lookingAt = 1;
var cameraLookAtPosition = new THREE.Vector3(0, 0, 0);
var cameraStep = 0;

var AllControls = function() {
  this.cubeSize = 1;
  this.rockRadius = 4;  // buvo 8
  this.positionDiff = 0;
  this.freeCamera = true;
  this.cameraLookDiff = 0.1;
  this.lookingAt = "Kubai";
  this.switchCameraObject = function(){
    if (lookingAt === 1){
      this.lookingAt = 'Sfera';
      lookingAt = 2;
      cameraStep = this.cameraLookDiff;
    }else if (lookingAt === 2){
      this.lookingAt = 'Kubeliai';
      lookingAt = 1;
      cameraStep = -this.cameraLookDiff;
    }
  };
  /*this.cameraPosition = 1;
  this.setCameraAbove = function(){
    camera.position.x = 0;
    camera.position.y = 20;
    camera.position.z = 0;
    camera.lookAt(cameraLookAtPosition);
    this.cameraPosition = 2;
  };
  this.setDefaultCameraPosition = function(){
    this.dobyEffect = 45;
    camera.up =  new THREE.Vector3(0, 1, 0);
    camera.position.x = -50;
    camera.position.y = 20;
    camera.position.z = 0;
    camera.fov = this.dobyEffect;
    camera.lookAt(cameraLookAtPosition);
    this.cameraPosition = 1;
    camera.updateProjectionMatrix();
  };
  this.fovIncrement = 0.2;
  this.setDollyZoom = function(){
    camera.position.x = 0;
    camera.position.y = 10;
    camera.position.z = 60;
    camera.lookAt(rockObject);
    this.cameraPosition = 3;
  };*/
  
};

var controls = new AllControls();

function init() {
  
  var axes = new THREE.AxisHelper(20);
  //scene.add(axes);
  
  var planeGeometry = new THREE.PlaneGeometry(140,140, 50, 50);
  var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc, side: THREE.DoubleSide});
  planeMaterial.wireframe = true;
  

  
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xFDFF98, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;
  
  var ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  
  var spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(50, 80, 30);
  spotLight.castShadow = true;
  scene.add(spotLight);
  
  //var gui = new dat.GUI();
  /*gui.add(controls, 'freeCamera');
  gui.add(controls, 'setCameraAbove');
  gui.add(controls, 'setDefaultCameraPosition');
  gui.add(controls, 'setDollyZoom');*/

  addRock();

  cameraLookAtPosition = rockObject.position.clone();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = -50;
  camera.position.y = 20;
  camera.position.z = 0;
  camera.lookAt(cameraLookAtPosition);
 
  document.body.appendChild(renderer.domElement);
  cameraControls = new THREE.TrackballControls(camera, renderer.domElement);
  render();
}

function render(){
  if (controls.freeCamera) {
    cameraControls.update();
  }
  
  cameraLookAtPosition.z = cameraLookAtPosition.z + cameraStep;
  if ((lookingAt == 1 && cameraLookAtPosition.z < rockObject.position.z) || (lookingAt == 2 && cameraLookAtPosition.z > rockObject.position.z)){
      cameraStep = 0;
  }
  
  if (controls.cameraPosition == 2){
    var swith = 3;
    if (cameraLookAtPosition.z <= swith && cameraLookAtPosition.z >= -swith){
        camera.up = new THREE.Vector3(Math.cos(Math.PI / 2 * Math.abs(cameraLookAtPosition.z) / swith), Math.sin(Math.PI / 2 * Math.abs(cameraLookAtPosition.z) / swith), 0).normalize();
    } else {
      camera.up = new THREE.Vector3(0, 1, 0);
    }
  }
  
  if (controls.cameraPosition == 3){
    camera.fov = controls.dobyEffect;
    controls.dobyEffect = controls.dobyEffect + controls.fovIncrement;
    camera.position.z = camera.position.z - controls.fovIncrement / 2;
    camera.position.z = rockObject.position.z + 47 / (2 * Math.tan(Math.PI / 180 * controls.dobyEffect / 2));
    camera.updateProjectionMatrix();
    if (controls.dobyEffect > 80 || controls.dobyEffect < 10){
      controls.fovIncrement = -1 * controls.fovIncrement;
    }
  }
  
  camera.lookAt(cameraLookAtPosition);
  camera.updateProjectionMatrix();
  
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function addRock(){
  var dif = 0.7;
  var points = [];
  for (var i = 0; i < 5000; i++){
    var randomX = - controls.rockRadius + Math.random() * controls.rockRadius * 2;
    var randomY = - controls.rockRadius + Math.random() * controls.rockRadius * 2;
    var randomZ = - controls.rockRadius + Math.random() * controls.rockRadius * 2;
	// pateikta formule
    if (((randomX * randomX + randomZ * randomZ) <= (controls.rockRadius * controls.rockRadius))  &&  ((-controls.rockRadius/2)  <= randomY <= (controls.rockRadius/2))){
      points.push(new THREE.Vector3(randomX, randomY, randomZ));
    }
  }
  
  var rockGeometry = new THREE.ConvexGeometry(points);
  // u konvertuojamas is x
  //u = lambda x
  
  var faceVertexUvs = rockGeometry.faceVertexUvs[0];
  for (i = 0; i < faceVertexUvs.length; i ++) {
    var tat;
    var uvs = faceVertexUvs[i];
    var face = rockGeometry.faces[i];
    for (var j = 0; j < 3; j ++) {
      var x, y, z;
      if (j === 0){
        tat = rockGeometry.vertices[face.a].clone();//.normalize();
        x = tat.x;
        y = tat.y;
        z = tat.z;
      }
      if (j === 1){
        tat = rockGeometry.vertices[face.b].clone();//.normalize();
        x = tat.x;
        y = tat.y;
        z = tat.z;
      }
      if (j === 2){
        tat = rockGeometry.vertices[face.c].clone();//.normalize();
        x = tat.x;
        y = tat.y;
        z = tat.z;
      }
	  uvs[j].x = 1 * (0.5+(Math.atan2(z, x)) / (2 * Math.PI));
      uvs[j].y = y/(controls.rockRadius*2) + 0.5;
    }
	
    if (Math.abs(uvs[0].x - uvs[1].x) > dif || Math.abs(uvs[1].x - uvs[2].x) > dif || Math.abs(uvs[2].x - uvs[0].x) > dif){
      if (uvs[0].x > dif) {
        uvs[0].x = uvs[0].x - 1;
      }
      if (uvs[1].x > dif){
       uvs[1].x = uvs[1].x - 1;
      }
      if (uvs[2].x > dif){
        uvs[2].x = uvs[2].x - 1;
      }
    }
  }

  var rockMesh = createRockMesh(rockGeometry);
  rockObject = new THREE.Object3D();
  rockObject.position.z = controls.rockRadius * controls.positionDiff;
  rockObject.add(rockMesh);
/*  
var spheres = [];
for (var i=0 ; i<rockGeometry.vertices.length ; i++){
  var sphereGeometry = new THREE.SphereGeometry(0.2,7,10);
  var sphereMaterial = new THREE.MeshBasicMaterial({color: 0xff0000,opacity:1});
  spheres[i] = new THREE.Mesh(sphereGeometry,sphereMaterial);
  spheres[i].position.set(rockGeometry.vertices[i].x,
                      rockGeometry.vertices[i].y + controls.rockRadius * 0.95,
                      rockGeometry.vertices[i].z + (controls.rockRadius * controls.positionDiff));
  //scene.add(spheres[i]);
}*/
  
  scene.add(rockObject);
}

function createRockMesh(geom) {
  var texture = THREE.ImageUtils.loadTexture("finalChes.png");
  var material = new THREE.MeshPhongMaterial();
  material.map = texture;

  var wireFrameMat = new THREE.MeshBasicMaterial();
  //wireFrameMat.wireframe = true;
  
  var rockMesh= new THREE.SceneUtils.createMultiMaterialObject(geom, [material, wireFrameMat]);
  rockMesh.position.y = controls.rockRadius - controls.cubeSize / 2;
  return rockMesh;
}

window.onload = init;