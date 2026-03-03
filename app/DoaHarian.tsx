import { useRouter } from 'expo-router';
import { ArrowLeft, Bookmark, BookmarkCheck, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TEAL = '#728D8E';
const BG = '#F5F0E8';

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

    const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
    const [showSaved, setShowSaved] = useState(false);

    const fetchDoas = async () => {
        setLoading(true);
        try {
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
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(doa =>
                doa.judul.toLowerCase().includes(query) ||
                doa.latin.toLowerCase().includes(query) ||
                doa.terjemah.toLowerCase().includes(query)
            );
        }
        if (showSaved) result = result.filter(doa => savedItems.has(doa.id));
        setFilteredDoas(result);
    }, [searchQuery, showSaved, doas, savedItems]);

    const toggleSave = (id: string, e: any) => {
        e.stopPropagation();
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
                style={{
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
                    marginBottom: 12,
                }}
                activeOpacity={0.7}
                onPress={() => router.push({
                    pathname: '/DetailDoa' as any,
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: '#1a1a1a' }}>
                            Doa #{displayIndex}
                        </Text>
                        <View style={{ backgroundColor: '#E8F0F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, flexShrink: 1 }}>
                            <Text style={{ fontSize: 11, fontWeight: '600', color: TEAL }} numberOfLines={1}>
                                {item.judul}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Ayat Arab */}
                <Text style={{ fontFamily: 'NotoNaskhArabic', fontSize: 22, color: '#1a1a1a', textAlign: 'right', lineHeight: 38, marginBottom: 16 }}>
                    {item.arab}
                </Text>

                {/* Terjemahan */}
                <Text style={{ fontSize: 13, color: '#666', lineHeight: 20, marginBottom: 16 }}>
                    {item.terjemah}
                </Text>

                {/* Footer Bookmark */}
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 12 }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: isSaved ? TEAL : '#F5F8F8',
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 8,
                            gap: 6,
                        }}
                        onPress={(e) => toggleSave(item.id, e)}
                        activeOpacity={0.7}
                    >
                        {isSaved
                            ? <BookmarkCheck size={14} color="#fff" />
                            : <Bookmark size={14} color={TEAL} />
                        }
                        <Text style={{ fontSize: 12, fontWeight: '600', color: isSaved ? '#fff' : TEAL }}>
                            {isSaved ? 'Tersimpan' : 'Simpan'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} color={TEAL} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#1a1a1a' }}>Doa Harian</Text>
                <TouchableOpacity
                    onPress={() => setShowSaved(!showSaved)}
                    style={{ padding: 8 }}
                    activeOpacity={0.7}
                >
                    <Bookmark
                        size={22}
                        color={showSaved ? '#E2C675' : TEAL}
                        fill={showSaved ? '#E2C675' : 'transparent'}
                    />
                    {savedItems.size > 0 && (
                        <View style={{
                            position: 'absolute', top: 2, right: 2,
                            backgroundColor: '#E2C675', borderRadius: 10,
                            minWidth: 16, height: 16,
                            alignItems: 'center', justifyContent: 'center',
                            borderWidth: 1.5, borderColor: '#fff',
                        }}>
                            <Text style={{ color: '#fff', fontSize: 9, fontWeight: 'bold', paddingHorizontal: 3 }}>
                                {savedItems.size}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.05)' }} />

            {/* Search Box */}
            <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#EAEBE8', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, gap: 10 }}>
                    <Search size={20} color="#a0a0a0" />
                    <TextInput
                        style={{ flex: 1, fontSize: 14, color: '#1a1a1a', padding: 0 }}
                        placeholder="Cari judul, arti, latin..."
                        placeholderTextColor="#a0a0a0"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* List */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                    <ActivityIndicator size="large" color={TEAL} />
                    <Text style={{ color: '#888', fontSize: 14 }}>Memuat doa harian...</Text>
                </View>
            ) : filteredDoas.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                    <Text style={{ color: '#888', fontSize: 14 }}>Tidak ada doa ditemukan.</Text>
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={filteredDoas}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}
