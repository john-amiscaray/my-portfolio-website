import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0,7,-5);

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

mesh.position.z = -10;

scene.add(mesh);

function animate() {

    requestAnimationFrame(animate);
    renderer.clearDepth();
    renderer.render(scene, camera);

}

animate();
