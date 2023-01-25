import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderScene = new RenderPass( scene, camera );
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );

const ENTIRE_SCENE = 0;
const BLOOM_SCENE = 1;

const bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );

const params = {
    bloomStrength: 5,
    bloomThreshold: 0,
    bloomRadius: 0.4
};

bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
});

const bloomComposer = new EffectComposer( renderer );
bloomComposer.addPass( renderScene );
bloomComposer.addPass( bloomPass );

renderer.setPixelRatio(window.devicePixelRatio);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(2,7,-20);

const sunLight = new THREE.HemisphereLight(0x404040, 0xFFFFFF, 0.5);

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;
camera.position.y = 1.5;

scene.add(pointLight, sunLight);
const geo = new THREE.SphereGeometry(6);
const mat = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('./assets/moonTexture.jpg')
})

const mesh = new THREE.Mesh(geo, mat);
mesh.layers.enable(BLOOM_SCENE);
console.log(mesh.layers);

mesh.position.x = pointLight.position.x;
mesh.position.y = pointLight.position.y;
mesh.position.z = pointLight.position.z;

scene.add(mesh);

camera.layers.set(BLOOM_SCENE);
camera.layers.set(ENTIRE_SCENE);

function animate() {

    requestAnimationFrame(animate);

    renderer.autoClear = false;
    renderer.clear();

    camera.layers.enable(BLOOM_SCENE);
    bloomComposer.render();

    camera.layers.enable(ENTIRE_SCENE);
    renderer.clearDepth();
    renderer.render(scene, camera);
    mesh.rotateY(Math.PI / 2048);

}

animate();
