import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Products</Text>

      {/* Search Bar */}
      <TextInput style={styles.searchBar} placeholder="Search for products..." placeholderTextColor="#999" />

      {/* Product Boxes */}
      <View style={styles.productContainer}>
        <View style={styles.productBox}>
          <Text style={styles.productText}>Product 1</Text>
        </View>
        <View style={styles.productBox}>
          <Text style={styles.productText}>Product 2</Text>
        </View>
        <View style={styles.productBox}>
          <Text style={styles.productText}>Product 3</Text>
        </View>
        <View style={styles.productBox}>
          <Text style={styles.productText}>Product 4</Text>
        </View>
        <View style={styles.productBox}>
          <Text style={styles.productText}>Product 5</Text>
        </View>
        <View style={styles.productBox}>
          <Text style={styles.productText}>Product 6</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAF3F3', // Soft pink background
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333', // Darker color for text contrast
    marginBottom: 20,
    textAlign: 'center',
  },
  searchBar: {
    height: 50,
    borderColor: '#FF6F61', // Soft pink for the border to match the logo
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFF', // White background for the input
    shadowColor: '#000', // Subtle shadow for elevation effect
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  productContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
  },
  productBox: {
    backgroundColor: '#E6F7FF', // Light blue box background for freshness
    padding: 15,
    width: '45%', // Each box takes about 45% of the width for balanced layout
    marginVertical: 10,
    borderRadius: 15, // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  productText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333', // Darker color for text contrast
  },
});
