import * as THREE from 'three';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {
    getGlowFragmentShader,
    getGlowShaderUniforms,
    getGlowVertexShader,
    getShootingStarFragmentShader
} from "./shaders.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderScene = new RenderPass( scene, camera );
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );

const BLOOM_SCENE = 1;
const clock = new THREE.Clock();
let shootingStars = [];

const bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );

const params = {
    bloomStrength: 5,
    bloomThreshold: 0,
    bloomRadius: 0
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
const moonGeo = new THREE.SphereGeometry(6);
const moonMat = new THREE.ShaderMaterial({
    uniforms: getGlowShaderUniforms(new THREE.TextureLoader().load('https://john-amiscaray.github.io/my-portfolio-website/textures/moonTexture.jpg')),
    vertexShader: getGlowVertexShader(),
    fragmentShader: getGlowFragmentShader(),
    lights: true
})

const moonMesh = new THREE.Mesh(moonGeo, moonMat);
moonMesh.layers.enable(BLOOM_SCENE);

moonMesh.position.x = pointLight.position.x;
moonMesh.position.y = pointLight.position.y;
moonMesh.position.z = pointLight.position.z;

scene.add(moonMesh);

const torusGeometry = new THREE.TorusGeometry(4, 3, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({
    color: '#f21b3f'
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);

torus.position.z = -150;
torus.position.y = -30;
torus.position.x = -200;

scene.add(torus);

const planet1Geo = new THREE.SphereGeometry(3);
const planet1Mat = new THREE.ShaderMaterial({
    uniforms: getGlowShaderUniforms(new THREE.TextureLoader().load('https://john-amiscaray.github.io/my-portfolio-website/textures/planet1.jpg')),
    vertexShader: getGlowVertexShader(),
    fragmentShader: getGlowFragmentShader(),
    lights: true
});

const planet1 = new THREE.Mesh(planet1Geo, planet1Mat);

planet1.position.x = 80;
planet1.position.y = -20;
planet1.position.z = -50;

scene.add(planet1);

const planet2Geo = new THREE.SphereGeometry(8);
const planet2Mat = new THREE.ShaderMaterial({
    uniforms: getGlowShaderUniforms(new THREE.TextureLoader().load('https://john-amiscaray.github.io/my-portfolio-website/textures/planet2.jpg')),
    vertexShader: getGlowVertexShader(),
    fragmentShader: getGlowFragmentShader(),
    lights: true
});

const planet2 = new THREE.Mesh(planet2Geo, planet2Mat);

planet2.position.x = -100;
planet2.position.y = -90;
planet2.position.z = -100;

scene.add(planet2);

function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function moveCamera(){

    const t = document.body.getBoundingClientRect().top;
    const rotX = 0.05;
    const rotY = 0.075;
    const rotZ = 0.05;
    const bodies = [moonMesh, planet1, planet2, torus];

    for(let body of bodies){

        body.rotation.x += rotX;
        body.rotation.y += rotY;
        body.rotation.z += rotZ;

    }

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;

}

function shootingStar() {

    const geometry = new THREE.SphereGeometry(1, 32, 0, Math.PI);
    const uniforms = {
        dt: {
            value: 0
        }
    };
    const material = new THREE.ShaderMaterial({
        fragmentShader: getShootingStarFragmentShader(),
        vertexShader: getGlowVertexShader(),
        uniforms: uniforms
    });
    const starMesh = new THREE.Mesh(geometry, material);

    starMesh.position.x = getRandomInRange(-170, 170);
    starMesh.position.z = -100;
    starMesh.position.y = 80;

    scene.add(starMesh);

    return { mesh: starMesh, uniforms: uniforms };

}

document.body.onscroll = moveCamera;

setInterval(() => {
    if(!document.hidden){
        shootingStars.push(shootingStar());
    }
}, 1000);

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function animate() {

    requestAnimationFrame(animate);

    renderer.autoClear = false;
    renderer.clear();

    bloomComposer.render();

    renderer.clearDepth();
    renderer.render(scene, camera);
    moonMesh.rotateY(Math.PI / 2048);
    planet1.rotateX(Math.PI / 4096);
    planet2.rotateZ(Math.PI / 1024);
    torus.rotateZ(Math.PI / 2048);
    torus.rotateY(Math.PI / 2048);
    torus.rotateX(Math.PI / 2048);
    for(let shootingStar of shootingStars){
        shootingStar.uniforms.dt.value += clamp(clock.getElapsedTime(), 0, 0.05);
        shootingStar.mesh.position.y -= 1;
        shootingStar.mesh.position.x -= 0.4
        if(shootingStar.mesh.position.y <= -80){
            scene.remove(shootingStar.mesh);
        }
    }
    shootingStars = shootingStars.filter(shootingStar => {
        return shootingStar.mesh.position.y > -80;
    })

}

animate();
