import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const Analysis1 = () => {
  const [analysisData, setAnalysisData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/analyze', { method: 'POST' });
        const data = await response.json();
        setAnalysisData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutritional Analysis</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <ScrollView style={styles.dataContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <Text style={styles.detailText}>Product Name: {analysisData.product_name}</Text>
            <Text style={styles.detailText}>Brand Name: {analysisData.brand_name}</Text>
            <Text style={styles.detailText}>Quantity: {analysisData.quantity}</Text>
            <Text style={styles.detailText}>Weight: {analysisData.weight_in_grams || 'N/A'}g</Text>
            <Text style={styles.detailText}>Category: {analysisData.category}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Macronutrients</Text>
            {Object.keys(analysisData.macronutrients || {}).map((key, index) => (
              <Text key={index} style={styles.detailText}>
                {key.trim()}: {analysisData.macronutrients[key]}g
              </Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Micronutrients</Text>
            {Object.keys(analysisData.micronutrients || {}).length === 0 ? (
              <Text style={styles.detailText}>No micronutrients available.</Text>
            ) : (
              Object.keys(analysisData.micronutrients).map((key, index) => (
                <Text key={index} style={styles.detailText}>
                  {key.trim()}: {analysisData.micronutrients[key]}mg
                </Text>
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Excessive Nutrients</Text>
            {Object.keys(analysisData.excessive_nutrients || {}).length === 0 ? (
              <Text style={styles.detailText}>No excessive nutrients reported.</Text>
            ) : (
              Object.keys(analysisData.excessive_nutrients).map((key, index) => (
                <Text key={index} style={styles.detailText}>
                  {key.trim()}: {analysisData.excessive_nutrients[key]}mg
                </Text>
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.detailText}>{analysisData.ingredients}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Proprietary Claims</Text>
            {analysisData.proprietary_claims.map((claim, index) => (
              <Text key={index} style={styles.detailText}>
                {claim}
              </Text>
            ))}
          </View>

          {analysisData.claims_analysis && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Claims Analysis</Text>
              <Text style={styles.detailText}>{analysisData.claims_analysis.verdict}</Text>
              {analysisData.claims_analysis.why.map((reason, index) => (
                <Text key={index} style={styles.detailText}>
                  - {reason}
                </Text>
              ))}
              <Text style={styles.detailText}>{analysisData.claims_analysis.detailed_analysis}</Text>
            </View>
          )}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.buttonText}>Show Analysis</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(tabs)/home')} style={styles.submitButton}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAF3F3',
  },
  title: {
    fontSize: 28,
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  dataContainer: {
    flex: 1,
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFFBF0',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#333',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF6F61',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginVertical: 2,
  },
  submitButton: {
    marginTop: 15,
    width: width * 0.85,
    height: 50,
    backgroundColor: '#FF6F61',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default Analysis1;
