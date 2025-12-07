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
const INITIAL_LEVELS = 10;
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
    const cameraAngleRef = useRef({ theta: 0 });
    const lastTouchRef = useRef({ x: 0, y: 0 });
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
            const radius = 11;
            const { theta } = cameraAngleRef.current;
            cameraRef.current.position.x = radius * Math.sin(theta);
            cameraRef.current.position.y = 5;
            cameraRef.current.position.z = radius * Math.cos(theta);
            cameraRef.current.lookAt(0, 1.5, 0);
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
        camera.position.set(0, 5, 11);
        camera.lookAt(0, 1.5, 0);
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

        // === COFFEE SHOP ENVIRONMENT ===
        const tableTexture = createWoodTexture(true);

        // Large wooden table
        const tableTop = new THREE.Mesh(
            new THREE.BoxGeometry(12, 0.4, 8),
            new THREE.MeshStandardMaterial({ map: tableTexture, color: 0x6a4530, roughness: 0.6 })
        );
        tableTop.position.set(0, -0.7, 0);
        tableTop.receiveShadow = true;
        tableTop.castShadow = true;
        scene.add(tableTop);

        // Table legs
        const legGeo = new THREE.BoxGeometry(0.4, 3.5, 0.4);
        const legMat = new THREE.MeshStandardMaterial({ map: tableTexture, color: 0x4a2d18 });
        [[-5.5, -2.6, 3.5], [5.5, -2.6, 3.5], [-5.5, -2.6, -3.5], [5.5, -2.6, -3.5]].forEach(pos => {
            const leg = new THREE.Mesh(legGeo, legMat);
            leg.position.set(pos[0], pos[1], pos[2]);
            leg.castShadow = true;
            scene.add(leg);
        });

        // Coffee cup
        const cupBody = new THREE.Mesh(
            new THREE.CylinderGeometry(0.28, 0.22, 0.55, 16),
            new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
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

        // Floor - wooden planks look
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(40, 40),
            new THREE.MeshStandardMaterial({ map: createWoodTexture(true), color: 0x5a3d25, roughness: 0.8 })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -4.35;
        floor.receiveShadow = true;
        scene.add(floor);

        // Back wall with windows
        const wallMat = new THREE.MeshStandardMaterial({ color: 0xe8dcc8, roughness: 0.9 });
        const wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 18), wallMat);
        wall.position.set(0, 4, -12);
        scene.add(wall);

        // Window frames (two large windows)
        const windowFrame = (x: number) => {
            // Window glass (sky reflection)
            const glass = new THREE.Mesh(
                new THREE.PlaneGeometry(5, 6),
                new THREE.MeshStandardMaterial({ color: 0xa8d8ea, roughness: 0.1, metalness: 0.3 })
            );
            glass.position.set(x, 5, -11.9);
            scene.add(glass);

            // Frame
            const frameMat = new THREE.MeshStandardMaterial({ color: 0x4a3520 });
            // Top
            const fTop = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.2, 0.15), frameMat);
            fTop.position.set(x, 8.1, -11.85);
            scene.add(fTop);
            // Bottom
            const fBot = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.2, 0.15), frameMat);
            fBot.position.set(x, 2, -11.85);
            scene.add(fBot);
            // Left
            const fLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 6.3, 0.15), frameMat);
            fLeft.position.set(x - 2.6, 5.05, -11.85);
            scene.add(fLeft);
            // Right
            const fRight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 6.3, 0.15), frameMat);
            fRight.position.set(x + 2.6, 5.05, -11.85);
            scene.add(fRight);
            // Cross
            const fMid = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.15, 0.12), frameMat);
            fMid.position.set(x, 5, -11.85);
            scene.add(fMid);
            const fMidV = new THREE.Mesh(new THREE.BoxGeometry(0.15, 6.3, 0.12), frameMat);
            fMidV.position.set(x, 5.05, -11.85);
            scene.add(fMidV);
        };
        windowFrame(-5);
        windowFrame(5);

        // Potted plant on table
        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.25, 0.4, 8),
            new THREE.MeshStandardMaterial({ color: 0x8b4513 })
        );
        pot.position.set(-4.5, -0.3, -2.5);
        scene.add(pot);

        const plant = new THREE.Mesh(
            new THREE.SphereGeometry(0.4, 8, 6),
            new THREE.MeshStandardMaterial({ color: 0x228b22 })
        );
        plant.position.set(-4.5, 0.2, -2.5);
        scene.add(plant);

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

    // Simple and aggressive collapse check
    const checkCollapse = (): boolean => {
        // Count how many blocks have been removed from bottom levels
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
                if (level < 5) { // Bottom half
                    bottomRemoved += removed;
                }
            }

            // If a level in bottom half has 0 blocks = instant collapse
            if (level < 5 && onLevelNow === 0) {
                console.log(`Collapse: Level ${level} is empty!`);
                return true;
            }
        }

        console.log(`Bottom removed: ${bottomRemoved}, Total: ${totalRemoved}`);

        // More than 3 blocks from bottom = very likely collapse
        if (bottomRemoved >= 3) {
            // Random chance increases with more blocks removed
            const collapseChance = (bottomRemoved - 2) * 0.35;
            if (Math.random() < collapseChance) {
                console.log(`Collapse: ${bottomRemoved} blocks from bottom, chance ${collapseChance}`);
                return true;
            }
        }

        // 5+ blocks removed from anywhere = collapse
        if (totalRemoved >= 5) {
            console.log(`Collapse: ${totalRemoved} total blocks removed`);
            return true;
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
            const deltaX = touchX - lastTouchRef.current.x;
            cameraAngleRef.current.theta += deltaX * 0.008;
            updateCamera();
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
