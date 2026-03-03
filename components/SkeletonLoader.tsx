import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

// ─── Base shimmer box ───────────────────────────────────────
interface SkeletonBoxProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export function SkeletonBox({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonBoxProps) {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, []);

    return (
        <Animated.View
            style={[
                { width: width as any, height, borderRadius, backgroundColor: '#E0E0DC', opacity },
                style,
            ]}
        />
    );
}

// ─── Skeleton for a surah list item ─────────────────────────
export function SkeletonSurahItem() {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 14 }}>
            <SkeletonBox width={65} height={65} borderRadius={16} />
            <View style={{ flex: 1, gap: 8 }}>
                <SkeletonBox width="50%" height={16} />
                <SkeletonBox width="70%" height={12} />
            </View>
            <View style={{ alignItems: 'flex-end', gap: 8 }}>
                <SkeletonBox width={60} height={20} />
                <SkeletonBox width={40} height={12} />
            </View>
        </View>
    );
}

// ─── Skeleton for a hadits / generic card ───────────────────
export function SkeletonCard({ lines = 3 }: { lines?: number }) {
    return (
        <View style={{
            backgroundColor: '#fff', borderRadius: 16, padding: 16,
            borderWidth: 1, borderColor: '#EAEBE8', marginBottom: 12, gap: 10,
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <SkeletonBox width="60%" height={16} />
                <SkeletonBox width={40} height={24} borderRadius={6} />
            </View>
            <SkeletonBox width="100%" height={14} />
            {Array.from({ length: lines - 1 }).map((_, i) => (
                <SkeletonBox key={i} width={i === lines - 2 ? '70%' : '100%'} height={14} />
            ))}
        </View>
    );
}

// ─── Skeleton for an article card ───────────────────────────
export function SkeletonArticleCard() {
    return (
        <View style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#EAEBE8', marginBottom: 16 }}>
            <SkeletonBox width="100%" height={180} borderRadius={0} />
            <View style={{ padding: 14, gap: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <SkeletonBox width={80} height={22} borderRadius={20} />
                    <SkeletonBox width={60} height={14} />
                </View>
                <SkeletonBox width="100%" height={16} />
                <SkeletonBox width="85%" height={16} />
                <SkeletonBox width="60%" height={12} />
            </View>
        </View>
    );
}

// ─── Skeleton for Asmaul Husna grid card ────────────────────
export function SkeletonAsmaulCard() {
    return (
        <View style={{
            backgroundColor: '#fff', borderRadius: 12, padding: 12, width: '31%',
            borderWidth: 1, borderColor: '#EAEBE8', gap: 8,
        }}>
            <SkeletonBox width="100%" height={24} />
            <SkeletonBox width="70%" height={14} />
            <SkeletonBox width="90%" height={11} />
        </View>
    );
}

// ─── Skeleton for a doa list item ───────────────────────────
export function SkeletonDoaItem() {
    return (
        <View style={{
            backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
            borderWidth: 1, borderColor: '#EAEBE8', gap: 10,
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <SkeletonBox width="50%" height={16} />
                <SkeletonBox width={60} height={24} borderRadius={12} />
            </View>
            <SkeletonBox width="100%" height={14} />
            <SkeletonBox width="80%" height={14} />
        </View>
    );
}
