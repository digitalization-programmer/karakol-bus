import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES, getNextDeparture } from '../data/routes';

export default function ScheduleScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Расписание</Text>
        <View style={styles.clockBadge}>
          <Ionicons name="time" size={14} color="#2a9d8f" />
          <Text style={styles.clockText}>{formatTime(currentTime)}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {ROUTES.map(route => {
          const dep = getNextDeparture(route.id, null);
          const now = currentTime;
          const currentMinutes = now.getHours() * 60 + now.getMinutes();

          return (
            <View key={route.id} style={styles.routeBlock}>
              <View style={styles.routeBlockHeader}>
                <View style={[styles.routeBadge, { backgroundColor: route.color }]}>
                  <Text style={styles.routeBadgeText}>№ {route.number}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.routeName}>{route.name}</Text>
                </View>
                {dep && (
                  <View style={styles.nextBadge}>
                    <Text style={styles.nextText}>
                      {dep.tomorrow ? 'Завтра' : `${dep.minutesLeft} мин`}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.timesGrid}>
                {route.schedule.map((time, i) => {
                  const [h, m] = time.split(':').map(Number);
                  const t = h * 60 + m;
                  const isPast = t < currentMinutes;
                  const isNext = !isPast && dep && dep.time === time;

                  return (
                    <View
                      key={i}
                      style={[
                        styles.timePill,
                        isPast && styles.timePillPast,
                        isNext && { backgroundColor: route.color, borderColor: route.color },
                      ]}
                    >
                      <Text style={[
                        styles.timePillText,
                        isPast && styles.timePillTextPast,
                        isNext && styles.timePillTextActive,
                      ]}>
                        {time}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1f2d' },

  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1e3d56',
  },
  headerTitle: { fontSize: 32, fontWeight: '800', color: '#e8f4f8' },
  clockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#122436',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#1e3d56',
  },
  clockText: { color: '#2a9d8f', fontWeight: '700', fontSize: 15 },

  content: { padding: 16, gap: 16, paddingBottom: 40 },

  routeBlock: {
    backgroundColor: '#122436',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e3d56',
  },
  routeBlockHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  routeBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  routeBadgeText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  routeName: { color: '#7a9fb8', fontSize: 13, flex: 1 },
  nextBadge: {
    backgroundColor: '#0d1f2d',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#2a9d8f',
  },
  nextText: { color: '#2a9d8f', fontSize: 12, fontWeight: '700' },

  timesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  timePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e3d56',
    backgroundColor: '#0d1f2d',
  },
  timePillPast: { opacity: 0.35 },
  timePillText: { color: '#7a9fb8', fontSize: 13, fontWeight: '600' },
  timePillTextPast: { color: '#3a5a70' },
  timePillTextActive: { color: '#fff' },
});
