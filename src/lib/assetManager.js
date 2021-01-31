import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadAssets(basePath, assets, onComplete, debug) {
    if (basePath && basePath[basePath.length - 1] != '/') {
        basePath += '/';
    }

    let count = 0;

    const gltfLoader = new GLTFLoader();
    const texLoader = new THREE.TextureLoader();

    loadEnvironmentAssets(basePath, assets);

    const loaders = {
        gltf: gltfLoader,
        glb: gltfLoader,
        png: texLoader,
        jpg: texLoader,
    };

    for (let i in assets) {
        count += 1;
        let assetId = i;
        if (!assetId.includes('env')) {
            let assetPath = assets[i].url;
            let ext = assetPath.substr(assetPath.lastIndexOf('.') + 1).toLowerCase();
            loaders[ext].load(
                basePath + assetPath,
                asset => {
                    if (debug) {
                        console.info(`%c ${assetPath} loaded`, 'color:green');
                    }
                    let options = assets[assetId].options;
                    assets[assetId] = asset;

                    if (typeof options !== 'undefined') {
                        if (typeof options.repeat !== 'undefined') {
                            assets[assetId].repeat.set(options.repeat[0], options.repeat[1]);
                            delete options.repeat;
                        }
                        for (let opt in options) {
                            assets[assetId][opt] = options[opt];
                        }
                    }

                    if (onComplete && count == Object.keys(assets).length) {
                        onComplete();
                    }
                },
                xhr => {
                    if (debug) {
                        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
                    }
                },
                error => {
                    count -= 1;
                    console.error('Error loading asset', error);
                }
            );
        }
    }
}

function loadEnvironmentAssets(basePath, assets) {
    const cubeTexLoader = new THREE.CubeTextureLoader();
    assets['cubic_env'] = cubeTexLoader.load([
        basePath + assets['env_tex_px'].url,
        basePath + assets['env_tex_nx'].url,
        basePath + assets['env_tex_py'].url,
        basePath + assets['env_tex_ny'].url,
        basePath + assets['env_tex_pz'].url,
        basePath + assets['env_tex_nz'].url,
    ]);
}
