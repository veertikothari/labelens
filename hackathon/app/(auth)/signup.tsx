import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Adding a gradient to buttons
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const SignUpScreen = ({ }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const validateEmail = (email) => email.includes('@');

  const onSubmit = async () => {
    if (name.trim() === '') {
      Alert.alert('Please enter your name');
      return;
    }
    if (age.trim() === '') {
      Alert.alert('Please enter your age');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Please enter a valid email');
      return;
    }
    if (phone.trim() === '') {
      Alert.alert('Please enter your phone number');
      return;
    }
    if (weight.trim() === '') {
      Alert.alert('Please enter your weight');
      return;
    }
    if (height.trim() === '') {
      Alert.alert('Please enter your height');
      return;
    }

    // Store data in Firestore
    const data = {
      name,
      age,
      email,
      phone,
      weight,
      height,
    };

    try {
      // Make POST request to Flask backend
      const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.status === 201) {
        Alert.alert('Success', 'User signed up successfully!');
        router.push('/(tabs)/home'); // Navigate to home screen
      } else {
        Alert.alert('Error', result.error || 'Failed to sign up');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to connect to the server');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Background Image */}
      {/*<Image source={require('@/assets/images/background.jpg')} style={styles.backgroundImage} />
      <LinearGradient colors={['#FF8964', '#FFFFFF']} style={styles.backgroundImage}>
      </LinearGradient>*/}
      <Text style={styles.title}>Sign Up to Labelens</Text>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        value={age}
        onChangeText={(text) => setAge(text)}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={(text) => setPhone(text)}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={(text) => setWeight(text)}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={(text) => setHeight(text)}
        placeholderTextColor="#888"
      />

      {/* Sign Up Button with Gradient */}
      <TouchableOpacity onPress={onSubmit}>
        <LinearGradient
          colors={['#FF6F61', '#FF8964']}
          style={styles.submitButton}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Link to Log In */}
      <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
        <Text style={styles.link}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    opacity: 0.3,
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
    paddingLeft: 12,
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

export default SignUpScreen;
