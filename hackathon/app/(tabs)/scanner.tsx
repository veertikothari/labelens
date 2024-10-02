import React, { useState } from 'react';
import { View, Text, Button, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { router } from 'expo-router';
const { width } = Dimensions.get('window');

const firebaseConfig = {
  apiKey: "AIzaSyCQHLorWTJX-q1TNIMS6sSAVfJ992FPtGk",
  authDomain: "label-lens-63cb7.firebaseapp.com",
  databaseURL: "https://label-lens-63cb7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "label-lens-63cb7",
  storageBucket: "label-lens-63cb7.appspot.com",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const Scanner = () => {
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [uploading, setUploading] = useState(false);
  const [displayedImages, setDisplayedImages] = useState(images);

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });
  
    if (!result.canceled) {
      setImages(result.assets);
      setDisplayedImages(result.assets);
    }
  };

  const uploadImages = async () => {
    setUploading(true);
    for (const image of images) {
      const uniqueId = uuidv4();
      const imageRef = ref(storage, `images/${uniqueId}.jpg`);
      const response = await fetch(image.uri);
      const blob = await response.blob();

      uploadBytes(imageRef, blob)
        .then(() => {
          console.log(`Image uploaded with ID: ${uniqueId}`);
          setImageUrls((prev) => ({ ...prev, [image.uri]: uniqueId }));
        })
        .catch((error) => {
          console.error(error);
        });
    }
    setUploading(false);
  };

  const deleteImage = async (imageUri) => {
  setImages(images.filter((image) => image.uri !== imageUri));
  setDisplayedImages(displayedImages.filter((image) => image.uri !== imageUri));
  setImageUrls((prev) => {
    const newUrls = { ...prev };
    delete newUrls[imageUri];
    return newUrls;
  });
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Images</Text>

      <TouchableOpacity onPress={pickImages} style={styles.submitButton}>
        <Text style={styles.buttonText}>Pick Images</Text>
      </TouchableOpacity>

      <ScrollView style={styles.imageContainer}>
  {displayedImages.map((image, index) => (
    <View key={index} style={styles.imageBox}>
      <Image source={{ uri: image.uri }} style={styles.image} />
      <TouchableOpacity onPress={() => deleteImage(image.uri)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  ))}
</ScrollView>

      <TouchableOpacity onPress={uploadImages} style={styles.submitButton} disabled={uploading} >
        <Text style={styles.buttonText}>{uploading ? 'Uploading...' : 'Upload Images'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/analysis')} style={styles.submitButton} >
        <Text style={styles.buttonText}>Show Analysis</Text>
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
  imageContainer: {
    flex: 1,
    marginVertical: 10,
  },
  imageBox: {
    marginBottom: 15,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#E6F7FF', // Light blue background for images
    padding: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#FF4C61', // Red delete button
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Scanner;
