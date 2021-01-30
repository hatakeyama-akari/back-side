import * as THREE from 'three';

let scene, camera, renderer, box;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1.0, 10.0);
    camera.position.x = -0.3;
    camera.position.y = 1.7;
    camera.position.z = 8.2;
    camera.rotation.x = -12.0 * (Math.PI / 180);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial();
    box = new THREE.Mesh(geometry, material);
    scene.add(box);

    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onResize, false);

    animate();
}

function animate() {
    renderer.setAnimationLoop(animate);
    box.rotation.y += 0.05;
    renderer.render(scene, camera);
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = () => {
    init();
};
