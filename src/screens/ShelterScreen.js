import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, RefreshControl } from 'react-native';
import * as Location from 'expo-location';
import api from '../services/api';

export default function Shelters() {
  const [shelters, setShelters] = useState([]);
  const [refresh, setRefresh]   = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let url = '/shelters';
      if (status === 'granted') {
        const l = await Location.getCurrentPositionAsync({});
        url = `/shelters/nearby?latitude=${l.coords.latitude}&longitude=${l.coords.longitude}&maxDistance=15000`;
      }
      const { data } = await api.get(url);
      setShelters(data);
    } catch (e) { console.log(e.message); }
    finally { setRefresh(false); }
  };

  return (
    <View style={s.wrap}>
      <Text style={s.heading}>Nearby Shelters</Text>
      <FlatList
        data={shelters}
        keyExtractor={(item, i) => item._id || String(i)}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={() => { setRefresh(true); load(); }} tintColor="#3b82f6" />}
        renderItem={({ item }) => {
          const full = item.currentOccupancy >= item.capacity;
          return (
            <View style={s.card}>
              <View style={s.row}>
                <Text style={s.name}>{item.name}</Text>
                <Text style={[s.status, { color: full ? '#ef4444' : '#22c55e' }]}>
                  {full ? 'FULL' : 'OPEN'}
                </Text>
              </View>
              <Text style={s.addr}>{item.address}</Text>
              <Text style={s.cap}>{item.currentOccupancy} / {item.capacity} occupied</Text>

              {item.facilities?.length > 0 && (
                <Text style={s.fac}>{item.facilities.join(' · ')}</Text>
              )}

              {item.contactNumber && (
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.contactNumber}`)}>
                  <Text style={s.call}>Call Shelter</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        ListEmptyComponent={<Text style={s.empty}>No shelters found nearby</Text>}
        contentContainerStyle={{ paddingBottom:30 }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap:    { flex:1, backgroundColor:'#0f172a' },
  heading: { fontSize:22, fontWeight:'bold', color:'#f1f5f9', padding:20, paddingTop:60 },
  card:    { marginHorizontal:16, marginBottom:12, backgroundColor:'#1e293b', borderRadius:12, padding:14 },
  row:     { flexDirection:'row', justifyContent:'space-between', marginBottom:4 },
  name:    { color:'#f1f5f9', fontWeight:'600', fontSize:14, flex:1 },
  status:  { fontSize:12, fontWeight:'700' },
  addr:    { color:'#64748b', fontSize:12, marginBottom:6 },
  cap:     { color:'#94a3b8', fontSize:13, marginBottom:6 },
  fac:     { color:'#3b82f6', fontSize:12, marginBottom:10 },
  call:    { color:'#22c55e', fontWeight:'600', fontSize:14 },
  empty:   { color:'#475569', textAlign:'center', marginTop:60 },
});