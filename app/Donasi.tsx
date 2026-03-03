import { useRouter } from 'expo-router';
import { ArrowLeft, Share2 } from 'lucide-react-native';
import React from 'react';
import {
    Image,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Donasi() {
    const router = useRouter();

    const handleOpenSaweria = () => {
        Linking.openURL('https://saweria.co');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FDFBF7' }} edges={['top']}>

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} color="#728D8E" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#1a1a1a' }}>Dukung Developer</Text>
                <TouchableOpacity style={{ padding: 4 }}>
                    <Share2 size={20} color="#728D8E" />
                </TouchableOpacity>
            </View>
            <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.05)' }} />

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>

                {/* Milestone Support */}
                <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: '#EAEBE8', paddingBottom: 24 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#1a1a1a', marginBottom: 6 }}>Milestone Dukungan</Text>
                    <Text style={{ fontSize: 12, color: '#666', lineHeight: 18, marginBottom: 20 }}>
                        QuranApp adalah aplikasi gratis tanpa iklan yang dibuat dengan penuh cinta
                    </Text>

                    <View style={{ backgroundColor: '#1a1a1a', borderRadius: 8, marginLeft: 4, marginTop: 4 }}>
                        <View style={{
                            backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#1a1a1a',
                            borderRadius: 8, padding: 16,
                            transform: [{ translateX: -4 }, { translateY: -4 }],
                        }}>
                            <Text style={{ fontFamily: 'monospace', fontSize: 14, color: '#1a1a1a', marginBottom: 16 }}>
                                Bayar server dan akomodasi
                            </Text>
                            <View style={{ height: 24, borderWidth: 1, borderColor: '#1a1a1a', borderRadius: 6, backgroundColor: '#fff', marginBottom: 16, overflow: 'hidden' }}>
                                <View style={{ height: '100%', width: '0%', backgroundColor: '#4A90E2' }} />
                            </View>
                            <Text style={{ fontFamily: 'monospace', fontSize: 14, color: '#1a1a1a', textAlign: 'center' }}>
                                Rp0  /  Rp50.000.000
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Section Title */}
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#888', marginBottom: 12, marginLeft: 4, letterSpacing: 0.5 }}>
                    DUKUNGAN VIA SAWERIA
                </Text>

                {/* QR Code Card */}
                <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: '#EAEBE8' }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 }}>Scan QR atau buka Saweria</Text>
                    <Text style={{ fontSize: 12, color: '#666', marginBottom: 24 }}>
                        Semua dukungan akan masuk langsung ke akun developer.
                    </Text>

                    <View style={{ alignItems: 'center', marginBottom: 24 }}>
                        <View style={{ backgroundColor: '#1a1a1a', borderRadius: 12, paddingRight: 6, paddingBottom: 6 }}>
                            <Image
                                source={require('../assets/images/Qrcode.jpg')}
                                style={{ width: 200, height: 200, borderRadius: 20, borderWidth: 1, borderColor: '#1a1a1a', backgroundColor: '#fff', transform: [{ translateX: -3 }, { translateY: -3 }] }}
                                resizeMode="cover"
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={{ backgroundColor: '#728D8E', paddingVertical: 14, borderRadius: 8, alignItems: 'center' }}
                        onPress={handleOpenSaweria}
                        activeOpacity={0.8}
                    >
                        <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Buka Saweria</Text>
                    </TouchableOpacity>
                </View>

                {/* Notes Card */}
                <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: '#EAEBE8' }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#1a1a1a', marginBottom: 6 }}>Catatan Development & Transparansi</Text>
                    <Text style={{ fontSize: 12, color: '#555', lineHeight: 20, marginTop: 6 }}>1. Ini dukungan untuk developer, bukan penggalangan donasi lembaga.</Text>
                    <Text style={{ fontSize: 12, color: '#555', lineHeight: 20, marginTop: 6 }}>2. Penyaluran ke pihak lain sepenuhnya keputusan pribadi developer.</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
