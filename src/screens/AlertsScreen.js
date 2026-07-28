import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import api from '../services/api';
import { get } from '../services/socket';

const colors = { critical:'#ef4444', high:'#f97316', medium:'#eab308', low:'#22c55e' };

export default function Alerts() {
  const [alerts, setAlerts]   = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    load();
    const sock = get();
    if (sock) {
      sock.on('new-alert',      (a)  => setAlerts(p => [a, ...p]));
      sock.on('alert-resolved', ({ alertId }) => setAlerts(p => p.filter(x => x._id !== alertId)));
    }
    return () => {
      sock?.off('new-alert');
      sock?.off('alert-resolved');
    };
  }, []);

  const load = async () => {
    try {
      const { data } = await api.get('/alerts');
      setAlerts(data);
    } catch (e) { console.log(e.message); }
  };

  const onRefresh = async () => {
    setRefresh(true);
    await load();
    setRefresh(false);
  };

  return (
    <View style={s.wrap}>
      <Text style={s.heading}>Flood Alerts</Text>
      <FlatList
        data={alerts}
        keyExtractor={(item, i) => item._id || String(i)}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} tintColor="#3b82f6" />}
        renderItem={({ item }) => (
          <View style={[s.card, { borderLeftColor: colors[item.severity] || '#64748b' }]}>
            <View style={s.row}>
              <Text style={s.title}>{item.title}</Text>
              <Text style={[s.sev, { color: colors[item.severity] }]}>{item.severity?.toUpperCase()}</Text>
            </View>
            <Text style={s.msg}>{item.message}</Text>
            <Text style={s.meta}>{item.zone} · {new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={s.empty}>No active alerts</Text>}
        contentContainerStyle={{ paddingBottom:20 }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap:    { flex:1, backgroundColor:'#0f172a' },
  heading: { fontSize:22, fontWeight:'bold', color:'#f1f5f9', padding:20, paddingTop:60 },
  card:    { marginHorizontal:16, marginBottom:10, backgroundColor:'#1e293b', borderRadius:12, padding:14, borderLeftWidth:4 },
  row:     { flexDirection:'row', justifyContent:'space-between', marginBottom:6 },
  title:   { color:'#f1f5f9', fontWeight:'600', fontSize:14, flex:1 },
  sev:     { fontSize:11, fontWeight:'700' },
  msg:     { color:'#94a3b8', fontSize:13, marginBottom:6 },
  meta:    { color:'#475569', fontSize:11 },
  empty:   { color:'#475569', textAlign:'center', marginTop:60 },
});