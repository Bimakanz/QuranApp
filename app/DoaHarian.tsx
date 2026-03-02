import { useRouter } from 'expo-router';
import { ArrowLeft, Bookmark, BookmarkCheck, Search } from 'lucide-react-native';
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
    const [loading, setLoading] = useState(true);

    // Bookmark state
    const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
    const [showSaved, setShowSaved] = useState(false);

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

        // Filter search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(doa =>
                doa.judul.toLowerCase().includes(query) ||
                doa.latin.toLowerCase().includes(query) ||
                doa.terjemah.toLowerCase().includes(query)
            );
        }

        // Filter saved
        if (showSaved) {
            result = result.filter(doa => savedItems.has(doa.id));
        }

        setFilteredDoas(result);
    }, [searchQuery, showSaved, doas, savedItems]);

    const toggleSave = (id: string, e: any) => {
        e.stopPropagation(); // prevent card tap
        setSavedItems(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const renderItem = ({ item, index }: { item: Doa; index: number }) => {
        const isSaved = savedItems.has(item.id);
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
                {/* Header Card */}
                <View style={styles.cardHeader}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.doaNumber}>Doa #{displayIndex}</Text>
                        <View style={styles.typeBadge}>
                            <Text style={styles.typeText} numberOfLines={1}>{item.judul}</Text>
                        </View>
                    </View>
                </View>

                {/* Ayat Arab */}
                <Text style={styles.arabText}>{item.arab}</Text>

                {/* Terjemahan Indo */}
                <Text style={styles.indoText}>{item.terjemah}</Text>

                {/* Footer Bookmark */}
                <View style={styles.cardFooter}>
                    <TouchableOpacity
                        style={[styles.saveBtn, isSaved && styles.saveBtnActive]}
                        onPress={(e) => toggleSave(item.id, e)}
                        activeOpacity={0.7}
                    >
                        {isSaved
                            ? <BookmarkCheck size={14} color="#fff" />
                            : <Bookmark size={14} color="#728D8E" />
                        }
                        <Text style={[styles.saveText, isSaved && styles.saveTextActive]}>
                            {isSaved ? 'Tersimpan' : 'Simpan'}
                        </Text>
                    </TouchableOpacity>
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
                <TouchableOpacity
                    onPress={() => setShowSaved(!showSaved)}
                    style={[styles.headerBookmark, showSaved && styles.headerBookmarkActive]}
                    activeOpacity={0.7}
                >
                    <Bookmark
                        size={22}
                        color={showSaved ? '#E2C675' : '#728D8E'}
                        fill={showSaved ? '#E2C675' : 'transparent'}
                    />
                    {savedItems.size > 0 && (
                        <View style={styles.badgeCount}>
                            <Text style={styles.badgeCountText}>{savedItems.size}</Text>
                        </View>
                    )}
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

    headerBookmark: {
        padding: 8,
    },
    headerBookmarkActive: {
        backgroundColor: 'transparent',
    },
    badgeCount: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: '#E2C675',
        borderRadius: 10,
        minWidth: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    badgeCountText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold',
        paddingHorizontal: 3,
    },

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
        alignItems: 'center',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    doaNumber: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    typeBadge: {
        backgroundColor: '#E8F0F0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        flexShrink: 1,
    },
    typeText: {
        fontSize: 11,
        fontWeight: '600',
        color: TEAL,
    },
    arabText: {
        fontFamily: 'NotoNaskhArabic',
        fontSize: 22,
        color: '#1a1a1a',
        textAlign: 'right',
        writingDirection: 'rtl',
        lineHeight: 38,
        marginBottom: 16,
    },
    indoText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 20,
        marginBottom: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 12,
    },
    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F8F8',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    saveBtnActive: {
        backgroundColor: TEAL,
    },
    saveText: {
        fontSize: 12,
        fontWeight: '600',
        color: TEAL,
    },
    saveTextActive: {
        color: '#fff',
    },
});
