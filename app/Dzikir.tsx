import { useRouter } from 'expo-router';
import { ArrowLeft, Bookmark, BookmarkCheck } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BG = '#F5F0E8';
const TEAL = '#32665C';
const TEAL_LIGHT = '#728D8E';

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

    const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
    const [showSaved, setShowSaved] = useState(false);

    const getDzikirKey = (item: DzikirItem) => `${item.type}-${item.arab.slice(0, 30)}`;

    const toggleSave = (item: DzikirItem) => {
        const key = getDzikirKey(item);
        setSavedItems(prev => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = 'https://muslim-api-three.vercel.app/v1/dzikir';
                let json: any;

                if (Platform.OS === 'web') {
                    // Di Web (browser), pakai proxy CORS biar tidak kena blokiran
                    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`);
                    const proxyJson = await res.json();
                    json = JSON.parse(proxyJson.contents);
                } else {
                    // Di Android / iOS, fetch langsung tanpa proxy
                    const res = await fetch(apiUrl);
                    json = await res.json();
                }

                if (json && json.data && Array.isArray(json.data)) {
                    setDzikirData(json.data);
                    setFilteredData(json.data);
                } else if (Array.isArray(json)) {
                    setDzikirData(json);
                    setFilteredData(json);
                } else {
                    setErrorMsg("Format respons API tidak sesuai.");
                }
            } catch (error: any) {
                setErrorMsg(error.message || "Gagal mengambil data dzikir.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let result = dzikirData;
        if (subTab !== 'semua') result = result.filter(d => d.type.toLowerCase() === subTab);
        if (showSaved) result = result.filter(d => savedItems.has(getDzikirKey(d)));
        setFilteredData(result);
    }, [subTab, dzikirData, showSaved, savedItems]);

    const handleDuhaPress = () => {
        Alert.alert("Informasi", "Fitur Dzikir Duha masih dalam tahap pengembangan (Develop).");
    };

    const renderItem = ({ item, index }: { item: DzikirItem; index: number }) => {
        const displayIndex = index + 1;
        const isSaved = savedItems.has(getDzikirKey(item));
        const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);

        return (
            <TouchableOpacity
                style={{
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#EAEBE8',
                    padding: 16,
                    paddingBottom: 24,
                    marginBottom: 16,
                }}
                activeOpacity={0.7}
                onPress={() => router.push({
                    pathname: '/DetailDzikir' as any,
                    params: {
                        type: item.type,
                        arab: item.arab,
                        indo: item.indo,
                        ulang: item.ulang,
                    }
                })}
            >
                {/* Header Card */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: TEAL_LIGHT }}>
                            Dzikir #{displayIndex}
                        </Text>
                        <View style={{ backgroundColor: '#E8F0F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
                            <Text style={{ fontSize: 11, fontWeight: '600', color: TEAL }}>{typeLabel}</Text>
                        </View>
                    </View>
                    <View style={{ backgroundColor: '#F5F5F5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
                        <Text style={{ fontSize: 11, color: '#666', fontWeight: '600' }}>{item.ulang}</Text>
                    </View>
                </View>

                {/* Ayat Arab */}
                <Text style={{
                    fontFamily: 'NotoNaskhArabic',
                    fontSize: 24,
                    color: '#1a1a1a',
                    textAlign: 'right',
                    lineHeight: 44,
                    marginBottom: 16,
                }}>
                    {item.arab}
                </Text>

                {/* Terjemahan Indo */}
                <Text style={{ fontSize: 14, color: '#444', marginBottom: 20, lineHeight: 22 }}>
                    {item.indo}
                </Text>

                {/* Footer Bookmark */}
                <View style={{ borderTopWidth: 1, borderTopColor: '#F5F5F5', paddingTop: 16, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: isSaved ? TEAL : '#E8F0F0',
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 8,
                            gap: 6,
                        }}
                        onPress={() => toggleSave(item)}
                        activeOpacity={0.7}
                    >
                        {isSaved
                            ? <BookmarkCheck size={14} color="#fff" />
                            : <Bookmark size={14} color={TEAL_LIGHT} />
                        }
                        <Text style={{ fontSize: 12, fontWeight: '600', color: isSaved ? '#fff' : TEAL_LIGHT }}>
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
                    <ArrowLeft size={24} color={TEAL_LIGHT} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#1a1a1a' }}>
                    {showSaved ? 'Dzikir Tersimpan' : 'Dzikir'}
                </Text>
                <TouchableOpacity style={{ padding: 4 }} onPress={() => setShowSaved(!showSaved)} activeOpacity={0.7}>
                    <Bookmark
                        size={22}
                        color={showSaved ? '#E2C675' : TEAL_LIGHT}
                        fill={showSaved ? '#E2C675' : 'transparent'}
                    />
                    {savedItems.size > 0 && (
                        <View style={{
                            position: 'absolute', top: -4, right: -6,
                            backgroundColor: '#E2C675', borderRadius: 10,
                            minWidth: 18, height: 18, justifyContent: 'center',
                            alignItems: 'center', paddingHorizontal: 4,
                        }}>
                            <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>
                                {savedItems.size}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Main Tabs */}
            <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderTopWidth: 1, borderColor: '#EAEBE8' }}>
                <TouchableOpacity
                    style={{
                        flex: 1, alignItems: 'center', justifyContent: 'center',
                        paddingVertical: 14, borderBottomWidth: 2,
                        borderBottomColor: mainTab === 'harian' ? TEAL : 'transparent',
                        backgroundColor: mainTab === 'harian' ? '#EAEBE8' : 'transparent',
                    }}
                    onPress={() => setMainTab('harian')}
                    activeOpacity={0.7}
                >
                    <Text style={{ fontSize: 14, fontWeight: '600', color: mainTab === 'harian' ? TEAL : TEAL_LIGHT }}>
                        Dzikir Harian
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flex: 1, alignItems: 'center', justifyContent: 'center',
                        paddingVertical: 14, borderBottomWidth: 2,
                        borderBottomColor: mainTab === 'duha' ? TEAL : 'transparent',
                        backgroundColor: mainTab === 'duha' ? '#EAEBE8' : 'transparent',
                    }}
                    onPress={handleDuhaPress}
                    activeOpacity={0.7}
                >
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: mainTab === 'duha' ? TEAL : TEAL_LIGHT }}>
                            Dzikir Duha
                        </Text>
                        <View style={{ backgroundColor: '#FFF2E5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4, borderWidth: 1, borderColor: '#FFDDB3' }}>
                            <Text style={{ fontSize: 9, fontWeight: '700', color: '#E58A35' }}>DEVELOP</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Sub Tabs */}
            <View style={{
                flexDirection: 'row', marginHorizontal: 20, marginTop: 16, marginBottom: 16,
                backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#EAEBE8', overflow: 'hidden',
            }}>
                {(['semua', 'pagi', 'sore', 'solat'] as const).map((tabStr) => (
                    <TouchableOpacity
                        key={tabStr}
                        style={{
                            flex: 1, paddingVertical: 12, alignItems: 'center',
                            borderRightWidth: tabStr === 'solat' ? 0 : 1,
                            borderRightColor: '#EAEBE8',
                            backgroundColor: subTab === tabStr ? TEAL : 'transparent',
                        }}
                        onPress={() => setSubTab(tabStr)}
                        activeOpacity={0.7}
                    >
                        <Text style={{ fontSize: 12, fontWeight: '600', color: subTab === tabStr ? '#fff' : TEAL_LIGHT }}>
                            {tabStr.charAt(0).toUpperCase() + tabStr.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* List Content */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                    <ActivityIndicator size="large" color={TEAL_LIGHT} />
                    <Text style={{ color: '#888', fontSize: 14 }}>Memuat dzikir...</Text>
                </View>
            ) : errorMsg ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                    <Text style={{ color: '#D32F2F', fontSize: 14, textAlign: 'center', paddingHorizontal: 20 }}>
                        Error: {errorMsg}
                    </Text>
                </View>
            ) : filteredData.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                    <Bookmark size={48} color="#ddd" />
                    <Text style={{ color: '#888', fontSize: 14 }}>
                        {showSaved ? 'Belum ada dzikir yang disimpan.' : 'Tidak ada dzikir ditemukan.'}
                    </Text>
                    {showSaved && (
                        <Text style={{ fontSize: 12, color: '#aaa', textAlign: 'center', paddingHorizontal: 40, marginTop: 4 }}>
                            Tekan tombol "Simpan" di setiap dzikir untuk menyimpannya.
                        </Text>
                    )}
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(_, idx) => idx.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}