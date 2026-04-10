// --- 1. シーン・カメラ・レンダラーの設定 ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0d8ef); 
scene.fog = new THREE.Fog(0xd2b48c, 10, 450); // 遠くを霞ませる

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// --- 2. ライト ---
const sunLight = new THREE.DirectionalLight(0xfff0dd, 1.5);
sunLight.position.set(10, 20, 15);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 4096;
sunLight.shadow.mapSize.height = 4096;
sunLight.shadow.camera.left = -50;
sunLight.shadow.camera.right = 1500;
sunLight.shadow.camera.top = 100;
sunLight.shadow.camera.bottom = -50;
sunLight.shadow.camera.far = 1000;
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0x706050, 0.8);
scene.add(ambientLight);

// --- 3. 地面と背景 ---
const groundGeometry = new THREE.PlaneGeometry(3000, 200, 10, 10);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xc2a47d, roughness: 1.0 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// レンガの塔（背景）
const brickColor = 0xa67153; 
for (let i = -50; i < 1500; i += 60) {
    const tHeight = 15 + Math.random() * 20;
    const tower = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 2.5, tHeight, 16),
        new THREE.MeshStandardMaterial({ color: brickColor, roughness: 0.9 })
    );
    tower.position.set(i + 50, tHeight / 2, -30);
    tower.castShadow = true;
    tower.receiveShadow = true;
    scene.add(tower);
}

// 遠景の塔
for (let j = 0; j < 50; j++) {
    const tHeight_distant = 30 + Math.random() * 40;
    const distanceX = Math.random() * 2000 - 50;
    const distanceZ = -50 - Math.random() * 50;
    const distantTower = new THREE.Mesh(
        new THREE.CylinderGeometry(2, 3, tHeight_distant, 16),
        new THREE.MeshStandardMaterial({ color: brickColor, roughness: 1.0 })
    );
    distantTower.position.set(distanceX, tHeight_distant / 2, distanceZ);
    scene.add(distantTower);
}

// --- 新機能：木のはしごを作成 ---
// はしごをまとめるグループ
const ladderGroup = new THREE.Group();

// 木材のマテリアル（少し古びた茶色）
const woodMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8b5a2b, // 木の色
    roughness: 1.0,  // 光沢なし
    metalness: 0.0
});

// 1. 縦の柱（2本）
const sideRailGeometry = new THREE.BoxGeometry(0.2, 10, 0.2); // 幅0.2m, 高さ10m, 奥行0.2m
const leftRail = new THREE.Mesh(sideRailGeometry, woodMaterial);
leftRail.position.set(-0.6, 5, 0); // 左側に配置、高さを地面に合わせる
leftRail.castShadow = true;
leftRail.receiveShadow = true;
ladderGroup.add(leftRail);

const rightRail = new THREE.Mesh(sideRailGeometry, woodMaterial);
rightRail.position.set(0.6, 5, 0); // 右側に配置
rightRail.castShadow = true;
rightRail.receiveShadow = true;
ladderGroup.add(rightRail);

// 2. 横の踏み板（ステップ）
const stepGeometry = new THREE.BoxGeometry(1.4, 0.1, 0.1); // 幅1.4m, 高さ0.1m, 奥行0.1m
const stepCount = 12; // ステップの数
for (let i = 0; i < stepCount; i++) {
    const step = new THREE.Mesh(stepGeometry, woodMaterial);
    // 下から上へ、等間隔に配置
    step.position.set(0, 0.8 + i * 0.8, 0); 
    step.castShadow = true;
    step.receiveShadow = true;
    ladderGroup.add(step);
}

// はしごの位置と角度（タイヤ飛ばし器の少し先）
ladderGroup.position.set(20, 0, 0); // X=20mの位置（機械はX=0）
ladderGroup.rotation.y = Math.PI / 2; // 少し斜めに構える（奥行き感を出す）
ladderGroup.rotation.x = -Math.PI / 18; // 少し後ろに立てかけるような角度
scene.add(ladderGroup);

// --- 小石 ---
for (let i = 0; i < 400; i++) {
    const size = 0.1 + Math.random() * 0.2;
    const stone = new THREE.Mesh(
        new THREE.DodecahedronGeometry(size),
        new THREE.MeshStandardMaterial({ color: 0x8b7355 })
    );
    stone.position.set(Math.random() * 1000 - 50, size / 2, Math.random() * 60 - 30);
    stone.castShadow = true;
    scene.add(stone);
}

