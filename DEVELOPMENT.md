# 🛠️ Development Guide - Neanderthal Filter App

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- iOS Simulator (macOS) or Android Emulator
- Code editor (VSCode recommended)

### Installation

```bash
# Clone and setup
git clone https://github.com/yourusername/neanderthal-filter-app.git
cd neanderthal-filter-app
npm install

# Start development server
npm start

# Run on simulator
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web (for testing)
```

## Project Structure

```
neanderthal-filter-app/
├── App.tsx                          # Main app component & navigation
├── screens/
│   ├── CameraScreen.tsx            # Photo capture UI
│   ├── FilterScreen.tsx            # Transformation preview & controls
├── services/
│   ├── FaceDetectionService.ts     # Face detection logic
│   └── MorphingService.ts          # Morphing algorithms
├── utils/
│   ├── constants.ts                # App constants & configuration
│   └── imageUtils.ts               # Image processing utilities
├── assets/                         # Images, icons, etc.
├── app.json                        # Expo configuration
├── eas.json                        # EAS build configuration
├── package.json                    # Dependencies
└── .github/workflows/              # GitHub Actions CI/CD
```

## Core Components

### App.tsx - Navigation Layer

Manages screen navigation and state:
- Passes captured image between screens
- Handles screen transitions

```typescript
// Usage
const [currentScreen, setCurrentScreen] = useState<AppScreen>('camera');
const handlePhotoCapture = (photoUri: string) => {
  setCapturedImage(photoUri);
  setCurrentScreen('filter');
};
```

### CameraScreen.tsx - Capture UI

Features:
- Real-time camera preview
- Front/back camera toggle
- Selfie capture with haptic feedback
- Permission handling

**Key Props:**
```typescript
interface CameraScreenProps {
  onPhotoCapture: (photoUri: string) => void;
}
```

**Key Methods:**
- `takePicture()` - Captures photo and returns URI
- `toggleFacing()` - Switches camera direction

### FilterScreen.tsx - Transformation UI

Features:
- Face detection processing
- Real-time morphing transformation
- Intensity slider (0-100%)
- Before/after comparison
- Share to social platforms
- Save to device gallery

**Key State:**
```typescript
const [processedImage, setProcessedImage] = useState<string | null>(null);
const [isProcessing, setIsProcessing] = useState(true);
const [morphIntensity, setMorphIntensity] = useState(0.5);
```

### FaceDetectionService.ts - Face Detection

Detects facial landmarks using simplified algorithms:
- `detectFaces(imageUri)` - Main detection method
- `generateLandmarks()` - Creates landmark points
- `validateFaceData()` - Validates detection results

**Detected Landmarks:**
- Eyes (left, right)
- Nose (tip)
- Mouth (left, center, right)
- Chin
- Cheeks (left, right)
- Forehead

### MorphingService.ts - Transformation

Applies Neanderthal transformation:
- `applyNeanderthalMorph()` - Main transformation
- `calculateMorphingMap()` - Computes transformation points
- `applyPixelTransformations()` - Applies transformations to image

**Transformation Parameters:**
```typescript
case 'forehead':
  morphedY = landmark.y - bounds.size.height * 0.15 * intensity;
  // Extends forehead upward
  
case 'chin':
  morphedY = landmark.y + bounds.size.height * 0.12 * intensity;
  morphedX = landmark.x + bounds.size.width * 0.05 * intensity;
  // Enlarges and protrudes chin
```

## Development Workflow

### 1. Start Development Server

```bash
npm start
```

This launches Expo's development environment. Press:
- `i` for iOS Simulator
- `a` for Android Emulator
- `w` for web browser

### 2. Hot Reload

Changes are instantly reflected:
- Edit component files
- Save file
- See changes in simulator immediately

### 3. Debug

```typescript
// Use React Native debugging
import { Alert } from 'react-native';

Alert.alert('Debug', 'Your message');
```

Or use React Native Debugger:
```bash
npm install -g react-native-debugger
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

## Making Changes

### Adding a New Screen

1. Create `screens/NewScreen.tsx`:
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NewScreenProps {
  onNavigate: (screen: string) => void;
}

export default function NewScreen({ onNavigate }: NewScreenProps) {
  return (
    <View style={styles.container}>
      <Text>New Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
```

2. Update `App.tsx`:
```typescript
import NewScreen from './screens/NewScreen';

// Add to navigation logic
{currentScreen === 'new' && <NewScreen onNavigate={setCurrentScreen} />}
```

