import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const BLOCK_WIDTH = width * 0.7;
const BLOCK_HEIGHT = 40;
const INITIAL_SPEED = 2;
const SPEED_INCREMENT = 0.3;

interface Block {
    x: number;
    width: number;
    color: string;
}

const COLORS = ['#f94144', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590', '#f3722c', '#f9844a'];

export default function StackTowerGame() {
    const router = useRouter();
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [blocks, setBlocks] = useState<Block[]>([{ x: width / 2 - BLOCK_WIDTH / 2, width: BLOCK_WIDTH, color: COLORS[0] }]);
    const [currentBlock, setCurrentBlock] = useState<Block>({ x: 0, width: BLOCK_WIDTH, color: COLORS[1] });
    const [direction, setDirection] = useState(1);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const animationRef = useRef<number>();
    const blockX = useRef(0);

    useEffect(() => {
        if (gameStarted && !gameOver) {
            const animate = () => {
                blockX.current += speed * direction;

                if (blockX.current <= 0 || blockX.current + currentBlock.width >= width) {
                    setDirection(d => -d);
                }

                setCurrentBlock(prev => ({ ...prev, x: blockX.current }));
                animationRef.current = requestAnimationFrame(animate);
            };

            animationRef.current = requestAnimationFrame(animate);

            return () => {
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }
            };
        }
    }, [gameStarted, gameOver, direction, speed, currentBlock.width]);

    const handleTap = () => {
        if (!gameStarted) {
            setGameStarted(true);
            return;
        }

        if (gameOver) {
            resetGame();
            return;
        }

        const lastBlock = blocks[blocks.length - 1];
        const overlap = calculateOverlap(currentBlock, lastBlock);

        if (overlap <= 0) {
            // Game over - no overlap
            setGameOver(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            if (score > highScore) {
                setHighScore(score);
            }
            return;
        }

        // Calculate new block position and width
        const newX = Math.max(currentBlock.x, lastBlock.x);
        const newWidth = overlap;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const newBlock: Block = {
            x: newX,
            width: newWidth,
            color: COLORS[(blocks.length) % COLORS.length]
        };

        setBlocks([...blocks, newBlock]);
        setScore(score + 1);
        setSpeed(s => s + SPEED_INCREMENT);

        // Reset current block
        blockX.current = 0;
        setCurrentBlock({
            x: 0,
            width: newWidth,
            color: COLORS[(blocks.length + 1) % COLORS.length]
        });
    };

    const calculateOverlap = (moving: Block, stationary: Block): number => {
        const movingRight = moving.x + moving.width;
        const stationaryRight = stationary.x + stationary.width;

        const overlapStart = Math.max(moving.x, stationary.x);
        const overlapEnd = Math.min(movingRight, stationaryRight);

        return Math.max(0, overlapEnd - overlapStart);
    };

    const resetGame = () => {
        setGameStarted(false);
        setGameOver(false);
        setScore(0);
        setBlocks([{ x: width / 2 - BLOCK_WIDTH / 2, width: BLOCK_WIDTH, color: COLORS[0] }]);
        setCurrentBlock({ x: 0, width: BLOCK_WIDTH, color: COLORS[1] });
        setDirection(1);
        setSpeed(INITIAL_SPEED);
        blockX.current = 0;
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1a1a2e', '#16213e', '#0f3460']}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.safeArea}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Text style={styles.backText}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Stack Tower</Text>
                        <View style={styles.scoreContainer}>
                            <Text style={styles.scoreText}>{score}</Text>
                        </View>
                    </View>

                    {/* Game Area */}
                    <TouchableOpacity
                        style={styles.gameArea}
                        onPress={handleTap}
                        activeOpacity={1}
                    >
                        {/* Blocks */}
                        <View style={styles.blocksContainer}>
                            {blocks.map((block, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.block,
                                        {
                                            left: block.x,
                                            width: block.width,
                                            bottom: index * BLOCK_HEIGHT,
                                            backgroundColor: block.color,
                                        }
                                    ]}
                                />
                            ))}

                            {/* Current moving block */}
                            {gameStarted && !gameOver && (
                                <View
                                    style={[
                                        styles.block,
                                        styles.currentBlock,
                                        {
                                            left: currentBlock.x,
                                            width: currentBlock.width,
                                            bottom: blocks.length * BLOCK_HEIGHT,
                                            backgroundColor: currentBlock.color,
                                        }
                                    ]}
                                />
                            )}
                        </View>

                        {/* Instructions/Game Over */}
                        {!gameStarted && !gameOver && (
                            <View style={styles.overlay}>
                                <Text style={styles.overlayTitle}>📦 Stack Tower</Text>
                                <Text style={styles.overlayText}>Tap to drop blocks</Text>
                                <Text style={styles.overlayText}>Stack as high as you can!</Text>
                                <View style={styles.startButton}>
                                    <Text style={styles.startButtonText}>TAP TO START</Text>
                                </View>
                            </View>
                        )}

                        {gameOver && (
                            <View style={styles.overlay}>
                                <Text style={styles.overlayTitle}>Game Over!</Text>
                                <Text style={styles.overlayScore}>Score: {score}</Text>
                                {score > 0 && score === highScore && (
                                    <Text style={styles.newHighScore}>🎉 New High Score!</Text>
                                )}
                                <Text style={styles.highScoreText}>High Score: {highScore}</Text>
                                <View style={styles.startButton}>
                                    <Text style={styles.startButtonText}>TAP TO RETRY</Text>
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* High Score Display */}
                    {gameStarted && !gameOver && (
                        <View style={styles.highScoreDisplay}>
                            <Text style={styles.highScoreLabel}>Best: {highScore}</Text>
                        </View>
                    )}
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
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
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backText: {
        fontSize: 24,
        color: 'white',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        ...Platform.select({ ios: { fontFamily: 'Avenir-Black' }, android: { fontFamily: 'sans-serif-black' } }),
    },
    scoreContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    gameArea: {
        flex: 1,
        position: 'relative',
    },
    blocksContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
    },
    block: {
        position: 'absolute',
        height: BLOCK_HEIGHT,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    currentBlock: {
        borderColor: 'rgba(255, 255, 255, 0.6)',
        shadowOpacity: 0.5,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    overlayTitle: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
    },
    overlayText: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 10,
        textAlign: 'center',
    },
    overlayScore: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#f8961e',
        marginBottom: 10,
    },
    newHighScore: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f9c74f',
        marginBottom: 10,
    },
    highScoreText: {
        fontSize: 20,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 30,
    },
    startButton: {
        backgroundColor: '#f8961e',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
        shadowColor: '#f8961e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
    },
    startButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 1,
    },
    highScoreDisplay: {
        padding: 15,
        alignItems: 'center',
    },
    highScoreLabel: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '600',
    },
});
