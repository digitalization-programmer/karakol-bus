# 🚌 Каракол Маршрутка — Мобильное приложение

Приложение для отслеживания маршруток города Каракол в реальном времени.

## Функции

- 🗺️ **Карта города** с маршрутами маршруток
- 📍 **Отслеживание** положения маршруток онлайн
- 📋 **Список маршрутов** со всеми остановками
- 🕐 **Расписание** с подсветкой ближайшего рейса

## Маршруты

| № | Маршрут |
|---|---------|
| 101 | Вокзал — Рынок Дордой |
| 102 | Мкр. Алатоо — Базар |
| 103 | Каракол — Ущелье |
| 104 | Пристань — Вокзал |

## Установка и запуск

### Требования
- Node.js 18+
- npm или yarn
- Expo CLI
- Android Studio (для Android) или Xcode (для iOS)

### Шаги

```bash
# 1. Клонировать репозиторий
git clone https://github.com/username/karakol-bus.git
cd karakol-bus

# 2. Установить зависимости
npm install

# 3. Запустить
npm start

# Запуск на Android
npm run android

# Запуск на iOS
npm run ios
```

### Запуск через Expo Go (самый простой способ)
1. Установить [Expo Go](https://expo.dev/client) на телефон
2. Запустить `npm start`
3. Отсканировать QR-код

## Структура проекта

```
karakol-bus/
├── App.js                    # Точка входа
├── package.json
└── src/
    ├── data/
    │   └── routes.js         # Данные маршрутов и GPS
    ├── navigation/
    │   └── AppNavigator.js   # Навигация
    └── screens/
        ├── MapScreen.js      # Карта с маршрутками
        ├── RoutesScreen.js   # Список маршрутов
        └── ScheduleScreen.js # Расписание
```

## Подключение реального GPS

Для подключения реальных GPS-трекеров замените функцию `getBusPositions()` 
в файле `src/data/routes.js` на запрос к вашему серверу:

```js
export const getBusPositions = async () => {
  const response = await fetch('https://ваш-сервер.com/api/buses');
  return await response.json();
};
```

## Технологии

- React Native + Expo
- React Navigation
- React Native Maps (Google Maps)
- Expo Location

---
Разработано для города Каракол, Иссык-Куль, Кыргызстан 🇰🇬
