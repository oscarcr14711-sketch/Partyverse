import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import * as THREE from 'three';

interface Bomb3DProps {
    timeLeft: number;
    totalTime: number;
    shakeIntensity?: number;
    size?: number;
}

interface Spark {
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    life: number;
    maxLife: number;
}

export default function Bomb3D({ timeLeft, totalTime, shakeIntensity = 0, size = 300 }: Bomb3DProps) {
    const glRef = useRef<ExpoWebGLRenderingContext | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<Renderer | null>(null);
    const bombGroupRef = useRef<THREE.Group | null>(null);
    const bombBodyRef = useRef<THREE.Mesh | null>(null);
    const bombGlowRef = useRef<THREE.Mesh | null>(null);
    const fuseRef = useRef<THREE.Mesh | null>(null);
    const emberRef = useRef<THREE.Mesh | null>(null);
    const emberLightRef = useRef<THREE.PointLight | null>(null);
    const sparksRef = useRef<Spark[]>([]);
    const sparkGroupRef = useRef<THREE.Group | null>(null);
    const animationFrameRef = useRef<number>(0);
    const timeRef = useRef(0);
    const timeLeftRef = useRef(timeLeft);
    const totalTimeRef = useRef(totalTime);

    // Keep refs in sync
    useEffect(() => {
        timeLeftRef.current = timeLeft;
        totalTimeRef.current = totalTime;
    }, [timeLeft, totalTime]);

    const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
        glRef.current = gl;

        const scene = new THREE.Scene();
        scene.background = null;
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 0.5, 5);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        renderer.setClearColor(0x000000, 0);
        rendererRef.current = renderer;

        // Enhanced lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
        keyLight.position.set(5, 5, 5);
        scene.add(keyLight);

        const rimLight = new THREE.DirectionalLight(0xff4400, 0.4);
        rimLight.position.set(-3, 2, -3);
        scene.add(rimLight);

        // Bomb group
        const bombGroup = new THREE.Group();
        bombGroupRef.current = bombGroup;

        // === BOMB BODY with enhanced materials ===
        const bombBodyGeometry = new THREE.SphereGeometry(1, 64, 64);
        const bombBodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.25,
            metalness: 0.8,
            emissive: 0x000000,
            emissiveIntensity: 0,
        });
        const bombBody = new THREE.Mesh(bombBodyGeometry, bombBodyMaterial);
        bombBodyRef.current = bombBody;
        bombGroup.add(bombBody);

        // === BOMB GLOW LAYER (outer shell for danger glow) ===
        const bombGlowGeometry = new THREE.SphereGeometry(1.08, 32, 32);
        const bombGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0xff2200,
            transparent: true,
            opacity: 0,
            side: THREE.BackSide,
        });
        const bombGlow = new THREE.Mesh(bombGlowGeometry, bombGlowMaterial);
        bombGlowRef.current = bombGlow;
        bombGroup.add(bombGlow);

        // Decorative rivets around bomb
        const rivetGeometry = new THREE.SphereGeometry(0.06, 8, 8);
        const rivetMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            roughness: 0.3,
            metalness: 0.9,
        });
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const rivet = new THREE.Mesh(rivetGeometry, rivetMaterial);
            rivet.position.set(Math.cos(angle) * 0.95, 0, Math.sin(angle) * 0.95);
            bombGroup.add(rivet);
        }

        // Decorative band
        const bandGeometry = new THREE.TorusGeometry(1.02, 0.05, 8, 48);
        const bandMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            roughness: 0.2,
            metalness: 0.95,
        });
        const band = new THREE.Mesh(bandGeometry, bandMaterial);
        band.rotation.x = Math.PI / 2;
        bombGroup.add(band);

        // === FUSE HOLE ===
        const fuseHoleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16);
        const fuseHoleMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            roughness: 0.9,
        });
        const fuseHole = new THREE.Mesh(fuseHoleGeometry, fuseHoleMaterial);
        fuseHole.position.set(0, 1.0, 0);
        bombGroup.add(fuseHole);

        // Metal collar
        const collarGeometry = new THREE.TorusGeometry(0.22, 0.05, 8, 24);
        const collarMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555,
            roughness: 0.2,
            metalness: 0.9,
        });
        const collar = new THREE.Mesh(collarGeometry, collarMaterial);
        collar.position.set(0, 1.08, 0);
        collar.rotation.x = Math.PI / 2;
        bombGroup.add(collar);

        // === BRAIDED FUSE ===
        const fuseGeometry = new THREE.CylinderGeometry(0.07, 0.07, 1.4, 16);
        const fuseMaterial = new THREE.MeshStandardMaterial({
            color: 0x6b4423,
            roughness: 0.95,
        });
        const fuse = new THREE.Mesh(fuseGeometry, fuseMaterial);
        fuse.position.set(0, 1.75, 0);
        fuse.rotation.z = 0.2;
        fuse.rotation.x = 0.15;
        fuseRef.current = fuse;
        bombGroup.add(fuse);

        // === EMBER at fuse tip ===
        const emberGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const emberMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6600,
            emissive: 0xff4400,
            emissiveIntensity: 3,
        });
        const ember = new THREE.Mesh(emberGeometry, emberMaterial);
        ember.position.set(0.15, 2.4, 0.12);
        emberRef.current = ember;
        bombGroup.add(ember);

        // Core glow inside ember (brighter center)
        const emberCoreGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const emberCoreMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffaa,
        });
        const emberCore = new THREE.Mesh(emberCoreGeometry, emberCoreMaterial);
        emberCore.position.copy(ember.position);
        bombGroup.add(emberCore);

        // Ember light
        const emberLight = new THREE.PointLight(0xff4400, 3, 4);
        emberLight.position.copy(ember.position);
        emberLightRef.current = emberLight;
        bombGroup.add(emberLight);

        // === SPARK PARTICLES GROUP ===
        const sparkGroup = new THREE.Group();
        sparkGroupRef.current = sparkGroup;
        bombGroup.add(sparkGroup);

        bombGroup.position.y = -0.3;
        scene.add(bombGroup);

        // Create spark function
        const createSpark = () => {
            if (!sparkGroupRef.current || !emberRef.current) return;

            const sparkGeometry = new THREE.SphereGeometry(0.025 + Math.random() * 0.02, 6, 6);
            const sparkMaterial = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? 0xffaa00 : 0xffff00,
            });
            const spark = new THREE.Mesh(sparkGeometry, sparkMaterial);

            // Start at ember position
            spark.position.copy(emberRef.current.position);
            spark.position.x += (Math.random() - 0.5) * 0.1;
            spark.position.z += (Math.random() - 0.5) * 0.1;

            sparkGroupRef.current.add(spark);

            sparksRef.current.push({
                mesh: spark,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.08,
                    0.04 + Math.random() * 0.06,
                    (Math.random() - 0.5) * 0.08
                ),
                life: 1,
                maxLife: 0.8 + Math.random() * 0.5,
            });
        };

        // Animation loop
        const animate = () => {
            animationFrameRef.current = requestAnimationFrame(animate);
            const dt = 0.016;
            timeRef.current += dt;

            const burnRatio = timeLeftRef.current / totalTimeRef.current;
            const danger = 1 - burnRatio; // 0 = safe, 1 = danger

            // Bomb rotation - faster when danger
            if (bombGroupRef.current) {
                bombGroupRef.current.rotation.y += 0.006 + danger * 0.01;
            }

            // === BOMB EXPANSION when about to explode ===
            if (bombBodyRef.current) {
                const pulseSpeed = 5 + danger * 15;
                const pulseAmount = danger * 0.08;
                const scale = 1 + Math.sin(timeRef.current * pulseSpeed) * pulseAmount;
                bombBodyRef.current.scale.setScalar(scale);

                // Bomb body glows red when danger
                const mat = bombBodyRef.current.material as THREE.MeshStandardMaterial;
                mat.emissive.setHSL(0.02, 1, danger * 0.3);
                mat.emissiveIntensity = danger * 2;
            }

            // === OUTER GLOW intensity ===
            if (bombGlowRef.current) {
                const glowMat = bombGlowRef.current.material as THREE.MeshBasicMaterial;
                const glowPulse = 0.5 + Math.sin(timeRef.current * 8) * 0.3;
                glowMat.opacity = danger * 0.4 * glowPulse;
                bombGlowRef.current.scale.setScalar(1.08 + danger * 0.1);
            }

            // Update fuse length
            if (fuseRef.current) {
                const minScale = 0.05;
                const fuseScale = minScale + (1 - minScale) * burnRatio;
                fuseRef.current.scale.y = fuseScale;
                fuseRef.current.position.y = 1.05 + (0.7 * fuseScale);
            }

            // Update ember position and intensity
            if (emberRef.current && emberLightRef.current && fuseRef.current) {
                const fuseScale = fuseRef.current.scale.y;
                const emberY = 1.05 + (1.35 * fuseScale) + 0.1;
                emberRef.current.position.y = emberY;
                emberLightRef.current.position.y = emberY;

                // Flicker effect
                const flicker = 1 + Math.sin(timeRef.current * 25) * 0.4 + Math.random() * 0.3;
                const baseIntensity = 3 + danger * 5;
                emberLightRef.current.intensity = baseIntensity * flicker;

                // Color shifts to red
                const hue = 0.1 - danger * 0.08;
                const emberColor = new THREE.Color().setHSL(hue, 1, 0.5);
                (emberRef.current.material as THREE.MeshStandardMaterial).emissive = emberColor;
                emberLightRef.current.color = emberColor;

                // Ember scale pulses
                const emberScale = 1 + Math.sin(timeRef.current * 15) * 0.2 + danger * 0.3;
                emberRef.current.scale.setScalar(emberScale);
            }

            // === SPARK PARTICLES ===
            // Spawn new sparks more frequently when danger
            if (Math.random() < 0.15 + danger * 0.35) {
                createSpark();
            }

            // Update existing sparks
            sparksRef.current = sparksRef.current.filter(spark => {
                spark.life -= dt / spark.maxLife;

                if (spark.life <= 0) {
                    sparkGroupRef.current?.remove(spark.mesh);
                    spark.mesh.geometry.dispose();
                    (spark.mesh.material as THREE.Material).dispose();
                    return false;
                }

                // Physics - arc upward then fall
                spark.velocity.y -= 0.003; // Gravity
                spark.mesh.position.add(spark.velocity);

                // Fade out
                (spark.mesh.material as THREE.MeshBasicMaterial).opacity = spark.life;

                // Scale down
                spark.mesh.scale.setScalar(spark.life);

                return true;
            });

            renderer.render(scene, camera);
            gl.endFrameEXP();
        };
        animate();
    };

    // Shake effect
    useEffect(() => {
        if (bombGroupRef.current && shakeIntensity > 0) {
            const shakeX = (Math.random() - 0.5) * shakeIntensity * 0.15;
            const shakeZ = (Math.random() - 0.5) * shakeIntensity * 0.15;
            bombGroupRef.current.position.x = shakeX;
            bombGroupRef.current.position.z = shakeZ;
        } else if (bombGroupRef.current) {
            bombGroupRef.current.position.x = 0;
            bombGroupRef.current.position.z = 0;
        }
    }, [shakeIntensity, timeLeft]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            // Clean up sparks
            sparksRef.current.forEach(spark => {
                spark.mesh.geometry.dispose();
                (spark.mesh.material as THREE.Material).dispose();
            });
            sparksRef.current = [];
        };
    }, []);

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <GLView
                style={styles.glView}
                onContextCreate={onContextCreate}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    glView: {
        flex: 1,
    },
});
