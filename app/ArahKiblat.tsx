import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Magnetometer } from 'expo-sensors';
import { ArrowBigUp, ArrowLeft, MapPin } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const TEAL = '#32665C';
const TEAL_LIGHT = '#728D8E';
const BG = '#F5F0E8';

const KaabaIcon = ({ size = 32 }: { size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 36 36">
        <Path d="M18 0L0 5v29l18 2l18-2V5z" fill="#292F33" />
        <Path fill="#3B3F42" d="M18 36l18-2V5L18 0z" />
        <Path fill="#FFD983" d="M22.454 14.507v3.407l4.229.612V15.22zm7 1.181v3.239l3.299.478v-3.161zM18 13.756v3.513l1.683.244V14.04zm18 3.036l-.539-.091v3.096l.539.078z" />
        <Path fill="#FFAC33" d="M0 16.792v3.083l.539-.078v-3.096zm16.317-2.752v3.473L18 17.269v-3.513zm-13.07 2.204v3.161l3.299-.478v-3.239zm6.07-1.024v3.306l4.229-.612v-3.407z" />
        <Path fill="#FFD983" d="M18 7.614v3.764l18 3.268v-3.5z" />
        <Path fill="#FFAC33" d="M0 11.146v3.5l18-3.268V7.614z" />
    </Svg>
);

const { width } = Dimensions.get('window');
const COMPASS_SIZE = width * 0.75;
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

export default function ArahKiblat() {
    const router = useRouter();
    const [heading, setHeading] = useState(0);
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
    const [locationName, setLocationName] = useState('Mencari lokasi...');
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const animatedHeading = useRef(new Animated.Value(0)).current;
    const lastHeading = useRef(0);

    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Izin lokasi diperlukan untuk menentukan arah kiblat.');
                    setLoading(false);
                    return;
                }
                const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                const { latitude, longitude } = loc.coords;
                try {
                    const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
                    if (address) {
                        const city = address.city || address.subregion || address.region || '';
                        const country = address.country || '';
                        setLocationName(city ? `${city}, ${country}` : country);
                    }
                } catch { setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`); }

                try {
                    const res = await fetch(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`);
                    const json = await res.json();
                    if (json.data && json.data.direction) setQiblaDirection(json.data.direction);
                    else setQiblaDirection(calculateQibla(latitude, longitude));
                } catch { setQiblaDirection(calculateQibla(latitude, longitude)); }

                setLoading(false);
            } catch (err: any) {
                setErrorMsg(err.message || 'Gagal mendapatkan lokasi.');
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        Magnetometer.setUpdateInterval(100);
        const sub = Magnetometer.addListener((data) => {
            let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
            angle = (angle + 360) % 360;
            if (Platform.OS === 'android') angle = (360 - angle) % 360;
            setHeading(angle);
            let diff = angle - lastHeading.current;
            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;
            const newVal = lastHeading.current + diff;
            lastHeading.current = newVal;
            Animated.spring(animatedHeading, { toValue: newVal, useNativeDriver: true, friction: 10, tension: 40 }).start();
        });
        return () => sub.remove();
    }, []);

    const calculateQibla = (lat: number, lng: number): number => {
        const latR = (lat * Math.PI) / 180;
        const lngR = (lng * Math.PI) / 180;
        const kaabaLatR = (KAABA_LAT * Math.PI) / 180;
        const kaabaLngR = (KAABA_LNG * Math.PI) / 180;
        const dLng = kaabaLngR - lngR;
        const y = Math.sin(dLng);
        const x = Math.cos(latR) * Math.tan(kaabaLatR) - Math.sin(latR) * Math.cos(dLng);
        let bearing = Math.atan2(y, x) * (180 / Math.PI);
        return (bearing + 360) % 360;
    };

    const compassRotation = animatedHeading.interpolate({ inputRange: [-360, 360], outputRange: ['360deg', '-360deg'] });
    const qiblaRotation = qiblaDirection !== null ? `${qiblaDirection}deg` : '0deg';

    const getDirectionLabel = (angle: number): string => {
        const directions = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'];
        return directions[Math.round(angle / 45) % 8];
    };

    const headerContent = (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                <ArrowLeft size={24} color={TEAL_LIGHT} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1a1a1a' }}>Arah Kiblat</Text>
            <View style={{ width: 32 }} />
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>
                {headerContent}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                    <ActivityIndicator size="large" color={TEAL} />
                    <Text style={{ color: '#888', fontSize: 14 }}>Mencari lokasi Anda...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (errorMsg) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>
                {headerContent}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#D32F2F', fontSize: 14, textAlign: 'center', paddingHorizontal: 20 }}>{errorMsg}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>
            {headerContent}

            {/* Location Info */}
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F0F0', marginHorizontal: 20, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, gap: 8 }}>
                <MapPin size={16} color={TEAL} />
                <Text style={{ fontSize: 14, color: TEAL, fontWeight: '600' }}>{locationName}</Text>
            </View>

            {/* Compass */}
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 24 }}>
                {/* Rotating compass rose */}
                <Animated.View style={{ width: COMPASS_SIZE, height: COMPASS_SIZE, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: compassRotation }] }}>
                    <View style={{
                        width: COMPASS_SIZE, height: COMPASS_SIZE, borderRadius: COMPASS_SIZE / 2,
                        borderWidth: 3, borderColor: '#EAEBE8', backgroundColor: '#fff',
                        alignItems: 'center', justifyContent: 'center',
                        elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8,
                    }}>
                        <Text style={{ position: 'absolute', fontSize: 18, fontWeight: '800', color: '#D32F2F', top: 28 }}>U</Text>
                        <Text style={{ position: 'absolute', fontSize: 18, fontWeight: '800', color: TEAL_LIGHT, bottom: 28 }}>S</Text>
                        <Text style={{ position: 'absolute', fontSize: 18, fontWeight: '800', color: TEAL_LIGHT, right: 28 }}>T</Text>
                        <Text style={{ position: 'absolute', fontSize: 18, fontWeight: '800', color: TEAL_LIGHT, left: 28 }}>B</Text>

                        {Array.from({ length: 72 }).map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    { position: 'absolute', backgroundColor: '#ccc', width: 1 },
                                    i % 18 === 0 ? { height: 14, width: 2, backgroundColor: TEAL } :
                                        i % 9 === 0 ? { height: 10, backgroundColor: TEAL_LIGHT } :
                                            { height: 6 },
                                    { transform: [{ rotate: `${i * 5}deg` }, { translateY: -(COMPASS_SIZE / 2 - 20) }] }
                                ]}
                            />
                        ))}
                    </View>
                </Animated.View>

                {/* Qibla needle — outside the rotating compass, rotates independently */}
                {qiblaDirection !== null && (
                    <View
                        style={{
                            position: 'absolute',
                            width: COMPASS_SIZE,
                            height: COMPASS_SIZE,
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: [{ rotate: `${(qiblaDirection - heading + 360) % 360}deg` }],
                        }}
                    >
                        {/* Needle pointing upward (toward Mecca) */}
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            alignItems: 'center',
                            height: COMPASS_SIZE / 2 - 20,
                            justifyContent: 'flex-start',
                        }}>
                            {/* Kaaba icon at tip */}
                            <KaabaIcon size={28} />
                            {/* Needle line */}
                            <View style={{ width: 3, flex: 1, backgroundColor: TEAL, borderRadius: 2, marginTop: 4 }} />
                        </View>
                    </View>
                )}

                {/* Center fixed dot */}
                <View style={{ position: 'absolute', width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8F0F0', alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 }}>
                    <ArrowBigUp size={24} color={TEAL} />
                </View>
            </View>

            {/* Info Panel */}
            <View style={{ marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#EAEBE8', padding: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ fontSize: 12, color: TEAL_LIGHT, fontWeight: '600', marginBottom: 4 }}>Arah Kompas</Text>
                        <Text style={{ fontSize: 28, fontWeight: '800', color: TEAL }}>{Math.round(heading)}°</Text>
                        <Text style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{getDirectionLabel(heading)}</Text>
                    </View>
                    <View style={{ width: 1, height: 50, backgroundColor: '#EAEBE8' }} />
                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ fontSize: 12, color: TEAL_LIGHT, fontWeight: '600', marginBottom: 4 }}>Arah Kiblat</Text>
                        <Text style={{ fontSize: 28, fontWeight: '800', color: TEAL }}>{qiblaDirection !== null ? `${qiblaDirection.toFixed(1)}°` : '-'}</Text>
                        <Text style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{qiblaDirection !== null ? getDirectionLabel(qiblaDirection) : '-'}</Text>
                    </View>
                </View>
            </View>

            {/* Instruction */}
            <View style={{ marginHorizontal: 20, marginTop: 16, padding: 16, backgroundColor: '#FFF8EE', borderRadius: 12, borderWidth: 1, borderColor: '#FFEFD5' }}>
                <Text style={{ fontSize: 13, color: '#8B7355', lineHeight: 20, textAlign: 'center' }}>
                    Putar HP Anda hingga tanda Ka'bah berada di atas (posisi utara). Pastikan tidak ada benda logam di sekitar untuk hasil yang akurat.
                </Text>
            </View>
        </SafeAreaView>
    );
}
