import { useRouter } from 'expo-router';
import { ArrowLeft, RefreshCw, Search } from 'lucide-react-native';
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

const TEAL = '#32665C';
const BG = '#F5F0E8';

interface AsmaulHusnaItem {
    urutan: number;
    latin: string;
    arab: string;
    arti: string;
}

export default function AsmaulHusna() {
    const router = useRouter();
    const [data, setData] = useState<AsmaulHusnaItem[]>([]);
    const [filteredData, setFilteredData] = useState<AsmaulHusnaItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const loadData = (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        fetch('https://asmaul-husna-api.vercel.app/api/all')
            .then((res) => res.json())
            .then((json) => {
                if (json.data) { setData(json.data); setFilteredData(json.data); setErrorMsg(null); }
                else setErrorMsg('Gagal memuat data Asmaul Husna.');
            })
            .catch((err) => { console.error(err); setErrorMsg('Terjadi kesalahan jaringan.'); })
            .finally(() => { setLoading(false); setRefreshing(false); });
    };

    useEffect(() => { loadData(); }, []);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (text.trim() === '') { setFilteredData(data); return; }
        const lowerText = text.toLowerCase();
        setFilteredData(data.filter((item) =>
            item.latin.toLowerCase().includes(lowerText) ||
            item.arti.toLowerCase().includes(lowerText) ||
            item.arab.includes(lowerText)
        ));
    };

    const renderItem = ({ item }: { item: AsmaulHusnaItem }) => (
        <View style={{
            backgroundColor: '#fff', borderRadius: 12, padding: 12, width: '31%',
            borderWidth: 1, borderColor: '#EAEBE8',
            shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <Text style={{ fontSize: 11, color: '#888', fontWeight: '600' }}>{item.urutan}</Text>
                <Text style={{ fontSize: 20, fontFamily: 'serif', color: '#1a1a1a', textAlign: 'right', flex: 1, marginLeft: 4 }}>
                    {item.arab}
                </Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#1a1a1a', marginBottom: 2 }}>{item.latin}</Text>
                <Text style={{ fontSize: 10, color: '#666', lineHeight: 14 }} numberOfLines={2}>{item.arti}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} color="#728D8E" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#1a1a1a' }}>Asmaul Husna</Text>
                <TouchableOpacity
                    onPress={() => loadData(true)}
                    style={{ padding: 6, borderRadius: 20 }}
                    activeOpacity={0.7}
                >
                    <RefreshCw
                        size={18}
                        color="#32665C"
                        style={refreshing ? { opacity: 0.4 } : {}}
                    />
                </TouchableOpacity>
            </View>
            <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.05)' }} />

            {/* Search Bar */}
            <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#EAEBE8' }}>
                    <Search size={20} color="#a0a0a0" />
                    <TextInput
                        style={{ flex: 1, marginLeft: 10, fontSize: 14, color: '#1a1a1a' }}
                        placeholder="Cari arab, latin, arti..."
                        placeholderTextColor="#a0a0a0"
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                </View>
            </View>

            {/* Content */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={TEAL} />
                </View>
            ) : errorMsg ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#D32F2F', fontSize: 14 }}>{errorMsg}</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.urutan.toString()}
                    numColumns={3}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
                    columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}
