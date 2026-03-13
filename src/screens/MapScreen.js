import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Linking, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES, getBusPositions } from '../data/routes';

const { width } = Dimensions.get('window');

export default function MapScreen() {
  const [busPositions, setBusPositions] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);

  useEffect(() => {
    const update = () => setBusPositions(getBusPositions());
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, []);

  const openInGoogleMaps = (route) => {
    const stops = route.stops;
    const origin = `${stops[0].lat},${stops[0].lng}`;
    const destination = `${stops[stops.length - 1].lat},${stops[stops.length - 1].lng}`;
    const waypoints = stops.slice(1, -1).map(s => `${s.lat},${s.lng}`).join('|');
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
    Linking.openURL(url);
  };

  const activeBuses = selectedRoute
    ? busPositions.filter(b => b.routeId === selectedRoute)
    : busPositions;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Карта</Text>
        <Text style={styles.headerSub}>Каракол · маршрутки онлайн</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.filterBtn, !selectedRoute && styles.filterBtnActive]}
          onPress={() => { setSelectedRoute(null); setSelectedBus(null); }}
        >
          <Text style={[styles.filterText, !selectedRoute && styles.filterTextActive]}>Все</Text>
        </TouchableOpacity>
        {ROUTES.map(route => (
          <TouchableOpacity
            key={route.id}
            style={[styles.filterBtn, selectedRoute === route.id && { backgroundColor: route.color, borderColor: route.color }]}
            onPress={() => { setSelectedRoute(selectedRoute === route.id ? null : route.id); setSelectedBus(null); }}
          >
            <Text style={[styles.filterText, selectedRoute === route.id && styles.filterTextActive]}>
              № {route.number}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>🚌 Маршрутки сейчас</Text>
        {activeBuses.map(bus => {
          const route = ROUTES.find(r => r.id === bus.routeId);
          return (
            <TouchableOpacity
              key={bus.routeId}
              style={[styles.busCard, selectedBus?.routeId === bus.routeId && { borderColor: bus.color }]}
              onPress={() => setSelectedBus(selectedBus?.routeId === bus.routeId ? null : bus)}
            >
              <View style={[styles.busBadge, { backgroundColor: bus.color }]}>
                <Ionicons name="bus" size={16} color="#fff" />
                <Text style={styles.busBadgeText}>№ {bus.routeNumber}</Text>
              </View>
              <View style={styles.busInfo}>
                <Text style={styles.busRoute}>{route?.name}</Text>
                <Text style={styles.busNext}>→ {bus.nextStop}</Text>
              </View>
              <View style={styles.busTime}>
                <Text style={styles.busTimeText}>{bus.minutesToNextStop}</Text>
                <Text style={styles.busTimeLabel}>мин</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {selectedBus && (
          <View style={[styles.detailCard, { borderColor: selectedBus.color }]}>
            <View style={styles.liveRow}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Онлайн отслеживание</Text>
            </View>
            <Text style={styles.detailTitle}>Маршрутка № {selectedBus.routeNumber}</Text>
            <Text style={styles.detailCoords}>📍 {selectedBus.lat.toFixed(4)}, {selectedBus.lng.toFixed(4)}</Text>
            <Text style={styles.detailNext}>
              Следующая: <Text style={{ color: selectedBus.color }}>{selectedBus.nextStop}</Text>
            </Text>
            <Text style={styles.detailArrival}>Прибытие через {selectedBus.minutesToNextStop} мин</Text>
          </View>
        )}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>🗺️ Маршруты на карте</Text>
        {ROUTES.filter(r => !selectedRoute || r.id === selectedRoute).map(route => (
          <View key={route.id} style={styles.routeMapCard}>
            <View style={styles.routeMapHeader}>
              <View style={[styles.routeMapBadge, { backgroundColor: route.color }]}>
                <Text style={styles.routeMapBadgeText}>№ {route.number}</Text>
              </View>
              <Text style={styles.routeMapName}>{route.name}</Text>
            </View>
            <View style={styles.stopsList}>
              {route.stops.map((stop, i) => (
                <View key={stop.id} style={styles.stopRow}>
                  <View style={[styles.stopDot, { backgroundColor: i === 0 || i === route.stops.length - 1 ? route.color : '#1e3d56' }]} />
                  <Text style={styles.stopName}>{stop.name}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.mapsBtn, { borderColor: route.color }]}
              onPress={() => openInGoogleMaps(route)}
            >
              <Ionicons name="map" size={16} color={route.color} />
              <Text style={[styles.mapsBtnText, { color: route.color }]}>Открыть в Google Maps</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1f2d' },
  header: { paddingTop: 60, paddingBottom: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#1e3d56' },
  headerTitle: { fontSize: 32, fontWeight: '800', color: '#e8f4f8' },
  headerSub: { color: '#5a8fa8', fontSize: 13, marginTop: 4 },
  filterBar: { paddingVertical: 10, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#1e3d56', flexGrow: 0 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: '#1e3d56', marginRight: 8, backgroundColor: '#122436' },
  filterBtnActive: { backgroundColor: '#2a9d8f', borderColor: '#2a9d8f' },
  filterText: { color: '#7a9fb8', fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  content: { padding: 16, paddingBottom: 40 },
  sectionTitle: { color: '#5a8fa8', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
  busCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#122436', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#1e3d56' },
  busBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  busBadgeText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  busInfo: { flex: 1 },
  busRoute: { color: '#e8f4f8', fontSize: 13, fontWeight: '600' },
  busNext: { color: '#5a8fa8', fontSize: 12, marginTop: 2 },
  busTime: { alignItems: 'center' },
  busTimeText: { color: '#2a9d8f', fontSize: 22, fontWeight: '900' },
  busTimeLabel: { color: '#5a8fa8', fontSize: 10 },
  detailCard: { backgroundColor: '#122436', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2a9d8f' },
  liveText: { color: '#2a9d8f', fontSize: 12, fontWeight: '600' },
  detailTitle: { color: '#e8f4f8', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  detailCoords: { color: '#5a8fa8', fontSize: 12, marginBottom: 6 },
  detailNext: { color: '#7a9fb8', fontSize: 14, marginBottom: 4 },
  detailArrival: { color: '#e8f4f8', fontSize: 14, fontWeight: '600' },
  routeMapCard: { backgroundColor: '#122436', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#1e3d56' },
  routeMapHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  routeMapBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  routeMapBadgeText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  routeMapName: { color: '#7a9fb8', fontSize: 13, flex: 1 },
  stopsList: { marginBottom: 14, gap: 6 },
  stopRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stopDot: { width: 8, height: 8, borderRadius: 4 },
  stopName: { color: '#e8f4f8', fontSize: 13 },
  mapsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  mapsBtnText: { fontSize: 14, fontWeight: '600' },
});
