import { Ionicons } from '@expo/vector-icons';
import { GLView } from 'expo-gl';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Renderer } from 'expo-three';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, GestureResponderEvent, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as THREE from 'three';

const { width, height } = Dimensions.get('window');

// Block dimensions (in 3D units) - realistic Jenga proportions
const BLOCK_WIDTH = 0.5;
const BLOCK_HEIGHT = 0.3;
const BLOCK_DEPTH = 1.5;
const BLOCKS_PER_LEVEL = 3;
const INITIAL_LEVELS = 18;

interface Block {
    id: string;
    level: number;
    position: number;
    isHorizontal: boolean;
    removed: boolean;
    mesh?: THREE.Mesh;
    falling?: boolean;
    velocity?: THREE.Vector3;
}

interface Player {
    id: string;
    name: string;
    color: string;
}

// Create procedural wood texture using DataTexture (React Native compatible)
function createWoodTexture(): THREE.Texture {
    const size = 512;
    const data = new Uint8Array(size * size * 4);

    // Generate wood-like pattern
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const i = (y * size + x) * 4;

            // Base wood color (tan/brown)
            const baseR = 193;
            const baseG = 154;
            const baseB = 107;

            // Add grain variation
            const grainNoise = Math.sin(y * 0.1 + Math.random() * 0.5) * 20;
            const knotNoise = Math.random() < 0.02 ? -40 : 0;

            // Apply variations
            data[i] = Math.max(0, Math.min(255, baseR + grainNoise + knotNoise));
            data[i + 1] = Math.max(0, Math.min(255, baseG + grainNoise * 0.8 + knotNoise));
            data[i + 2] = Math.max(0, Math.min(255, baseB + grainNoise * 0.6 + knotNoise));
            data[i + 3] = 255; // Alpha
        }
    }

    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    texture.needsUpdate = true;

    return texture;
}


