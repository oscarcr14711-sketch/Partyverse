import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';
import { GLView } from 'expo-gl';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Renderer, loadTextureAsync } from 'expo-three';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, GestureResponderEvent, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as THREE from 'three';

const { width, height } = Dimensions.get('window');

const BLOCK_LENGTH = 1.5;
const BLOCK_WIDTH = 0.5;
const BLOCK_HEIGHT = 0.3;
const BLOCKS_PER_LEVEL = 3;
const INITIAL_LEVELS = 18; // Taller tower for more gameplay
const GRAVITY = 0.018;

interface Block {
    id: string;
    level: number;
    position: number;
    isHorizontal: boolean;
    mesh?: THREE.Mesh;
    isBeingDragged?: boolean;
    originalLevel?: number;
    falling?: boolean;
    velocity?: THREE.Vector3;
}

interface Player {
    id: string;
    name: string;
    color: string;
}

// Enhanced wood texture with rich detail for modern realistic look
function createWoodTexture(dark = false): THREE.Texture {
    const size = 512;
    const data = new Uint8Array(size * size * 4);

    const baseR = dark ? 85 : 190;
    const baseG = dark ? 50 : 140;
    const baseB = dark ? 30 : 95;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const i = (y * size + x) * 4;

            const flowOffset = Math.sin(y * 0.008) * 30 + Math.sin(y * 0.025) * 15;
            const grain1 = Math.sin((x + flowOffset) * 0.04) * 25;
            const grain2 = Math.sin((x + flowOffset) * 0.12 + y * 0.008) * 12;
            const grain3 = Math.sin((x + flowOffset) * 0.25) * 6;

            const centerX = size * 0.3 + Math.sin(y * 0.01) * 40;
            const dist = Math.sqrt((x - centerX) ** 2 + (y * 2.5) ** 2);
            const rings = Math.sin(dist * 0.018) * 15 + Math.sin(dist * 0.035) * 8;

            const fineGrain = Math.sin(x * 0.8 + y * 0.3) * 3 + Math.sin(x * 1.2 - y * 0.5) * 2;
            const noise = (Math.random() - 0.5) * 8;

            const knotCheck = Math.sin(x * 0.15 + y * 0.1) * Math.sin(y * 0.08 + x * 0.05);
            const knot = knotCheck > 0.92 ? -35 : knotCheck > 0.85 ? -15 : 0;

            const highlight = Math.sin(y * 0.005) * 8;
            const variation = grain1 + grain2 + grain3 + rings + fineGrain + noise + knot + highlight;

            data[i] = Math.max(0, Math.min(255, baseR + variation * 1.05));
            data[i + 1] = Math.max(0, Math.min(255, baseG + variation * 0.88));
            data[i + 2] = Math.max(0, Math.min(255, baseB + variation * 0.65));
            data[i + 3] = 255;
        }
    }

    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    return texture;
}

