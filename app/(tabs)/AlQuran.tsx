import { SkeletonSurahItem } from '@/components/SkeletonLoader';
import { useRouter } from 'expo-router';
import { Bookmark, BookOpen, Search, Settings } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GOLD = '#C8A84B';
const BG = '#F5F0E8';

interface Surah {
    nomor: number;
    nama: string;
    nama_latin: string;
    arti: string;
    jumlah_ayat: number;
    tempat_turun: string;
}

export default function AlQuran() {
    const router = useRouter();
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [filtered, setFiltered] = useState<Surah[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    const fetchSurahs = (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        fetch('https://quran-api.santrikoding.com/api/surah')
            .then((r) => r.json())
            .then((data: Surah[]) => { setSurahs(data); setFiltered(data); setError(''); setLoading(false); })
            .catch(() => { setError('Gagal memuat data. Coba lagi.'); setLoading(false); })
            .finally(() => setRefreshing(false));
    };

    useEffect(() => { fetchSurahs(); }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(surahs.filter((s) =>
            s.nama_latin.toLowerCase().includes(q) || s.arti.toLowerCase().includes(q) || String(s.nomor).includes(q)
        ));
    }, [search, surahs]);

    const renderItem = ({ item }: { item: Surah }) => (
        <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 14 }}
            activeOpacity={0.7}
            onPress={() => router.push(`/SuratQuran?nomor=${item.nomor}`)}
        >
            <View style={{ width: 65, height: 65, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../assets/images/ayat.png')} style={{ position: 'absolute', width: 65, height: 65 }} resizeMode="contain" />
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#333', zIndex: 1 }}>{item.nomor}</Text>
            </View>

            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1a1a1a' }}>{item.nama_latin}</Text>
                <Text style={{ fontSize: 12, color: '#888', marginTop: 3 }}>
                    {item.arti} • {item.jumlah_ayat} Ayat
                </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontFamily: 'NotoNaskhArabic', fontSize: 20, color: '#1a1a1a' }}>{item.nama}</Text>
                <Text style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
                    {item.tempat_turun.charAt(0).toUpperCase() + item.tempat_turun.slice(1)}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const Separator = () => <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.06)' }} />;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>

            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <BookOpen size={22} color="#333" />
                    <Text style={{ fontSize: 22, fontWeight: '700', color: '#1a1a1a' }}>Al-Quran</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                    <TouchableOpacity style={{ padding: 8 }}>
                        <Bookmark size={20} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 8 }}>
                        <Settings size={20} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.06)', marginHorizontal: 20, marginBottom: 12, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 }}>
                <Search size={16} color="#aaa" style={{ marginRight: 8 }} />
                <TextInput
                    style={{ flex: 1, fontSize: 14, color: '#1a1a1a', padding: 0 }}
                    placeholder="Cari surah..."
                    placeholderTextColor="#aaa"
                    value={search}
                    onChangeText={setSearch}
                    clearButtonMode="while-editing"
                />
            </View>

            {/* List */}
            {loading ? (
                <FlatList
                    data={Array.from({ length: 10 })}
                    keyExtractor={(_, i) => `sk-${i}`}
                    renderItem={() => <>
                        <SkeletonSurahItem />
                        <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.06)' }} />
                    </>}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    scrollEnabled={false}
                />
            ) : error ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#c0392b', fontSize: 14 }}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => String(item.nomor)}
                    renderItem={renderItem}
                    ItemSeparatorComponent={Separator}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => fetchSurahs(true)}
                            colors={['#C8A84B']}
                            tintColor="#C8A84B"
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
}
