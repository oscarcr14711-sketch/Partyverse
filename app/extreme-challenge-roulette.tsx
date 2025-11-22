import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const challenges: string[] = [
	'Lick Soap',            // 0
	'Mom Punishment',       // 1
	'15 Push Ups',          // 2
	'Oil Shot',             // 3
	'10 Pics Challenge',    // 4
	'Ask That Question',    // 5
	'5 Bucks Challenge',    // 6
	'Ice Ice Challenge',    // 7
	'Nasty Shake',          // 8
	'Hottest Pepper',       // 9
	'Sour Sour',            // 10
	'Little Insect',        // 11
	'Rubber Hit',           // 12
	'Embarrassing Post',    // 13
	'Safe and Spin'         // 14
];

export default function ExtremeChallengeRouletteScreen() {
		const router = require('expo-router').useRouter();
	const screenWidth = Dimensions.get('window').width;
	const rouletteSize = screenWidth;
	const [currentIndex, setCurrentIndex] = useState(0);
	const rotateAnim = useRef(new Animated.Value(0)).current;
	const blockCount = challenges.length;
	const blockAngle = 360 / blockCount;

	// Pop-out states and animations
	const [showMom, setShowMom] = useState(false);
	const flipMomAnim = useRef(new Animated.Value(0)).current;
	const [show5Bucks, setShow5Bucks] = useState(false);
	const flip5BucksAnim = useRef(new Animated.Value(0)).current;
	const [showLime, setShowLime] = useState(false);
	const flipLimeAnim = useRef(new Animated.Value(0)).current;
	const [showOil, setShowOil] = useState(false);
	const flipOilAnim = useRef(new Animated.Value(0)).current;
	const [showIce, setShowIce] = useState(false);
	const flipIceAnim = useRef(new Animated.Value(0)).current;
	const [showPhotos, setShowPhotos] = useState(false);
	const flipPhotosAnim = useRef(new Animated.Value(0)).current;
	const [showShake, setShowShake] = useState(false);
	const flipShakeAnim = useRef(new Animated.Value(0)).current;
	const [showRubber, setShowRubber] = useState(false);
	const flipRubberAnim = useRef(new Animated.Value(0)).current;
	const [showInsect, setShowInsect] = useState(false);
	const flipInsectAnim = useRef(new Animated.Value(0)).current;
	const [showPushup, setShowPushup] = useState(false);
	const flipPushupAnim = useRef(new Animated.Value(0)).current;
	const [showSoap, setShowSoap] = useState(false);
	const flipSoapAnim = useRef(new Animated.Value(0)).current;
	const [showPepper, setShowPepper] = useState(false);
	const flipPepperAnim = useRef(new Animated.Value(0)).current;
	const [showQuestion, setShowQuestion] = useState(false);
	const flipQuestionAnim = useRef(new Animated.Value(0)).current;
	const [showPost, setShowPost] = useState(false);
	const flipPostAnim = useRef(new Animated.Value(0)).current;
	const [showSafe, setShowSafe] = useState(false);
	const flipSafeAnim = useRef(new Animated.Value(0)).current;
	const [hasSpun, setHasSpun] = useState(false);

	useEffect(() => {
		// Pop-out logic for each index
		if (hasSpun && currentIndex === 0) { setShowSoap(true); flipSoapAnim.setValue(0); Animated.timing(flipSoapAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); } else { setShowSoap(false); }
		if (currentIndex === 1) { setShowMom(true); flipMomAnim.setValue(0); Animated.timing(flipMomAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); } else { setShowMom(false); }
		if (currentIndex === 5) { setShowQuestion(true); flipQuestionAnim.setValue(0); Animated.timing(flipQuestionAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); } else { setShowQuestion(false); }
		if (currentIndex === 6) { setShow5Bucks(true); flip5BucksAnim.setValue(0); Animated.timing(flip5BucksAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); } else if (currentIndex !== 5) { setShow5Bucks(false); }
		if (currentIndex === 10) { setShowLime(true); flipLimeAnim.setValue(0); Animated.timing(flipLimeAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); } else { setShowLime(false); }
		if (currentIndex === 3) { setShowOil(true); flipOilAnim.setValue(0); Animated.timing(flipOilAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); } else { setShowOil(false); }
		if (currentIndex === 7) { setShowIce(true); flipIceAnim.setValue(0); Animated.timing(flipIceAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); } else { setShowIce(false); }
		if (currentIndex === 4) { setShowPhotos(true); flipPhotosAnim.setValue(0); Animated.timing(flipPhotosAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); } else { setShowPhotos(false); }
		if (currentIndex === 8) { setShowShake(true); flipShakeAnim.setValue(0); Animated.timing(flipShakeAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); } else { setShowShake(false); }
		if (currentIndex === 12) { setShowRubber(true); flipRubberAnim.setValue(0); Animated.timing(flipRubberAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); } else { setShowRubber(false); }
		if (currentIndex === 11) { setShowInsect(true); flipInsectAnim.setValue(0); Animated.timing(flipInsectAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); } else { setShowInsect(false); }
		if (currentIndex === 2) { setShowPushup(true); flipPushupAnim.setValue(0); Animated.timing(flipPushupAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); } else { setShowPushup(false); }
		if (currentIndex === 9) { setShowPepper(true); flipPepperAnim.setValue(0); Animated.timing(flipPepperAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); } else { setShowPepper(false); }
		if (currentIndex === 13) { setShowPost(true); flipPostAnim.setValue(0); Animated.timing(flipPostAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); } else { setShowPost(false); }
		if (currentIndex === 14) { setShowSafe(true); flipSafeAnim.setValue(0); Animated.timing(flipSafeAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); } else { setShowSafe(false); }
	}, [currentIndex, hasSpun]);

	// Hide handlers
	const handleHideSoap = () => setShowSoap(false);
	const handleHideMom = () => setShowMom(false);
	const handleHide5Bucks = () => setShow5Bucks(false);
	const handleHideLime = () => setShowLime(false);
	const handleHideOil = () => setShowOil(false);
	const handleHideIce = () => setShowIce(false);
	const handleHidePhotos = () => setShowPhotos(false);
	const handleHideShake = () => setShowShake(false);
	const handleHideRubber = () => setShowRubber(false);
	const handleHideInsect = () => setShowInsect(false);
	const handleHidePushup = () => setShowPushup(false);
	const handleHidePepper = () => setShowPepper(false);
	const handleHideQuestion = () => setShowQuestion(false);
	const handleHidePost = () => setShowPost(false);
	const handleHideSafe = () => setShowSafe(false);

	// Spin logic
	const spinRoulette = () => {
		setHasSpun(true);
		const nextIndex = Math.floor(Math.random() * blockCount);
		const extraSpins = 4;
		const manualImageOffset = -12;
		rotateAnim.setValue(0);
		const targetRotation = nextIndex * blockAngle + manualImageOffset + extraSpins * 360;
		Animated.timing(rotateAnim, {
			toValue: targetRotation,
			duration: 2500,
			easing: Easing.out(Easing.cubic),
			useNativeDriver: true,
		}).start(() => {
			setCurrentIndex(nextIndex);
		});
	};

	const rotateInterpolate = rotateAnim.interpolate({
		inputRange: [0, 360],
		outputRange: ['0deg', '360deg'],
	});
	const staticOffset = -12;

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
			<Image
				source={require('../assets/images/telon1.png')}
				style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: -1 }}
				resizeMode="cover"
			/>
			<View style={{ width: rouletteSize, alignItems: 'center', justifyContent: 'flex-start', marginTop: 32, marginBottom: 0, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 }}>
				<LottieView source={require('../assets/animations/lights.json')} autoPlay loop style={{ width: rouletteSize, height: 260 }} />
			</View>
			<View style={{ width: rouletteSize, height: rouletteSize, justifyContent: 'center', alignItems: 'center', position: 'relative', marginTop: -72, marginBottom: 8 }}>
				<Animated.Image
					source={require('../assets/images/Roulettenew.png')}
					style={{ width: rouletteSize, height: rouletteSize, transform: [{ rotate: currentIndex === 0 ? `${staticOffset}deg` : rotateInterpolate }] }}
					resizeMode="contain"
				/>
				<Image
					source={require('../assets/images/Arrow.png')}
					style={{ width: 64, height: 64, position: 'absolute', top: -32, left: rouletteSize / 2 - 32, zIndex: 10 }}
					resizeMode="contain"
				/>
				{/* Pop-outs for each index */}
				{showSoap && (
					<TouchableOpacity activeOpacity={0.8} style={{ position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [{ translateX: -90 }, { translateY: -90 }] }} onPress={handleHideSoap}>
						<Animated.View style={{ width: 500, height: 500, borderRadius: 32, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [ { translateX: -250 }, { translateY: -250 }, { rotateY: flipSoapAnim.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] }) }, { scale: flipSoapAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.1] }) } ] }}>
							<Image source={require('../assets/images/soap.png')} style={{ width: 500, height: 500, borderRadius: 24 }} resizeMode="contain" />
						</Animated.View>
					</TouchableOpacity>
				)}
				{showMom && (
					<TouchableOpacity activeOpacity={0.8} style={{ position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [{ translateX: -90 }, { translateY: -90 }] }} onPress={handleHideMom}>
						<Animated.View style={{ width: 500, height: 500, borderRadius: 32, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [ { translateX: -250 }, { translateY: -250 }, { rotateY: flipMomAnim.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] }) }, { scale: flipMomAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.1] }) } ] }}>
							<Image source={require('../assets/images/mom.png')} style={{ width: 500, height: 500, borderRadius: 24 }} resizeMode="contain" />
						</Animated.View>
					</TouchableOpacity>
				)}
				{show5Bucks && (
					<TouchableOpacity activeOpacity={0.8} style={{ position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [{ translateX: -90 }, { translateY: -90 }] }} onPress={handleHide5Bucks}>
						<Animated.View style={{ width: 500, height: 500, borderRadius: 32, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [ { translateX: -250 }, { translateY: -250 }, { rotateY: flip5BucksAnim.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] }) }, { scale: flip5BucksAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.1] }) } ] }}>
							<Image source={require('../assets/images/5bucks.png')} style={{ width: 500, height: 500, borderRadius: 24 }} resizeMode="contain" />
						</Animated.View>
					</TouchableOpacity>
				)}
				{showLime && (
					<TouchableOpacity activeOpacity={0.8} style={{ position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [{ translateX: -90 }, { translateY: -90 }] }} onPress={handleHideLime}>
						<Animated.View style={{ width: 500, height: 500, borderRadius: 32, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [ { translateX: -250 }, { translateY: -250 }, { rotateY: flipLimeAnim.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] }) }, { scale: flipLimeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.1] }) } ] }}>
							<Image source={require('../assets/images/lime.png')} style={{ width: 500, height: 500, borderRadius: 24 }} resizeMode="contain" />
						</Animated.View>
					</TouchableOpacity>
				)}
				{showOil && (
					<TouchableOpacity activeOpacity={0.8} style={{ position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [{ translateX: -90 }, { translateY: -90 }] }} onPress={handleHideOil}>
						<Animated.View style={{ width: 500, height: 500, borderRadius: 32, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [ { translateX: -250 }, { translateY: -250 }, { rotateY: flipOilAnim.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] }) }, { scale: flipOilAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.1] }) } ] }}>
							<Image source={require('../assets/images/oil.png')} style={{ width: 500, height: 500, borderRadius: 24 }} resizeMode="contain" />
						</Animated.View>
					</TouchableOpacity>
				)}
				{showIce && (
					<TouchableOpacity activeOpacity={0.8} style={{ position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [{ translateX: -90 }, { translateY: -90 }] }} onPress={handleHideIce}>
						<Animated.View style={{ width: 500, height: 500, borderRadius: 32, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [ { translateX: -250 }, { translateY: -250 }, { rotateY: flipIceAnim.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] }) }, { scale: flipIceAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.1] }) } ] }}>
							<Image source={require('../assets/images/ice.png')} style={{ width: 500, height: 500, borderRadius: 24 }} resizeMode="contain" />
						</Animated.View>
					</TouchableOpacity>
				)}
				{showPhotos && (
					<TouchableOpacity activeOpacity={0.8} style={{ position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [{ translateX: -90 }, { translateY: -90 }] }} onPress={handleHidePhotos}>
						<Animated.View style={{ width: 500, height: 500, borderRadius: 32, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [ { translateX: -250 }, { translateY: -250 }, { rotateY: flipPhotosAnim.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] }) }, { scale: flipPhotosAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.1] }) } ] }}>
							<Image source={require('../assets/images/photos.png')} style={{ width: 500, height: 500, borderRadius: 24 }} resizeMode="contain" />
						</Animated.View>
					</TouchableOpacity>
				)}
				{showShake && (
					<TouchableOpacity activeOpacity={0.8} style={{ position: 'absolute', top: '110%', left: '105%', zIndex: 100, elevation: 100, transform: [{ translateX: -250 }, { translateY: -250 }] }} onPress={handleHideShake}>
						<Animated.View style={{ width: 500, height: 500, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '110%', left: '105%', zIndex: 100, elevation: 100, transform: [ { translateX: -250 }, { translateY: -250 }, { rotateY: flipShakeAnim.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] }) }, { scale: flipShakeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.1] }) } ] }}>
							<Image source={require('../assets/images/shake.png')} style={{ width: 500, height: 500 }} resizeMode="contain" />
						</Animated.View>
					</TouchableOpacity>
				)}
				{showRubber && (
					<TouchableOpacity activeOpacity={0.8} style={{ position: 'absolute', top: '110%', left: '105%', zIndex: 100, elevation: 100, transform: [{ translateX: -250 }, { translateY: -250 }] }} onPress={handleHideRubber}>
						<Animated.View style={{ width: 500, height: 500, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '110%', left: '105%', zIndex: 100, elevation: 100, transform: [ { translateX: -250 }, { translateY: -250 }, { rotateY: flipRubberAnim.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] }) }, { scale: flipRubberAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.1] }) } ] }}>
							<Image source={require('../assets/images/rubber.png')} style={{ width: 500, height: 500 }} resizeMode="contain" />
						</Animated.View>
					</TouchableOpacity>
				)}
				{showInsect && (
					<TouchableOpacity activeOpacity={0.8} style={{ position: 'absolute', top: '110%', left: '105%', zIndex: 100, elevation: 100, transform: [{ translateX: -250 }, { translateY: -250 }] }} onPress={handleHideInsect}>
						<Animated.View style={{ width: 500, height: 500, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '110%', left: '105%', zIndex: 100, elevation: 100, transform: [ { translateX: -250 }, { translateY: -250 }, { rotateY: flipInsectAnim.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] }) }, { scale: flipInsectAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.1] }) } ] }}>
							<Image source={require('../assets/images/insect.png')} style={{ width: 500, height: 500 }} resizeMode="contain" />
						</Animated.View>
					</TouchableOpacity>
				)}
				{showPushup && (
					<TouchableOpacity activeOpacity={0.8} style={{ position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [{ translateX: -90 }, { translateY: -90 }] }} onPress={handleHidePushup}>
						<Animated.View style={{ width: 500, height: 500, borderRadius: 32, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [ { translateX: -250 }, { translateY: -250 }, { rotateY: flipPushupAnim.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] }) }, { scale: flipPushupAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.1] }) } ] }}>
							<Image source={require('../assets/images/pushup.png')} style={{ width: 500, height: 500, borderRadius: 24 }} resizeMode="contain" />
						</Animated.View>
					</TouchableOpacity>
				)}
				{showPepper && (
					<TouchableOpacity activeOpacity={0.8} style={{ position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [{ translateX: -90 }, { translateY: -90 }] }} onPress={handleHidePepper}>
						<Animated.View style={{ width: 500, height: 500, borderRadius: 32, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [ { translateX: -250 }, { translateY: -250 }, { rotateY: flipPepperAnim.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] }) }, { scale: flipPepperAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.1] }) } ] }}>
							<Image source={require('../assets/images/pepper.png')} style={{ width: 500, height: 500, borderRadius: 24 }} resizeMode="contain" />
						</Animated.View>
					</TouchableOpacity>
				)}
				{showQuestion && (
					<TouchableOpacity activeOpacity={0.8} style={{ position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [{ translateX: -90 }, { translateY: -90 }] }} onPress={handleHideQuestion}>
						<Animated.View style={{ width: 500, height: 500, borderRadius: 32, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [ { translateX: -250 }, { translateY: -250 }, { rotateY: flipQuestionAnim.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] }) }, { scale: flipQuestionAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.1] }) } ] }}>
							<Image source={require('../assets/images/question.png')} style={{ width: 500, height: 500, borderRadius: 24 }} resizeMode="contain" />
						</Animated.View>
					</TouchableOpacity>
				)}
				{showPost && (
					<TouchableOpacity activeOpacity={0.8} style={{ position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [{ translateX: -90 }, { translateY: -90 }] }} onPress={handleHidePost}>
						<Animated.View style={{ width: 500, height: 500, borderRadius: 32, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [ { translateX: -250 }, { translateY: -250 }, { rotateY: flipPostAnim.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] }) }, { scale: flipPostAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.1] }) } ] }}>
							<Image source={require('../assets/images/post.png')} style={{ width: 500, height: 500, borderRadius: 24 }} resizeMode="contain" />
						</Animated.View>
					</TouchableOpacity>
				)}
				{showSafe && (
					<TouchableOpacity activeOpacity={0.8} style={{ position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [{ translateX: -90 }, { translateY: -90 }] }} onPress={handleHideSafe}>
						<Animated.View style={{ width: 500, height: 500, borderRadius: 32, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '65%', left: '70%', zIndex: 100, elevation: 100, transform: [ { translateX: -250 }, { translateY: -250 }, { rotateY: flipSafeAnim.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] }) }, { scale: flipSafeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.1] }) } ] }}>
							<Image source={require('../assets/images/safe1.png')} style={{ width: 500, height: 500, borderRadius: 24 }} resizeMode="contain" />
						</Animated.View>
					</TouchableOpacity>
				)}
			</View>
			<TouchableOpacity onPress={spinRoulette} style={{ marginTop: 32, alignSelf: 'center' }} activeOpacity={0.7}>
				<Image source={require('../assets/images/Button.png')} style={{ width: 120, height: 120 }} resizeMode="contain" />
			</TouchableOpacity>
			<TouchableOpacity 
				style={{ position: 'absolute', bottom: 24, alignSelf: 'center', backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 28, paddingVertical: 8, borderWidth: 1, borderColor: '#ccc' }}
				onPress={() => router.push('/game-over-screen')}
			>
				<Text style={{ fontSize: 18, color: '#333', fontWeight: 'bold' }}>Finish</Text>
			</TouchableOpacity>
		</View>
	);
}


