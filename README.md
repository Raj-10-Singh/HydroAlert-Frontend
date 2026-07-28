# HydroAlert - Mobile App

React Native (Expo) app for the HydroAlert project. This is the part users actually interact with.

## Stack
Expo, React Navigation, Socket.io-client, Expo Location, react-native-maps

## Screens
- Login / Register
- Home - shows active alerts for whatever zone you're in
- Map - shows alert zones and nearby shelters on a map
- Alerts - full list of alerts
- Shelters - nearby shelters with capacity and a call button

## How the real-time part works
When you open the app it grabs your location, figures out roughly which zone you're in, and joins that zone's "room" through a socket connection. If the backend creates an alert for that zone, it shows up instantly on your phone without needing to refresh anything.

## Running it
npm install
npx expo start

You'll need to update `src/config.js` with wherever your backend is running:
```js
export const SERVER = 'https://hydroalert-backend.onrender.com';
```

If testing locally on your phone, use your computer's local IP instead of localhost (run `ipconfig` to find it), since your phone can't reach "localhost" on your laptop.

## Known issues / things left to do
- Zone detection is currently hardcoded to one zone for testing, need to make it actually calculate based on coordinates
- No offline support yet
- Map only shows basic markers right now, want to add proper polygon zones later

## Related repos
- Backend: https://github.com/Raj-10-Singh/HydroAlert-Backend
- AI model: https://github.com/Raj-10-Singh/HydroAlert-AI
