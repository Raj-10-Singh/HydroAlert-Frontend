import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Login({ navigation }) {
  const [email, setEmail]       = useState('');
  const [pass, setPass]         = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuth();

  const submit = async () => {
    if (!email || !pass) return Alert.alert('Fill in all fields');
    setLoading(true);
    try {
      await login(email.trim(), pass);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <View style={s.wrap}>
      <Text style={s.title}>HydroAlert</Text>
      <Text style={s.sub}>Real-time flood alerts for your area</Text>

      <TextInput style={s.input} placeholder="Email" placeholderTextColor="#475569"
        value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={s.input} placeholder="Password" placeholderTextColor="#475569"
        value={pass} onChangeText={setPass} secureTextEntry />

      <TouchableOpacity style={s.btn} onPress={submit} disabled={loading}>
        <Text style={s.btnTxt}>{loading ? 'Please wait...' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={s.link}>New here? Create an account</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  wrap:   { flex:1, backgroundColor:'#0f172a', justifyContent:'center', padding:24 },
  title:  { fontSize:30, fontWeight:'bold', color:'#f1f5f9', textAlign:'center' },
  sub:    { color:'#475569', textAlign:'center', marginBottom:36, marginTop:6 },
  input:  { backgroundColor:'#1e293b', color:'#f1f5f9', padding:14, borderRadius:10, marginBottom:12 },
  btn:    { backgroundColor:'#3b82f6', padding:14, borderRadius:10, alignItems:'center', marginTop:4 },
  btnTxt: { color:'#fff', fontWeight:'600', fontSize:15 },
  link:   { color:'#3b82f6', textAlign:'center', marginTop:18 },
});