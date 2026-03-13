// Маршруты маршруток города Каракол
export const ROUTES = [
  {
    id: '1',
    number: '101',
    name: 'Вокзал — Рынок Дордой',
    color: '#e76f51',
    stops: [
      { id: 's1', name: 'Автовокзал', lat: 42.4869, lng: 78.3932 },
      { id: 's2', name: 'ул. Токтогула', lat: 42.4890, lng: 78.3910 },
      { id: 's3', name: 'Центральная площадь', lat: 42.4912, lng: 78.3888 },
      { id: 's4', name: 'Больница', lat: 42.4935, lng: 78.3865 },
      { id: 's5', name: 'Рынок Дордой', lat: 42.4958, lng: 78.3840 },
    ],
    schedule: ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00',
               '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    intervalMin: 30,
  },
  {
    id: '2',
    number: '102',
    name: 'Мкр. Алатоо — Базар',
    color: '#2a9d8f',
    stops: [
      { id: 's6', name: 'Мкр. Алатоо', lat: 42.4820, lng: 78.4010 },
      { id: 's7', name: 'Школа №5', lat: 42.4845, lng: 78.3985 },
      { id: 's8', name: 'ул. Гагарина', lat: 42.4870, lng: 78.3960 },
      { id: 's9', name: 'Центральный базар', lat: 42.4895, lng: 78.3935 },
      { id: 's10', name: 'Мечеть', lat: 42.4920, lng: 78.3910 },
    ],
    schedule: ['06:30', '07:00', '07:30', '08:00', '09:00', '10:00',
               '11:00', '13:00', '14:00', '15:30', '17:00', '18:30'],
    intervalMin: 40,
  },
  {
    id: '3',
    number: '103',
    name: 'Каракол — Ущелье',
    color: '#e9c46a',
    stops: [
      { id: 's11', name: 'Центр города', lat: 42.4900, lng: 78.3920 },
      { id: 's12', name: 'Зоопарк', lat: 42.4930, lng: 78.3960 },
      { id: 's13', name: 'Мост', lat: 42.4970, lng: 78.4000 },
      { id: 's14', name: 'Санаторий', lat: 42.5010, lng: 78.4050 },
      { id: 's15', name: 'Каракол ущелье', lat: 42.5060, lng: 78.4120 },
    ],
    schedule: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
    intervalMin: 120,
  },
  {
    id: '4',
    number: '104',
    name: 'Пристань — Вокзал',
    color: '#a8dadc',
    stops: [
      { id: 's16', name: 'Пристань Каракол', lat: 42.4780, lng: 78.3850 },
      { id: 's17', name: 'ул. Абдрахманова', lat: 42.4810, lng: 78.3875 },
      { id: 's18', name: 'Почта', lat: 42.4840, lng: 78.3900 },
      { id: 's19', name: 'Универмаг', lat: 42.4870, lng: 78.3925 },
      { id: 's20', name: 'Автовокзал', lat: 42.4869, lng: 78.3932 },
    ],
    schedule: ['07:00', '08:00', '09:00', '10:00', '11:00', '13:00',
               '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
    intervalMin: 60,
  },
];

// Симулированные позиции маршруток (в реальном приложении — с GPS трекеров)
export const getBusPositions = () => {
  const now = new Date();
  const minutes = now.getMinutes() + now.getSeconds() / 60;

  return ROUTES.map(route => {
    const stopCount = route.stops.length;
    const progress = (minutes % route.intervalMin) / route.intervalMin;
    const stopIndex = Math.floor(progress * (stopCount - 1));
    const nextStopIndex = Math.min(stopIndex + 1, stopCount - 1);
    const stopProgress = (progress * (stopCount - 1)) % 1;

    const currentStop = route.stops[stopIndex];
    const nextStop = route.stops[nextStopIndex];

    const lat = currentStop.lat + (nextStop.lat - currentStop.lat) * stopProgress;
    const lng = currentStop.lng + (nextStop.lng - currentStop.lng) * stopProgress;

    return {
      routeId: route.id,
      routeNumber: route.number,
      color: route.color,
      lat,
      lng,
      nextStop: nextStop.name,
      minutesToNextStop: Math.round((1 - stopProgress) * 3),
    };
  });
};

// Следующий рейс от остановки
export const getNextDeparture = (routeId, stopId) => {
  const route = ROUTES.find(r => r.id === routeId);
  if (!route) return null;

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  for (const timeStr of route.schedule) {
    const [h, m] = timeStr.split(':').map(Number);
    const scheduleTime = h * 60 + m;
    if (scheduleTime > currentTime) {
      const diff = scheduleTime - currentTime;
      return { time: timeStr, minutesLeft: diff };
    }
  }
  return { time: route.schedule[0], minutesLeft: null, tomorrow: true };
};
