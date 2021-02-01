import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

import { loadAssets } from './lib/assetManager.js';

import assets from './assets.js';

let scene, camera, renderer, controls, debugBox, backRoom;
const debug = true;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(10, 20, 3);
    camera.lookAt(25, 17, 13);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(window.devicePixelRatio);

    const pointLight = new THREE.PointLight();
    pointLight.position.set(20, 25, 12);
    scene.add(pointLight);

    // PCのマウスで視点操作・キーボードで移動可能に
    addPointerLockControls();

    loadAssets(
        'assets/',
        assets,
        () => {
            backRoom = assets['back_side_room_model'].scene;
            backRoom.rotation.x = -Math.PI / 2;
            scene.add(backRoom);

            debug && addDebugBox();

            document.body.appendChild(renderer.domElement);
            renderer.setAnimationLoop(animate);
        },
        debug
    );

    window.addEventListener('resize', onResize, false);
}

function addPointerLockControls() {
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
}

// 原点・座標軸の把握・material確認等に使用
function addDebugBox() {
    debugBox = assets['box_model'].scene.getObjectByName('Cube');
    debugBox.material = new THREE.MeshLambertMaterial({
        color: 0x777777,
    });
    scene.add(debugBox);
}

function animate() {
    renderer.setAnimationLoop(animate);
    if (debug) {
        debugBox.rotation.y += 0.02;
    }
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
