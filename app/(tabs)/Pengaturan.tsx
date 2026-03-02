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
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Pengaturan() {
    const router = useRouter();
    const [isDarkMode, setIsDarkMode] = useState(false);

    const SettingItem = ({
        icon,
        title,
        subtitle,
        onPress,
        rightElement,
        isLast = false,
        hideChevron = false
    }: any) => (
        <View>
            <TouchableOpacity
                style={styles.settingItem}
                onPress={onPress}
                disabled={!onPress}
                activeOpacity={0.7}
            >
                <View style={styles.settingIconWrapper}>
                    {icon}
                </View>
                <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>{title}</Text>
                    {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
                </View>
                {rightElement ? (
                    rightElement
                ) : (
                    !hideChevron && <ChevronRight size={20} color="#B0B0B0" />
                )}
            </TouchableOpacity>
            {!isLast && <View style={styles.divider} />}
        </View>
    );

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Pengaturan</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Account Section */}
                <View style={[styles.sectionCard, styles.accountCard]}>
                    <View style={styles.accountInfo}>
                        <View style={styles.accountIconWrapper}>
                            <User size={28} color="#A0AAB2" />
                        </View>
                        <View style={styles.accountTextContainer}>
                            <Text style={styles.accountTitle}>Masuk Akun</Text>
                            <Text style={styles.accountSubtitle}>Sync bookmark & progress</Text>
                            <View style={styles.badgeWrapper}>
                                <Text style={styles.badgeText}>DEVELOP</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.loginBtn}>
                        <LogOut size={16} color="#fff" style={{ marginRight: 6 }} />
                        <Text style={styles.loginBtnText}>Masuk</Text>
                    </TouchableOpacity>
                </View>

                {/* Notifikasi */}
                <Text style={styles.sectionTitle}>NOTIFIKASI</Text>
                <View style={styles.sectionCard}>
                    <SettingItem
                        icon={<Bell size={20} color="#8DA3A4" />}
                        title="Pengaturan Notifikasi"
                        subtitle="Waktu sholat, ayat harian"
                        onPress={() => router.push('/Notifikasi')}
                        isLast={true}
                    />
                </View>

                {/* Tampilan */}
                <Text style={styles.sectionTitle}>TAMPILAN</Text>
                <View style={styles.sectionCard}>
                    <SettingItem
                        icon={<Moon size={20} color="#8DA3A4" />}
                        title="Mode Gelap"
                        subtitle="Tampilan lebih nyaman di malam hari"
                        rightElement={
                            <Switch
                                trackColor={{ false: '#E0E0E0', true: '#728D8E' }}
                                thumbColor="#fff"
                                ios_backgroundColor="#E0E0E0"
                                onValueChange={() => setIsDarkMode(!isDarkMode)}
                                value={isDarkMode}
                                style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                            />
                        }
                    />
                    <SettingItem
                        icon={<Palette size={20} color="#8DA3A4" />}
                        title="Ukuran Font Arab"
                        subtitle="Sedang"
                        isLast={true}
                        onPress={() => { }}
                    />
                </View>

                {/* Dukungan */}
                <Text style={styles.sectionTitle}>DUKUNGAN</Text>
                <View style={styles.sectionCard}>
                    <SettingItem
                        icon={<Heart size={20} color="#8DA3A4" />}
                        title="Dukung Developer"
                        subtitle="Kontribusi untuk biaya maintenance & fitur baru"
                        onPress={() => router.push('/Donasi')}
                    />
                    <SettingItem
                        icon={<Star size={20} color="#8DA3A4" />}
                        title="Beri Rating"
                        subtitle="Bantu kami dengan memberikan rating"
                        onPress={() => { }}
                    />
                    <SettingItem
                        icon={<Share2 size={20} color="#8DA3A4" />}
                        title="Bagikan Aplikasi"
                        subtitle="Ajak teman menggunakan aplikasi ini"
                        onPress={() => { }}
                    />
                    <SettingItem
                        icon={<Mail size={20} color="#8DA3A4" />}
                        title="Kirim Feedback"
                        subtitle="Sampaikan saran dan masukan"
                        onPress={() => { }}
                        isLast={true}
                    />
                </View>

                {/* Tentang */}
                <Text style={styles.sectionTitle}>TENTANG</Text>
                <View style={styles.sectionCard}>
                    <SettingItem
                        icon={<Info size={20} color="#8DA3A4" />}
                        title="Tentang Aplikasi"
                        subtitle="Versi 1.0.0"
                        onPress={() => { }}
                    />
                    <SettingItem
                        icon={<ShieldCheck size={20} color="#8DA3A4" />}
                        title="Kebijakan Privasi"
                        onPress={() => { }}
                    />
                    <SettingItem
                        icon={<CircleHelp size={20} color="#8DA3A4" />}
                        title="Bantuan & FAQ"
                        onPress={() => { }}
                        isLast={true}
                    />
                </View>

                {/* Footer Info */}
                <View style={styles.footerContainer}>
                    <Text style={styles.footerTextAppName}>Quran Pesat v1.0.0</Text>
                    <View style={styles.footerMadeWith}>
                        <Text style={styles.footerTextLight}>Made with </Text>
                        <Heart size={14} color="#E25C5C" fill="#E25C5C" />
                        <Text style={styles.footerTextLight}> for Muslims</Text>
                    </View>
                </View>

                {/* Spacer for bottom tab */}
                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

// LIGHT THEME COLORS
const BG = '#FDFBF7';
const CARD_BG = '#F3F5F4';
const TEXT_H = '#1a1a1a';
const TEXT_P = '#9E9E9E';
const TEAL = '#728D8E';

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: BG,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: TEXT_H,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#999',
        marginTop: 24,
        marginBottom: 8,
        marginLeft: 4,
        letterSpacing: 0.5,
    },
    sectionCard: {
        backgroundColor: CARD_BG,
        borderRadius: 16,
        paddingHorizontal: 16,
    },

    /* Account Card Specifics */
    accountCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        marginTop: 8,
    },
    accountInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    accountIconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#EAEBE8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    accountTextContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    accountTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: TEXT_H,
    },
    accountSubtitle: {
        fontSize: 13,
        color: TEXT_P,
        marginTop: 2,
        marginBottom: 4,
    },
    badgeWrapper: {
        backgroundColor: 'rgba(226, 198, 117, 0.2)', // E2C675 with opacity
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(226, 198, 117, 0.4)',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#D4B04C',
    },
    loginBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: TEAL,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        marginLeft: 12,
    },
    loginBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },

    /* List Setting Item */
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    settingIconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#EAEBE8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    settingTextContainer: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 15,
        color: TEXT_H,
        fontWeight: '500',
    },
    settingSubtitle: {
        fontSize: 13,
        color: TEXT_P,
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#EAEBE8',
        marginLeft: 50, // aligns with text
    },

    /* Footer */
    footerContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    footerTextAppName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#A0A0A0',
        marginBottom: 4,
    },
    footerMadeWith: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerTextLight: {
        fontSize: 12,
        color: '#B0B0B0',
    },
});
