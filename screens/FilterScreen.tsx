import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import FaceDetectionService from '../services/FaceDetectionService';
import MorphingService from '../services/MorphingService';

interface FilterScreenProps {
  imageUri: string;
  onBack: () => void;
}

interface FaceData {
  bounds: {
    origin: { x: number; y: number };
    size: { width: number; height: number };
  };
  landmarks: Array<{ x: number; y: number }>;
}

export default function FilterScreen({ imageUri, onBack }: FilterScreenProps) {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [faceData, setFaceData] = useState<FaceData | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [morphIntensity, setMorphIntensity] = useState(0.5);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    processImage();
  }, []);

  const processImage = async () => {
    try {
      setIsProcessing(true);
      // Detect faces
      const faces = await FaceDetectionService.detectFaces(imageUri);
      
      if (faces && faces.length > 0) {
        setFaceData(faces[0]);
        
        // Apply morphing transformation
        const morphed = await MorphingService.applyNeanderthalMorph(
          imageUri,
          faces[0],
          morphIntensity
        );
        setProcessedImage(morphed);
      } else {
        Alert.alert('No Face Detected', 'Please take a photo with your face clearly visible.');
        onBack();
      }
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Processing Error', 'Failed to process your photo. Please try again.');
      onBack();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToGallery = async () => {
    if (!processedImage) return;
    
    setIsSaving(true);
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.granted) {
        const asset = await MediaLibrary.createAssetAsync(processedImage);
        await MediaLibrary.createAlbumAsync('NeanderthalFilter', asset, false);
        Alert.alert('Success', 'Image saved to your gallery!');
      } else {
        Alert.alert('Permission Required', 'Please grant gallery access to save photos.');
      }
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image to gallery.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    if (!processedImage) return;

    try {
      await Sharing.shareAsync(processedImage, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Share Your Neanderthal Transformation',
        UTI: 'com.compuserve.gif',
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share image.');
    }
  };

  const updateMorphIntensity = async (newIntensity: number) => {
    setMorphIntensity(newIntensity);
    setIsProcessing(true);
    try {
      if (faceData) {
        const morphed = await MorphingService.applyNeanderthalMorph(
          imageUri,
          faceData,
          newIntensity
        );
        setProcessedImage(morphed);
      }
    } catch (error) {
      console.error('Error updating morphing:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Neanderthal Transformation</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Image Comparison */}
      <ScrollView style={styles.imageContainer}>
        {isProcessing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
            <Text style={styles.loadingText}>
              {morphIntensity === 0.5 ? 'Detecting face...' : 'Applying transformation...'}
            </Text>
          </View>
        ) : (
          <>
            {showComparison && (
              <View style={styles.comparisonContainer}>
                <View style={styles.imageColumn}>
                  <Text style={styles.imageLabel}>Original</Text>
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.comparisonImage}
                  />
                </View>
                <View style={styles.imageColumn}>
                  <Text style={styles.imageLabel}>Neanderthal</Text>
                  {processedImage && (
                    <Image
                      source={{ uri: processedImage }}
                      style={styles.comparisonImage}
                    />
                  )}
                </View>
              </View>
            )}
            
            {!showComparison && processedImage && (
              <Image
                source={{ uri: processedImage }}
                style={styles.fullImage}
              />
            )}
          </>
        )}
      </ScrollView>

      {/* Morphing Intensity Slider */}
      {!isProcessing && (
        <View style={styles.controlsContainer}>
          <Text style={styles.controlLabel}>Transformation Intensity</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.intensityValue}>{Math.round(morphIntensity * 100)}%</Text>
            {/* Simplified slider using buttons */}
            <View style={styles.buttonSlider}>
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.intensityButton,
                    morphIntensity === value && styles.intensityButtonActive,
                  ]}
                  onPress={() => updateMorphIntensity(value)}
                >
                  <Text style={styles.intensityButtonText}>{Math.round(value * 100)}%</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      {!isProcessing && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.comparisonToggle}
            onPress={() => setShowComparison(!showComparison)}
          >
            <MaterialCommunityIcons name="compare" size={20} color="#fff" />
            <Text style={styles.buttonText}>
              {showComparison ? 'Hide Comparison' : 'Show Comparison'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={handleShare}
          >
            <MaterialCommunityIcons name="share-variant" size={20} color="#fff" />
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSaveToGallery}
            disabled={isSaving}
          >
            <MaterialCommunityIcons
              name={isSaving ? 'loading' : 'download'}
              size={20}
              color="#fff"
            />
            <Text style={styles.buttonText}>
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: '#000',
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 44,
  },
  imageContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  loadingText: {
    color: '#fff',
    marginTop: 15,
    fontSize: 14,
  },
  comparisonContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  imageColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  imageLabel: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  comparisonImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 10,
    backgroundColor: '#333',
  },
  fullImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    marginBottom: 10,
  },
  controlsContainer: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  controlLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  sliderContainer: {
    alignItems: 'center',
  },
  intensityValue: {
    color: '#FF6B6B',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonSlider: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  intensityButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  intensityButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  intensityButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: 10,
  },
  comparisonToggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
  },
  shareButton: {
    backgroundColor: '#4A9EFF',
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
