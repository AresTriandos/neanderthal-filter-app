// Color palette
export const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4A9EFF',
  background: '#1a1a1a',
  dark: '#000',
  white: '#fff',
  gray: '#333',
  lightGray: 'rgba(255,255,255,0.1)',
  darkGray: 'rgba(0,0,0,0.5)',
};

// App configuration
export const APP_CONFIG = {
  appName: 'NeanderthalFilter',
  appVersion: '1.0.0',
  appBundle: 'com.neanderthalfilter.app',
  albumName: 'NeanderthalFilter',
};

// Morphing intensity presets
export const MORPHING_PRESETS = {
  subtle: 0.2,
  moderate: 0.4,
  strong: 0.6,
  veryStrong: 0.8,
  extreme: 1.0,
};

// Face detection thresholds
export const FACE_DETECTION = {
  minFaceSize: 0.1, // 10% of image
  maxFaceSize: 2.0, // 200% of image
  confidenceThreshold: 0.5,
};

// Performance settings
export const PERFORMANCE = {
  imageQuality: 0.9,
  maxImageDimension: 2048,
  cacheMaxSize: 100 * 1024 * 1024, // 100MB
};

// Sharing options
export const SHARING_PLATFORMS = [
  { name: 'Instagram', icon: 'instagram', url: 'instagram://' },
  { name: 'TikTok', icon: 'tiktok', url: 'tiktok://' },
  { name: 'Facebook', icon: 'facebook', url: 'fb://' },
  { name: 'Twitter', icon: 'twitter', url: 'twitter://' },
];

// Error messages
export const ERROR_MESSAGES = {
  cameraPermission: 'Camera permission is required to capture photos',
  galleryPermission: 'Gallery permission is required to save photos',
  faceNotDetected: 'No face detected. Please ensure your face is clearly visible.',
  processingError: 'An error occurred while processing your photo.',
  sharingError: 'Failed to share the image.',
  savingError: 'Failed to save the image to gallery.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  photoCapture: 'Photo captured successfully!',
  imageSaved: 'Image saved to your gallery!',
  sharedSuccess: 'Image shared successfully!',
  transformationComplete: 'Neanderthal transformation complete!',
};
