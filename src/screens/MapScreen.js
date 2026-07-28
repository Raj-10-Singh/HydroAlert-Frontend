import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import api from '../services/api';

const sevColor = { critical:'#ef4444', high:'#f97316', medium:'#eab308', low:'#22c55e' };

export default function MapScreen() {
  const [myLoc, setMyLoc]     = useState(null);
  const [alerts, setAlerts]   = useState([]);
  const [shelters, setShelters] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      setMyLoc({ latitude, longitude });

      const [ar, sr] = await Promise.all([
        api.get('/alerts'),
        api.get(`/shelters/nearby?latitude=${latitude}&longitude=${longitude}&maxDistance=10000`)
      ]);
      setAlerts(ar.data);
      setShelters(sr.data);
    })();
  }, []);

  if (!myLoc) return (
    <View style={s.center}>
      <Text style={{ color:'#64748b' }}>Getting your location...</Text>
    </View>
  );

  return (
    <MapView style={s.map}
      initialRegion={{ ...myLoc, latitudeDelta:0.05, longitudeDelta:0.05 }}
      showsUserLocation
    >
      {alerts.map((a, i) => {
        const c = a.location?.coordinates;
        if (!c) return null;
        const color = sevColor[a.severity] || '#3b82f6';
        return (
          <React.Fragment key={a._id || i}>
            <Marker coordinate={{ latitude:c[1], longitude:c[0] }}
              title={a.title} description={a.message} pinColor={color} />
            <Circle center={{ latitude:c[1], longitude:c[0] }}
              radius={a.radius || 5000}
              fillColor={color + '22'} strokeColor={color} strokeWidth={1} />
          </React.Fragment>
        );
      })}

      {shelters.map((sh, i) => {
        const c = sh.location?.coordinates;
        if (!c) return null;
        return (
          <Marker key={sh._id || i}
            coordinate={{ latitude:c[1], longitude:c[0] }}
            title={sh.name}
            description={`${sh.currentOccupancy}/${sh.capacity} | ${sh.contactNumber}`}
            pinColor="#22c55e"
          />
        );
      })}
    </MapView>
  );
}

const s = StyleSheet.create({
  map:    { flex:1 },
  center: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#0f172a' },
});