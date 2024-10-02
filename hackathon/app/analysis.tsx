import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { router } from 'expo-router';
const { width } = Dimensions.get('window');

const Analysis = () => {
  const [loading, setLoading] = useState(false);

  const analysisData = {
    product_name: "Belgian Chocochip Minis",
    brand_name: "The Good Gobble",
    quantity: "175g",
    weight_in_grams: null,
    macronutrients: {
      "Calories": "503",
      "Total Fat": "5.3g",
      "Saturated Fat": "3.8g",
      "Total Carbohydrate": "67.72g",
      "Dietary Fiber": "14.66g",
      "Sugars": "21.38g",
      "Protein": "2.00g"
    },
    micronutrients: {},
    excessive_nutrients: {
      "Cholesterol": "17.4mg",
      "Sodium": "121.7mg"
    },
    ingredients: "Refined Flour, Butter, Castor Sugar, Milk Powder, French Vanilla Extract, Sodium Bi Carb",
    harmful_ingredients: [],
    category: "Cookies",
    proprietary_claims: [
      "Handmade with love",
      "Fresh from the oven",
      "All butter & french vanilla",
      "No margarine or compound",
      "Only the best will dough",
      "Hand-Packed",
      "Premium Quality",
      "100% Natural",
      "Batch Weight: 175g",
      "Batch No.: A02707",
      "Mfg. Dt.: 27/07/24",
      "Exp. Dt.: 27/11/24",
      "MRP (Incl. of all Taxes): 270/-",
      "USP: 1.54/gm"
    ],
    claims_analysis: {
      verdict: "Misleading",
      why: [
        "Claim of '100% Natural' is questionable due to the presence of Sodium Bi Carb, which is a synthetic compound.",
        "Uses refined ingredients such as Refined Flour and Castor Sugar, which do not align with the 'Premium Quality' claim typically associated with whole, minimally processed ingredients."
      ],
      detailed_analysis: "The '100% Natural' claim often implies that the product is made from whole, unprocessed ingredients. However, Sodium Bi Carb (baking soda) is synthetically produced, contradicting this claim. Additionally, the product contains refined flour and castor sugar, which are heavily processed. These ingredients do not align with consumer expectations of 'Premium Quality' that suggests more natural, less industrially processed components. Therefore, the labeling can be misleading by suggesting a healthier or more 'natural' product than it actually is."
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutritional Analysis</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          <Text style={styles.sectionTitle}>Product Name: {analysisData.product_name}</Text>
          <Text style={styles.detailText}>Brand Name: {analysisData.brand_name}</Text>
          <Text style={styles.detailText}>Quantity: {analysisData.quantity}</Text>
          <Text style={styles.detailText}>Weight: {analysisData.weight_in_grams ? `${analysisData.weight_in_grams}g` : "N/A"}</Text>

          <Text style={styles.sectionTitle}>Macronutrients:</Text>
          {Object.entries(analysisData.macronutrients).map(([key, value], index) => (
            <Text key={index} style={styles.detailText}>
              {key}: {value}
            </Text>
          ))}

          <Text style={styles.sectionTitle}>Micronutrients:</Text>
          {Object.keys(analysisData.micronutrients).length === 0 ? (
            <Text style={styles.detailText}>None</Text>
          ) : (
            Object.entries(analysisData.micronutrients).map(([key, value], index) => (
              <Text key={index} style={styles.detailText}>
                {key}: {value}
              </Text>
            ))
          )}

          <Text style={styles.sectionTitle}>Excessive Nutrients:</Text>
          {Object.entries(analysisData.excessive_nutrients).map(([key, value], index) => (
            <Text key={index} style={styles.detailText}>
              {key}: {value}
            </Text>
          ))}

          <Text style={styles.detailText}>Ingredients: {analysisData.ingredients}</Text>

          <Text style={styles.sectionTitle}>Harmful Ingredients:</Text>
          {analysisData.harmful_ingredients.length === 0 ? (
            <Text style={styles.detailText}>None</Text>
          ) : (
            analysisData.harmful_ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.detailText}>
                {ingredient}
              </Text>
            ))
          )}

          <Text style={styles.detailText}>Category: {analysisData.category}</Text>

          <Text style={styles.sectionTitle}>Proprietary Claims:</Text>
          {analysisData.proprietary_claims.map((claim, index) => (
            <Text key={index} style={styles.detailText}>
              {claim}
            </Text>
          ))}

          <Text style={styles.sectionTitle}>Claims Analysis:</Text>
          <Text style={styles.detailText}>Verdict: {analysisData.claims_analysis.verdict}</Text>
          <Text style={styles.detailText}>Why:</Text>
          {analysisData.claims_analysis.why.map((reason, index) => (
            <Text key={index} style={styles.detailText}>
              - {reason}
            </Text>
          ))}
          <Text style={styles.detailText}>Detailed Analysis: {analysisData.claims_analysis.detailed_analysis}</Text>
        </ScrollView>
      )}


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
    backgroundColor: '#FAF3F3', // Soft pink background
  },
  title: {
    fontSize: 24,
    margin: 20,
    textAlign: 'center',
    color: '#333', // Dark text color
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
    color: '#FF6F61', // Vibrant pink for section headers
    fontWeight: '600',
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  submitButton: {
    marginTop: 20,
    width: width * 0.85,
    height: 50,
    backgroundColor: '#FF6F61', // Vibrant pink for buttons
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    marginVertical: 10,
  }
});

export default Analysis;
