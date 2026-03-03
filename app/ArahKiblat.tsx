import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useRef } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function ArahKiblat() {
    const router = useRouter();
    const webViewRef = useRef<WebView>(null);

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <ArrowLeft size={24} color="#728D8E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Arah Kiblat</Text>
                <View style={{ width: 32 }} />
            </View>

            {/* Google Qibla Finder WebView */}
            <WebView
                ref={webViewRef}
                source={{ uri: 'https://qiblafinder.withgoogle.com/' }}
                style={styles.webview}
                startInLoadingState={true}
                renderLoading={() => (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#728D8E" />
                        <Text style={styles.loadingText}>Memuat Qibla Finder...</Text>
                    </View>
                )}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                geolocationEnabled={true}
                mediaPlaybackRequiresUserAction={false}
                allowsInlineMediaPlayback={true}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FDFBF7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.06)',
    },
    iconBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    webview: {
        flex: 1,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FDFBF7',
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
        color: '#888',
    },
});
