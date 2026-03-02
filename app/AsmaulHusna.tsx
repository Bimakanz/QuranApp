import { useRouter } from 'expo-router';
import { ArrowLeft, Search } from 'lucide-react-native';
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
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        fetch('https://asmaul-husna-api.vercel.app/api/all')
            .then((res) => res.json())
            .then((json) => {
                if (json.data) {
                    setData(json.data);
                    setFilteredData(json.data);
                } else {
                    setErrorMsg('Gagal memuat data Asmaul Husna.');
                }
            })
            .catch((err) => {
                console.error(err);
                setErrorMsg('Terjadi kesalahan jaringan.');
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (text.trim() === '') {
            setFilteredData(data);
        } else {
            const lowerText = text.toLowerCase();
            const filtered = data.filter(
                (item) =>
                    item.latin.toLowerCase().includes(lowerText) ||
                    item.arti.toLowerCase().includes(lowerText) ||
                    item.arab.includes(lowerText)
            );
            setFilteredData(filtered);
        }
    };

    const renderItem = ({ item }: { item: AsmaulHusnaItem }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.urutan}>{item.urutan}</Text>
                <Text style={styles.arab}>{item.arab}</Text>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.latin}>{item.latin}</Text>
                <Text style={styles.arti} numberOfLines={2}>{item.arti}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <ArrowLeft size={24} color="#728D8E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Asmaul Husna</Text>
                <TouchableOpacity onPress={() => fetch('https://asmaul-husna-api.vercel.app/api/all').then(res => res.json()).then(j => { setData(j.data); setFilteredData(j.data) })} style={styles.iconBtn}>
                    {/* Placeholder for the refresh icon seen in the screenshot */}
                    <Text style={{ color: '#728D8E', fontSize: 20 }}>↻</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.headerDivider} />

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <Search size={20} color="#a0a0a0" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cari arab, latin, arti..."
                        placeholderTextColor="#a0a0a0"
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                </View>
            </View>

            {/* Content */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#32665C" />
                </View>
            ) : errorMsg ? (
                <View style={styles.center}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.urutan.toString()}
                    numColumns={3}
                    contentContainerStyle={styles.listContainer}
                    columnWrapperStyle={styles.columnWrapper}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const BG = '#FDFBF7';
const TEAL = '#32665C';

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: BG,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 14,
    },

    // Header
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

    // Search
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#EAEBE8',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: '#1a1a1a',
    },

    // List
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        width: '31%', // 3 columns
        borderWidth: 1,
        borderColor: '#EAEBE8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    urutan: {
        fontSize: 11,
        color: '#888',
        fontWeight: '600',
    },
    arab: {
        fontSize: 20,
        fontFamily: 'serif',
        color: '#1a1a1a',
        textAlign: 'right',
        flex: 1,
        marginLeft: 4,
    },
    cardBody: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    latin: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 2,
    },
    arti: {
        fontSize: 10,
        color: '#666',
        lineHeight: 14,
    },
});
