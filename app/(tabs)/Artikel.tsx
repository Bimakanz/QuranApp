import { SkeletonArticleCard } from '@/components/SkeletonLoader';
import { BookOpen, ExternalLink } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    Linking,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const BG = '#F5F0E8';
const TEAL = '#728D8E';

interface Article {
    title: string;
    pubDate: string;
    link: string;
    guid: string;
    author: string;
    description: string;
    enclosure: { link: string };
    categories: string[];
}

function formatDate(pubDate: string): string {
    const d = new Date(pubDate);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

const CATEGORIES = ['Semua', 'Islam', 'Ramadhan', 'Ibadah', 'Kisah Nabi', 'Tafsir', 'Dunia'];

export default function Artikel() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [filtered, setFiltered] = useState<Article[]>([]);
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    const fetchArticles = (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        fetch('https://api.rss2json.com/v1/api.json?rss_url=https://republika.co.id/rss/khazanah')
            .then((r) => r.json())
            .then((data) => { setArticles(data.items); setFiltered(data.items); setError(''); setLoading(false); })
            .catch(() => { setError('Gagal memuat artikel.'); setLoading(false); })
            .finally(() => setRefreshing(false));
    };

    useEffect(() => { fetchArticles(); }, []);


    useEffect(() => {
        if (activeCategory === 'Semua') { setFiltered(articles); return; }
        setFiltered(articles.filter((a) => a.categories.some((c) => c.toLowerCase().includes(activeCategory.toLowerCase()))));
    }, [activeCategory, articles]);

    const renderItem = ({ item }: { item: Article }) => {
        const imageUrl = item.enclosure?.link;
        const category = item.categories?.[0] ?? 'Islam';
        const excerpt = stripHtml(item.description).slice(0, 120) + '...';

        return (
            <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)', marginBottom: 16 }}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={{ width: '100%', height: 180 }} resizeMode="cover" />
                ) : (
                    <View style={{ width: '100%', height: 180, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen size={32} color="#ccc" />
                    </View>
                )}

                <View style={{ padding: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <View style={{ backgroundColor: '#E8F0F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                            <Text style={{ fontSize: 11, fontWeight: '600', color: TEAL }}>{category}</Text>
                        </View>
                        <Text style={{ fontSize: 11, color: '#999' }}>{formatDate(item.pubDate)}</Text>
                    </View>

                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#1a1a1a', lineHeight: 22, marginBottom: 8 }} numberOfLines={3}>
                        {item.title}
                    </Text>

                    <Text style={{ fontSize: 12, color: '#666', lineHeight: 18, marginBottom: 12 }} numberOfLines={3}>
                        {excerpt}
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 10 }}>
                        <Text style={{ fontSize: 11, color: '#888', flex: 1 }} numberOfLines={1}>{item.author || 'Republika'}</Text>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F0F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 }}
                            onPress={() => Linking.openURL(item.link)}
                            activeOpacity={0.7}
                        >
                            <Text style={{ fontSize: 12, fontWeight: '600', color: TEAL }}>Baca Selengkapnya</Text>
                            <ExternalLink size={12} color={TEAL} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingBottom: 4, paddingTop: 14 }}>
                <BookOpen size={22} color="#333" />
                <View>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: '#1a1a1a' }}>Artikel</Text>
                    <Text style={{ fontSize: 12, color: '#888' }}>Berita dan artikel Islami terkini</Text>
                </View>
            </View>
            <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginTop: 8 }} />

            {/* Category Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, alignItems: 'center', gap: 4 }}
                style={{ flexGrow: 0 }}
            >
                {CATEGORIES.map((cat, i) => (
                    <TouchableOpacity
                        key={cat}
                        onPress={() => setActiveCategory(cat)}
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        activeOpacity={0.7}
                    >
                        <View style={{ paddingHorizontal: 4, borderBottomWidth: activeCategory === cat ? 2 : 0, borderBottomColor: '#1a1a1a', paddingBottom: 2 }}>
                            <Text style={[{ fontSize: 14, color: '#999', paddingHorizontal: 4 }, activeCategory === cat && { color: '#1a1a1a', fontWeight: '600' }]}>{cat}</Text>
                        </View>
                        {i < CATEGORIES.length - 1 && <Text style={{ color: '#ccc', marginHorizontal: 2 }}>·</Text>}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* List */}
            <View style={{ flex: 1 }}>
                {loading ? (
                    <FlatList
                        data={Array.from({ length: 4 })}
                        keyExtractor={(_, i) => `sk-${i}`}
                        renderItem={() => <SkeletonArticleCard />}
                        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8 }}
                        scrollEnabled={false}
                    />
                ) : error ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#c0392b', fontSize: 14 }}>{error}</Text>
                    </View>
                ) : filtered.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#888', fontSize: 14 }}>Tidak ada artikel untuk kategori ini.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item.guid ?? item.link}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, paddingTop: 8 }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => fetchArticles(true)}
                                colors={[TEAL]}
                                tintColor={TEAL}
                            />
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
