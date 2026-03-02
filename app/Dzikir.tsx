import { useRouter } from 'expo-router';
import { ArrowLeft, Bookmark } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DzikirItem {
    type: string;
    arab: string;
    indo: string;
    ulang: string;
}

export default function Dzikir() {
    const router = useRouter();
    const [dzikirData, setDzikirData] = useState<DzikirItem[]>([]);
    const [filteredData, setFilteredData] = useState<DzikirItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [mainTab, setMainTab] = useState<'harian' | 'duha'>('harian');
    const [subTab, setSubTab] = useState<'semua' | 'pagi' | 'sore' | 'solat'>('semua');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = 'https://muslim-api-three.vercel.app/v1/dzikir';
                const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`, {
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                });

                const proxyJson = await res.json();

                // Ekstrak data aslinya dari dalam properti `contents` proxy
                let json;
                try {
                    json = JSON.parse(proxyJson.contents);
                } catch (e) {
                    json = proxyJson; // Fallback kalau ternyata tidak diproxy
                }

                console.log("Hasil respons API:", json);

                // Cek kalau formatnya langsung Array
                if (Array.isArray(json)) {
                    setDzikirData(json);
                    setFilteredData(json);
                }
                // Cek kalau formatnya dibungkus object 'data'
                else if (json && json.data && Array.isArray(json.data)) {
                    setDzikirData(json.data);
                    setFilteredData(json.data);
                }
                else {
                    setErrorMsg("Format respons API tidak sesuai.");
                }
            } catch (error: any) {
                console.error(error);
                setErrorMsg(error.message || "Gagal mengambil data dzikir.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (subTab === 'semua') {
            setFilteredData(dzikirData);
        } else {
            setFilteredData(dzikirData.filter(d => d.type.toLowerCase() === subTab));
        }
    }, [subTab, dzikirData]);

    const handleDuhaPress = () => {
        Alert.alert("Informasi", "Fitur Dzikir Duha masih dalam tahap pengembangan (Develop).");
    };

    const renderItem = ({ item, index }: { item: DzikirItem; index: number }) => {
        const displayIndex = index + 1;

        // Kapitalisasi awal untuk label tipe
        const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);

        return (
            <View style={styles.card}>
                {/* Header Card */}
                <View style={styles.cardHeader}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.dzikirNumber}>Dzikir #{displayIndex}</Text>
                        <View style={styles.typeBadge}>
                            <Text style={styles.typeText}>{typeLabel}</Text>
                        </View>
                    </View>
                    <View style={styles.ulangBadge}>
                        <Text style={styles.ulangText}>{item.ulang}</Text>
                    </View>
                </View>

                {/* Ayat Arab */}
                <Text style={styles.arabText}>{item.arab}</Text>

                {/* Terjemahan Indo */}
                <Text style={styles.indoText}>{item.indo}</Text>

                {/* Footer Bookmark */}
                <View style={styles.cardFooter}>
                    <TouchableOpacity style={styles.saveBtn}>
                        <Bookmark size={14} color="#728D8E" />
                        <Text style={styles.saveText}>Simpan</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <ArrowLeft size={24} color="#728D8E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Dzikir</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <Bookmark size={22} color="#728D8E" />
                </TouchableOpacity>
            </View>

            {/* Main Tabs (Dzikir Harian vs Duha) */}
            <View style={styles.mainTabsContainer}>
                <TouchableOpacity
                    style={[styles.mainTab, mainTab === 'harian' && styles.mainTabActive]}
                    onPress={() => setMainTab('harian')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.mainTabText, mainTab === 'harian' && styles.mainTabTextActive]}>
                        Dzikir Harian
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.mainTab, mainTab === 'duha' && styles.mainTabActive]}
                    onPress={handleDuhaPress}
                    activeOpacity={0.7}
                >
                    <View style={styles.duhaTabContainer}>
                        <Text style={[styles.mainTabText, mainTab === 'duha' && styles.mainTabTextActive]}>
                            Dzikir Duha
                        </Text>
                        <View style={styles.developBadge}>
                            <Text style={styles.developText}>DEVELOP</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Sub Tabs */}
            <View style={styles.subTabsContainer}>
                {['semua', 'pagi', 'sore', 'solat'].map((tabStr) => (
                    <TouchableOpacity
                        key={tabStr}
                        style={[styles.subTab, subTab === tabStr && styles.subTabActive, tabStr === 'solat' && { borderRightWidth: 0 }]}
                        onPress={() => setSubTab(tabStr as any)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.subTabText, subTab === tabStr && styles.subTabTextActive]}>
                            {tabStr.charAt(0).toUpperCase() + tabStr.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* List Content */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#728D8E" />
                    <Text style={styles.loadingText}>Memuat dzikir...</Text>
                </View>
            ) : errorMsg ? (
                <View style={styles.center}>
                    <Text style={styles.errorText}>Error: {errorMsg}</Text>
                </View>
            ) : filteredData.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.loadingText}>Tidak ada dzikir ditemukan.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(_, idx) => idx.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

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

    /* Main Tabs */
    mainTabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: '#EAEBE8',
    },
    mainTab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    mainTabActive: {
        borderBottomColor: TEAL,
        backgroundColor: '#EAEBE8',
    },
    mainTabText: {
        fontSize: 14,
        fontWeight: '600',
        color: TEAL_LIGHT,
    },
    mainTabTextActive: {
        color: TEAL,
    },
    duhaTabContainer: {
        alignItems: 'center',
    },
    developBadge: {
        backgroundColor: '#FFF2E5',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#FFDDB3',
    },
    developText: {
        fontSize: 9,
        fontWeight: '700',
        color: '#E58A35',
    },

    /* Sub Tabs */
    subTabsContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 16,
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EAEBE8',
        overflow: 'hidden',
    },
    subTab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#EAEBE8',
    },
    subTabActive: {
        backgroundColor: TEAL,
    },
    subTabText: {
        fontSize: 12,
        fontWeight: '600',
        color: TEAL_LIGHT,
    },
    subTabTextActive: {
        color: '#fff',
    },

    /* List Content */
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EAEBE8',
        padding: 16,
        paddingBottom: 24,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dzikirNumber: {
        fontSize: 12,
        fontWeight: '700',
        color: TEAL_LIGHT,
    },
    typeBadge: {
        backgroundColor: '#E8F0F0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    typeText: {
        fontSize: 11,
        fontWeight: '600',
        color: TEAL,
    },
    ulangBadge: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    ulangText: {
        fontSize: 11,
        color: '#666',
        fontWeight: '600',
    },
    arabText: {
        fontFamily: 'NotoNaskhArabic',
        fontSize: 24,
        color: '#1a1a1a',
        textAlign: 'right',
        writingDirection: 'rtl',
        lineHeight: 44,
        marginBottom: 16,
    },
    indoText: {
        fontSize: 14,
        color: '#444',
        marginBottom: 20,
        lineHeight: 22,
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        paddingTop: 16,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F0F0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    saveText: {
        fontSize: 12,
        fontWeight: '600',
        color: TEAL_LIGHT,
    },
});