import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CameraScreen from './screens/CameraScreen';
import FilterScreen from './screens/FilterScreen';

type AppScreen = 'camera' | 'filter';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handlePhotoCapture = (photoUri: string) => {
    setCapturedImage(photoUri);
    setCurrentScreen('filter');
  };

  const handleBackToCamera = () => {
    setCapturedImage(null);
    setCurrentScreen('camera');
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'camera' ? (
        <CameraScreen onPhotoCapture={handlePhotoCapture} />
      ) : (
        <FilterScreen
          imageUri={capturedImage!}
          onBack={handleBackToCamera}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
