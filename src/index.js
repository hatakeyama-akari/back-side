import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

import { loadAssets } from './lib/assetManager.js';

import assets from './assets.js';

let scene, camera, renderer, controls, box;
const debug = true;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(3, 4, 9);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(window.devicePixelRatio);

    const ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);

    controls = new PointerLockControls(camera, renderer.domElement);
    document.body.addEventListener('click', () => controls.lock());
    document.body.addEventListener('keydown', ev => {
        switch (ev.code) {
            case 'ArrowUp':
                controls.moveForward(0.2);
                break;
            case 'ArrowLeft':
                controls.moveRight(-0.2);
                break;
            case 'ArrowDown':
                controls.moveForward(-0.2);
                break;
            case 'ArrowRight':
                controls.moveRight(0.2);
                break;
            case 'KeyW':
                controls.moveForward(0.2);
                break;
            case 'KeyA':
                controls.moveRight(-0.2);
                break;
            case 'KeyS':
                controls.moveForward(-0.2);
                break;
            case 'KeyD':
                controls.moveRight(0.2);
                break;
            default:
                console.log(ev.code + ' was pushed');
        }
    });
    scene.add(controls.getObject());

    loadAssets(
        'assets/',
        assets,
        () => {
            scene.background = assets['cubic_env'];

            box = assets['box_model'].scene.getObjectByName('Cube');
            box.material = new THREE.MeshLambertMaterial({
                color: 0x777777,
                envMap: assets['cubic_env'],
            });
            scene.add(box);

            document.body.appendChild(renderer.domElement);
            renderer.setAnimationLoop(animate);
        },
        debug
    );

    window.addEventListener('resize', onResize, false);
}

function animate() {
    renderer.setAnimationLoop(animate);
    box.rotation.y += 0.02;
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