// --- 4. 登場オブジェクト (タイヤ & インド人) ---
// タイヤグループ
const tireGroup = new THREE.Group();
const tireMesh = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 100),
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 })
);
tireMesh.castShadow = true;
tireGroup.add(tireMesh);

const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 0.4, 8, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x444444, wireframe: true })
);
hub.rotation.x = Math.PI / 2;
tireGroup.add(hub);

tireGroup.rotation.y = Math.PI / 6; // 縦に立てる
tireGroup.position.y = 1.4;
scene.add(tireGroup);

// インド人
const indianGuy = new THREE.Group();
const skinMat = new THREE.MeshStandardMaterial({ color: 0x8d5524 });
const clothMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 0.8), clothMat);
body.position.y = 0.7;
indianGuy.add(body);

const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), skinMat);
head.position.y = 1.7;
indianGuy.add(head);

const turban = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.3, 12), clothMat);
turban.position.y = 2.0;
indianGuy.add(turban);

const arms = new THREE.Group();
const armGeo = new THREE.CylinderGeometry(0.1, 0.08, 1);
const rArm = new THREE.Mesh(armGeo, clothMat);
rArm.position.set(0.5, 1.2, 0.4);
rArm.rotation.x = Math.PI / 3;
arms.add(rArm);
indianGuy.add(arms);

indianGuy.position.set(-3, 0, 2);
indianGuy.rotation.y = Math.PI / 4;
scene.add(indianGuy);

// 機械
const engine = new THREE.Mesh(new THREE.BoxGeometry(3, 1.8, 2.5), new THREE.MeshStandardMaterial({ color: 0x1b3d18 }));
engine.position.set(0, 0.9, 0);
engine.castShadow = true;
scene.add(engine);

const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1, 16), new THREE.MeshStandardMaterial({ color: 0x222222 }));
exhaust.position.set(0.5, 2.3, 0);
scene.add(exhaust);

// フライホイール
const flywheel = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.4, 32), new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.6 }));
flywheel.rotation.z = Math.PI / 2;
flywheel.position.set(1.5, 1.2, 0);
flywheel.castShadow = true;
scene.add(flywheel);

// --- 5. ゲームロジック & エフェクト ---
let smokeParticles = [];
function createSmoke() {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), new THREE.MeshLambertMaterial({ color: 0x666666, transparent: true, opacity: 0.7 }));
    p.position.set(exhaust.position.x, exhaust.position.y + 0.5, exhaust.position.z);
    p.velocity = new THREE.Vector3((Math.random()-0.5)*0.1, 0.2, (Math.random()-0.5)*0.1);
    p.life = 1.0;
    scene.add(p);
    smokeParticles.push(p);
}

let power = 0, isFlying = false, resultShown = false;
let vx = 0, vy = 0;
const gravity = -0.015;

camera.position.set(-15, 10, 18);
camera.lookAt(0, 2, 0);

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !isFlying) {
        power = Math.min(power + 4, 110);
        createSmoke();
        arms.rotation.z = Math.sin(Date.now() * 0.1) * 0.2; // 腕をピョコピョコ動かす
    }
    if (e.code === 'Enter' && !isFlying && power > 10) {
        isFlying = true;
        vx = power * 0.018; vy = power * 0.038;
        for(let i=0; i<25; i++) setTimeout(createSmoke, i * 40);
    }
});

function animate() {
    requestAnimationFrame(animate);

    smokeParticles.forEach((p, i) => {
        p.position.add(p.velocity); p.life -= 0.015; p.material.opacity = p.life;
        if (p.life <= 0) { scene.remove(p); smokeParticles.splice(i, 1); }
    });

    if (isFlying) {
        vy += gravity;
        tireGroup.position.x += vx; tireGroup.position.y += vy;
        tireGroup.rotation.z -= vx * 0.4; // 縦回転

        if (tireGroup.position.y <= 1.4) {
            tireGroup.position.y = 1.4; vy *= -0.55; vx *= 0.97;
            if (Math.abs(vx) < 0.01 && !resultShown) {
                vx = 0; resultShown = true;
                showResult(tireGroup.position.x);
            }
        }
        camera.position.x = tireGroup.position.x - 12;
        camera.lookAt(tireGroup.position.x + 8, tireGroup.position.y, 0);
    } else {
        power *= 0.99;
        flywheel.rotation.x += power * 0.01;
    }

    renderer.render(scene, camera);
}

function showResult(finalX) {
    const score = Math.floor(finalX / 10);
    document.getElementById('distance').innerText = score + "m";
    document.getElementById('result').style.display = "block";
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();