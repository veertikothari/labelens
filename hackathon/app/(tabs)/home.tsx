import React from 'react';
import {router} from 'expo-router';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function App() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>LABELENS</Text>
        <Image
          style={styles.profileImage}
          source={require('@/assets/images/logo.png')}        />
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Discover Products that Matter</Text>
        <TouchableOpacity style={styles.searchButton} onPress={() => router.push('/(tabs)/search')}>
          <Text style={styles.searchButtonText}>Search for Products</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.scanButton} onPress={() => router.push('/(tabs)/scanner')}>
          <Text style={styles.scanButtonText}>Scan a Product</Text>
        </TouchableOpacity>
      </View>

      {/* Featured Section */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.productCard}>
            <Image
              style={styles.productImage}
              source={require('@/assets/images/p1.jpeg')}
            />
            <Text style={styles.productName}>Salted Peanuts</Text>
          </View>
          <View style={styles.productCard}>
            <Image
              style={styles.productImage}
              source={require('@/assets/images/p2.jpeg')}
            />
            <Text style={styles.productName}>Cornitos Jalapeno</Text>
          </View>
          <View style={styles.productCard}>
            <Image
              style={styles.productImage}
              source={require('@/assets/images/p3.jpeg')}
            />
            <Text style={styles.productName}>Cornitos Tomato</Text>
          </View>
        </ScrollView>
      </View>
    <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Featured Blogs</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.productCard}>
            <Image
              style={styles.productImage}
              source={require('@/assets/images/b1.jpg')}
            />
            <Text style={styles.productName}>Dinner</Text>
          </View>
          <View style={styles.productCard}>
            <Image
              style={styles.productImage}
              source={require('@/assets/images/b2.jpg')}

            />
            <Text style={styles.productName}>SOS Series</Text>
          </View>
          <View style={styles.productCard}>
            <Image
              style={styles.productImage}
              source={require('@/assets/images/b3.jpg')}
            />
            <Text style={styles.productName}>Fall</Text>
          </View>
        </ScrollView>
      </View>

      {/* Footer 
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerIcon} >
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIcon} onPress={() => router.push('/(tabs)/search')}>
          <Text style={styles.footerText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIcon} onPress={() => router.push('/(tabs)/profile')}>
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </View>*/}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF3F3', // Soft Pink from the logo background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomColor: '#ECECEC',
    borderBottomWidth: 1,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333', // Dark color to contrast with pink
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 20,
  },
  heroSection: {
    padding: 20,
    backgroundColor: '#E6F7FF', // Light blue (or could adjust to fit your theme)
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchButton: {
    width: width * 0.8,
    height: 50,
    backgroundColor: '#FF6F61', // Vibrant pink from the logo
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  scanButton: {
    width: width * 0.8,
    height: 50,
    backgroundColor: '#5FD927', // Green from the logo
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  featuredSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  productCard: {
    width: 120,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 15,
    marginBottom: 10,
    
  },
  productName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    
  },
  footerIcon: {
    alignItems: 'center',
  },
  footerText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
