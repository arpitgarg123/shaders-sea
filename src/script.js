import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import testVertexShader from "./shaders/test/testVertex.glsl"
import testFragmentShader from "./shaders/test/testFragment.glsl"
/**
 * Base
 */
// Debug
const gui = new GUI()
const debugObject = {}

// Canvas 
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(3, 3, 512, 512)

// color
debugObject.depthColor = "#56aad7";
debugObject.surfaceColor = "#9bd8ff";

// Material
const material = new THREE.ShaderMaterial({
    vertexShader : testVertexShader,
    fragmentShader : testFragmentShader,
    uniforms: {
        uTime :{value: 0},
        // big waves
        uWavesSpeed : {value: 0.8},
        uBigWavesElevation : {value: 0.2},
        uBigWavesFrequency : {value: new THREE.Vector2(4,1.5)},

        // color
        uDepthColor : {value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor : {value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset : {value: 0.08},
        uColorMultiplier : {value:5},

        // small waves
        uSmallWavesSpeed : {value: 0.2},
        uSmallWavesElevation : {value: 0.15},
        uSmallWavesFrequency : {value: 3},
    }
});
gui.add(material.uniforms.uBigWavesElevation,"value").min(0).max(1).step(.001).name("bigWavesElevation");
gui.add(material.uniforms.uBigWavesFrequency.value,"x").min(1).max(10).step(.01).name("uBigWavesFrequencyX");
gui.add(material.uniforms.uBigWavesFrequency.value,"y").min(1).max(10).step(.01).name("uBigWavesFrequencyY");
gui.add(material.uniforms.uWavesSpeed,"value").min(0).max(4).step(.01).name("bigWavesSpeed");

gui.add(material.uniforms.uSmallWavesElevation,"value").min(0).max(1).step(.001).name("smallWavesElevation");
gui.add(material.uniforms.uSmallWavesFrequency,"value").min(1).max(10).step(.01).name("uSmallWavesFrequencyX");
gui.add(material.uniforms.uSmallWavesSpeed,"value").min(0).max(4).step(.01).name("uSmallWavesSpeed");
gui.addColor(debugObject , "depthColor").onChange(()=>{material.uniforms.uDepthColor.value.set(debugObject.depthColor)}).name("depthColor");
gui.addColor(debugObject , "surfaceColor").onChange(()=>{material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)}).name("surfaceColor");
gui.add(material.uniforms.uColorOffset,"value").min(0.1).max(1).step(.001).name("uColorOffset");
gui.add(material.uniforms.uColorMultiplier,"value").min(1).max(10).step(.01).name("uColorMultiplier");

// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.rotation.x = - Math.PI * 0.5
scene.add(mesh)
// fog
// const fog = new THREE.Fog("#0000ff", 0, 100);
// scene.background = fog;
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0.5, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x000000); 

// fog
scene.fog = new THREE.Fog(0x000000, 0.1, 1000); 

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // Update controls
    controls.update()
// update shaders
    material.uniforms.uTime.value = elapsedTime;
    // Render
    renderer.render(scene, camera)
    // fog animate
    scene.fog.near = camera.near;
    scene.fog.far = camera.far;
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()