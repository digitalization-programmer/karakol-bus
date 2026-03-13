import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Animated, Dimensions,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES, getBusPositions } from '../data/routes';

const { width } = Dimensions.get('window');

const KARAKOL_CENTER = {
  latitude: 42.4900,
  longitude: 78.3920,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen() {
  const [busPositions, setBusPositions] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const mapRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    // Обновляем позиции маршруток каждые 5 секунд
    const update = () => setBusPositions(getBusPositions());
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBusPress = (bus) => {
    setSelectedBus(bus);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    mapRef.current?.animateToRegion({
      latitude: bus.lat,
      longitude: bus.lng,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    }, 500);
  };

  const closePanel = () => {
    Animated.timing(slideAnim, {
      toValue: 200,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedBus(null));
  };

  const activeRoute = selectedRoute
    ? ROUTES.find(r => r.id === selectedRoute)
    : null;

  return (
    <View style={styles.container}>
      {/* Фильтр маршрутов */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterBtn, !selectedRoute && styles.filterBtnActive]}
            onPress={() => setSelectedRoute(null)}
          >
            <Text style={[styles.filterText, !selectedRoute && styles.filterTextActive]}>
              Все
            </Text>
          </TouchableOpacity>
          {ROUTES.map(route => (
            <TouchableOpacity
              key={route.id}
              style={[
                styles.filterBtn,
                selectedRoute === route.id && { backgroundColor: route.color, borderColor: route.color }
              ]}
              onPress={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
            >
              <Text style={[
                styles.filterText,
                selectedRoute === route.id && styles.filterTextActive
              ]}>
                № {route.number}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Карта */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={KARAKOL_CENTER}
        showsUserLocation
        showsMyLocationButton
      >
        {/* Маршруты на карте */}
        {ROUTES.filter(r => !selectedRoute || r.id === selectedRoute).map(route => (
          <Polyline
            key={route.id}
            coordinates={route.stops.map(s => ({ latitude: s.lat, longitude: s.lng }))}
            strokeColor={route.color}
            strokeWidth={3}
            lineDashPattern={[5, 3]}
          />
        ))}

        {/* Остановки */}
        {activeRoute && activeRoute.stops.map(stop => (
          <Marker
            key={stop.id}
            coordinate={{ latitude: stop.lat, longitude: stop.lng }}
            title={stop.name}
          >
            <View style={[styles.stopMarker, { borderColor: activeRoute.color }]}>
              <View style={[styles.stopDot, { backgroundColor: activeRoute.color }]} />
            </View>
          </Marker>
        ))}

        {/* Маршрутки */}
        {busPositions
          .filter(b => !selectedRoute || b.routeId === selectedRoute)
          .map(bus => (
            <Marker
              key={bus.routeId}
              coordinate={{ latitude: bus.lat, longitude: bus.lng }}
              onPress={() => handleBusPress(bus)}
            >
              <View style={[styles.busMarker, { backgroundColor: bus.color }]}>
                <Ionicons name="bus" size={14} color="#fff" />
                <Text style={styles.busNumber}>{bus.routeNumber}</Text>
              </View>
            </Marker>
          ))}
      </MapView>

      {/* Панель информации о маршрутке */}
      {selectedBus && (
        <Animated.View style={[styles.infoPanel, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.infoPanelHeader}>
            <View style={[styles.infoBadge, { backgroundColor: selectedBus.color }]}>
              <Ionicons name="bus" size={16} color="#fff" />
              <Text style={styles.infoBadgeText}>№ {selectedBus.routeNumber}</Text>
            </View>
            <TouchableOpacity onPress={closePanel}>
              <Ionicons name="close-circle" size={28} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.infoRoute}>
            {ROUTES.find(r => r.id === selectedBus.routeId)?.name}
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={18} color={selectedBus.color} />
              <View style={styles.infoItemText}>
                <Text style={styles.infoLabel}>Следующая остановка</Text>
                <Text style={styles.infoValue}>{selectedBus.nextStop}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time" size={18} color={selectedBus.color} />
              <View style={styles.infoItemText}>
                <Text style={styles.infoLabel}>Прибытие через</Text>
                <Text style={styles.infoValue}>{selectedBus.minutesToNextStop} мин</Text>
              </View>
            </View>
          </View>

          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Онлайн отслеживание</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1f2d' },

  filterBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(13,31,45,0.92)',
    borderBottomWidth: 1,
    borderBottomColor: '#1e3d56',
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e3d56',
    marginRight: 8,
    backgroundColor: '#122436',
  },
  filterBtnActive: { backgroundColor: '#2a9d8f', borderColor: '#2a9d8f' },
  filterText: { color: '#7a9fb8', fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#fff' },

  map: { flex: 1, marginTop: 55 },

  stopMarker: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#fff',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopDot: { width: 6, height: 6, borderRadius: 3 },

  busMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  busNumber: { color: '#fff', fontWeight: '800', fontSize: 12 },

  infoPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#122436',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#1e3d56',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  infoPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  infoBadgeText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  infoRoute: { color: '#e8f4f8', fontSize: 16, fontWeight: '600', marginBottom: 16 },

  infoRow: { flexDirection: 'row', gap: 20, marginBottom: 16 },
  infoItem: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  infoItemText: { flex: 1 },
  infoLabel: { color: '#5a8fa8', fontSize: 11, marginBottom: 2 },
  infoValue: { color: '#e8f4f8', fontSize: 15, fontWeight: '700' },

  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#2a9d8f',
    shadowColor: '#2a9d8f',
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  liveText: { color: '#2a9d8f', fontSize: 12, fontWeight: '600' },
});
