import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadAssets(basePath, assets, onComplete, debug) {
    if (basePath && basePath[basePath.length - 1] != '/') {
        basePath += '/';
    }

    let gltfLoader = new GLTFLoader();
    let texLoader = new THREE.TextureLoader();

    const loaders = {
        gltf: gltfLoader,
        glb: gltfLoader,
        png: texLoader,
        jpg: texLoader,
    };

    for (let i in assets) {
        assets[i].loading = true;
        let assetId = i;
        let assetPath = assets[i].url;
        let ext = assetPath.substr(assetPath.lastIndexOf('.') + 1).toLowerCase();
        loaders[ext].load(
            basePath + assetPath,
            asset => {
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

                if (debug) {
                    console.info(`%c ${assetPath} loaded`, 'color:green');
                }

                if (onComplete && isAllAssetsLoaded(assets)) {
                    onComplete();
                }
            },
            xhr => {
                if (debug) {
                    console.log(assetId + ': ' + (xhr.loaded / xhr.total) * 100 + '% loaded');
                }
            },
            error => {
                console.error('Error loading asset', error);
            }
        );
    }
}

function isAllAssetsLoaded(assets) {
    for (let i in assets) {
        if (assets[i].loading === true) {
            return false;
        }
    }
    return true;
}
