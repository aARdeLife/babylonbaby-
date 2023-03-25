const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

const createScene = async () => {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 4, 3, new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 2;
  camera.upperRadiusLimit = 10;

  const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

  const videoTexture = new BABYLON.VideoTexture('videoTexture', {
    success: stream => {
      videoTexture.video.srcObject = stream;
      videoTexture.video.play();
    },
    error: message => console.error(message),
    constraints: {
      audio: false,
      video: {
        facingMode: 'environment',
        width: 1280,
        height: 720,
      },
    },
    scene,
  });

  const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {diameter: 5, segments: 64}, scene);
  sphere.invertU = true;
  sphere.invertV = true;

  const sphereMaterial = new BABYLON.StandardMaterial('sphereMaterial', scene);
  sphereMaterial.emissiveTexture = videoTexture;
  sphereMaterial.disableLighting = true;
  sphere.material = sphereMaterial;

  return scene;
};

createScene().then(scene => {
  engine.runRenderLoop(() => {
    scene.render();
  });
});

window.addEventListener('resize', () => {
  engine.resize();
});
