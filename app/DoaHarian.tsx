import { useRouter } from 'expo-router';
import { ArrowLeft, RefreshCcw, Search, Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Doa {
    id: string;
    judul: string;
    arab: string;
    latin: string;
    terjemah: string;
}

export default function DoaHarian() {
    const router = useRouter();
    const [doas, setDoas] = useState<Doa[]>([]);
    const [filteredDoas, setFilteredDoas] = useState<Doa[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'semua' | 'favorit'>('semua');
    const [loading, setLoading] = useState(true);

    // In a real app, this would be persisted in AsyncStorage
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    const fetchDoas = async () => {
        setLoading(true);
        try {
            // Menggunakan API doa dari layanan gratis
            const res = await fetch('https://open-api.my.id/api/doa');
            const data = await res.json();
            setDoas(data);
            setFilteredDoas(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoas();
    }, []);

    useEffect(() => {
        let result = doas;

        // Filter tab
        if (activeTab === 'favorit') {
            result = result.filter(doa => favorites.has(doa.id));
        }

        // Filter search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(doa =>
                doa.judul.toLowerCase().includes(query) ||
                doa.latin.toLowerCase().includes(query) ||
                doa.terjemah.toLowerCase().includes(query)
            );
        }

        setFilteredDoas(result);
    }, [searchQuery, activeTab, doas, favorites]);

    const toggleFavorite = (id: string, e: any) => {
        e.stopPropagation(); // prevent card tap
        setFavorites(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const renderItem = ({ item, index }: { item: Doa; index: number }) => {
        const isFavorite = favorites.has(item.id);
        const displayIndex = index + 1;

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => router.push({
                    pathname: '/DetailDoa',
                    params: {
                        id: item.id,
                        title: item.judul,
                        arab: item.arab,
                        latin: item.latin,
                        arti: item.terjemah
                    }
                })}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.judul}</Text>
                    <TouchableOpacity onPress={(e) => toggleFavorite(item.id, e)} style={styles.starBtn}>
                        <Star size={20} color={isFavorite ? "#E2C675" : "#728D8E"} fill={isFavorite ? "#E2C675" : "transparent"} />
                    </TouchableOpacity>
                </View>

                {/* Potongan ayat Arab untuk preview (max 1 baris) */}
                <Text style={styles.arabPreview} numberOfLines={1}>{item.arab}</Text>

                <View style={styles.cardFooter}>
                    <Text style={styles.latinPreview} numberOfLines={2}>
                        {item.terjemah}
                    </Text>
                    <View style={styles.numberBadge}>
                        <Text style={styles.numberText}>#{displayIndex}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <ArrowLeft size={24} color="#728D8E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Doa Harian</Text>
                <TouchableOpacity onPress={fetchDoas} style={styles.iconBtn}>
                    <RefreshCcw size={22} color="#728D8E" />
                </TouchableOpacity>
            </View>

            <View style={styles.headerDivider} />

            {/* Search Box */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <Search size={20} color="#a0a0a0" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cari judul, arti, latin..."
                        placeholderTextColor="#a0a0a0"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Filter Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'semua' && styles.tabBtnActive]}
                    onPress={() => setActiveTab('semua')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.tabText, activeTab === 'semua' && styles.tabTextActive]}>Semua</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'favorit' && styles.tabBtnActive]}
                    onPress={() => setActiveTab('favorit')}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.tabText, activeTab === 'favorit' && styles.tabTextActive]}>
                        Favorit ({favorites.size})
                    </Text>
                </TouchableOpacity>
            </View>

            {/* List */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#728D8E" />
                    <Text style={styles.loadingText}>Memuat doa harian...</Text>
                </View>
            ) : filteredDoas.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.loadingText}>Tidak ada doa ditemukan.</Text>
                </View>
            ) : (
                <View style={styles.listContainer}>
                    <FlatList
                        data={filteredDoas}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}

const BG = '#FDFBF7';
const TEAL = '#728D8E';

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
    headerDivider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },

    /* Search */
    searchContainer: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#EAEBE8',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1a1a1a',
        padding: 0,
    },

    /* Tabs */
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 16,
        gap: 8,
    },
    tabBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#EAEBE8',
    },
    tabBtnActive: {
        backgroundColor: TEAL,
        borderColor: TEAL,
    },
    tabText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#fff',
    },

    /* List */
    listContainer: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        gap: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#EAEBE8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1a1a1a',
        flex: 1,
        marginRight: 10,
    },
    starBtn: {
        backgroundColor: '#F5F8F8',
        padding: 6,
        borderRadius: 8,
    },
    arabPreview: {
        fontFamily: 'NotoNaskhArabic',
        fontSize: 18,
        color: '#888',
        textAlign: 'right',
        writingDirection: 'rtl',
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 12,
    },
    latinPreview: {
        flex: 1,
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
    },
    numberBadge: {
        backgroundColor: '#E8F0F0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    numberText: {
        fontSize: 11,
        fontWeight: '700',
        color: TEAL,
    },
});
