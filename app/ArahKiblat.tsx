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
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

// Kaaba icon component from SVG
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

// Kaaba coordinates
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

export default function ArahKiblat() {
    const router = useRouter();

    const [heading, setHeading] = useState(0);
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationName, setLocationName] = useState('Mencari lokasi...');
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const animatedHeading = useRef(new Animated.Value(0)).current;
    const lastHeading = useRef(0);

    // ── Get location & Qibla direction ──────────────────────
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Izin lokasi diperlukan untuk menentukan arah kiblat.');
                    setLoading(false);
                    return;
                }

                const loc = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });
                const { latitude, longitude } = loc.coords;
                setLocation({ lat: latitude, lng: longitude });

                // Get location name
                try {
                    const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
                    if (address) {
                        const city = address.city || address.subregion || address.region || '';
                        const country = address.country || '';
                        setLocationName(city ? `${city}, ${country}` : country);
                    }
                } catch {
                    setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                }

                // Get Qibla direction from API
                try {
                    const res = await fetch(
                        `https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`
                    );
                    const json = await res.json();
                    if (json.data && json.data.direction) {
                        setQiblaDirection(json.data.direction);
                    } else {
                        // Fallback: calculate manually
                        setQiblaDirection(calculateQibla(latitude, longitude));
                    }
                } catch {
                    // Fallback: calculate manually
                    setQiblaDirection(calculateQibla(latitude, longitude));
                }

                setLoading(false);
            } catch (err: any) {
                setErrorMsg(err.message || 'Gagal mendapatkan lokasi.');
                setLoading(false);
            }
        })();
    }, []);

    // ── Magnetometer for compass ────────────────────────────
    useEffect(() => {
        Magnetometer.setUpdateInterval(100);

        const sub = Magnetometer.addListener((data) => {
            let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
            // Normalize to 0-360
            angle = (angle + 360) % 360;
            // On Android, adjust for device orientation
            if (Platform.OS === 'android') {
                angle = (360 - angle) % 360;
            }

            setHeading(angle);

            // Smooth animation
            let diff = angle - lastHeading.current;
            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;
            const newVal = lastHeading.current + diff;
            lastHeading.current = newVal;

            Animated.spring(animatedHeading, {
                toValue: newVal,
                useNativeDriver: true,
                friction: 10,
                tension: 40,
            }).start();
        });

        return () => sub.remove();
    }, []);

    // ── Calculate Qibla bearing manually ────────────────────
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

    // ── Compass rotation ────────────────────────────────────
    const compassRotation = animatedHeading.interpolate({
        inputRange: [-360, 360],
        outputRange: ['360deg', '-360deg'],
    });

    // Qibla needle rotation relative to compass
    const qiblaRotation = qiblaDirection !== null
        ? `${qiblaDirection}deg`
        : '0deg';

    // Direction label
    const getDirectionLabel = (angle: number): string => {
        const directions = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'];
        const idx = Math.round(angle / 45) % 8;
        return directions[idx];
    };

    // ── Render ──────────────────────────────────────────────
    if (loading) {
        return (
            <SafeAreaView style={styles.screen} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                        <ArrowLeft size={24} color="#728D8E" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Arah Kiblat</Text>
                    <View style={{ width: 32 }} />
                </View>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#32665C" />
                    <Text style={styles.loadingText}>Mencari lokasi Anda...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (errorMsg) {
        return (
            <SafeAreaView style={styles.screen} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                        <ArrowLeft size={24} color="#728D8E" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Arah Kiblat</Text>
                    <View style={{ width: 32 }} />
                </View>
                <View style={styles.center}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <ArrowLeft size={24} color="#728D8E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Arah Kiblat</Text>
                <View style={{ width: 32 }} />
            </View>

            {/* Location info */}
            <View style={styles.locationCard}>
                <MapPin size={16} color="#32665C" />
                <Text style={styles.locationText}>{locationName}</Text>
            </View>

            {/* Compass */}
            <View style={styles.compassContainer}>
                <Animated.View
                    style={[
                        styles.compass,
                        { transform: [{ rotate: compassRotation }] },
                    ]}
                >
                    {/* Compass circle */}
                    <View style={styles.compassCircle}>
                        {/* Cardinal directions */}
                        <Text style={[styles.cardinalText, styles.north]}>U</Text>
                        <Text style={[styles.cardinalText, styles.south]}>S</Text>
                        <Text style={[styles.cardinalText, styles.east]}>T</Text>
                        <Text style={[styles.cardinalText, styles.west]}>B</Text>

                        {/* Compass tick marks */}
                        {Array.from({ length: 72 }).map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.tick,
                                    {
                                        transform: [
                                            { rotate: `${i * 5}deg` },
                                            { translateY: -(COMPASS_SIZE / 2 - 20) },
                                        ],
                                    },
                                    i % 18 === 0 ? styles.tickMajor : i % 9 === 0 ? styles.tickMinor : styles.tickSmall,
                                ]}
                            />
                        ))}

                        {/* Qibla indicator */}
                        {qiblaDirection !== null && (
                            <View
                                style={[
                                    styles.qiblaArrow,
                                    { transform: [{ rotate: qiblaRotation }] },
                                ]}
                            >
                                <View style={styles.qiblaNeedle} />
                                <View style={styles.kaabaContainer}>
                                    <KaabaIcon size={28} />
                                </View>
                            </View>
                        )}
                    </View>
                </Animated.View>

                {/* Center fixed indicator */}
                <View style={styles.centerDot}>
                    <ArrowBigUp size={24} color="#32665C" />
                </View>
            </View>

            {/* Info panel */}
            <View style={styles.infoPanel}>
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Arah Kompas</Text>
                        <Text style={styles.infoValue}>{Math.round(heading)}°</Text>
                        <Text style={styles.infoSub}>{getDirectionLabel(heading)}</Text>
                    </View>
                    <View style={styles.infoDivider} />
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Arah Kiblat</Text>
                        <Text style={styles.infoValue}>{qiblaDirection !== null ? `${qiblaDirection.toFixed(1)}°` : '-'}</Text>
                        <Text style={styles.infoSub}>
                            {qiblaDirection !== null ? getDirectionLabel(qiblaDirection) : '-'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Instruction */}
            <View style={styles.instructionCard}>
                <Text style={styles.instructionText}>
                    Putar HP Anda hingga tanda Ka'bah berada di atas (posisi utara). Pastikan tidak ada benda logam di sekitar untuk hasil yang akurat.
                </Text>
            </View>
        </SafeAreaView>
    );
}

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────
const BG = '#FDFBF7';
const TEAL = '#32665C';
const TEAL_LIGHT = '#728D8E';

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: BG,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        color: '#888',
        fontSize: 14,
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 20,
    },

    /* Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    iconBtn: {
        padding: 4,
    },

    /* Location */
    locationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F0F0',
        marginHorizontal: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
    },
    locationText: {
        fontSize: 14,
        color: TEAL,
        fontWeight: '600',
    },

    /* Compass */
    compassContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 24,
    },
    compass: {
        width: COMPASS_SIZE,
        height: COMPASS_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    compassCircle: {
        width: COMPASS_SIZE,
        height: COMPASS_SIZE,
        borderRadius: COMPASS_SIZE / 2,
        borderWidth: 3,
        borderColor: '#EAEBE8',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardinalText: {
        position: 'absolute',
        fontSize: 18,
        fontWeight: '800',
        color: TEAL_LIGHT,
    },
    north: {
        top: 28,
        color: '#D32F2F',
    },
    south: {
        bottom: 28,
    },
    east: {
        right: 28,
    },
    west: {
        left: 28,
    },
    tick: {
        position: 'absolute',
        width: 1,
        backgroundColor: '#ccc',
    },
    tickMajor: {
        height: 14,
        width: 2,
        backgroundColor: TEAL,
    },
    tickMinor: {
        height: 10,
        backgroundColor: TEAL_LIGHT,
    },
    tickSmall: {
        height: 6,
    },

    /* Qibla arrow */
    qiblaArrow: {
        position: 'absolute',
        width: 2,
        height: COMPASS_SIZE / 2 - 30,
        alignItems: 'center',
        bottom: COMPASS_SIZE / 2,
        transformOrigin: 'bottom',
    },
    qiblaNeedle: {
        width: 3,
        flex: 1,
        backgroundColor: TEAL,
        borderRadius: 2,
    },
    kaabaContainer: {
        position: 'absolute',
        top: -14,
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* Center dot */
    centerDot: {
        position: 'absolute',
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E8F0F0',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },

    /* Info panel */
    infoPanel: {
        marginHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#EAEBE8',
        padding: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    infoItem: {
        alignItems: 'center',
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: TEAL_LIGHT,
        fontWeight: '600',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 28,
        fontWeight: '800',
        color: TEAL,
    },
    infoSub: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    infoDivider: {
        width: 1,
        height: 50,
        backgroundColor: '#EAEBE8',
    },

    /* Instruction */
    instructionCard: {
        marginHorizontal: 20,
        marginTop: 16,
        padding: 16,
        backgroundColor: '#FFF8EE',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFEFD5',
    },
    instructionText: {
        fontSize: 13,
        color: '#8B7355',
        lineHeight: 20,
        textAlign: 'center',
    },
});
