import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { GLView } from 'expo-gl';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Renderer } from 'expo-three';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, GestureResponderEvent, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

function createWoodTexture(dark = false): THREE.Texture {
    const size = 512; // Higher resolution for better detail
    const data = new Uint8Array(size * size * 4);

    // Base wood colors
    const baseR = dark ? 90 : 215;
    const baseG = dark ? 55 : 175;
    const baseB = dark ? 35 : 130;

    // Create wood grain with rings and natural variation
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const i = (y * size + x) * 4;

            // Wood grain pattern - horizontal lines with wave
            const grainWave = Math.sin(y * 0.03) * 8;
            const grain1 = Math.sin((x + grainWave) * 0.08) * 20;
            const grain2 = Math.sin((x + grainWave) * 0.15 + y * 0.02) * 10;

            // Annual rings effect
            const ringPattern = Math.sin(Math.sqrt((x - size / 2) ** 2 + (y * 3) ** 2) * 0.03) * 8;

            // Random noise for natural look
            const noise = (Math.random() - 0.5) * 15;

            // Occasional darker streaks (knots)
            const knotNoise = Math.sin(x * 0.5 + y * 0.3) * Math.sin(y * 0.2);
            const knot = knotNoise > 0.95 ? -25 : 0;

            // Combine all effects
            const variation = grain1 + grain2 + ringPattern + noise + knot;

            data[i] = Math.max(0, Math.min(255, baseR + variation));
            data[i + 1] = Math.max(0, Math.min(255, baseG + variation * 0.85));
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

export default function JengaTowerGame() {
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

        // Lighting - warm cafe feel
        scene.add(new THREE.AmbientLight(0xfff8f0, 0.55));

        const sunLight = new THREE.DirectionalLight(0xfffaf0, 0.9);
        sunLight.position.set(8, 15, 10);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 1;
        sunLight.shadow.camera.far = 50;
        sunLight.shadow.camera.left = -15;
        sunLight.shadow.camera.right = 15;
        sunLight.shadow.camera.top = 15;
        sunLight.shadow.camera.bottom = -15;
        scene.add(sunLight);

        const warmLight = new THREE.PointLight(0xff9955, 0.4, 20);
        warmLight.position.set(-4, 5, 4);
        scene.add(warmLight);

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

        // === COFFEE SHOP ENVIRONMENT (Enhanced) ===
        const tableTexture = createWoodTexture(true);

        // Large wooden table (polished)
        const tableTop = new THREE.Mesh(
            new THREE.BoxGeometry(12, 0.4, 8),
            new THREE.MeshStandardMaterial({ map: tableTexture, color: 0x8b5a2b, roughness: 0.4, metalness: 0.1 })
        );
        tableTop.position.set(0, -0.7, 0);
        tableTop.receiveShadow = true;
        tableTop.castShadow = true;
        scene.add(tableTop);

        // Table legs (elegant carved)
        const legGeo = new THREE.BoxGeometry(0.35, 3.5, 0.35);
        const legMat = new THREE.MeshStandardMaterial({ map: tableTexture, color: 0x4a2d18, roughness: 0.5 });
        [[-5.5, -2.6, 3.5], [5.5, -2.6, 3.5], [-5.5, -2.6, -3.5], [5.5, -2.6, -3.5]].forEach(pos => {
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

        // Window frames (two large arched windows)
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
        windowFrame(-5);
        windowFrame(5);

        // Elegant potted palm plant
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

        // === JENGA TOWER ===
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
                mesh.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x3a2510 })));

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
        try {
            // Use existing sounds as placeholders
            const soundFile = type === 'crash'
                ? require('../assets/sounds/wasted.mp3')
                : require('../assets/sounds/wasted.mp3');

            const { sound } = await Audio.Sound.createAsync(soundFile, {
                shouldPlay: true,
                volume: type === 'crash' ? 0.8 : 0.3
            });
            soundRef.current = sound;

            // Light haptics for feedback
            if (type === 'pickup') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } else if (type === 'place') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }

            // Cleanup sound after playing
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

    // More realistic collapse check - real Jenga can have many blocks removed
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

        // Rule 1: Bottom 3 levels must have at least 1 block each
        for (let level = 0; level < 3; level++) {
            if (levelCounts[level] === 0) {
                console.log(`Collapse: Bottom level ${level} is completely empty!`);
                return true;
            }
        }

        // Rule 2: Can't have 3 consecutive empty levels anywhere
        let consecutiveEmpty = 0;
        for (let level = 0; level < INITIAL_LEVELS; level++) {
            if (levelCounts[level] === 0) {
                consecutiveEmpty++;
                if (consecutiveEmpty >= 3) {
                    console.log(`Collapse: 3 consecutive empty levels!`);
                    return true;
                }
            } else {
                consecutiveEmpty = 0;
            }
        }

        // Rule 3: Tower becomes VERY unstable only when >50% of blocks removed
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
                pathname: '/jenga-game-over',
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
            const mouse = new THREE.Vector2(
                (touchX / width) * 2 - 1,
                -(touchY / height) * 2 + 1
            );
            raycaster.setFromCamera(mouse, cameraRef.current);

            const meshes = blocks.filter(b => b.mesh && !b.isBeingDragged && !b.falling).map(b => b.mesh!);
            const intersects = raycaster.intersectObjects(meshes, false);

            if (intersects.length > 0) {
                const hit = intersects[0];
                const blockId = (hit.object as THREE.Mesh).userData.blockId;
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
                        dragPlaneRef.current.setFromNormalAndCoplanarPoint(camDir, hit.point);
                        dragOffsetRef.current.copy(block.mesh.position).sub(hit.point);
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
        } else if (!draggedBlockId && gameStarted && !gameOver) {
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

                sceneRef.current.remove(block.mesh);

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

    const handleStartGame = () => {
        setGameStarted(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFE0B2" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Jenga</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.canvasContainer}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}>
                    <GLView style={styles.canvas} onContextCreate={onContextCreate} />
                </View>

                {!gameStarted && !gameOver && (
                    <View style={styles.startOverlay}>
                        <Text style={styles.titleLarge}>🏗️ JENGA</Text>
                        <Text style={styles.subtitle}>Remove & stack blocks carefully!</Text>
                        <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                            <Text style={styles.startButtonText}>START GAME</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {gameStarted && !gameOver && (
                    <View style={styles.gameUI}>
                        {/* Stability Meter */}
                        <View style={styles.stabilityContainer}>
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
                            <Text style={[
                                styles.stabilityText,
                                { color: stability > 60 ? '#27AE60' : stability > 30 ? '#F39C12' : '#E74C3C' }
                            ]}>
                                {stability > 60 ? '✓ STABLE' : stability > 30 ? '⚠️ SHAKY' : '💀 DANGER'}
                            </Text>
                        </View>

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
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#87CEEB' },
    safeArea: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10, backgroundColor: 'rgba(61,37,24,0.8)' },
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
    stabilityContainer: { position: 'absolute', top: 80, right: 20, alignItems: 'center', backgroundColor: 'rgba(61,37,24,0.9)', padding: 12, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(210,180,140,0.4)' },
    stabilityLabel: { fontSize: 11, fontWeight: 'bold', color: '#D2B48C', marginBottom: 5 },
    stabilityBar: { width: 80, height: 10, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 5, overflow: 'hidden' },
    stabilityFill: { height: '100%', borderRadius: 5 },
    stabilityText: { fontSize: 11, fontWeight: 'bold', marginTop: 4 },
    blockCounter: { fontSize: 14, color: '#F39C12', fontWeight: 'bold', marginTop: 2 },
});