export default function StackTowerGame() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const playersParam: Player[] = JSON.parse((params.players as string) || '[]');
    const players: Player[] = playersParam.length > 0 ? playersParam : [{ id: '1', name: 'Player', color: '#f94144' }];

    const [blocks, setBlocks] = useState<Block[]>([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
    const [removedCount, setRemovedCount] = useState(0);
    const [stability, setStability] = useState(100); // 0-100 stability meter
    const [gamePhase, setGamePhase] = useState<'build' | 'play'>('play'); // build or play phase

    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const towerGroupRef = useRef<THREE.Group | null>(null);
    const cameraAngleRef = useRef({ theta: 0, phi: 0.3 }); // Added phi for vertical angle
    const zoomRef = useRef(18); // Camera distance (zoom level)
    const lastTouchRef = useRef({ x: 0, y: 0 });
    const lastPinchDistRef = useRef(0); // For pinch-to-zoom
    const touchCountRef = useRef(0); // Track number of fingers
    const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
    const animationFrameRef = useRef<number>();
    const dragPlaneRef = useRef<THREE.Plane>(new THREE.Plane());
    const dragOffsetRef = useRef<THREE.Vector3>(new THREE.Vector3());
    const blocksRef = useRef<Block[]>([]);
    const collapsingRef = useRef(false);
    const wobbleRef = useRef({ angle: 0, speed: 0 }); // Tower wobble
    const soundRef = useRef<Audio.Sound | null>(null);
    const shelfWallRef = useRef<THREE.Mesh | null>(null);
    const sofaWallRef = useRef<THREE.Mesh | null>(null);

    const currentPlayer = players[currentPlayerIndex];

    useEffect(() => {
        blocksRef.current = blocks;
    }, [blocks]);

    const updateCamera = () => {
        if (cameraRef.current) {
            const radius = zoomRef.current; // Use zoom level
            const { theta, phi } = cameraAngleRef.current;
            // Spherical coordinates for full camera control
            cameraRef.current.position.x = radius * Math.sin(theta) * Math.cos(phi);
            cameraRef.current.position.y = 4 + radius * Math.sin(phi); // Base height + vertical
            cameraRef.current.position.z = radius * Math.cos(theta) * Math.cos(phi);
            cameraRef.current.lookAt(0, 3, 0); // Look at tower center

            // Fade walls based on camera direction to prevent blocking view
            // Left wall (shelf) fades when camera looks left (theta > 0)
            if (shelfWallRef.current) {
                const leftFace = Math.abs(Math.sin(theta));
                const leftOpacity = theta > 0.3 ? Math.max(0.05, 0.5 - leftFace * 0.5) : 0.5;
                (shelfWallRef.current.material as THREE.MeshBasicMaterial).opacity = leftOpacity;
            }
            // Right wall (sofa) fades when camera looks right (theta < 0)
            if (sofaWallRef.current) {
                const rightFace = Math.abs(Math.sin(theta));
                const rightOpacity = theta < -0.3 ? Math.max(0.05, 0.5 - rightFace * 0.5) : 0.5;
                (sofaWallRef.current.material as THREE.MeshBasicMaterial).opacity = rightOpacity;
            }
        }
    };

    const onContextCreate = async (gl: any) => {
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        renderer.setClearColor(0x87CEEB); // Sky blue
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
        const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
        camera.position.set(0, 12, 18); // Much higher and further back
        camera.lookAt(0, 4, 0); // Look at upper tower
        cameraRef.current = camera;

        // === MODERN SOPHISTICATED LIGHTING ===
        // Warm ambient for base illumination
        scene.add(new THREE.AmbientLight(0xfff5e6, 0.45));

        // Main sunlight with soft shadows
        const sunLight = new THREE.DirectionalLight(0xfffaf5, 0.85);
        sunLight.position.set(8, 18, 12);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 1;
        sunLight.shadow.camera.far = 50;
        sunLight.shadow.camera.left = -15;
        sunLight.shadow.camera.right = 15;
        sunLight.shadow.camera.top = 15;
        sunLight.shadow.camera.bottom = -15;
        sunLight.shadow.bias = -0.001;
        sunLight.shadow.radius = 3; // Soft shadow edges
        scene.add(sunLight);

        // Warm fill light from side
        const warmFill = new THREE.PointLight(0xffaa66, 0.5, 25);
        warmFill.position.set(-5, 6, 5);
        scene.add(warmFill);

        // Rim light for depth (warm, not blue to avoid tinting)
        const rimLight = new THREE.PointLight(0xffcc88, 0.25, 20);
        rimLight.position.set(6, 8, -4);
        scene.add(rimLight);

        // Subtle ground bounce light
        const bounceLight = new THREE.PointLight(0xffd8b0, 0.2, 15);
        bounceLight.position.set(0, -2, 3);
        scene.add(bounceLight);

        // === GRADIENT SKY BACKGROUND ===
        // Create a large sphere for gradient sky
        const skyGeo = new THREE.SphereGeometry(50, 32, 32);
        const skyColors: number[] = [];
        const skyVertices = skyGeo.attributes.position;

        for (let i = 0; i < skyVertices.count; i++) {
            const y = skyVertices.getY(i);
            // Gradient from warm sunset orange at horizon to deep blue at top
            const t = (y + 50) / 100; // 0 at bottom, 1 at top
            const r = 0.2 + 0.6 * (1 - t); // More red at bottom
            const g = 0.4 + 0.3 * t; // Green varies
            const b = 0.5 + 0.4 * t; // More blue at top
            skyColors.push(r, g, b);
        }
        skyGeo.setAttribute('color', new THREE.Float32BufferAttribute(skyColors, 3));

        const skyMat = new THREE.MeshBasicMaterial({
            vertexColors: true,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeo, skyMat);
        scene.add(sky);

        // === FLOATING CLOUDS ===
        const createCloud = (x: number, y: number, z: number, scale: number) => {
            const cloudGroup = new THREE.Group();
            const cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });

            // Multiple spheres form a cloud
            for (let i = 0; i < 5; i++) {
                const radius = (Math.random() * 0.5 + 0.4) * scale;
                const sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 8, 6), cloudMat);
                sphere.position.set(
                    (Math.random() - 0.5) * 2 * scale,
                    (Math.random() - 0.5) * 0.5 * scale,
                    (Math.random() - 0.5) * scale
                );
                cloudGroup.add(sphere);
            }
            cloudGroup.position.set(x, y, z);
            return cloudGroup;
        };

        // Add several clouds
        scene.add(createCloud(-15, 12, -20, 1.5));
        scene.add(createCloud(10, 14, -25, 2));
        scene.add(createCloud(-8, 10, -18, 1));
        scene.add(createCloud(18, 11, -22, 1.8));

        // === CITY SKYLINE SILHOUETTE ===
        const buildingSilhouetteMat = new THREE.MeshBasicMaterial({ color: 0x1a1a2e });
        const addBuilding = (x: number, w: number, h: number) => {
            const building = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.1), buildingSilhouetteMat);
            building.position.set(x, h / 2 - 4, -30);
            scene.add(building);
        };
        addBuilding(-20, 3, 8);
        addBuilding(-15, 2, 12);
        addBuilding(-11, 4, 6);
        addBuilding(-6, 2.5, 15);
        addBuilding(-2, 3, 9);
        addBuilding(3, 2, 18);
        addBuilding(8, 4, 7);
        addBuilding(13, 2.5, 13);
        addBuilding(18, 3, 10);

        // === PREMIUM TABLE SETUP ===
        const tableTexture = createWoodTexture(true);

        // Polished mahogany table top with subtle reflections
        const tableTop = new THREE.Mesh(
            new THREE.BoxGeometry(12, 0.5, 8),
            new THREE.MeshStandardMaterial({
                map: tableTexture,
                color: 0x6b3d2e,
                roughness: 0.25,
                metalness: 0.08,
                envMapIntensity: 0.3
            })
        );
        tableTop.position.set(0, -0.7, 0);
        tableTop.receiveShadow = true;
        tableTop.castShadow = true;
        scene.add(tableTop);

        // Table edge trim (decorative)
        const trimGeo = new THREE.BoxGeometry(12.1, 0.1, 8.1);
        const trimMat = new THREE.MeshStandardMaterial({ color: 0x4a2510, roughness: 0.3, metalness: 0.15 });
        const topTrim = new THREE.Mesh(trimGeo, trimMat);
        topTrim.position.set(0, -0.42, 0);
        scene.add(topTrim);

        // Elegant turned legs
        const legGeo = new THREE.CylinderGeometry(0.18, 0.22, 3.5, 12);
        const legMat = new THREE.MeshStandardMaterial({ map: tableTexture, color: 0x4a2d18, roughness: 0.35, metalness: 0.05 });
        [[-5.3, -2.6, 3.3], [5.3, -2.6, 3.3], [-5.3, -2.6, -3.3], [5.3, -2.6, -3.3]].forEach(pos => {
            const leg = new THREE.Mesh(legGeo, legMat);
            leg.position.set(pos[0], pos[1], pos[2]);
            leg.castShadow = true;
            scene.add(leg);
        });

        // Pendant lights hanging above table
        const createPendantLight = (x: number, z: number) => {
            const cord = new THREE.Mesh(
                new THREE.CylinderGeometry(0.02, 0.02, 3, 8),
                new THREE.MeshStandardMaterial({ color: 0x333333 })
            );
            cord.position.set(x, 10, z);
            scene.add(cord);

            const shade = new THREE.Mesh(
                new THREE.ConeGeometry(0.4, 0.5, 8, 1, true),
                new THREE.MeshStandardMaterial({ color: 0xe8d4b8, side: THREE.DoubleSide })
            );
            shade.position.set(x, 8.5, z);
            shade.rotation.x = Math.PI;
            scene.add(shade);

            const bulb = new THREE.PointLight(0xffdd88, 0.6, 8);
            bulb.position.set(x, 8.3, z);
            scene.add(bulb);
        };
        createPendantLight(-2, 0);
        createPendantLight(2, 0);

        // Coffee cup with steam effect (white porcelain)
        const cupBody = new THREE.Mesh(
            new THREE.CylinderGeometry(0.28, 0.22, 0.55, 16),
            new THREE.MeshStandardMaterial({ color: 0xfffef8, roughness: 0.2, metalness: 0.05 })
        );
        cupBody.position.set(4.5, -0.2, 2.5);
        cupBody.castShadow = true;
        scene.add(cupBody);

        const coffee = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.25, 0.06, 16),
            new THREE.MeshStandardMaterial({ color: 0x3a1c0a })
        );
        coffee.position.set(4.5, 0.02, 2.5);
        scene.add(coffee);

        // Saucer
        const saucer = new THREE.Mesh(
            new THREE.CylinderGeometry(0.4, 0.38, 0.06, 16),
            new THREE.MeshStandardMaterial({ color: 0xfffef8, roughness: 0.2 })
        );
        saucer.position.set(4.5, -0.48, 2.5);
        scene.add(saucer);

        // Books stack
        const bookColors = [0x8b4513, 0x2e4a62, 0x654321, 0x3d5c5c];
        bookColors.forEach((color, i) => {
            const book = new THREE.Mesh(
                new THREE.BoxGeometry(0.6, 0.12, 0.8),
                new THREE.MeshStandardMaterial({ color, roughness: 0.7 })
            );
            book.position.set(-4.5, -0.35 + i * 0.12, 2);
            book.rotation.y = (Math.random() - 0.5) * 0.3;
            scene.add(book);
        });

        // === PREMIUM DECORATIONS ===
        // Wine glass (crystal)
        const wineGlassMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.02,
            metalness: 0.1,
            transparent: true,
            opacity: 0.4
        });
        const glassStem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 12), wineGlassMat);
        glassStem.position.set(-4.8, -0.2, -2);
        scene.add(glassStem);
        const glassBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.03, 16), wineGlassMat);
        glassBase.position.set(-4.8, -0.45, -2);
        scene.add(glassBase);
        const glassBowl = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), wineGlassMat);
        glassBowl.position.set(-4.8, 0.05, -2);
        scene.add(glassBowl);
        // Wine inside
        const wine = new THREE.Mesh(
            new THREE.SphereGeometry(0.18, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2.5),
            new THREE.MeshStandardMaterial({ color: 0x6b1126, roughness: 0.3, transparent: true, opacity: 0.85 })
        );
        wine.position.set(-4.8, 0.02, -2);
        scene.add(wine);

        // Candle with flame
        const candleBody = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 0.6, 12),
            new THREE.MeshStandardMaterial({ color: 0xfff5e6, roughness: 0.8 })
        );
        candleBody.position.set(-3.5, -0.15, -2.5);
        scene.add(candleBody);
        // Flame
        const flame = new THREE.Mesh(
            new THREE.ConeGeometry(0.05, 0.15, 8),
            new THREE.MeshBasicMaterial({ color: 0xffaa33 })
        );
        flame.position.set(-3.5, 0.22, -2.5);
        scene.add(flame);
        // Candle glow
        const candleGlow = new THREE.PointLight(0xffaa55, 0.4, 4);
        candleGlow.position.set(-3.5, 0.3, -2.5);
        scene.add(candleGlow);

        // Folded cloth napkin
        const napkin = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.08, 0.3),
            new THREE.MeshStandardMaterial({ color: 0xf5f0e8, roughness: 0.9 })
        );
        napkin.position.set(4.8, -0.42, -1.5);
        napkin.rotation.y = 0.3;
        scene.add(napkin);

        // Floor - rich hardwood
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(40, 40),
            new THREE.MeshStandardMaterial({ map: createWoodTexture(true), color: 0x6b4423, roughness: 0.6, metalness: 0.05 })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -4.35;
        floor.receiveShadow = true;
        scene.add(floor);

        // Elegant wallpaper back wall
        const wallMat = new THREE.MeshStandardMaterial({ color: 0xd4c4b0, roughness: 0.9 });
        const wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 20), wallMat);
        wall.position.set(0, 5, -12);
        scene.add(wall);

        // Side walls removed - replaced with texture images below

        // Window frame (single large arched window on left)
        const windowFrame = (x: number) => {
            // Window glass (gradient reflection)
            const glass = new THREE.Mesh(
                new THREE.PlaneGeometry(5, 7),
                new THREE.MeshStandardMaterial({ color: 0xa8d8ea, roughness: 0.05, metalness: 0.4, transparent: true, opacity: 0.7 })
            );
            glass.position.set(x, 5.5, -11.9);
            scene.add(glass);

            // Elegant dark frame
            const frameMat = new THREE.MeshStandardMaterial({ color: 0x2d1f14, roughness: 0.4, metalness: 0.2 });
            const fTop = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.25, 0.18), frameMat);
            fTop.position.set(x, 9.2, -11.85);
            scene.add(fTop);
            const fBot = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.25, 0.18), frameMat);
            fBot.position.set(x, 2, -11.85);
            scene.add(fBot);
            const fLeft = new THREE.Mesh(new THREE.BoxGeometry(0.25, 7.4, 0.18), frameMat);
            fLeft.position.set(x - 2.7, 5.6, -11.85);
            scene.add(fLeft);
            const fRight = new THREE.Mesh(new THREE.BoxGeometry(0.25, 7.4, 0.18), frameMat);
            fRight.position.set(x + 2.7, 5.6, -11.85);
            scene.add(fRight);
        };
        windowFrame(-5); // Left window
        windowFrame(5);  // Right window

        // === BOOKSHELF WALL TEXTURE (left side wall) ===
        const shelfAsset = Asset.fromModule(require('../assets/images/shelf.png'));
        await shelfAsset.downloadAsync();
        const shelfTexture = await loadTextureAsync({ asset: shelfAsset });
        const shelfWallGeometry = new THREE.PlaneGeometry(40, 25);
        const shelfWallMaterial = new THREE.MeshBasicMaterial({
            map: shelfTexture,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
        });
        const shelfWall = new THREE.Mesh(shelfWallGeometry, shelfWallMaterial);
        shelfWall.position.set(-20, 5, 0);
        shelfWall.rotation.y = Math.PI / 2;
        shelfWallRef.current = shelfWall;
        scene.add(shelfWall);

        // === SOFA WALL TEXTURE (right side wall) ===
        const sofaAsset = Asset.fromModule(require('../assets/images/sofa.png'));
        await sofaAsset.downloadAsync();
        const sofaTexture = await loadTextureAsync({ asset: sofaAsset });
        const sofaWallGeometry = new THREE.PlaneGeometry(40, 25);
        const sofaWallMaterial = new THREE.MeshBasicMaterial({
            map: sofaTexture,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
        });
        const sofaWall = new THREE.Mesh(sofaWallGeometry, sofaWallMaterial);
        sofaWall.position.set(20, 5, 0);
        sofaWall.rotation.y = -Math.PI / 2;
        sofaWallRef.current = sofaWall;
        scene.add(sofaWall);

        // === ENHANCED TABLE ITEMS ===
        // Realistic coffee cup with handle
        const cupMat = new THREE.MeshStandardMaterial({ color: 0xfffef8, roughness: 0.15, metalness: 0.05 });

        // Cup handle using torus
        const handleGeo = new THREE.TorusGeometry(0.12, 0.03, 8, 16, Math.PI);
        const handle = new THREE.Mesh(handleGeo, cupMat);
        handle.position.set(4.78, -0.2, 2.5);
        handle.rotation.z = Math.PI / 2;
        handle.rotation.y = Math.PI / 2;
        scene.add(handle);

        // Napkin under cup
        const cupNapkin = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.02, 0.8),
            new THREE.MeshStandardMaterial({ color: 0xf5f5dc, roughness: 0.95 })
        );
        cupNapkin.position.set(4.5, -0.49, 2.5);
        cupNapkin.rotation.y = 0.3;
        scene.add(cupNapkin);

        // Small spoon on saucer
        const spoonHandle = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, 0.02, 0.4),
            new THREE.MeshStandardMaterial({ color: 0xc0c0c0, roughness: 0.2, metalness: 0.8 })
        );
        spoonHandle.position.set(4.8, -0.44, 2.5);
        spoonHandle.rotation.y = 0.5;
        scene.add(spoonHandle);

        // Wine/water glass nearby
        const glassBody = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.08, 0.5, 12),
            new THREE.MeshStandardMaterial({ color: 0xeeffff, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.6 })
        );
        glassBody.position.set(5.2, -0.25, 1.5);
        scene.add(glassBody);
        const waterGlassStem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.02, 0.25, 8),
            new THREE.MeshStandardMaterial({ color: 0xeeffff, roughness: 0.05, transparent: true, opacity: 0.7 })
        );
        waterGlassStem.position.set(5.2, -0.62, 1.5);
        scene.add(waterGlassStem);
        const waterGlassBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 0.03, 12),
            new THREE.MeshStandardMaterial({ color: 0xeeffff, roughness: 0.05, transparent: true, opacity: 0.7 })
        );
        waterGlassBase.position.set(5.2, -0.76, 1.5);
        scene.add(waterGlassBase);

        // Small vase with flowers
        const vase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.18, 0.5, 12),
            new THREE.MeshStandardMaterial({ color: 0x4a7c59, roughness: 0.3 })
        );
        vase.position.set(-4.8, -0.25, -1);
        scene.add(vase);
        // Simple flower stems
        for (let i = 0; i < 3; i++) {
            const stem = new THREE.Mesh(
                new THREE.CylinderGeometry(0.015, 0.015, 0.6, 6),
                new THREE.MeshStandardMaterial({ color: 0x228b22 })
            );
            stem.position.set(-4.8 + (i - 1) * 0.06, 0.25, -1);
            stem.rotation.z = (i - 1) * 0.15;
            scene.add(stem);
            // Flower head
            const flower = new THREE.Mesh(
                new THREE.SphereGeometry(0.08, 8, 8),
                new THREE.MeshStandardMaterial({ color: [0xff6b6b, 0xffd93d, 0xff8fab][i] })
            );
            flower.position.set(-4.8 + (i - 1) * 0.08, 0.55 + i * 0.05, -1);
            scene.add(flower);
        }

        // Elegant potted palm plant (moved and enhanced)
        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.35, 0.28, 0.5, 12),
            new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.6 })
        );
        pot.position.set(-4.5, -0.25, -2.5);
        scene.add(pot);

        const soil = new THREE.Mesh(
            new THREE.CylinderGeometry(0.32, 0.32, 0.1, 12),
            new THREE.MeshStandardMaterial({ color: 0x3d2817 })
        );
        soil.position.set(-4.5, 0.02, -2.5);
        scene.add(soil);

        // Palm leaves (simple representation)
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x228b22, side: THREE.DoubleSide });
        for (let i = 0; i < 6; i++) {
            const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 1.2), leafMat);
            const angle = (i / 6) * Math.PI * 2;
            leaf.position.set(-4.5 + Math.sin(angle) * 0.3, 0.7, -2.5 + Math.cos(angle) * 0.3);
            leaf.rotation.x = -0.5;
            leaf.rotation.y = angle;
            scene.add(leaf);
        }

        // === STACK TOWER ===
        const towerGroup = new THREE.Group();
        towerGroup.position.set(0, -0.5, 0);
        scene.add(towerGroup);
        towerGroupRef.current = towerGroup;

        const woodTexture = createWoodTexture();
        const initialBlocks: Block[] = [];

        for (let level = 0; level < INITIAL_LEVELS; level++) {
            const isHorizontal = level % 2 === 0;
            const y = level * BLOCK_HEIGHT + BLOCK_HEIGHT / 2;

            for (let pos = 0; pos < BLOCKS_PER_LEVEL; pos++) {
                const geometry = new THREE.BoxGeometry(BLOCK_LENGTH, BLOCK_HEIGHT, BLOCK_WIDTH);
                const material = new THREE.MeshStandardMaterial({
                    map: woodTexture, color: 0xd4b896, roughness: 0.65,
                });

                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.userData = { blockId: `${level}-${pos}` };

                const edges = new THREE.EdgesGeometry(geometry);
                mesh.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })));

                // Add invisible larger hitbox for better tap detection
                const hitboxGeometry = new THREE.BoxGeometry(
                    BLOCK_LENGTH * 1.3,
                    BLOCK_HEIGHT * 2.5,  // Much taller hitbox to prevent selecting wrong level
                    BLOCK_WIDTH * 1.3
                );
                const hitboxMaterial = new THREE.MeshBasicMaterial({
                    visible: false,  // Invisible
                    transparent: true,
                    opacity: 0
                });
                const hitbox = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
                hitbox.userData = { blockId: `${level}-${pos}`, isHitbox: true };
                mesh.add(hitbox);  // Add as child so it moves with the block

                const offset = (pos - 1) * BLOCK_WIDTH;
                if (isHorizontal) {
                    mesh.position.set(0, y, offset);
                } else {
                    mesh.position.set(offset, y, 0);
                    mesh.rotation.y = Math.PI / 2;
                }

                towerGroup.add(mesh);
                initialBlocks.push({
                    id: `${level}-${pos}`, level, position: pos, isHorizontal, mesh,
                    originalLevel: level, isBeingDragged: false, falling: false,
                    velocity: new THREE.Vector3(0, 0, 0),
                });
            }
        }

        setBlocks(initialBlocks);
        blocksRef.current = initialBlocks;

        // Render loop with physics
        const render = () => {
            animationFrameRef.current = requestAnimationFrame(render);

            if (collapsingRef.current) {
                blocksRef.current.forEach(block => {
                    if (block.falling && block.mesh && block.velocity) {
                        block.velocity.y -= GRAVITY;
                        block.mesh.position.add(block.velocity);
                        block.mesh.rotation.x += block.velocity.x * 0.8;
                        block.mesh.rotation.z += block.velocity.z * 0.8;
                    }
                });
            }

            renderer.render(scene, camera);
            gl.endFrameEXP();
        };
        render();
    };

    useEffect(() => {
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (soundRef.current) soundRef.current.unloadAsync();
        };
    }, []);

    // Sound effects
    const playSound = async (type: 'pickup' | 'place' | 'crash' | 'wobble') => {
        // Only play crash sound - pickup/place don't have appropriate sounds
        if (type !== 'crash') {
            // Just do haptics for pickup/place
            if (type === 'pickup') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } else if (type === 'place') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            return;
        }

        try {
            const soundFile = require('../assets/sounds/wasted.mp3');
            const { sound } = await Audio.Sound.createAsync(soundFile, {
                shouldPlay: true,
                volume: 0.8
            });
            soundRef.current = sound;
            setTimeout(() => sound.unloadAsync(), 2000);
        } catch (e) {
            console.log('Sound error:', e);
        }
    };

    // Calculate stability based on removed blocks
    const calculateStability = (): number => {
        let bottomRemoved = 0;
        let totalRemoved = 0;

        for (let level = 0; level < INITIAL_LEVELS; level++) {
            const blocksOnLevel = blocksRef.current.filter(b =>
                b.originalLevel === level && !b.isBeingDragged
            );
            const onLevelNow = blocksOnLevel.filter(b => b.level === level).length;
            const removed = 3 - onLevelNow;

            if (removed > 0) {
                totalRemoved += removed;
                if (level < 5) bottomRemoved += removed;
            }
        }

        // Stability decreases more with bottom blocks removed
        let newStability = 100 - (bottomRemoved * 15) - (totalRemoved * 5);
        return Math.max(0, Math.min(100, newStability));
    };

    // Trigger tower wobble effect
    const triggerWobble = (intensity: number = 1) => {
        wobbleRef.current.speed = 0.15 * intensity;
        wobbleRef.current.angle = (Math.random() - 0.5) * 0.05 * intensity;

        if (towerGroupRef.current) {
            // Animate wobble
            const wobbleLoop = () => {
                if (collapsingRef.current) return;

                wobbleRef.current.angle += wobbleRef.current.speed;
                wobbleRef.current.speed *= 0.92; // Damping

                if (towerGroupRef.current) {
                    towerGroupRef.current.rotation.x = Math.sin(wobbleRef.current.angle) * 0.02;
                    towerGroupRef.current.rotation.z = Math.cos(wobbleRef.current.angle * 1.3) * 0.015;
                }

                if (Math.abs(wobbleRef.current.speed) > 0.001) {
                    requestAnimationFrame(wobbleLoop);
                } else {
                    // Reset rotation when done
                    if (towerGroupRef.current) {
                        towerGroupRef.current.rotation.x = 0;
                        towerGroupRef.current.rotation.z = 0;
                    }
                }
            };
            wobbleLoop();
        }
    };

    // More realistic collapse check - real block tower games can have many blocks removed
    const checkCollapse = (): boolean => {
        // Count blocks on each level and check structural integrity
        const levelCounts: number[] = [];

        for (let level = 0; level < INITIAL_LEVELS; level++) {
            const blocksOnLevel = blocksRef.current.filter(b =>
                b.originalLevel === level && !b.isBeingDragged && !b.falling
            );
            const onLevelNow = blocksOnLevel.filter(b => b.level === level).length;
            levelCounts[level] = onLevelNow;
        }

        // Rule 1: ANY level that's completely empty causes collapse (no support for above)
        // Check from bottom up - if a level has blocks above it but is empty, collapse
        for (let level = 0; level < INITIAL_LEVELS - 1; level++) {
            if (levelCounts[level] === 0) {
                // Check if there are any blocks above this level
                let hasBlocksAbove = false;
                for (let aboveLevel = level + 1; aboveLevel < INITIAL_LEVELS; aboveLevel++) {
                    if (levelCounts[aboveLevel] > 0) {
                        hasBlocksAbove = true;
                        break;
                    }
                }
                if (hasBlocksAbove) {
                    console.log(`Collapse: Level ${level} is completely empty with blocks above it!`);
                    return true;
                }
            }
        }

        // Rule 2: Tower becomes VERY unstable only when >50% of blocks removed
        const totalBlocks = INITIAL_LEVELS * 3;
        const remainingBlocks = blocksRef.current.filter(b => !b.falling && !b.isBeingDragged).length;
        const removedPercent = 1 - (remainingBlocks / totalBlocks);

        if (removedPercent > 0.6) {
            // 60%+ blocks removed - increasing collapse chance
            const collapseChance = (removedPercent - 0.6) * 0.8;
            if (Math.random() < collapseChance) {
                console.log(`Collapse: ${Math.round(removedPercent * 100)}% blocks removed`);
                return true;
            }
        }

        return false;
    };

    const triggerCollapse = () => {
        collapsingRef.current = true;
        setGameOver(true);
        setStability(0);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        playSound('crash');

        blocksRef.current = blocksRef.current.map((block) => {
            if (block.mesh && !block.isBeingDragged) {
                const vx = (Math.random() - 0.5) * 0.12;
                const vz = (Math.random() - 0.5) * 0.12;
                return {
                    ...block,
                    falling: true,
                    velocity: new THREE.Vector3(vx, 0, vz),
                };
            }
            return block;
        });
        setBlocks([...blocksRef.current]);

        // Navigate to game over after collapse animation
        setTimeout(() => {
            router.replace({
                pathname: '/stack-tower-game-over',
                params: {
                    loserName: currentPlayer?.name || 'Player',
                    loserColor: currentPlayer?.color || '#f94144',
                    blocksRemoved: String(removedCount),
                    players: JSON.stringify(players),
                },
            });
        }, 2500);
    };

    const handleTouchStart = (e: GestureResponderEvent) => {
        const touchX = e.nativeEvent.pageX;
        const touchY = e.nativeEvent.pageY;
        lastTouchRef.current = { x: touchX, y: touchY };

        if (!gameStarted || gameOver || draggedBlockId) return;

        if (cameraRef.current) {
            const raycaster = raycasterRef.current;
            // Set very small thresholds for precise intersection
            raycaster.params.Line = { threshold: 0.01 };
            raycaster.params.Points = { threshold: 0.01 };

            const mouse = new THREE.Vector2(
                (touchX / width) * 2 - 1,
                -(touchY / height) * 2 + 1
            );
            raycaster.setFromCamera(mouse, cameraRef.current);

            const meshes = blocks.filter(b => b.mesh && !b.isBeingDragged && !b.falling).map(b => b.mesh!);
            const intersects = raycaster.intersectObjects(meshes, false);

            if (intersects.length > 0) {
                // Use the first intersection's Y position to determine the intended level
                const firstHit = intersects[0];
                const hitY = firstHit.point.y;

                // Calculate the approximate level based on Y position
                // Each level is BLOCK_HEIGHT (0.3) tall, starting from 0
                const towerBaseY = towerGroupRef.current ? towerGroupRef.current.position.y : -0.5;
                const relativeY = hitY - towerBaseY;
                const targetLevel = Math.floor(relativeY / BLOCK_HEIGHT);

                // Find all hits and select the one at the closest level to our target
                let bestHit = firstHit;
                let bestLevelDiff = Infinity;

                for (const hit of intersects) {
                    const blockId = (hit.object as THREE.Mesh).userData.blockId;
                    const block = blocks.find(b => b.id === blockId);
                    if (block) {
                        const levelDiff = Math.abs(block.level - targetLevel);
                        if (levelDiff < bestLevelDiff) {
                            bestLevelDiff = levelDiff;
                            bestHit = hit;
                        }
                    }
                }

                const blockId = (bestHit.object as THREE.Mesh).userData.blockId;
                const block = blocks.find(b => b.id === blockId);

                if (block && block.mesh) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

                    if (towerGroupRef.current) {
                        const worldPos = new THREE.Vector3();
                        block.mesh.getWorldPosition(worldPos);
                        towerGroupRef.current.remove(block.mesh);

                        if (sceneRef.current) {
                            sceneRef.current.add(block.mesh);
                            block.mesh.position.copy(worldPos);
                        }
                    }

                    if (cameraRef.current) {
                        const camDir = new THREE.Vector3();
                        cameraRef.current.getWorldDirection(camDir);
                        dragPlaneRef.current.setFromNormalAndCoplanarPoint(camDir, bestHit.point);
                        dragOffsetRef.current.copy(block.mesh.position).sub(bestHit.point);
                    }

                    const mat = block.mesh.material as THREE.MeshStandardMaterial;
                    mat.emissive = new THREE.Color(0xFFD700);
                    mat.emissiveIntensity = 0.35;

                    // Play pickup sound
                    playSound('pickup');

                    setDraggedBlockId(blockId);
                    setBlocks(prev => prev.map(b =>
                        b.id === blockId ? { ...b, isBeingDragged: true } : b
                    ));
                }
            }
        }
    };

    const handleTouchMove = (e: GestureResponderEvent) => {
        const touchX = e.nativeEvent.pageX;
        const touchY = e.nativeEvent.pageY;

        if (draggedBlockId && cameraRef.current) {
            const block = blocks.find(b => b.id === draggedBlockId);
            if (block?.mesh) {
                const mouse = new THREE.Vector2(
                    (touchX / width) * 2 - 1,
                    -(touchY / height) * 2 + 1
                );

                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(mouse, cameraRef.current);
                const intersection = new THREE.Vector3();

                if (raycaster.ray.intersectPlane(dragPlaneRef.current, intersection)) {
                    block.mesh.position.copy(intersection.add(dragOffsetRef.current));
                }
            }
        } else if (!draggedBlockId && !gameOver) {
            // Check for pinch-to-zoom (two fingers)
            const touches = (e.nativeEvent as any).touches;
            if (touches && touches.length === 2) {
                // Calculate pinch distance
                const dx = touches[0].pageX - touches[1].pageX;
                const dy = touches[0].pageY - touches[1].pageY;
                const pinchDist = Math.sqrt(dx * dx + dy * dy);

                if (lastPinchDistRef.current > 0) {
                    const delta = pinchDist - lastPinchDistRef.current;
                    // Zoom in/out based on pinch
                    zoomRef.current = Math.max(8, Math.min(30, zoomRef.current - delta * 0.05));
                    updateCamera();
                }
                lastPinchDistRef.current = pinchDist;
            } else {
                // Single finger: rotate camera
                const deltaX = touchX - lastTouchRef.current.x;
                const deltaY = touchY - lastTouchRef.current.y;

                cameraAngleRef.current.theta += deltaX * 0.008;
                // Vertical camera angle (clamped)
                cameraAngleRef.current.phi = Math.max(0.1, Math.min(0.8,
                    cameraAngleRef.current.phi + deltaY * 0.005
                ));
                updateCamera();
                lastPinchDistRef.current = 0; // Reset pinch
            }
        }

        lastTouchRef.current = { x: touchX, y: touchY };
    };

    const handleTouchEnd = () => {
        if (draggedBlockId) {
            const block = blocks.find(b => b.id === draggedBlockId);
            if (block?.mesh && towerGroupRef.current && sceneRef.current) {

                // In build mode, just place the block without collapse check
                if (gamePhase === 'build') {
                    // Clear highlighting
                    const mat = block.mesh.material as THREE.MeshStandardMaterial;
                    mat.emissive = new THREE.Color(0x000000);
                    mat.emissiveIntensity = 0;

                    // Update block state
                    setBlocks(prev => prev.map(b =>
                        b.id === draggedBlockId ? { ...b, isBeingDragged: false } : b
                    ));
                    setDraggedBlockId(null);
                    playSound('place');
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    return;
                }

                towerGroupRef.current.remove(block.mesh);

                // Update blocksRef for the collapse check
                blocksRef.current = blocks.map(b =>
                    b.id === draggedBlockId ? { ...b, isBeingDragged: true } : b
                );

                // Check if this removal will cause collapse
                if (checkCollapse()) {
                    setBlocks(prev => prev.map(b =>
                        b.id === draggedBlockId ? { ...b, isBeingDragged: false } : b
                    ));
                    setDraggedBlockId(null);
                    triggerCollapse();
                    return;
                }

                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

                // Find placement
                const activeBlocks = blocks.filter(b => !b.isBeingDragged && b.id !== draggedBlockId);
                const topLevel = Math.max(...activeBlocks.map(b => b.level), -1);
                const blocksOnTop = activeBlocks.filter(b => b.level === topLevel);

                let newLevel: number;
                let newPosition: number;

                if (blocksOnTop.length < 3) {
                    newLevel = topLevel;
                    const usedPositions = blocksOnTop.map(b => b.position);
                    newPosition = [0, 1, 2].find(p => !usedPositions.includes(p)) ?? 0;
                } else {
                    newLevel = topLevel + 1;
                    newPosition = 0;
                }

                const isHorizontal = newLevel % 2 === 0;
                const y = newLevel * BLOCK_HEIGHT + BLOCK_HEIGHT / 2;
                const offset = (newPosition - 1) * BLOCK_WIDTH;

                block.mesh.rotation.set(0, 0, 0);
                if (isHorizontal) {
                    block.mesh.position.set(0, y, offset);
                } else {
                    block.mesh.position.set(offset, y, 0);
                    block.mesh.rotation.y = Math.PI / 2;
                }

                const mat = block.mesh.material as THREE.MeshStandardMaterial;
                mat.emissive = new THREE.Color(0x000000);
                mat.emissiveIntensity = 0;

                towerGroupRef.current.add(block.mesh);
                setRemovedCount(prev => prev + 1);

                // Play placement sound and trigger wobble
                playSound('place');
                triggerWobble(0.8 + Math.random() * 0.5);

                // Update stability meter
                const newStability = calculateStability();
                setStability(newStability);

                setBlocks(prev => prev.map(b =>
                    b.id === draggedBlockId
                        ? { ...b, level: newLevel, position: newPosition, isHorizontal, isBeingDragged: false }
                        : b
                ));

                setDraggedBlockId(null);
                setCurrentPlayerIndex(prev => (prev + 1) % players.length);
            }
        }
    };

    // Build mode: Spawn a new block above the tower
    const spawnBlock = () => {
        if (!towerGroupRef.current || !sceneRef.current) return;

        const highestY = blocks.reduce((max, b) => {
            if (b.mesh) {
                return Math.max(max, b.mesh.position.y);
            }
            return max;
        }, 0);

        const newBlockId = `build-${Date.now()}`;
        const isHorizontal = Math.random() > 0.5;

        const geometry = new THREE.BoxGeometry(BLOCK_LENGTH, BLOCK_HEIGHT, BLOCK_WIDTH);
        const woodTexture = createWoodTexture();
        const material = new THREE.MeshStandardMaterial({
            map: woodTexture, color: 0xd4b896, roughness: 0.65,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { blockId: newBlockId };

        // Add edges
        const edges = new THREE.EdgesGeometry(geometry);
        mesh.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x3a2510 })));

        // Position above tower
        mesh.position.set(0, highestY + 2, 0);
        if (!isHorizontal) mesh.rotation.y = Math.PI / 2;

        towerGroupRef.current.add(mesh);

        const newBlock: Block = {
            id: newBlockId,
            level: -1, // Build mode block
            position: 0,
            isHorizontal,
            mesh,
            originalLevel: -1,
            isBeingDragged: true,
            falling: false,
            velocity: new THREE.Vector3(0, 0, 0),
        };

        setBlocks(prev => [...prev, newBlock]);
        setDraggedBlockId(newBlockId);

        // Highlight
        material.emissive = new THREE.Color(0xFFD700);
        material.emissiveIntensity = 0.35;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        playSound('pickup');
    };

    // Build mode: Clear tower and start with 3 base blocks
    const startBuildMode = () => {
        if (!towerGroupRef.current) return;

        // Remove all existing blocks from scene
        blocks.forEach(block => {
            if (block.mesh) {
                towerGroupRef.current?.remove(block.mesh);
            }
        });

        // Create 3 base blocks
        const woodTexture = createWoodTexture();
        const baseBlocks: Block[] = [];

        for (let pos = 0; pos < 3; pos++) {
            const geometry = new THREE.BoxGeometry(BLOCK_LENGTH, BLOCK_HEIGHT, BLOCK_WIDTH);
            const material = new THREE.MeshStandardMaterial({
                map: woodTexture, color: 0xd4b896, roughness: 0.65,
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.userData = { blockId: `base-${pos}` };

            const edges = new THREE.EdgesGeometry(geometry);
            mesh.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x3a2510 })));

            const offset = (pos - 1) * BLOCK_WIDTH;
            mesh.position.set(0, BLOCK_HEIGHT / 2, offset);

            towerGroupRef.current.add(mesh);
            baseBlocks.push({
                id: `base-${pos}`,
                level: 0,
                position: pos,
                isHorizontal: true,
                mesh,
                originalLevel: 0,
                isBeingDragged: false,
                falling: false,
                velocity: new THREE.Vector3(0, 0, 0),
            });
        }

        setBlocks(baseBlocks);
        blocksRef.current = baseBlocks;
        setGamePhase('build');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    // Build mode: Switch to play phase
    const handleFinishBuilding = () => {
        // Recalculate block levels based on their Y positions
        const updatedBlocks = blocks.map(block => {
            if (block.mesh) {
                const y = block.mesh.position.y;
                const calculatedLevel = Math.round((y - BLOCK_HEIGHT / 2) / BLOCK_HEIGHT);
                return { ...block, level: calculatedLevel, originalLevel: calculatedLevel };
            }
            return block;
        });

        setBlocks(updatedBlocks);
        blocksRef.current = updatedBlocks;
        setGamePhase('play');
        setGameStarted(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const handleStartGame = () => {
        setGameStarted(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    return (
        <View style={styles.container}>
            <View style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFE0B2" />
                    </TouchableOpacity>
                    {/* Stability Meter in Header */}
                    {gameStarted && !gameOver && (
                        <View style={styles.headerStability}>
                            <Text style={styles.stabilityLabel}>STABILITY</Text>
                            <View style={styles.stabilityBar}>
                                <View style={[
                                    styles.stabilityFill,
                                    {
                                        width: `${stability}%`,
                                        backgroundColor: stability > 60 ? '#27AE60' : stability > 30 ? '#F39C12' : '#E74C3C'
                                    }
                                ]} />
                            </View>
                        </View>
                    )}
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.canvasContainer}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}>
                    <GLView style={styles.canvas} onContextCreate={onContextCreate} />
                </View>

                {!gameStarted && !gameOver && gamePhase === 'play' && (
                    <View style={styles.startOverlay}>
                        <Text style={styles.titleLarge}>🏗️ STACK TOWER</Text>
                        <Text style={styles.subtitle}>Remove & stack blocks carefully!</Text>
                        <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                            <Text style={styles.startButtonText}>CLASSIC MODE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.startButton, { backgroundColor: '#27AE60', marginTop: 12 }]}
                            onPress={startBuildMode}
                        >
                            <Text style={styles.startButtonText}>🔨 BUILD MODE</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Build Mode UI */}
                {gamePhase === 'build' && !gameOver && (
                    <View style={styles.buildModeUI}>
                        <Text style={styles.buildTitle}>🔨 BUILD YOUR TOWER</Text>
                        <Text style={styles.buildSubtitle}>Blocks: {blocks.length}</Text>
                        <View style={styles.buildButtonRow}>
                            <TouchableOpacity style={styles.buildButton} onPress={spawnBlock}>
                                <Ionicons name="add-circle" size={24} color="#FFF" />
                                <Text style={styles.buildButtonText}>ADD BLOCK</Text>
                            </TouchableOpacity>
                            {blocks.length > 3 && (
                                <TouchableOpacity
                                    style={[styles.buildButton, { backgroundColor: '#27AE60' }]}
                                    onPress={handleFinishBuilding}
                                >
                                    <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                                    <Text style={styles.buildButtonText}>DONE</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <Text style={styles.buildHint}>Drag to position • Release to drop</Text>
                    </View>
                )}

                {gameStarted && !gameOver && (
                    <View style={styles.gameUI}>
                        {/* Status indicator moved to header */}

                        <View style={styles.playerInfo}>
                            <Text style={styles.playerName}>{currentPlayer?.name}'s Turn</Text>
                            <Text style={styles.blockCounter}>Blocks moved: {removedCount}</Text>
                            <Text style={styles.instructionText}>
                                {draggedBlockId ? 'Release to place on top' : 'Swipe to look • Tap to grab'}
                            </Text>
                        </View>
                    </View>
                )}

                {gameOver && (
                    <View style={styles.gameOverOverlay}>
                        <Text style={styles.gameOverText}>💥 CRASH!</Text>
                        <Text style={styles.loserText}>{currentPlayer?.name} knocked it down!</Text>
                        <Text style={styles.statsText}>{removedCount} blocks moved</Text>
                        <TouchableOpacity style={styles.restartButton} onPress={() => router.back()}>
                            <Text style={styles.restartButtonText}>BACK TO MENU</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a0f0a' },
    safeArea: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10, backgroundColor: 'rgba(61,37,24,0.95)' },
    headerStability: { alignItems: 'center' },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#FFE0B2' },
    canvasContainer: { flex: 1 },
    canvas: { flex: 1 },
    startOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(61,37,24,0.92)' },
    titleLarge: { fontSize: 48, fontWeight: 'bold', color: '#FFE0B2', marginBottom: 10 },
    subtitle: { fontSize: 18, color: '#D2B48C', marginBottom: 40 },
    startButton: { backgroundColor: '#8B4513', borderRadius: 30, paddingHorizontal: 50, paddingVertical: 18, borderWidth: 2, borderColor: '#D2B48C' },
    startButtonText: { fontSize: 22, fontWeight: 'bold', color: '#FFE0B2', fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }) },
    gameUI: { position: 'absolute', bottom: 25, left: 0, right: 0, alignItems: 'center' },
    playerInfo: { backgroundColor: 'rgba(61,37,24,0.9)', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(210,180,140,0.4)' },
    playerName: { fontSize: 18, fontWeight: 'bold', color: '#FFE0B2', textAlign: 'center' },
    instructionText: { fontSize: 13, color: '#D2B48C', marginTop: 4, textAlign: 'center' },
    gameOverOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(30,15,8,0.95)' },
    gameOverText: { fontSize: 42, fontWeight: 'bold', color: '#FF6B6B', marginBottom: 10 },
    loserText: { fontSize: 22, color: '#FFE0B2', marginBottom: 10 },
    statsText: { fontSize: 16, color: '#D2B48C', marginBottom: 30 },
    restartButton: { backgroundColor: '#8B4513', borderRadius: 25, paddingHorizontal: 35, paddingVertical: 14, borderWidth: 1, borderColor: '#D2B48C' },
    restartButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFE0B2' },
    // Stability meter styles
    stabilityContainer: { position: 'absolute', top: 50, right: 20, alignItems: 'center', backgroundColor: 'rgba(61,37,24,0.9)', padding: 12, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(210,180,140,0.4)' },
    stabilityLabel: { fontSize: 11, fontWeight: 'bold', color: '#D2B48C', marginBottom: 5 },
    stabilityBar: { width: 80, height: 10, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 5, overflow: 'hidden' },
    stabilityFill: { height: '100%', borderRadius: 5 },
    stabilityText: { fontSize: 11, fontWeight: 'bold', marginTop: 4 },
    blockCounter: { fontSize: 14, color: '#F39C12', fontWeight: 'bold', marginTop: 2 },
    // Build mode styles
    buildModeUI: { position: 'absolute', bottom: 25, left: 0, right: 0, alignItems: 'center' },
    buildTitle: { fontSize: 24, fontWeight: 'bold', color: '#27AE60', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
    buildSubtitle: { fontSize: 16, color: '#FFE0B2', marginTop: 5, marginBottom: 15 },
    buildButtonRow: { flexDirection: 'row', gap: 15 },
    buildButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#8B4513', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 25, borderWidth: 2, borderColor: '#D2B48C' },
    buildButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
    buildHint: { fontSize: 12, color: '#D2B48C', marginTop: 12 },
});
