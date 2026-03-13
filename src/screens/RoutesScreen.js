import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Modal, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES, getNextDeparture } from '../data/routes';

export default function RoutesScreen() {
  const [selectedRoute, setSelectedRoute] = useState(null);

  const renderRoute = ({ item }) => (
    <TouchableOpacity
      style={styles.routeCard}
      onPress={() => setSelectedRoute(item)}
      activeOpacity={0.8}
    >
      <View style={[styles.routeNumber, { backgroundColor: item.color }]}>
        <Text style={styles.routeNumberText}>{item.number}</Text>
      </View>
      <View style={styles.routeInfo}>
        <Text style={styles.routeName}>{item.name}</Text>
        <Text style={styles.routeStops}>
          {item.stops.length} остановок · каждые {item.intervalMin} мин
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#3a6a88" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Маршруты</Text>
        <Text style={styles.headerSub}>Каракол · {ROUTES.length} маршрута</Text>
      </View>

      <FlatList
        data={ROUTES}
        keyExtractor={item => item.id}
        renderItem={renderRoute}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Детали маршрута */}
      <Modal
        visible={!!selectedRoute}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedRoute(null)}
      >
        {selectedRoute && (
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalBadge, { backgroundColor: selectedRoute.color }]}>
                <Text style={styles.modalBadgeText}>№ {selectedRoute.number}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedRoute(null)}>
                <Ionicons name="close" size={26} color="#7a9fb8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>{selectedRoute.name}</Text>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {/* Ближайший рейс */}
              <View style={styles.nextDepartureCard}>
                <Ionicons name="time" size={20} color={selectedRoute.color} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.ndLabel}>Ближайший рейс</Text>
                  {(() => {
                    const dep = getNextDeparture(selectedRoute.id, null);
                    if (!dep) return null;
                    return (
                      <Text style={styles.ndValue}>
                        {dep.tomorrow
                          ? `Завтра в ${dep.time}`
                          : dep.minutesLeft < 60
                            ? `Через ${dep.minutesLeft} мин (${dep.time})`
                            : `В ${dep.time}`
                        }
                      </Text>
                    );
                  })()}
                </View>
              </View>

              {/* Остановки */}
              <Text style={styles.sectionTitle}>Остановки</Text>
              {selectedRoute.stops.map((stop, index) => (
                <View key={stop.id} style={styles.stopRow}>
                  <View style={styles.stopLine}>
                    <View style={[styles.stopCircle, { borderColor: selectedRoute.color }]}>
                      {index === 0 || index === selectedRoute.stops.length - 1
                        ? <View style={[styles.stopFill, { backgroundColor: selectedRoute.color }]} />
                        : null
                      }
                    </View>
                    {index < selectedRoute.stops.length - 1 && (
                      <View style={[styles.stopConnector, { backgroundColor: selectedRoute.color + '44' }]} />
                    )}
                  </View>
                  <View style={styles.stopInfo}>
                    <Text style={styles.stopName}>{stop.name}</Text>
                    {(index === 0) && <Text style={styles.stopTag}>Начало маршрута</Text>}
                    {(index === selectedRoute.stops.length - 1) && <Text style={styles.stopTag}>Конечная</Text>}
                  </View>
                </View>
              ))}

              {/* Расписание */}
              <Text style={styles.sectionTitle}>Расписание</Text>
              <View style={styles.scheduleGrid}>
                {selectedRoute.schedule.map((time, i) => (
                  <View key={i} style={styles.timeBadge}>
                    <Text style={styles.timeText}>{time}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1f2d' },

  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e3d56',
  },
  headerTitle: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '800',
    color: '#e8f4f8',
  },
  headerSub: { color: '#5a8fa8', fontSize: 14, marginTop: 4 },

  list: { padding: 16 },
  separator: { height: 1, backgroundColor: '#1e3d56', marginHorizontal: 16 },

  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  routeNumber: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeNumberText: { color: '#fff', fontWeight: '900', fontSize: 18 },
  routeInfo: { flex: 1 },
  routeName: { color: '#e8f4f8', fontSize: 15, fontWeight: '600', marginBottom: 4 },
  routeStops: { color: '#5a8fa8', fontSize: 13 },

  // Modal
  modal: { flex: 1, backgroundColor: '#0d1f2d', padding: 20, paddingTop: 10 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginBottom: 12,
  },
  modalBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalBadgeText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  modalTitle: { color: '#e8f4f8', fontSize: 20, fontWeight: '700', marginBottom: 20 },
  modalScroll: { flex: 1 },

  nextDepartureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#122436',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1e3d56',
  },
  ndLabel: { color: '#5a8fa8', fontSize: 12 },
  ndValue: { color: '#e8f4f8', fontSize: 16, fontWeight: '700', marginTop: 2 },

  sectionTitle: { color: '#5a8fa8', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },

  stopRow: { flexDirection: 'row', gap: 14, marginBottom: 0 },
  stopLine: { alignItems: 'center', width: 20 },
  stopCircle: {
    width: 16, height: 16, borderRadius: 8,
    borderWidth: 2,
    backgroundColor: '#0d1f2d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopFill: { width: 8, height: 8, borderRadius: 4 },
  stopConnector: { width: 2, flex: 1, minHeight: 28 },
  stopInfo: { flex: 1, paddingBottom: 20 },
  stopName: { color: '#e8f4f8', fontSize: 15, fontWeight: '500' },
  stopTag: { color: '#2a9d8f', fontSize: 11, marginTop: 2 },

  scheduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 40 },
  timeBadge: {
    backgroundColor: '#122436',
    borderWidth: 1,
    borderColor: '#1e3d56',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  timeText: { color: '#7a9fb8', fontWeight: '600' },
});
