import { BookOpen, ExternalLink } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
function formatDate(pubDate: string): string {
    const d = new Date(pubDate);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

const CATEGORIES = ['Semua', 'Islam', 'Ramadhan', 'Ibadah', 'Kisah Nabi', 'Tafsir', 'Dunia'];

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────
export default function Artikel() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [filtered, setFiltered] = useState<Article[]>([]);
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('https://api.rss2json.com/v1/api.json?rss_url=https://republika.co.id/rss/khazanah')
            .then((r) => r.json())
            .then((data) => {
                setArticles(data.items);
                setFiltered(data.items);
                setLoading(false);
            })
            .catch(() => {
                setError('Gagal memuat artikel.');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (activeCategory === 'Semua') {
            setFiltered(articles);
        } else {
            setFiltered(
                articles.filter((a) =>
                    a.categories.some((c) =>
                        c.toLowerCase().includes(activeCategory.toLowerCase())
                    )
                )
            );
        }
    }, [activeCategory, articles]);

    // ── Render article card ───────────────────────────────
    const renderItem = ({ item }: { item: Article }) => {
        const imageUrl = item.enclosure?.link;
        const category = item.categories?.[0] ?? 'Islam';
        const excerpt = stripHtml(item.description).slice(0, 120) + '...';

        return (
            <View style={styles.card}>
                {/* Thumbnail */}
                {imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.cardImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
                        <BookOpen size={32} color="#ccc" />
                    </View>
                )}

                {/* Content */}
                <View style={styles.cardContent}>
                    {/* Category + Date */}
                    <View style={styles.metaRow}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{category}</Text>
                        </View>
                        <Text style={styles.dateText}>{formatDate(item.pubDate)}</Text>
                    </View>

                    {/* Title */}
                    <Text style={styles.cardTitle} numberOfLines={3}>{item.title}</Text>

                    {/* Excerpt */}
                    <Text style={styles.cardExcerpt} numberOfLines={3}>{excerpt}</Text>

                    {/* Author + Read More */}
                    <View style={styles.cardFooter}>
                        <Text style={styles.authorText} numberOfLines={1}>{item.author || 'Republika'}</Text>
                        <TouchableOpacity
                            style={styles.readMoreBtn}
                            onPress={() => Linking.openURL(item.link)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.readMoreText}>Baca Selengkapnya</Text>
                            <ExternalLink size={12} color="#728D8E" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>

            {/* ── Header ── */}
            <View style={styles.header}>
                <BookOpen size={22} color="#333" />
                <View style={styles.headerText}>
                    <Text style={styles.headerTitle}>Artikel</Text>
                    <Text style={styles.headerSub}>Berita dan artikel Islami terkini</Text>
                </View>
            </View>

            {/* ── Divider ── */}
            <View style={styles.headerDivider} />

            {/* ── Category tabs ── */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsContainer}
                style={styles.tabsScroll}
            >
                {CATEGORIES.map((cat, i) => (
                    <TouchableOpacity
                        key={cat}
                        onPress={() => setActiveCategory(cat)}
                        style={styles.tabItem}
                        activeOpacity={0.7}
                    >
                        <View style={[
                            styles.textWrapper,
                            activeCategory === cat && styles.textWrapperActive,
                        ]}>
                            <Text style={[
                                styles.tabText,
                                activeCategory === cat && styles.tabTextActive,
                            ]}>
                                {cat}
                            </Text>
                        </View>
                        {i < CATEGORIES.length - 1 && (
                            <Text style={styles.tabDot}>·</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* ── List ── */}
            <View style={styles.listContainer}>
                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#728D8E" />
                        <Text style={styles.loadingText}>Memuat artikel...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.center}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : filtered.length === 0 ? (
                    <View style={styles.center}>
                        <Text style={styles.loadingText}>Tidak ada artikel untuk kategori ini.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item.guid ?? item.link}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────
const BG = '#F5F0E8';
const TEAL = '#728D8E';

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: BG,
        paddingTop: 10,
    },

    /* Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 20,
        paddingBottom: 4,
    },
    headerText: {},
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    headerSub: {
        fontSize: 12,
        color: '#888',
    },

    headerDivider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.08)',
        marginTop: 10,
        marginHorizontal: 20,
    },

    /* Category tabs */
    tabsScroll: {
        flexGrow: 0,
        marginTop: 10,
        marginBottom: 10,
    },
    tabsContainer: {
        paddingHorizontal: 15,
        alignItems: 'center',
        paddingBottom: 4, // mencegah border ketototng
    },
    tabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 2,
    },
    textWrapper: {
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    textWrapperActive: {
        borderBottomColor: TEAL,
    },
    tabText: {
        fontSize: 13,
        color: '#888',
        paddingHorizontal: 4,
    },
    tabTextActive: {
        color: '#1a1a1a',
        fontWeight: '600',
    },
    tabDot: {
        color: '#ccc',
        marginHorizontal: 2,
    },

    /* List */
    listContainer: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 24,
        gap: 16,
        paddingTop: 8,
    },

    /* Card */
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    cardImage: {
        width: '100%',
        height: 200,
    },
    cardImagePlaceholder: {
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        padding: 16,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    categoryBadge: {
        backgroundColor: '#E8F0F0',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    categoryText: {
        fontSize: 11,
        color: TEAL,
        fontWeight: '600',
    },
    dateText: {
        fontSize: 11,
        color: '#aaa',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
        lineHeight: 22,
        marginBottom: 8,
    },
    cardExcerpt: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 10,
    },
    authorText: {
        fontSize: 11,
        color: '#999',
        flex: 1,
    },
    readMoreBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    readMoreText: {
        fontSize: 12,
        color: TEAL,
        fontWeight: '600',
    },

    /* States */
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    loadingText: {
        color: '#888',
        fontSize: 14,
    },
    errorText: {
        color: '#c0392b',
        fontSize: 14,
    },
});
