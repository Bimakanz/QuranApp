import { SkeletonCard } from '@/components/SkeletonLoader';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bookmark, BookmarkCheck, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



interface HadithItem {
    number: number;
    arab: string;
    id: string;
}

interface BookInfo {
    name: string;
    id: string;
    available: number;
}

const API_BASE = 'https://api.hadith.gading.dev';
const TEAL = '#32665C';
const TEAL_LIGHT = '#728D8E';
const BG = '#F5F0E8';


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

export default function Hadits() {
    const router = useRouter();

    const [activeBook, setActiveBook] = useState<BookInfo>(BOOKS[0]);
    const [hadiths, setHadiths] = useState<HadithItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSaved, setShowSaved] = useState(false);

    const { isBookmarked, toggle: toggleSaveById, bookmarks } = useBookmarks('hadits');
    const getHadithKey = (item: HadithItem) => `${activeBook.id}-${item.number}`;

    const toggleSave = (item: HadithItem) => {
        toggleSaveById(getHadithKey(item));
    };


    const fetchHadiths = async (bookId: string, pageNum: number, append = false) => {
        if (pageNum === 1) setLoading(true); else setLoadingMore(true);
        try {
            const start = (pageNum - 1) * PAGE_SIZE + 1;
            const end = pageNum * PAGE_SIZE;
            const res = await fetch(`${API_BASE}/books/${bookId}?range=${start}-${end}`);
            const json = await res.json();
            if (json.data && json.data.hadiths) {
                const newData = json.data.hadiths as HadithItem[];
                if (append) setHadiths(prev => [...prev, ...newData]); else setHadiths(newData);
                setHasMore(end < (json.data.available || activeBook.available));
            } else {
                if (!append) setErrorMsg('Format data tidak sesuai.');
            }
        } catch (error: any) {
            if (!append) setErrorMsg(error.message || 'Gagal memuat hadits.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        setHadiths([]); setPage(1); setHasMore(true);
        setErrorMsg(null); setSearchQuery(''); setShowSaved(false);
        fetchHadiths(activeBook.id, 1);
    }, [activeBook]);

    const loadMore = () => {
        if (!loadingMore && hasMore && !showSaved) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchHadiths(activeBook.id, nextPage, true);
        }
    };

    const getFilteredData = () => {
        let result = hadiths;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(h => h.id.toLowerCase().includes(q) || h.arab.includes(searchQuery) || String(h.number).includes(q));
        }
        if (showSaved) result = result.filter(h => isBookmarked(getHadithKey(h)));
        return result;
    };

    const filteredData = getFilteredData();

    const getHadithTitle = (item: HadithItem): string => {
        const text = item.id;
        const firstSentence = text.split(/[.;:]/)[0];
        if (firstSentence.length > 50) return firstSentence.slice(0, 47) + '...';
        return firstSentence;
    };

    const renderItem = ({ item }: { item: HadithItem }) => {
        const isSaved = isBookmarked(getHadithKey(item));
        const arabPreview = item.arab.length > 120 ? item.arab.slice(0, 120) + '...' : item.arab;
        const terjemahPreview = item.id.length > 100 ? item.id.slice(0, 100) + '...' : item.id;

        return (
            <TouchableOpacity
                style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#EAEBE8', marginBottom: 12 }}
                activeOpacity={0.7}
                onPress={() => router.push({ pathname: '/DetailHadits' as any, params: { number: String(item.number), arab: item.arab, terjemah: item.id, book: activeBook.name } })}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#1a1a1a', flex: 1, marginRight: 10 }} numberOfLines={1}>
                        {getHadithTitle(item)}
                    </Text>
                    <View style={{ backgroundColor: '#E8F0F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: TEAL }}>#{item.number}</Text>
                    </View>
                </View>

                <Text style={{ fontFamily: 'NotoNaskhArabic', fontSize: 20, color: '#1a1a1a', textAlign: 'right', lineHeight: 40, marginBottom: 12 }} numberOfLines={3}>
                    {arabPreview}
                </Text>

                <Text style={{ fontSize: 13, color: '#666', lineHeight: 20, marginBottom: 12 }} numberOfLines={2}>
                    {terjemahPreview}
                </Text>

                <View style={{ borderTopWidth: 1, borderTopColor: '#F5F5F5', paddingTop: 12, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isSaved ? TEAL : '#E8F0F0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, gap: 6 }}
                        onPress={(e) => { e.stopPropagation(); toggleSave(item); }}
                        activeOpacity={0.7}
                    >
                        {isSaved ? <BookmarkCheck size={14} color="#fff" /> : <Bookmark size={14} color={TEAL_LIGHT} />}
                        <Text style={{ fontSize: 12, fontWeight: '600', color: isSaved ? '#fff' : TEAL_LIGHT }}>
                            {isSaved ? 'Tersimpan' : 'Simpan'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, gap: 8 }}>
                <ActivityIndicator size="small" color={TEAL_LIGHT} />
                <Text style={{ fontSize: 13, color: '#888' }}>Memuat lebih banyak...</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} color={TEAL_LIGHT} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#1a1a1a' }}>
                    {showSaved ? 'Hadits Tersimpan' : 'Hadits'}
                </Text>
                <TouchableOpacity style={{ padding: 4 }} onPress={() => setShowSaved(!showSaved)} activeOpacity={0.7}>
                    <Bookmark size={22} color={showSaved ? '#E2C675' : TEAL_LIGHT} fill={showSaved ? '#E2C675' : 'transparent'} />
                    {bookmarks.size > 0 && (
                        <View style={{ position: 'absolute', top: -4, right: -6, backgroundColor: '#E2C675', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 }}>
                            <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>{bookmarks.size}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#EAEBE8', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 10 }}>
                    <Search size={18} color="#a0a0a0" />
                    <TextInput
                        style={{ flex: 1, fontSize: 14, color: '#1a1a1a', padding: 0 }}
                        placeholder="Cari judul hadits..."
                        placeholderTextColor="#a0a0a0"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Book Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 6, gap: 8, alignItems: 'center' }}
                style={{ flexGrow: 0, minHeight: 44, maxHeight: 44, marginBottom: 12 }}
            >
                {BOOKS.map((book) => (
                    <TouchableOpacity
                        key={book.id}
                        style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: activeBook.id === book.id ? TEAL : '#fff', borderWidth: 1, borderColor: activeBook.id === book.id ? TEAL : '#EAEBE8' }}
                        onPress={() => setActiveBook(book)}
                        activeOpacity={0.7}
                    >
                        <Text style={{ fontSize: 12, color: activeBook.id === book.id ? '#fff' : '#666', fontWeight: '600' }}>{book.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* List */}
            {loading ? (
                <FlatList
                    data={Array.from({ length: 5 })}
                    keyExtractor={(_, i) => `sk-${i}`}
                    renderItem={() => <SkeletonCard lines={3} />}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4 }}
                    scrollEnabled={false}
                />
            ) : errorMsg ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#D32F2F', fontSize: 14, textAlign: 'center', paddingHorizontal: 20 }}>{errorMsg}</Text>
                </View>
            ) : filteredData.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                    <Bookmark size={48} color="#ddd" />
                    <Text style={{ color: '#888', fontSize: 14 }}>
                        {showSaved ? 'Belum ada hadits yang disimpan.' : 'Tidak ada hadits ditemukan.'}
                    </Text>
                    {showSaved && (
                        <Text style={{ fontSize: 12, color: '#aaa', textAlign: 'center', paddingHorizontal: 40, marginTop: 4 }}>
                            Tekan tombol "Simpan" di setiap hadits untuk menyimpannya.
                        </Text>
                    )}
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => `${activeBook.id}-${item.number}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => { setPage(1); setHadiths([]); fetchHadiths(activeBook.id, 1); }}
                            colors={[TEAL]}
                            tintColor={TEAL}
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
}
