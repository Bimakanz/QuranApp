import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Magnetometer } from 'expo-sensors';
import { ArrowLeft, MapPin } from 'lucide-react-native';
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
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

const TEAL = '#728D8E';
const TEAL_DARK = '#32665C';
const BG = '#F5F0E8';
const GOLD = '#C8A84B';

const { width } = Dimensions.get('window');
const COMPASS_SIZE = Math.min(width * 0.78, 300);
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

// Kaaba SVG icon
const KaabaIcon = ({ size = 28 }: { size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 36 36">
        <Path d="M18 0L0 5v29l18 2l18-2V5z" fill="#292F33" />
        <Path fill="#3B3F42" d="M18 36l18-2V5L18 0z" />
        <Path fill="#FFD983" d="M22.454 14.507v3.407l4.229.612V15.22zm7 1.181v3.239l3.299.478v-3.161zM18 13.756v3.513l1.683.244V14.04zm18 3.036l-.539-.091v3.096l.539.078z" />
        <Path fill="#FFAC33" d="M0 16.792v3.083l.539-.078v-3.096zm16.317-2.752v3.473L18 17.269v-3.513zm-13.07 2.204v3.161l3.299-.478v-3.239zm6.07-1.024v3.306l4.229-.612v-3.407z" />
        <Path fill="#FFD983" d="M18 7.614v3.764l18 3.268v-3.5z" />
        <Path fill="#FFAC33" d="M0 11.146v3.5l18-3.268V7.614z" />
    </Svg>
);

function calculateQibla(lat: number, lng: number): number {
    const latR = (lat * Math.PI) / 180;
    const lngR = (lng * Math.PI) / 180;
    const kaabaLatR = (KAABA_LAT * Math.PI) / 180;
    const kaabaLngR = (KAABA_LNG * Math.PI) / 180;
    const dLng = kaabaLngR - lngR;
    const y = Math.sin(dLng);
    const x = Math.cos(latR) * Math.tan(kaabaLatR) - Math.sin(latR) * Math.cos(dLng);
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function getDirectionLabel(angle: number): string {
    const dirs = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL'];
    return dirs[Math.round(angle / 45) % 8];
}

export default function ArahKiblat() {
    const router = useRouter();
    const [heading, setHeading] = useState(0);
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
    const [locationName, setLocationName] = useState('Mencari lokasi...');
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const animCompass = useRef(new Animated.Value(0)).current;
    const lastHeading = useRef(0);

    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Izin lokasi diperlukan untuk menentukan arah kiblat. Aktifkan di pengaturan.');
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
                    setQiblaDirection(json?.data?.direction ?? calculateQibla(latitude, longitude));
                } catch { setQiblaDirection(calculateQibla(latitude, longitude)); }

                setLoading(false);
            } catch (err: any) {
                setErrorMsg(err.message || 'Gagal mendapatkan lokasi.');
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        Magnetometer.setUpdateInterval(80);
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
            Animated.spring(animCompass, { toValue: newVal, useNativeDriver: true, friction: 12, tension: 50 }).start();
        });
        return () => sub.remove();
    }, []);

    const compassRotation = animCompass.interpolate({ inputRange: [-360, 360], outputRange: ['360deg', '-360deg'] });
    const qiblaAngle = qiblaDirection !== null ? (qiblaDirection - heading + 360) % 360 : null;

    // Compass rose marks
    const marks = Array.from({ length: 72 }, (_, i) => i);

    const header = (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)' }}>
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                <ArrowLeft size={24} color={TEAL} />
            </TouchableOpacity>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#1a1a1a' }}>Arah Kiblat</Text>
            <View style={{ width: 32 }} />
        </View>
    );

    if (loading) return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>
            {header}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                <ActivityIndicator size="large" color={TEAL} />
                <Text style={{ color: '#888', fontSize: 14 }}>Mencari lokasi Anda...</Text>
            </View>
        </SafeAreaView>
    );

    if (errorMsg) return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>
            {header}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
                <Text style={{ color: '#c0392b', fontSize: 14, textAlign: 'center', lineHeight: 22 }}>{errorMsg}</Text>
            </View>
        </SafeAreaView>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>
            {header}

            {/* Location badge */}
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F0F0', marginHorizontal: 20, marginTop: 12, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, gap: 6, alignSelf: 'flex-start' }}>
                <MapPin size={14} color={TEAL} />
                <Text style={{ fontSize: 13, color: TEAL_DARK, fontWeight: '600' }}>{locationName}</Text>
            </View>

            {/* Compass container */}
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                {/* Rotating compass rose */}
                <Animated.View style={{ width: COMPASS_SIZE, height: COMPASS_SIZE, transform: [{ rotate: compassRotation }] }}>
                    <Svg width={COMPASS_SIZE} height={COMPASS_SIZE} viewBox={`0 0 ${COMPASS_SIZE} ${COMPASS_SIZE}`}>
                        {/* Outer ring */}
                        <Circle cx={COMPASS_SIZE / 2} cy={COMPASS_SIZE / 2} r={COMPASS_SIZE / 2 - 4} fill="#fff" stroke="#E0DAD0" strokeWidth={2} />

                        {/* Tick marks */}
                        {marks.map((i) => {
                            const angle = (i * 5 * Math.PI) / 180;
                            const isMajor = i % 18 === 0;
                            const isMid = i % 9 === 0;
                            const r = COMPASS_SIZE / 2 - 10;
                            const innerR = r - (isMajor ? 16 : isMid ? 11 : 6);
                            const cx = COMPASS_SIZE / 2;
                            const cy = COMPASS_SIZE / 2;
                            return (
                                <Line
                                    key={i}
                                    x1={cx + innerR * Math.sin(angle)}
                                    y1={cy - innerR * Math.cos(angle)}
                                    x2={cx + r * Math.sin(angle)}
                                    y2={cy - r * Math.cos(angle)}
                                    stroke={isMajor ? TEAL_DARK : isMid ? TEAL : '#D0CBC2'}
                                    strokeWidth={isMajor ? 2.5 : isMid ? 1.5 : 1}
                                />
                            );
                        })}

                        {/* Cardinal labels */}
                        {[
                            { label: 'U', angle: 0, color: '#D32F2F' },
                            { label: 'T', angle: 90, color: TEAL },
                            { label: 'S', angle: 180, color: TEAL },
                            { label: 'B', angle: 270, color: TEAL },
                        ].map(({ label, angle, color }) => {
                            const r = COMPASS_SIZE / 2 - 34;
                            const angleRad = (angle * Math.PI) / 180;
                            return (
                                <SvgText
                                    key={label}
                                    x={COMPASS_SIZE / 2 + r * Math.sin(angleRad)}
                                    y={COMPASS_SIZE / 2 - r * Math.cos(angleRad) + 6}
                                    textAnchor="middle"
                                    fontSize={17}
                                    fontWeight="800"
                                    fill={color}
                                >
                                    {label}
                                </SvgText>
                            );
                        })}
                    </Svg>
                </Animated.View>

                {/* Qibla needle — independent rotation */}
                {qiblaAngle !== null && (
                    <View style={{
                        position: 'absolute',
                        width: COMPASS_SIZE, height: COMPASS_SIZE,
                        alignItems: 'center', justifyContent: 'center',
                        transform: [{ rotate: `${qiblaAngle}deg` }],
                    }}>
                        {/* Needle pointing up = toward Mecca */}
                        <View style={{
                            position: 'absolute', top: 12,
                            alignItems: 'center',
                            height: COMPASS_SIZE / 2 - 24,
                            justifyContent: 'flex-start',
                        }}>
                            <KaabaIcon size={26} />
                            <View style={{ width: 3, flex: 1, backgroundColor: GOLD, borderRadius: 2, marginTop: 4, opacity: 0.9 }} />
                        </View>
                    </View>
                )}

                {/* Center fixed dot */}
                <View style={{ position: 'absolute', width: 48, height: 48, borderRadius: 24, backgroundColor: BG, borderWidth: 3, borderColor: '#E0DAD0', alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4 }}>
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: TEAL }} />
                </View>
            </View>

            {/* Info cards */}
            <View style={{ flexDirection: 'row', gap: 12, marginHorizontal: 20, marginBottom: 16 }}>
                <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}>
                    <Text style={{ fontSize: 11, color: TEAL, fontWeight: '700', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Kompas</Text>
                    <Text style={{ fontSize: 26, fontWeight: '800', color: TEAL_DARK }}>{Math.round(heading)}°</Text>
                    <Text style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{getDirectionLabel(heading)}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}>
                    <Text style={{ fontSize: 11, color: GOLD, fontWeight: '700', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Kiblat</Text>
                    <Text style={{ fontSize: 26, fontWeight: '800', color: TEAL_DARK }}>
                        {qiblaDirection !== null ? `${qiblaDirection.toFixed(1)}°` : '-'}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                        {qiblaDirection !== null ? getDirectionLabel(qiblaDirection) : '-'}
                    </Text>
                </View>
            </View>

            {/* Tip */}
            <View style={{ marginHorizontal: 20, marginBottom: 20, padding: 14, backgroundColor: '#FFF8EE', borderRadius: 12, borderWidth: 1, borderColor: '#FFEFD5' }}>
                <Text style={{ fontSize: 12, color: '#8B7355', lineHeight: 18, textAlign: 'center' }}>
                    Putar HP hingga ikon Ka'bah (🕋) mengarah ke atas. Jauhkan dari benda logam untuk hasil akurat.
                </Text>
            </View>
        </SafeAreaView>
    );
}
