import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import gradient for button

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const validateEmail = (email) => {
    return email.includes('@');
  };

  const onSubmit = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Please enter a valid email');
      return;
    }
    if (phone.trim() === '') {
      Alert.alert('Please enter your phone number');
      return;
    }

    const data = { email, phone };

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.status === 200) {
        Alert.alert('Success', 'Login successful!');
        router.push('/(tabs)/home');
      } else {
        Alert.alert('Error', result.message || 'Invalid email or phone number');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to connect to the server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={(text) => setPhone(text)}
        placeholderTextColor="#999"
      />

      {/* Log In button with Gradient */}
      <TouchableOpacity onPress={onSubmit}>
        <LinearGradient
          colors={['#FF6666','#FF6667']}          
          style={styles.submitButton}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Navigation to Sign Up */}
      <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
        <Text style={styles.link}>Don’t have an account? Sign Up</Text>
      </TouchableOpacity>

    </View>

    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 16,
    borderRadius: 25,
    backgroundColor: '#FFF',
    width: width * 0.85,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  submitButton: {
    marginTop: 20,
    width: width * 0.85,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    marginTop: 20,
    color: '#FF6F61',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default LoginScreen;
