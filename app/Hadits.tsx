import { useRouter } from 'expo-router';
import { ArrowLeft, Bookmark, BookmarkCheck, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
interface HadithItem {
    number: number;
    arab: string;
    id: string; // terjemahan Indonesia
}

interface BookInfo {
    name: string;
    id: string;
    available: number;
}

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────
const API_BASE = 'https://api.hadith.gading.dev';

const BOOKS: BookInfo[] = [
    { name: 'Bukhari', id: 'bukhari', available: 6638 },
    { name: 'Muslim', id: 'muslim', available: 4930 },
    { name: 'Abu Daud', id: 'abu-daud', available: 4419 },
    { name: 'Tirmidzi', id: 'tirmidzi', available: 3625 },
    { name: 'Nasai', id: 'nasai', available: 5364 },
    { name: 'Ibnu Majah', id: 'ibnu-majah', available: 4285 },
    { name: 'Ahmad', id: 'ahmad', available: 4305 },
    { name: 'Darimi', id: 'darimi', available: 2949 },
    { name: 'Malik', id: 'malik', available: 1587 },
];

const PAGE_SIZE = 20;

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────
export default function Hadits() {
    const router = useRouter();

    const [activeBook, setActiveBook] = useState<BookInfo>(BOOKS[0]);
    const [hadiths, setHadiths] = useState<HadithItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Search
    const [searchQuery, setSearchQuery] = useState('');

    // Bookmark state
    const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
    const [showSaved, setShowSaved] = useState(false);

    // Buat unique key
    const getHadithKey = (item: HadithItem) => `${activeBook.id}-${item.number}`;

    const toggleSave = (item: HadithItem) => {
        const key = getHadithKey(item);
        setSavedItems(prev => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    // ── Fetch hadits ──────────────────────────────────────
    const fetchHadiths = async (bookId: string, pageNum: number, append = false) => {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        try {
            const start = (pageNum - 1) * PAGE_SIZE + 1;
            const end = pageNum * PAGE_SIZE;
            const res = await fetch(`${API_BASE}/books/${bookId}?range=${start}-${end}`);
            const json = await res.json();

            if (json.data && json.data.hadiths) {
                const newData = json.data.hadiths as HadithItem[];
                if (append) {
                    setHadiths(prev => [...prev, ...newData]);
                } else {
                    setHadiths(newData);
                }
                setHasMore(end < (json.data.available || activeBook.available));
            } else {
                if (!append) setErrorMsg('Format data tidak sesuai.');
            }
        } catch (error: any) {
            console.error(error);
            if (!append) setErrorMsg(error.message || 'Gagal memuat hadits.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        setHadiths([]);
        setPage(1);
        setHasMore(true);
        setErrorMsg(null);
        setSearchQuery('');
        setShowSaved(false);
        fetchHadiths(activeBook.id, 1);
    }, [activeBook]);

    const loadMore = () => {
        if (!loadingMore && hasMore && !showSaved) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchHadiths(activeBook.id, nextPage, true);
        }
    };

    // ── Filtered data ─────────────────────────────────────
    const getFilteredData = () => {
        let result = hadiths;

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(h =>
                h.id.toLowerCase().includes(q) ||
                h.arab.includes(searchQuery) ||
                String(h.number).includes(q)
            );
        }

        if (showSaved) {
            result = result.filter(h => savedItems.has(getHadithKey(h)));
        }

        return result;
    };

    const filteredData = getFilteredData();

    // ── Render hadith card ────────────────────────────────
    const renderItem = ({ item }: { item: HadithItem }) => {
        const isSaved = savedItems.has(getHadithKey(item));
        // Potong teks Arab untuk preview (max ~120 karakter)
        const arabPreview = item.arab.length > 120 ? item.arab.slice(0, 120) + '...' : item.arab;
        // Potong terjemahan untuk preview (max ~100 karakter)
        const terjemahPreview = item.id.length > 100 ? item.id.slice(0, 100) + '...' : item.id;

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => router.push({
                    pathname: '/DetailHadits',
                    params: {
                        number: String(item.number),
                        arab: item.arab,
                        terjemah: item.id,
                        book: activeBook.name,
                    }
                })}
            >
                {/* Header: Judul + Nomor */}
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                        {getHadithTitle(item)}
                    </Text>
                    <View style={styles.numberBadge}>
                        <Text style={styles.numberText}>#{item.number}</Text>
                    </View>
                </View>

                {/* Teks Arab */}
                <Text style={styles.arabText} numberOfLines={3}>{arabPreview}</Text>

                {/* Terjemahan */}
                <Text style={styles.terjemahText} numberOfLines={2}>{terjemahPreview}</Text>

                {/* Footer: Simpan */}
                <View style={styles.cardFooter}>
                    <TouchableOpacity
                        style={[styles.saveBtn, isSaved && styles.saveBtnActive]}
                        onPress={(e) => { e.stopPropagation(); toggleSave(item); }}
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

    // Mengambil judul singkat dari terjemahan
    const getHadithTitle = (item: HadithItem): string => {
        // Ambil kalimat pertama atau 50 karakter pertama sebagai judul
        const text = item.id;
        const firstSentence = text.split(/[.;:]/)[0];
        if (firstSentence.length > 50) return firstSentence.slice(0, 47) + '...';
        return firstSentence;
    };

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.loadMoreContainer}>
                <ActivityIndicator size="small" color="#728D8E" />
                <Text style={styles.loadMoreText}>Memuat lebih banyak...</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <ArrowLeft size={24} color="#728D8E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{showSaved ? 'Hadits Tersimpan' : 'Hadits'}</Text>
                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => setShowSaved(!showSaved)}
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

            {/* ── Search Bar ── */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <Search size={18} color="#a0a0a0" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cari judul hadits..."
                        placeholderTextColor="#a0a0a0"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* ── Book Tabs ── */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.bookTabsContainer}
                style={styles.bookTabsScroll}
            >
                {BOOKS.map((book) => (
                    <TouchableOpacity
                        key={book.id}
                        style={[styles.bookTab, activeBook.id === book.id && styles.bookTabActive]}
                        onPress={() => setActiveBook(book)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.bookTabText, activeBook.id === book.id && styles.bookTabTextActive]}>
                            {book.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* ── List ── */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#728D8E" />
                    <Text style={styles.loadingText}>Memuat hadits {activeBook.name}...</Text>
                </View>
            ) : errorMsg ? (
                <View style={styles.center}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
            ) : filteredData.length === 0 ? (
                <View style={styles.center}>
                    <Bookmark size={48} color="#ddd" />
                    <Text style={styles.loadingText}>
                        {showSaved ? 'Belum ada hadits yang disimpan.' : 'Tidak ada hadits ditemukan.'}
                    </Text>
                    {showSaved && (
                        <Text style={styles.emptySubText}>
                            Tekan tombol "Simpan" di setiap hadits untuk menyimpannya.
                        </Text>
                    )}
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => `${activeBook.id}-${item.number}`}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                />
            )}
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

    /* Search */
    searchContainer: {
        paddingHorizontal: 20,
        paddingBottom: 12,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#EAEBE8',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1a1a1a',
        padding: 0,
    },

    /* Book tabs */
    bookTabsScroll: {
        flexGrow: 0,
        minHeight: 44,
        maxHeight: 44,
        marginBottom: 12,
    },
    bookTabsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 6,
        gap: 8,
        alignItems: 'center',
    },
    bookTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#EAEBE8',
    },
    bookTabActive: {
        backgroundColor: TEAL,
        borderColor: TEAL,
    },
    bookTabText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },
    bookTabTextActive: {
        color: '#fff',
    },

    /* List */
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        gap: 12,
    },

    /* Card */
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#EAEBE8',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1a1a1a',
        flex: 1,
        marginRight: 10,
    },
    numberBadge: {
        backgroundColor: '#E8F0F0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    numberText: {
        fontSize: 12,
        fontWeight: '700',
        color: TEAL,
    },
    arabText: {
        fontFamily: 'NotoNaskhArabic',
        fontSize: 20,
        color: '#1a1a1a',
        textAlign: 'right',
        writingDirection: 'rtl',
        lineHeight: 40,
        marginBottom: 12,
    },
    terjemahText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        paddingTop: 12,
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
    saveBtnActive: {
        backgroundColor: TEAL,
    },
    saveText: {
        fontSize: 12,
        fontWeight: '600',
        color: TEAL_LIGHT,
    },
    saveTextActive: {
        color: '#fff',
    },
    badgeCount: {
        position: 'absolute',
        top: -4,
        right: -6,
        backgroundColor: '#E2C675',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeCountText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#fff',
    },
    emptySubText: {
        fontSize: 12,
        color: '#aaa',
        textAlign: 'center',
        paddingHorizontal: 40,
        marginTop: 4,
    },
    loadMoreContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    loadMoreText: {
        fontSize: 13,
        color: '#888',
    },
});
