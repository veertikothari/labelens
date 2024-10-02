import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import {router} from 'expo-router';

export default function SplashScreen({ }) {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/logopink.png')} // Replace with actual logo URL
          style={styles.logo}
        />
      </View>

      {/* Welcome Text */}
      <Text style={styles.welcomeText}>Welcome to Labelens</Text>

      {/* Feature Icons */}
      <View style={styles.featuresContainer}>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => router.push('/(auth)/signup')}
        >
          <Text style={styles.signupButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEEFEF', // Light pastel background color
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 60,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  loginButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#FF6666',
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FF6666',
    borderRadius: 25,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#FF6666',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