export default function JengaTowerGame() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const players: Player[] = JSON.parse((params.players as string) || '[]');
    const towerMode = (params.towerMode as string) || 'classic';

    const [blocks, setBlocks] = useState<Block[]>([]);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<Renderer | null>(null);
    const towerGroupRef = useRef<THREE.Group | null>(null);
    const rotationRef = useRef({ x: 0, y: 0 });
    const lastTouchRef = useRef({ x: 0, y: 0 });
    const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
    const animationFrameRef = useRef<number>();

    const currentPlayer = players[currentPlayerIndex];

    const onContextCreate = async (gl: any) => {
        // Create renderer
        const renderer = new Renderer({ gl });
        renderer.setSize(width, height);
        renderer.setClearColor(0x1a1a2e);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        // Create scene
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);
        sceneRef.current = scene;

        // Create camera
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.set(0, 6, 10);
        camera.lookAt(0, 3, 0);
        cameraRef.current = camera;

        // Enhanced lighting for realism
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // Main directional light (sun-like)
        const directionalLight = new THREE.DirectionalLight(0xfff4e6, 1.2);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        scene.add(directionalLight);

        // Fill lights
        const fillLight1 = new THREE.PointLight(0xffffff, 0.5);
        fillLight1.position.set(-5, 5, 5);
        scene.add(fillLight1);

        const fillLight2 = new THREE.PointLight(0xffffff, 0.3);
        fillLight2.position.set(5, 3, -5);
        scene.add(fillLight2);

        // Rim light for depth
        const rimLight = new THREE.DirectionalLight(0x6495ED, 0.3);
        rimLight.position.set(-5, 5, -5);
        scene.add(rimLight);

        // Create ground with better material
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x2C3E50,
            roughness: 0.9,
            metalness: 0.1
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.5;
        ground.receiveShadow = true;
        scene.add(ground);

        // Create tower group
        const towerGroup = new THREE.Group();
        scene.add(towerGroup);
        towerGroupRef.current = towerGroup;

        // Create wood texture
        const woodTexture = createWoodTexture();

        // Create blocks with realistic wood material
        const levels = towerMode === 'classic' ? INITIAL_LEVELS : 3;
        const initialBlocks: Block[] = [];

        for (let level = 0; level < levels; level++) {
            const isHorizontal = level % 2 === 0;
            const y = level * BLOCK_HEIGHT;

            for (let pos = 0; pos < BLOCKS_PER_LEVEL; pos++) {
                const blockGeometry = new THREE.BoxGeometry(BLOCK_DEPTH, BLOCK_HEIGHT, BLOCK_WIDTH);

                // Realistic wood material
                const blockMaterial = new THREE.MeshStandardMaterial({
                    map: woodTexture,
                    color: 0xD2B48C,
                    roughness: 0.85,
                    metalness: 0.05,
                    bumpScale: 0.002,
                });

                const blockMesh = new THREE.Mesh(blockGeometry, blockMaterial);
                blockMesh.castShadow = true;
                blockMesh.receiveShadow = true;
                blockMesh.userData = { blockId: `${level}-${pos}` };

                if (isHorizontal) {
                    const x = (pos - 1) * BLOCK_WIDTH;
                    blockMesh.position.set(x, y, 0);
                } else {
                    const z = (pos - 1) * BLOCK_WIDTH;
                    blockMesh.position.set(0, y, z);
                    blockMesh.rotation.y = Math.PI / 2;
                }

                towerGroup.add(blockMesh);

                initialBlocks.push({
                    id: `${level}-${pos}`,
                    level,
                    position: pos,
                    isHorizontal,
                    removed: false,
                    mesh: blockMesh,
                    falling: false,
                    velocity: new THREE.Vector3(0, 0, 0),
                });
            }
        }

        setBlocks(initialBlocks);

        // Animation loop with physics
        const render = () => {
            animationFrameRef.current = requestAnimationFrame(render);

            // Apply rotation to tower
            if (towerGroup) {
                towerGroup.rotation.y = rotationRef.current.y;
                towerGroup.rotation.x = rotationRef.current.x * 0.3;
            }

            // Update falling blocks physics
            setBlocks(prevBlocks => {
                return prevBlocks.map(block => {
                    if (block.falling && block.mesh && block.velocity) {
                        // Apply gravity
                        block.velocity.y -= 0.01;

                        // Update position
                        block.mesh.position.add(block.velocity);

                        // Add rotation for realism
                        block.mesh.rotation.x += 0.05;
                        block.mesh.rotation.z += 0.03;

                        // Remove if fallen too far
                        if (block.mesh.position.y < -10) {
                            if (towerGroupRef.current) {
                                towerGroupRef.current.remove(block.mesh);
                            }
                            return { ...block, removed: true };
                        }
                    }
                    return block;
                });
            });

            renderer.render(scene, camera);
            gl.endFrameEXP();
        };
        render();
    };

    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const handleTouchStart = (e: GestureResponderEvent) => {
        lastTouchRef.current = {
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY,
        };
    };

    const handleTouchMove = (e: GestureResponderEvent) => {
        const deltaX = e.nativeEvent.pageX - lastTouchRef.current.x;
        const deltaY = e.nativeEvent.pageY - lastTouchRef.current.y;

        rotationRef.current.y += deltaX * 0.01;
        rotationRef.current.x += deltaY * 0.01;

        rotationRef.current.x = Math.max(-0.5, Math.min(0.5, rotationRef.current.x));

        lastTouchRef.current = {
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY,
        };
    };

    const handleBlockSelect = (blockId: string) => {
        if (!gameStarted || gameOver) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedBlockId(blockId);

        // Highlight selected block
        blocks.forEach(block => {
            if (block.mesh && !block.removed) {
                const material = block.mesh.material as THREE.MeshStandardMaterial;
                if (block.id === blockId) {
                    material.emissive = new THREE.Color(0xFFD700);
                    material.emissiveIntensity = 0.3;
                } else {
                    material.emissive = new THREE.Color(0x000000);
                    material.emissiveIntensity = 0;
                }
            }
        });
    };

    const handleRemoveBlock = () => {
        if (!selectedBlockId || !gameStarted || gameOver) return;

        const block = blocks.find(b => b.id === selectedBlockId);
        if (!block || !block.mesh || block.removed) return;

        // Check stability
        const blocksAbove = blocks.filter(b =>
            !b.removed && b.level > block.level
        );

        if (blocksAbove.length > 0 && block.level < Math.max(...blocks.map(b => b.level)) - 2) {
            const sameLevel = blocks.filter(b =>
                !b.removed && b.level === block.level && b.id !== block.id
            );

            if (sameLevel.length < 2) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                return;
            }
        }

        // Remove with physics
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        setBlocks(prev => prev.map(b => {
            if (b.id === selectedBlockId && b.mesh) {
                // Start falling animation
                const direction = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.1,
                    0.1,
                    (Math.random() - 0.5) * 0.1
                );
                return { ...b, falling: true, velocity: direction };
            }
            return b;
        }));

        setSelectedBlockId(null);
        setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    };

    const handleStartGame = () => {
        setGameStarted(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const handleRestart = () => {
        setGameOver(false);
        setGameStarted(false);
        setSelectedBlockId(null);
        setCurrentPlayerIndex(0);

        // Reset all blocks
        blocks.forEach(block => {
            if (block.mesh && towerGroupRef.current) {
                if (block.removed || block.falling) {
                    towerGroupRef.current.add(block.mesh);
                }

                // Reset position and rotation
                const level = block.level;
                const pos = block.position;
                const y = level * BLOCK_HEIGHT;

                if (block.isHorizontal) {
                    const x = (pos - 1) * BLOCK_WIDTH;
                    block.mesh.position.set(x, y, 0);
                    block.mesh.rotation.set(0, 0, 0);
                } else {
                    const z = (pos - 1) * BLOCK_WIDTH;
                    block.mesh.position.set(0, y, z);
                    block.mesh.rotation.set(0, Math.PI / 2, 0);
                }
            }
        });

        setBlocks(prev => prev.map(b => ({
            ...b,
            removed: false,
            falling: false,
            velocity: new THREE.Vector3(0, 0, 0)
        })));
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Stack Tower</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View
                    style={styles.canvasContainer}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                >
                    <GLView
                        style={styles.canvas}
                        onContextCreate={onContextCreate}
                    />
                </View>

                {!gameStarted && !gameOver && (
                    <View style={styles.startOverlay}>
                        <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                            <Text style={styles.startButtonText}>START GAME</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {gameStarted && !gameOver && (
                    <View style={styles.gameUI}>
                        <View style={styles.playerInfo}>
                            <Text style={styles.playerName}>
                                {currentPlayer?.name || 'Player'}'s Turn
                            </Text>
                        </View>

                        {selectedBlockId && (
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={handleRemoveBlock}
                            >
                                <Text style={styles.removeButtonText}>REMOVE BLOCK</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {gameOver && (
                    <View style={styles.gameOverOverlay}>
                        <Text style={styles.gameOverText}>Tower Collapsed!</Text>
                        <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
                            <Text style={styles.restartButtonText}>PLAY AGAIN</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    canvasContainer: {
        flex: 1,
    },
    canvas: {
        flex: 1,
    },
    startOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    startButton: {
        backgroundColor: '#263238',
        borderRadius: 30,
        paddingHorizontal: 60,
        paddingVertical: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
        borderBottomWidth: 4,
        borderBottomColor: '#1a1f23',
    },
    startButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFE0B2',
        fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
    },
    gameUI: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
        gap: 15,
    },
    playerInfo: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
    },
    playerName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFE0B2',
    },
    removeButton: {
        backgroundColor: '#FF6B6B',
        borderRadius: 25,
        paddingHorizontal: 40,
        paddingVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    removeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    gameOverOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
        gap: 30,
    },
    gameOverText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
    restartButton: {
        backgroundColor: '#263238',
        borderRadius: 30,
        paddingHorizontal: 50,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
        borderBottomWidth: 4,
        borderBottomColor: '#1a1f23',
    },
    restartButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFE0B2',
    },
});
