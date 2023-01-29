import * as THREE from 'three';

function getShootingStarFragmentShader() {

    return `
    varying vec3 Normal;
    varying vec3 Position;
    varying vec2 vUv;

    uniform float dt;
    
    vec3 colorA = vec3(0.912,0.000,0.035);
    vec3 colorB = vec3(0.270,0.127,0.042);

    void main() {
    
        vec3 color = vec3(0.0);
        float pct = abs(sin(dt));
        
        color = mix(colorA, colorB, pct);
        
        gl_FragColor = vec4(color,1.0);
    }
    `;

}

function getGlowVertexShader(){

    return `
    varying vec3 Normal;
    varying vec3 Position;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        Normal = normalize(normalMatrix * normal);
        Position = vec3(modelViewMatrix * vec4(position, 1.0));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    } 
    `;

}

function getGlowFragmentShader(){

    return `
    varying vec3 Normal;
    varying vec3 Position;
    varying vec2 vUv;

    uniform sampler2D meshTexture;

    void main() {
        gl_FragColor = texture2D(meshTexture, vUv);
    }
    `;

}

function getGlowShaderUniforms(texture){

    return THREE.UniformsUtils.merge([THREE.UniformsLib['lights'], {
        meshTexture: { value: texture }
    }]);

}


export { getGlowShaderUniforms, getGlowVertexShader, getGlowFragmentShader, getShootingStarFragmentShader }
