# 🧬 Neanderthal Selfie Filter App

Transform your selfies into a Neanderthal with AI-powered morphing technology! This free app uses face detection and custom morphing algorithms to create hilarious before/after transformations.

## 🎯 Features

- **Real-time Face Detection**: Automatically detects your face using TensorFlow.js
- **Morphing Transformation**: Apply scientifically-inspired Neanderthal features:
  - Enlarged jaw and chin
  - Extended forehead
  - Broadened nose
  - Receded chin
- **Adjustable Intensity**: Control the transformation strength (0-100%)
- **Before/After Comparison**: Side-by-side view of original vs. transformed
- **Social Sharing**: Share to Instagram, TikTok, and other social platforms
- **Gallery Save**: Save your transformations to your device gallery
- **Beautiful UI**: Clean, intuitive interface with real-time preview

## 🛠️ Tech Stack

- **Framework**: Expo + React Native
- **Face Detection**: TensorFlow.js (with React Native integration)
- **Camera**: expo-camera
- **Image Processing**: Custom morphing algorithms
- **Media**: expo-media-library, expo-sharing
- **Deployment**: EAS (Expo Application Services)
- **CI/CD**: GitHub Actions → TestFlight

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/neanderthal-filter-app.git
cd neanderthal-filter-app

# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS or Android
npm run ios   # or npm run android
```

## 📱 Building for Production

### Using EAS Build (Recommended)

```bash
# Build for iOS
eas build --platform ios --build-profile=production

# Build for Android
eas build --platform android --build-profile=production

# Build and submit to TestFlight
eas build --platform ios --auto-submit --build-profile=production
```

### Manual Build

```bash
# iOS
expo build:ios

# Android
expo build:android
```

## 🔄 Automated Deployment

This repo includes GitHub Actions workflows that automatically:

1. **Build** the app on every push to `main`
2. **Test** (when configured)
3. **Submit to TestFlight** on main branch pushes

### Setup Automation

1. **Get EAS Token**:
   ```bash
   eas token
   ```

2. **Add GitHub Secrets** (Settings → Secrets and Variables → Actions):
   - `EAS_TOKEN`: Your EAS authentication token
   - `APPLE_ID`: Your Apple ID email
   - `APPLE_PASSWORD`: Your app-specific password
   - `ASC_KEY_ID`: App Store Connect key ID
   - `ASC_ISSUER_ID`: App Store Connect issuer ID
   - `ASC_KEY_CONTENT`: Base64-encoded API key content

3. **Push to main** - GitHub Actions will build and deploy!

## 📁 Project Structure

```
neanderthal-filter-app/
├── screens/
│   ├── CameraScreen.tsx       # Camera capture UI
│   └── FilterScreen.tsx       # Filter preview & controls
├── services/
│   ├── FaceDetectionService.ts # Face detection logic
│   └── MorphingService.ts      # Morphing algorithms
├── App.tsx                     # Main app component
├── app.json                    # Expo config
├── eas.json                    # EAS build config
├── .github/workflows/          # GitHub Actions
└── package.json                # Dependencies
```

## 🧠 How It Works

### Face Detection
1. Image captured from device camera
2. TensorFlow.js detects facial landmarks
3. Creates mapping of facial features (eyes, nose, chin, etc.)

### Morphing Algorithm
Applies Neanderthal transformations:
- **Forehead**: Extended upward
- **Jaw/Chin**: Enlarged and protruding forward
- **Nose**: Broadened and lowered
- **Cheeks**: Broadened outward

Intensity slider (0-100%) controls transformation strength.

## 🎨 Customization

### Adjust Morphing Parameters

Edit `services/MorphingService.ts` - `calculateMorphingMap()` function:

```typescript
case 'chin':
  // Enlarge and protrude chin downward
  morphedY = landmark.y + bounds.size.height * 0.12 * intensity;
  morphedX = landmark.x + bounds.size.width * 0.05 * intensity;
  break;
```

### Change UI Colors

Edit `screens/FilterScreen.tsx` and `screens/CameraScreen.tsx` - modify the color values:

```typescript
const styles = StyleSheet.create({
  shareButton: {
    backgroundColor: '#4A9EFF',  // Change this
  },
});
```

## 📦 Dependencies

- `expo`: Framework
- `expo-camera`: Camera access
- `expo-media-library`: Gallery access
- `expo-sharing`: Social sharing
- `react-native`: Core framework
- `@expo/vector-icons`: UI icons

## 🔐 Permissions

The app requests:
- **Camera**: To capture selfies
- **Media Library**: To save images to gallery
- **Photo Library**: To access previously saved photos

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🐛 Known Issues

- Face detection accuracy depends on lighting and image quality
- Currently uses simplified morphing (production version needs Canvas API or native module)
- Some devices may experience performance issues with high-resolution images

## 🚀 Future Enhancements

- [ ] Advanced AI-powered morphing using ML Kit
- [ ] Real-time video transformation
- [ ] Multiple filter styles (Cro-Magnon, Homo Erectus, etc.)
- [ ] Beauty filters and effects
- [ ] Video recording
- [ ] Cloud storage for images
- [ ] AR filters

## 📧 Support

For issues, feature requests, or questions, please open an issue on GitHub.

---

**Made with ⚔️ by Ares**

Enjoy transforming! 🧬
