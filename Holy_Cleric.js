const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg'),
            alpha: true,
        });

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.setZ(30);

        renderer.render(scene, camera);

        const light = new THREE.PointLight(0xffffff)
        light.position.set(5, 5, 5);

const ambient = new THREE.DirectionalLight(0xffffff, 3.5);
ambient.position.set(0, 10, 25);
const bient = new THREE.AmbientLight(0xffffff, 0.4);

scene.add(bient);

const manager = new THREE.LoadingManager();

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    const progress = (itemsLoaded / itemsTotal) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-count').textContent = progress + '%';
};

manager.onLoad = function () {
    document.getElementById('loading-screen').style.display = 'none';
};

const textureloader = new THREE.TextureLoader(manager);

const hairtexture = textureloader.load('Holy_Cleric/Hair_Color.png');
const hairnormal = textureloader.load('Holy_Cleric/Hair_Normal.png');

const aclothcolor = textureloader.load('Holy_Cleric/Cloth_Color.png');
const aclothR = textureloader.load('Holy_Cleric/Cloth_Roughness.png');
const aclothM = textureloader.load('Holy_Cleric/Cloth_Metal.png');
const aclothNormal = textureloader.load('Holy_Cleric/Cloth_Normal.png');

const bclothcolor = textureloader.load('Holy_Cleric/Book_Color.png');
const bclothR = textureloader.load('Holy_Cleric/Book_Roughness.png');
const bclothM = textureloader.load('Holy_Cleric/Book_Metal.png');
const bclothNormal = textureloader.load('Holy_Cleric/Book_Normal.png');

const characterColor = textureloader.load('Holy_Cleric/Character_Color.png');

const detailColor = textureloader.load('Holy_Cleric/Detail_Color.png');
const detailR = textureloader.load('Holy_Cleric/Detail_Roughness.png');
const detailNormal = textureloader.load('Holy_Cleric/Detail_Normal.png');

const Gloader = new THREE.GLTFLoader(manager);

let isDragging = false;
let previouseMouseX = 0;

renderer.domElement.addEventListener('mousedown', (event) => {
    isDragging = true;
    previouseMouseX = event.clientX;
});

renderer.domElement.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - previouseMouseX;
    previouseMouseX = event.clientX;

    object.rotation.y += deltaX * 0.01;
});

renderer.domElement.addEventListener('wheel', (event) => {
    event.preventDefault();

    camera.position.z += event.deltaY * 0.01;

    camera.position.z = THREE.MathUntils.clamp(camera.position.z, 3, 20);
});

renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;
});

renderer.domElement.addEventListener('mouseleave', () => {
    isDragging = false;
});

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enabled = false;

let mixer;

Gloader.load('Holy_Cleric/a.glb', (gltf) => {
    object = gltf.scene;
    mixer = new THREE.AnimationMixer(object);
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();

    object.scale.set(3, 3, 3);
    object.position.set(0, 10, 0);
    
            object.traverse((child) => {
                if (child.isMesh) {
                    let materialParams = {};
                    characterColor.flipY = false;

                    aclothcolor.flipY = false;
                    aclothNormal.flipY = false;
                    aclothR.flipY = false;
                    aclothM.flipY = false;

                    bclothcolor.flipY = false;
                    bclothNormal.flipY = false;
                    bclothR.flipY = false;
                    bclothM.flipY = false;

                    detailColor.flipY = false;
                    detailR.flipY = false;
                    detailNormal.flipY = false;

                    hairtexture.flipY = false;
                    hairnormal.flipY = false;

                    if (child.name.toLowerCase().includes('hair')) {
                        materialParams = {
                            map: hairtexture,
                            normalMap: hairnormal,
                            transparent: true,
                            side: THREE.DoubleSide,
                            alphaTest: 0.1,
                        };
                    } else if (child.name.toLowerCase().includes('cloth')) {
                        materialParams = {
                            map: aclothcolor,
                            roughnessMap: aclothR,
                            metalnessMap: aclothM,
                            normalMap: aclothNormal,    
                            roughness: 1,
                            metalness: 1,
                            transparent: true,
                            side: THREE.DoubleSide,
                            alphaTest: 0.1,
                        };

                    } else if (child.name.toLowerCase().includes('book')) {
                        materialParams = {
                            map: bclothcolor,
                            roughnessMap: bclothR,
                            metalnessMap: bclothM,
                            normalMap: bclothNormal,
                            roughness: 1,
                            metalness: 1,
                        };
                    } else if (child.name.toLowerCase().includes('character')) {
                        materialParams = {
                            map: characterColor,
                            
                        };
                    } else if (child.name.toLowerCase().includes('detail')){
                        materialParams = {
                            map: detailColor,
                            roughnessMap: detailR,
                            normalMap: detailNormal,
                            roughness: 1,
                            transparent: true,
                            side: THREE.DoubleSide,
                            alphaTest: 0.1,
                        };
                    }

                    child.material = new THREE.MeshStandardMaterial(materialParams);
                }
            });
            
            scene.add(object);

        });



scene.add(light, ambient);        
        
const clock = new THREE.Clock();

        function view() {
            requestAnimationFrame(view);

            const delta = clock.getDelta();
            if (mixer) mixer.update(delta);

            controls.update();
            renderer.render(scene, camera);
        }

view();


let isControlsEnable = false;
function toggleOrbitControls() {
    if (isControlsEnable) {
        controls.enabled = false;
    } else {
        controls.enabled = true;
    }
    isControlsEnable = !isControlsEnable;

    document.getElementById('threeD').classList.add("hidden");
    document.getElementById('front').classList.remove("hidden");
};

function toggleOffOrbitControls() {
    if (!isControlsEnable) {
        controls.enabled = true;
    } else {
        controls.enabled = false;
    }
    isControlsEnable = !isControlsEnable;

    document.getElementById('front').classList.add("hidden");
    document.getElementById('threeD').classList.remove("hidden");

};