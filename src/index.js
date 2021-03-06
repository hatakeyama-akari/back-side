import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { loadAssets } from './lib/assetManager.js';

import assets from './assets.js';

let scene, camera, renderer, controls, debugBox, backRoom;
let signage1, signage2, signage3, ball1, ball2, ball3, bloomComposer, bulbLight;

// true時はconsoleにassets読み込みのmessage表示、テスト用のboxオブジェクト表示
const debug = false;

// change material on mouse over (need refactoring)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isMouseOver = false;
let intersects;
let mouseOverObject;
const ballMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
const mouseOverBallMaterial = new THREE.MeshBasicMaterial({ color: 0x88ffff, wireframe: true });
const signageMaterial = new THREE.MeshBasicMaterial({ color: 0xa0a0a0, side: THREE.FrontSide });
const mouseOverSignageMaterial = new THREE.MeshBasicMaterial({
    color: 0x88ffff,
    side: THREE.FrontSide,
});

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(10, 20, 3);
    camera.lookAt(25, 20, 13);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = Math.pow(0.8, 1); // to allow for very bright scenes.

    scene.add(new THREE.AmbientLight(0x404040));

    // PCのキーボードで移動操作可能に
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

    // outer glow effect
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.3,
        0.0,
        0.3
    );

    bloomComposer = new EffectComposer(renderer);
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    bloomComposer.render();

    addBulbLight();
    addSignage();
    addBalls();

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('resize', onResize, false);
}

function addBulbLight() {
    bulbLight = new THREE.PointLight(0xffee88, 1, 30, 3);
    const bulbGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const bulbMaterial = new THREE.MeshStandardMaterial({
        emissive: 0xffffee,
        emissiveIntensity: 10,
    });
    bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMaterial));
    bulbLight.position.y = 5;
    bulbLight.castShadow = true;
    scene.add(bulbLight);
}

function addSignage() {
    const signageGeometryWide = new THREE.PlaneGeometry(11, 6, 1, 1);
    const signageGeometry = new THREE.PlaneGeometry(7, 6, 1, 1);
    const xPosition = 41;

    signage1 = new THREE.Mesh(signageGeometryWide, signageMaterial);
    signage1.position.set(xPosition, 23, 6);
    signage1.rotation.y = -Math.PI / 2;
    signage1.name = 'signage1';
    scene.add(signage1);

    signage2 = new THREE.Mesh(signageGeometry, signageMaterial);
    signage2.position.set(xPosition, 15, 1);
    signage2.rotation.y = -Math.PI / 2;
    signage2.name = 'signage2';
    scene.add(signage2);

    signage3 = new THREE.Mesh(signageGeometry, signageMaterial);
    signage3.position.set(xPosition, 15, 11);
    signage3.rotation.y = -Math.PI / 2;
    signage3.name = 'signage3';
    scene.add(signage3);
}

function addBalls() {
    const ballGeometry = new THREE.SphereGeometry(1, 12, 12);

    ball1 = new THREE.Mesh(ballGeometry, ballMaterial);
    ball1.position.set(25, 17, 17);
    ball1.name = 'ball1';
    scene.add(ball1);

    ball2 = new THREE.Mesh(ballGeometry, ballMaterial);
    ball2.position.set(20, 14, 17);
    ball2.name = 'ball2';
    scene.add(ball2);

    ball3 = new THREE.Mesh(ballGeometry, ballMaterial);
    ball3.position.set(15, 17, 17);
    ball3.name = 'ball3';
    scene.add(ball3);
}

function addPointerLockControls() {
    controls = new PointerLockControls(camera, renderer.domElement);
    document.body.addEventListener('keydown', event => {
        switch (event.code) {
            case 'ArrowUp':
                camera.position.y += 0.1;
                break;
            case 'ArrowLeft':
                camera.rotation.y -= 0.01;
                break;
            case 'ArrowDown':
                camera.position.y -= 0.1;
                break;
            case 'ArrowRight':
                camera.rotation.y += 0.01;
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
                debug && console.log(event.code + ' was pushed');
        }
    });
    scene.add(controls.getObject());
}

function onMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        isMouseOver = true;
        mouseOverObject = intersects[0].object;

        const mouseOverMaterial = mouseOverObject.name.includes('ball')
            ? mouseOverBallMaterial
            : mouseOverSignageMaterial;
        mouseOverObject.material = mouseOverMaterial;
    } else if (isMouseOver && intersects.length === 0) {
        const originalMaterial = mouseOverObject.name.includes('ball')
            ? ballMaterial
            : signageMaterial;

        mouseOverObject.material = originalMaterial;
        isMouseOver = false;
    }
}

function onPointerDown(event) {
    event.preventDefault();
    if (intersects.length > 0) {
        const object = intersects[0].object;
        console.log(object);
    }
}

// 原点・座標軸の把握・material確認等に使用
function addDebugBox() {
    debugBox = assets['box_model'].scene.getObjectByName('Cube');
    debugBox.material = new THREE.MeshLambertMaterial({
        color: 0x777777,
    });
    debugBox.position.set(30, 2, 10);
    scene.add(debugBox);
}

function animate() {
    renderer.setAnimationLoop(animate);
    const time = Date.now() * 0.001;
    bulbLight.position.x = Math.sin(time) * 10 + 23;
    bulbLight.position.z = Math.cos(time) * 7 + 8;

    // refactor later
    if (isMouseOver && mouseOverObject.name === 'ball1') {
        ball1.rotation.x += 0;
    } else {
        ball1.rotation.x += 0.01;
    }
    if (isMouseOver && mouseOverObject.name === 'ball2') {
        ball2.rotation.y += 0;
    } else {
        ball2.rotation.y += 0.01;
    }
    if (isMouseOver && mouseOverObject.name === 'ball3') {
        ball3.rotation.z += 0;
    } else {
        ball3.rotation.z += 0.01;
    }

    if (debug) {
        debugBox.rotation.y += 0.02;
        debugBox.position.y = 10;
        debugBox.position.x = Math.sin(time * 2) * 7 + 20;
        debugBox.position.z = Math.cos(time * 2) * 6 + 8;
    }

    bloomComposer.render();
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = () => {
    init();
};
