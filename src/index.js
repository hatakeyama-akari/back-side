import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, controls, box;

function init() {
    scene = new THREE.Scene();

    // Background textures（Cube）
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath('../assets/skyboxsun/');

    const textureCube = cubeTextureLoader.load([
        'px.jpg',
        'nx.jpg',
        'py.jpg',
        'ny.jpg',
        'pz.jpg',
        'nz.jpg',
    ]);
    textureCube.encoding = THREE.sRGBEncoding;
    scene.background = textureCube;

    // // Background Textures（Equirectangular）
    // const textureLoader = new THREE.TextureLoader();
    // textureEquirec = textureLoader.load(''); // 正距円筒図法の画像データをロード
    // textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
    // textureEquirec.encoding = THREE.sRGBEncoding;

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

    const loader = new GLTFLoader();
    loader.load(
        // Blenderでdefaultのcubeをそのままglbでexport
        // '../assets/test_box_original.glb',

        // lightとcameraをglbに入れず、cubeのみexport（_originalと表示変わらず）
        // '../assets/test_box_onlycube.glb',

        // materialでBase colorを青にした
        // '../assets/test_box_onlycube_blue.glb',

        // material無しでexport
        '../assets/test_box_no_material.glb',

        // 光沢materialでexport
        // '../assets/test_box_glossy.glb',

        gltf => {
            console.log(gltf);
            console.log(gltf.scene.children[0]);

            gltf.scene.children[0].material = new THREE.MeshLambertMaterial({
                color: 0x777777,
                envMap: textureCube,
            });

            // // textureを読み込んでmapping
            // // const texLoader = new THREE.TextureLoader();
            // // const boxTexture = texLoader.load('../assets/box_texture_blue.png');
            // // gltf.scene.children[0].material = new THREE.MeshStandardMaterial({
            // //     map: boxTexture,
            // // });
            scene.add(gltf.scene);
        },
        xhr => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        error => {
            console.log('An error happened', error);
        }
    );

    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onResize, false);

    animate();
}

function animate() {
    renderer.setAnimationLoop(animate);
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
