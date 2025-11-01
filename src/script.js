import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
const gui = new dat.GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Particles
 */
const count = 20000
const particlesGeometry = new THREE.BufferGeometry()
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// Texture
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: particleTexture,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3 + 1] =
            Math.sin(elapsedTime + x)
    }

    particlesGeometry.attributes.position.needsUpdate = true

    controls.update()
    renderer.render(scene, camera)

    requestAnimationFrame(tick)
}

tick()
