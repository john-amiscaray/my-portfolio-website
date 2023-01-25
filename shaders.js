import * as THREE from 'three';

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


export { getGlowShaderUniforms, getGlowVertexShader, getGlowFragmentShader }
