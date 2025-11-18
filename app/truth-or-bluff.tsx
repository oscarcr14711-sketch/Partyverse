
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const truthImages = [
	require('../assets/images/Truth or bluff images/T1.png'),
	require('../assets/images/Truth or bluff images/T2.png'),
	require('../assets/images/Truth or bluff images/T3.png'),
	require('../assets/images/Truth or bluff images/T4.png'),
	require('../assets/images/Truth or bluff images/T5.png'),
	require('../assets/images/Truth or bluff images/T6.png'),
	require('../assets/images/Truth or bluff images/T7.png'),
	require('../assets/images/Truth or bluff images/T8.png'),
	require('../assets/images/Truth or bluff images/T9.png'),
	require('../assets/images/Truth or bluff images/T10.png'),
	require('../assets/images/Truth or bluff images/T11.png'),
	require('../assets/images/Truth or bluff images/T12.png'),
];

const avatarImages = [
	require('../assets/images/avatars/avatar1.png'),
	require('../assets/images/avatars/avatar2.png'),
	require('../assets/images/avatars/avatar3.png'),
	require('../assets/images/avatars/avatar4.png'),
	require('../assets/images/avatars/avatar5.png'),
	require('../assets/images/avatars/avatar6.png'),
];

const TruthOrBluffScreen = () => {
	// All hooks at top level
	const [showGame, setShowGame] = useState(false);
	const [numPlayers, setNumPlayers] = useState(2);
	const avatarsMemo = useMemo(() => {
		const count = Math.min(numPlayers, avatarImages.length);
		return Array.from({ length: count }, (_, i) => (
			<View key={i} style={styles.playerAvatar}>
				<Image
					source={avatarImages[i]}
					style={styles.playerAvatarImage}
					resizeMode="contain"
				/>
			</View>
		));
	}, [numPlayers]);

	// Game screen hooks
	const [currentImageIdx, setCurrentImageIdx] = useState(() => Math.floor(Math.random() * truthImages.length));
	const [timer, setTimer] = useState(30);
	const [isTimerActive, setIsTimerActive] = useState(true);

	useEffect(() => {
		if (!showGame) return;
		if (!isTimerActive) return;
		if (timer === 0) return;
		const interval = setInterval(() => {
			setTimer((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);
		return () => clearInterval(interval);
	}, [timer, isTimerActive, showGame]);

	const handleNextPlayer = () => {
		let nextIdx = Math.floor(Math.random() * truthImages.length);
		if (nextIdx === currentImageIdx) nextIdx = (nextIdx + 1) % truthImages.length;
		setCurrentImageIdx(nextIdx);
		setTimer(30);
		setIsTimerActive(true);
	};

	// Render
	if (!showGame) {
		// Pre-game setup screen
		return (
			<View style={styles.container}>
				<Image
					source={require('../assets/images/Truth1.png')}
					style={styles.titleImageMiddle}
					resizeMode="contain"
				/>
				<View style={styles.charactersWrapper}>
					<Image
						source={require('../assets/images/Truthorbluff.png')}
						style={styles.charactersImage}
						resizeMode="contain"
					/>
				</View>
				<View style={styles.buttonsWrapper}>
					<View style={styles.playerAvatarsContainer}>{avatarsMemo}</View>
					<View style={styles.playerCountPill}>
						<TouchableOpacity
							style={styles.playerCountCircle}
							onPress={() => setNumPlayers(Math.max(2, numPlayers - 1))}
						>
							<Text style={styles.playerCountCircleText}>−</Text>
						</TouchableOpacity>
						<Text style={styles.playerCountText}>{numPlayers} Players</Text>
						<TouchableOpacity
							style={styles.playerCountCircle}
							onPress={() => setNumPlayers(Math.min(6, numPlayers + 1))}
						>
							<Text style={styles.playerCountCircleText}>+</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity style={styles.setupStartButton} onPress={() => setShowGame(true)}>
						<Text style={styles.setupStartButtonText}>START</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	// Actual game screen (mockup)
	return (
		<View style={styles.mockupContainer}>
			<Text style={styles.turnText}>YOUR TURN</Text>
			<View style={styles.mockupPhoneFrame}>
				<Image source={truthImages[currentImageIdx]} style={styles.mockupImage} resizeMode="contain" />
				<View style={styles.timerCircleWrapper}>
					<View style={styles.timerCircleOuter}>
						<View style={styles.timerCircleInner}>
							<Text style={styles.timerText}>{timer.toString().padStart(2, '0')}</Text>
						</View>
					</View>
				</View>
			</View>
			<View style={styles.mockupButtonsWrapper}>
				<TouchableOpacity style={styles.mockupButton} disabled={timer === 0}>
					<Text style={styles.mockupButtonText}>I'LL DESCRIBE IT</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.mockupButton} onPress={handleNextPlayer}>
					<Text style={styles.mockupButtonText}>NEXT PLAYER</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	// Pre-game styles
	container: {
		flex: 1,
		backgroundColor: '#e6d8f7',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingTop: 48,
	},
	titleImageMiddle: {
		width: '100%',
		height: 180,
		marginBottom: 24,
		alignSelf: 'center',
		marginTop: 32,
	},
	charactersWrapper: {
		width: '100%',
		alignItems: 'center',
		marginBottom: 0,
		marginTop: 40,
	},
	charactersImage: {
		width: '90%',
		height: 260,
		alignSelf: 'center',
		marginBottom: 0,
	},
	playerAvatarsContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 15,
		marginTop: 8,
		marginBottom: 10,
		flexWrap: 'wrap',
		width: '100%',
	},
	playerAvatar: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 56,
		height: 56,
		borderRadius: 28,
		overflow: 'hidden',
		backgroundColor: '#fff',
		borderWidth: 2,
		borderColor: '#6c5ce7',
		marginHorizontal: 4,
	},
	playerAvatarImage: {
		width: 56,
		height: 56,
		borderRadius: 28,
	},
	playerCountPill: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#6c5ce7',
		borderRadius: 32,
		paddingHorizontal: 24,
		paddingVertical: 10,
		marginVertical: 16,
		width: 320,
		alignSelf: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 8,
		elevation: 8,
		justifyContent: 'space-between',
		gap: 18,
	},
	playerCountCircle: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: '#6c5ce7',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.18,
		shadowRadius: 4,
		elevation: 4,
	},
	playerCountCircleText: {
		fontSize: 36,
		fontWeight: 'bold',
		color: '#fff',
		textAlign: 'center',
		lineHeight: 56,
		width: '100%',
		includeFontPadding: false,
	},
	playerCountText: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#fff',
		textAlign: 'center',
		minWidth: 120,
		fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
	},
	buttonsWrapper: {
		width: '100%',
		alignItems: 'center',
		position: 'absolute',
		bottom: 110,
		left: 0,
		right: 0,
		zIndex: 10,
	},
	setupStartButton: {
		width: 220,
		height: 62,
		borderRadius: 30,
		backgroundColor: '#6c5ce7',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.4,
		shadowRadius: 8,
		elevation: 10,
		borderBottomWidth: 4,
		borderBottomColor: '#1a1f23',
		marginBottom: 8,
	},
	setupStartButtonText: {
		fontSize: 26,
		fontWeight: 'bold',
		color: '#fff',
		fontFamily: Platform.select({ ios: 'Avenir-Heavy', android: 'sans-serif-medium' }),
		letterSpacing: 2,
	},
	// Game screen styles
	mockupContainer: {
		flex: 1,
		backgroundColor: '#a78bfa',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingTop: 48,
	},
	turnText: {
		fontSize: 38,
		fontWeight: 'bold',
		color: '#fff',
		marginBottom: 18,
		letterSpacing: 2,
		textAlign: 'center',
	},
	mockupPhoneFrame: {
		width: 320,
		height: 400,
		borderRadius: 38,
		backgroundColor: '#22223b',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 32,
		position: 'relative',
		borderWidth: 6,
		borderColor: '#444',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.25,
		shadowRadius: 16,
		elevation: 12,
	},
	mockupImage: {
		width: 300,
		height: 300,
		borderRadius: 24,
		marginTop: 18,
		marginBottom: 18,
	},
	timerCircleWrapper: {
		position: 'absolute',
		bottom: 24,
		left: 0,
		right: 0,
		alignItems: 'center',
		justifyContent: 'center',
	},
	timerCircleOuter: {
		width: 72,
		height: 72,
		borderRadius: 36,
		backgroundColor: '#ffb300',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 5,
		borderColor: '#fff',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.18,
		shadowRadius: 8,
		elevation: 6,
	},
	timerCircleInner: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: '#e65100',
		alignItems: 'center',
		justifyContent: 'center',
	},
	timerText: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#fff',
		textAlign: 'center',
		letterSpacing: 1,
	},
	mockupButtonsWrapper: {
		width: '100%',
		alignItems: 'center',
		marginTop: 32,
		gap: 18,
	},
	mockupButton: {
		width: 320,
		height: 62,
		borderRadius: 32,
		backgroundColor: '#3d348b',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 0,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	mockupButtonText: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#fff',
		letterSpacing: 1,
	},
});

export default TruthOrBluffScreen;





