import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Register({ navigation }) {
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass]   = useState('');
  const [phone, setPhone] = useState('');
  const [busy, setBusy]   = useState(false);
  const { register }      = useAuth();

  const submit = async () => {
    if (!name || !email || !pass) return Alert.alert('Name, email and password required');
    setBusy(true);
    try {
      await register(name, email, pass, phone);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Registration failed');
    }
    setBusy(false);
  };

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <Text style={s.title}>Create Account</Text>

      <TextInput style={s.input} placeholder="Full Name"       placeholderTextColor="#475569" value={name}  onChangeText={setName} />
      <TextInput style={s.input} placeholder="Email"           placeholderTextColor="#475569" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={s.input} placeholder="Password"        placeholderTextColor="#475569" value={pass}  onChangeText={setPass} secureTextEntry />
      <TextInput style={s.input} placeholder="Phone (optional)" placeholderTextColor="#475569" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <TouchableOpacity style={s.btn} onPress={submit} disabled={busy}>
        <Text style={s.btnTxt}>{busy ? 'Creating...' : 'Register'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={s.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap:   { flexGrow:1, backgroundColor:'#0f172a', justifyContent:'center', padding:24 },
  title:  { fontSize:26, fontWeight:'bold', color:'#f1f5f9', textAlign:'center', marginBottom:30 },
  input:  { backgroundColor:'#1e293b', color:'#f1f5f9', padding:14, borderRadius:10, marginBottom:12 },
  btn:    { backgroundColor:'#3b82f6', padding:14, borderRadius:10, alignItems:'center', marginTop:4 },
  btnTxt: { color:'#fff', fontWeight:'600', fontSize:15 },
  link:   { color:'#3b82f6', textAlign:'center', marginTop:18 },
});