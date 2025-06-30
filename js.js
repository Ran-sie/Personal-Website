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

const hairtexture = textureloader.load('texture/Hair_Color.png');
const hairnormal = textureloader.load('texture/Hair_Normal.png');

const aclothcolor = textureloader.load('texture/1Cloth_Color.png');
const aclothR = textureloader.load('texture/1Cloth_Roughness.png');
const aclothM = textureloader.load('texture/1Cloth_Metallic.png');
const aclothNormal = textureloader.load('texture/1Cloth_Normal.png');

const bclothcolor = textureloader.load('texture/2Cloth_Color.png');
const bclothR = textureloader.load('texture/2Cloth_Roughness.png');
const bclothM = textureloader.load('texture/2Cloth_Metallic.png');
const bclothNormal = textureloader.load('texture/2Cloth_Normal.png');

const characterColor = textureloader.load('texture/Character_Color.png');
const characterNormal = textureloader.load('texture/Character_Normal.png');

const detailColor = textureloader.load('texture/Detail_Color.png');
const detailR = textureloader.load('texture/Detail_Roughness.png');
const detailNormal = textureloader.load('texture/Detail_Normal.png');

const Gloader = new THREE.GLTFLoader(manager);

let mixer;

Gloader.load('model/Battle_Medic.glb', (gltf) => {
    object = gltf.scene;
    mixer = new THREE.AnimationMixer(object);
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();

    object.scale.set(50, 50, 50);
    object.position.set(20, -65, 0);
    object.rotation.set(0, -.8, 0);
    
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
                    } else if (child.name.toLowerCase().includes('1cloth')) {
                        materialParams = {
                            map: aclothcolor,
                            roughnessMap: aclothR,
                            metalnessMap: aclothM,
                            normalMap: aclothNormal,
                            roughness: 1,
                            metalness: 1,
                        };

                    } else if (child.name.toLowerCase().includes('2cloth')) {
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

            renderer.render(scene, camera);
        }

view();

const sections = document.querySelectorAll("section");
const navlink = document.querySelectorAll(".nav_bar h1 a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(sections => {
        const sectionTop = sections.offsetTop;
        const sectionHeight = sections.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = sections.getAttribute("id");
        }
    });

    if (current && window.location.hash !== `#${current}`) {
        window.history.pushState(null, null, `#${current}`);
    }

    navlink.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(current)) {
            link.classList.add("active");
        }
    });

    updateCanva();
});

const raycast = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let object = null;

function onMouse(event) {

    const canvas = document.querySelector('#home canvas');
    const canvaSty = window.getComputedStyle(canvas);

    if (canvaSty.display === 'none') return;

    if (!object || !object.visible) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycast.setFromCamera(mouse, camera);

    const inter = raycast.intersectObject(object, true);

    if (inter.length > 0) {
        window.location.href = 'Battle_medic.html';
    }
}

window.addEventListener('click', onMouse, false);

if (!window.location.hash) {
    window.location.hash = '#home';
}
function updateCanva() {
    const canvas = document.querySelector('#home canvas');
    const currentSec = window.location.hash;

    if (currentSec === '#home' ) {
        canvas.style.display = 'block';
    } else {
        canvas.style.display = 'none';
    }
}

window.addEventListener('hashchange', updateCanva);

updateCanva();