### Modifying Morphing Algorithm

Edit `services/MorphingService.ts` → `calculateMorphingMap()`:

```typescript
case 'yourFeature':
  morphedX = landmark.x + bounds.size.width * 0.1 * intensity;
  morphedY = landmark.y + bounds.size.height * 0.1 * intensity;
  break;
```

Test by adjusting `intensity` slider in FilterScreen.

### Adding New Dependencies

```bash
npm install <package-name>
```

For React Native compatibility, use:
- `npm search react-native` to find packages
- Check expo compatibility on [Expo Docs](https://docs.expo.dev/guides/libraries/)

## Testing

### Manual Testing Checklist

- [ ] Camera permission requests
- [ ] Photo capture works
- [ ] Face detection succeeds
- [ ] Morphing transformation applies
- [ ] Intensity slider adjusts effect
- [ ] Before/after comparison displays
- [ ] Share functionality works
- [ ] Save to gallery succeeds
- [ ] Back navigation works
- [ ] No memory leaks on repeated use

### Performance Testing

```typescript
// Measure operation duration
const start = performance.now();
// ... operation
const end = performance.now();
console.log(`Operation took ${end - start}ms`);
```

### Device Testing

```bash
# Test on physical device using Expo Go
npm start
# Scan QR code with Expo Go app
```

## Debugging Tips

### View Console Logs

```bash
# In development server, press `j` for logs
npm start
# Then press `j`
```

### Inspect Network Requests

```typescript
console.log('Request:', url, params);
```

### Enable React DevTools

```bash
# Install globally
npm install -g react-devtools

# Run in another terminal
react-devtools

# See React component tree and state
```

### Check Bundle Size

```bash
npx expo export
```

## Common Issues & Solutions

### "Cannot find module" Error

```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
```

### Camera Permission Denied

- Emulator: Settings → Apps → NeanderthalFilter → Permissions → Camera
- Device: Physical settings → Privacy → Camera

### Image Processing Too Slow

- Reduce image resolution in `MorphingService`
- Lower `imageQuality` in `PERFORMANCE` constants
- Use memoization for expensive operations

### Build Fails Locally

```bash
# Clear Expo cache
expo start -c

# Or full reset
rm -rf .expo
npm start
```

## Performance Optimization

### Image Size

```typescript
// In PERFORMANCE constants
const maxImageDimension = 2048; // Adjust based on device
const imageQuality = 0.9; // Lower = faster
```

### Memoization

```typescript
import { useMemo } from 'react';

const expensiveValue = useMemo(() => {
  return calculateMorphingMap(faceData, imageWidth, imageHeight, intensity);
}, [faceData, imageWidth, imageHeight, intensity]);
```

### Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

const FilterScreen = lazy(() => import('./screens/FilterScreen'));

<Suspense fallback={<Loading />}>
  <FilterScreen />
</Suspense>
```

## Code Style

### Naming Conventions

- Components: PascalCase (`CameraScreen.tsx`)
- Functions: camelCase (`detectFaces()`)
- Constants: UPPER_SNAKE_CASE (`MAX_IMAGE_SIZE`)
- Types: PascalCase (`FaceData`)

### TypeScript

Strict typing is enforced:

```typescript
// ✅ Good
interface FaceData {
  bounds: {
    origin: { x: number; y: number };
    size: { width: number; height: number };
  };
  landmarks: Array<{ x: number; y: number; type?: string }>;
}

// ❌ Avoid
const faceData: any = {};
```

### Comments

```typescript
/**
 * Detect faces in image using ML algorithms
 * @param imageUri - Path to image
 * @returns Array of detected faces
 */
static async detectFaces(imageUri: string): Promise<FaceData[]> {
  // Implementation
}
```

## Deployment from Local

### Build for Testing

```bash
# iOS
eas build --platform ios --build-profile=preview

# Android
eas build --platform android --build-profile=preview
```

### Submit to TestFlight

```bash
eas build --platform ios --auto-submit --build-profile=production
```

View status:
```bash
eas build:list
```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [EAS Build Docs](https://docs.expo.dev/eas-update/introduction/)

## Getting Help

- 🐛 **Bug?** → Open GitHub Issue
- ❓ **Question?** → Check docs or existing issues
- 💡 **Feature idea?** → Discussions tab
- 🆘 **Stuck?** → DM @AresAgent

---

Happy coding! 🚀
