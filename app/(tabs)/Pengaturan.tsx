import { useRouter } from 'expo-router';
import {
    Bell,
    ChevronRight,
    CircleHelp,
    Heart,
    Info,
    LogOut,
    Mail,
    Moon,
    Palette,
    Share2,
    ShieldCheck,
    Star,
    User
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BG = '#F5F0E8';
const CARD_BG = '#F3F5F4';
const TEXT_H = '#1a1a1a';
const TEXT_P = '#9E9E9E';
const TEAL = '#728D8E';

export default function Pengaturan() {
    const router = useRouter();
    const [isDarkMode, setIsDarkMode] = useState(false);

    const SettingItem = ({ icon, title, subtitle, onPress, rightElement, isLast = false, hideChevron = false }: any) => (
        <View>
            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}
                onPress={onPress}
                disabled={!onPress}
                activeOpacity={0.7}
            >
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#EAEBE8', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                    {icon}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, color: TEXT_H, fontWeight: '500' }}>{title}</Text>
                    {subtitle && <Text style={{ fontSize: 13, color: TEXT_P, marginTop: 4 }}>{subtitle}</Text>}
                </View>
                {rightElement ? rightElement : (!hideChevron && <ChevronRight size={20} color="#B0B0B0" />)}
            </TouchableOpacity>
            {!isLast && <View style={{ height: 1, backgroundColor: '#EAEBE8', marginLeft: 50 }} />}
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>

            {/* Header */}
            <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: TEXT_H }}>Pengaturan</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>

                {/* Account Card */}
                <View style={{ backgroundColor: CARD_BG, borderRadius: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, marginTop: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#EAEBE8', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                            <User size={28} color="#A0AAB2" />
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: TEXT_H }}>Masuk Akun</Text>
                            <Text style={{ fontSize: 13, color: TEXT_P, marginTop: 2, marginBottom: 4 }}>Sync bookmark & progress</Text>
                            <View style={{ backgroundColor: 'rgba(226,198,117,0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(226,198,117,0.4)' }}>
                                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#D4B04C' }}>DEVELOP</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: TEAL, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, marginLeft: 12 }}>
                        <LogOut size={16} color="#fff" style={{ marginRight: 6 }} />
                        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>Masuk</Text>
                    </TouchableOpacity>
                </View>

                {/* Notifikasi */}
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#999', marginTop: 24, marginBottom: 8, marginLeft: 4, letterSpacing: 0.5 }}>NOTIFIKASI</Text>
                <View style={{ backgroundColor: CARD_BG, borderRadius: 16, paddingHorizontal: 16 }}>
                    <SettingItem icon={<Bell size={20} color="#8DA3A4" />} title="Pengaturan Notifikasi" subtitle="Waktu sholat, ayat harian" onPress={() => router.push('/Notifikasi')} isLast={true} />
                </View>

                {/* Tampilan */}
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#999', marginTop: 24, marginBottom: 8, marginLeft: 4, letterSpacing: 0.5 }}>TAMPILAN</Text>
                <View style={{ backgroundColor: CARD_BG, borderRadius: 16, paddingHorizontal: 16 }}>
                    <SettingItem
                        icon={<Moon size={20} color="#8DA3A4" />}
                        title="Mode Gelap"
                        subtitle="Tampilan lebih nyaman di malam hari"
                        rightElement={
                            <Switch trackColor={{ false: '#E0E0E0', true: TEAL }} thumbColor="#fff" ios_backgroundColor="#E0E0E0"
                                onValueChange={() => setIsDarkMode(!isDarkMode)} value={isDarkMode}
                                style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                            />
                        }
                    />
                    <SettingItem icon={<Palette size={20} color="#8DA3A4" />} title="Ukuran Font Arab" subtitle="Sedang" isLast={true} onPress={() => { }} />
                </View>

                {/* Dukungan */}
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#999', marginTop: 24, marginBottom: 8, marginLeft: 4, letterSpacing: 0.5 }}>DUKUNGAN</Text>
                <View style={{ backgroundColor: CARD_BG, borderRadius: 16, paddingHorizontal: 16 }}>
                    <SettingItem icon={<Heart size={20} color="#8DA3A4" />} title="Dukung Developer" subtitle="Kontribusi untuk biaya maintenance & fitur baru" onPress={() => router.push('/Donasi')} />
                    <SettingItem icon={<Star size={20} color="#8DA3A4" />} title="Beri Rating" subtitle="Bantu kami dengan memberikan rating" onPress={() => { }} />
                    <SettingItem icon={<Share2 size={20} color="#8DA3A4" />} title="Bagikan Aplikasi" subtitle="Ajak teman menggunakan aplikasi ini" onPress={() => { }} />
                    <SettingItem icon={<Mail size={20} color="#8DA3A4" />} title="Kirim Feedback" subtitle="Sampaikan saran dan masukan" onPress={() => { }} isLast={true} />
                </View>

                {/* Tentang */}
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#999', marginTop: 24, marginBottom: 8, marginLeft: 4, letterSpacing: 0.5 }}>TENTANG</Text>
                <View style={{ backgroundColor: CARD_BG, borderRadius: 16, paddingHorizontal: 16 }}>
                    <SettingItem icon={<Info size={20} color="#8DA3A4" />} title="Tentang Aplikasi" subtitle="Versi 1.0.0" onPress={() => { }} />
                    <SettingItem icon={<ShieldCheck size={20} color="#8DA3A4" />} title="Kebijakan Privasi" onPress={() => { }} />
                    <SettingItem icon={<CircleHelp size={20} color="#8DA3A4" />} title="Bantuan & FAQ" onPress={() => { }} isLast={true} />
                </View>

                {/* Footer */}
                <View style={{ alignItems: 'center', marginTop: 40, marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#A0A0A0', marginBottom: 4 }}>Quran Pesat v1.0.0</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, color: '#B0B0B0' }}>Made with </Text>
                        <Heart size={14} color="#E25C5C" fill="#E25C5C" />
                        <Text style={{ fontSize: 12, color: '#B0B0B0' }}> for Muslims</Text>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
