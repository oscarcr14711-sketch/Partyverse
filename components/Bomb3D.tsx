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

        // === BOMB BODY - rounder and more realistic ===
        const bombBodyGeometry = new THREE.SphereGeometry(1.1, 64, 64);
        const bombBodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x0d0d0d,
            roughness: 0.15,
            metalness: 0.7,
            emissive: 0x000000,
            emissiveIntensity: 0,
        });
        const bombBody = new THREE.Mesh(bombBodyGeometry, bombBodyMaterial);
        bombBodyRef.current = bombBody;
        bombGroup.add(bombBody);

        // === HIGHLIGHT SPHERE for 3D depth (shiny reflection) ===
        const highlightGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const highlightMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.35,
        });
        const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
        highlight.position.set(-0.55, 0.55, 0.7);
        bombGroup.add(highlight);

        // Second smaller highlight
        const highlight2Geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const highlight2 = new THREE.Mesh(highlight2Geometry, highlightMaterial);
        highlight2.position.set(-0.35, 0.35, 0.85);
        bombGroup.add(highlight2);

        // === BOMB GLOW LAYER (outer shell for danger glow) ===
        const bombGlowGeometry = new THREE.SphereGeometry(1.18, 32, 32);
        const bombGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0xff2200,
            transparent: true,
            opacity: 0,
            side: THREE.BackSide,
        });
        const bombGlow = new THREE.Mesh(bombGlowGeometry, bombGlowMaterial);
        bombGlowRef.current = bombGlow;
        bombGroup.add(bombGlow);

        // === METAL NOZZLE on top ===
        const nozzleBaseGeometry = new THREE.CylinderGeometry(0.32, 0.38, 0.25, 24);
        const nozzleMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a4a4a,
            roughness: 0.2,
            metalness: 0.95,
        });
        const nozzleBase = new THREE.Mesh(nozzleBaseGeometry, nozzleMaterial);
        nozzleBase.position.set(0, 1.05, 0);
        bombGroup.add(nozzleBase);

        // Nozzle top ring
        const nozzleTopGeometry = new THREE.CylinderGeometry(0.28, 0.32, 0.12, 24);
        const nozzleTop = new THREE.Mesh(nozzleTopGeometry, nozzleMaterial);
        nozzleTop.position.set(0, 1.2, 0);
        bombGroup.add(nozzleTop);

        // Metal collar ring
        const collarGeometry = new THREE.TorusGeometry(0.35, 0.06, 12, 32);
        const collarMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555,
            roughness: 0.15,
            metalness: 0.95,
        });
        const collar = new THREE.Mesh(collarGeometry, collarMaterial);
        collar.position.set(0, 1.0, 0);
        collar.rotation.x = Math.PI / 2;
        bombGroup.add(collar);

        // === FUSE HOLE ===
        const fuseHoleGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16);
        const fuseHoleMaterial = new THREE.MeshStandardMaterial({
            color: 0x050505,
            roughness: 0.9,
        });
        const fuseHole = new THREE.Mesh(fuseHoleGeometry, fuseHoleMaterial);
        fuseHole.position.set(0, 1.18, 0);
        bombGroup.add(fuseHole);

        // === THICKER BRAIDED FUSE with curve ===
        const fuseGeometry = new THREE.CylinderGeometry(0.09, 0.09, 1.4, 16);
        const fuseMaterial = new THREE.MeshStandardMaterial({
            color: 0x5c4033,
            roughness: 0.95,
        });
        const fuse = new THREE.Mesh(fuseGeometry, fuseMaterial);
        fuse.position.set(0.08, 1.9, 0);
        fuse.rotation.z = 0.15;
        fuse.rotation.x = 0.1;
        fuseRef.current = fuse;
        bombGroup.add(fuse);

        // Fuse braid rings for texture
        const braidMaterial = new THREE.MeshStandardMaterial({
            color: 0x3d2817,
            roughness: 0.9,
        });
        for (let i = 0; i < 7; i++) {
            const braidRingGeometry = new THREE.TorusGeometry(0.1, 0.02, 6, 12);
            const braidRing = new THREE.Mesh(braidRingGeometry, braidMaterial);
            braidRing.position.set(0.08 + i * 0.012, 1.35 + i * 0.16, i * 0.01);
            braidRing.rotation.x = Math.PI / 2;
            braidRing.rotation.z = 0.15;
            bombGroup.add(braidRing);
        }

        // === EMBER at fuse tip ===
        const emberGeometry = new THREE.SphereGeometry(0.18, 16, 16);
        const emberMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6600,
            emissive: 0xff4400,
            emissiveIntensity: 3,
        });
        const ember = new THREE.Mesh(emberGeometry, emberMaterial);
        ember.position.set(0.2, 2.5, 0.12);
        emberRef.current = ember;
        bombGroup.add(ember);

        // Core glow inside ember (brighter center)
        const emberCoreGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const emberCoreMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffcc,
        });
        const emberCore = new THREE.Mesh(emberCoreGeometry, emberCoreMaterial);
        emberCore.position.copy(ember.position);
        bombGroup.add(emberCore);

        // Ember light
        const emberLight = new THREE.PointLight(0xff4400, 4, 5);
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
