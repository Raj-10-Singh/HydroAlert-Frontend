import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import { connect, joinZone, get } from '../services/socket';
import api from '../services/api';

const colors = { critical:'#ef4444', high:'#f97316', medium:'#eab308', low:'#22c55e' };

export default function Home() {
  const { user, logout }      = useAuth();
  const [alerts, setAlerts]   = useState([]);
  const [zone, setZone]       = useState('');
  const [refreshing, setRef]  = useState(false);

  useEffect(() => {
    setup();
    loadAlerts();
  }, []);

  const setup = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const loc = await Location.getCurrentPositionAsync({});
    const zoneId = 'zone_kolkata_north'; // will be dynamic later
    setZone(zoneId);

    await api.put('/auth/update-location', {
      latitude:  loc.coords.latitude,
      longitude: loc.coords.longitude,
      zone:      zoneId
    });

    const sock = connect();
    joinZone(zoneId);

    sock.on('new-alert',      (a) => setAlerts(p => [a, ...p]));
    sock.on('alert-resolved', ({ alertId }) => setAlerts(p => p.filter(a => a._id !== alertId)));
  };

  const loadAlerts = async () => {
    try {
      const { data } = await api.get('/alerts');
      setAlerts(data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const onRefresh = async () => {
    setRef(true);
    await loadAlerts();
    setRef(false);
  };

  const renderAlert = ({ item }) => (
    <View style={[s.card, { borderLeftColor: colors[item.severity] || '#64748b' }]}>
      <View style={s.row}>
        <Text style={s.cardTitle}>{item.title}</Text>
        <Text style={[s.sev, { color: colors[item.severity] }]}>{item.severity?.toUpperCase()}</Text>
      </View>
      <Text style={s.msg}>{item.message}</Text>
      <Text style={s.zone}>{item.zone}</Text>
    </View>
  );

  return (
    <View style={s.wrap}>
      <View style={s.header}>
        <Text style={s.greeting}>Hey {user?.name?.split(' ')[0]} 👋</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={s.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {zone ? <Text style={s.zoneTag}>Watching: {zone}</Text> : null}

      <FlatList
        data={alerts}
        keyExtractor={(item, i) => item._id || String(i)}
        renderItem={renderAlert}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
        ListHeaderComponent={<Text style={s.section}>Active Alerts</Text>}
        ListEmptyComponent={<Text style={s.empty}>No alerts in your area right now</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap:     { flex:1, backgroundColor:'#0f172a' },
  header:   { flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:20, paddingTop:60 },
  greeting: { fontSize:20, fontWeight:'bold', color:'#f1f5f9' },
  logout:   { color:'#ef4444' },
  zoneTag:  { color:'#475569', fontSize:12, paddingHorizontal:20, marginBottom:8 },
  section:  { color:'#64748b', fontSize:13, fontWeight:'600', paddingHorizontal:20, paddingBottom:10 },
  card:     { marginHorizontal:16, marginBottom:10, backgroundColor:'#1e293b', borderRadius:12, padding:14, borderLeftWidth:4 },
  row:      { flexDirection:'row', justifyContent:'space-between', marginBottom:6 },
  cardTitle:{ color:'#f1f5f9', fontWeight:'600', fontSize:14, flex:1 },
  sev:      { fontSize:11, fontWeight:'700', marginLeft:8 },
  msg:      { color:'#94a3b8', fontSize:13, marginBottom:6 },
  zone:     { color:'#475569', fontSize:11 },
  empty:    { color:'#475569', textAlign:'center', marginTop:60 },
});