# 📦 Deployment Guide - Neanderthal Filter App

## Overview

This guide covers deploying the Neanderthal Filter App to iOS TestFlight and Google Play using Expo Application Services (EAS) with automated GitHub Actions CI/CD.

## Prerequisites

- [Expo Account](https://expo.dev) (free)
- [EAS CLI](https://docs.expo.dev/eas/) installed locally
- GitHub repository with admin access
- Apple Developer Account (for TestFlight/App Store)
- Google Play Developer Account (for Android)

## 1. Local Setup

### Install Dependencies

```bash
npm install -g eas-cli expo-cli
```

### Authenticate with EAS

```bash
eas login
```

This will prompt you to create/use an Expo account.

## 2. Prepare Apple Configuration

### Generate Apple App Certificates

```bash
eas credentials
```

Follow the prompts to:
1. Choose iOS platform
2. Generate credentials (certificates, keys, profiles)
3. Store in EAS servers

### Create App Store Connect Entry

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app "Neanderthal Filter"
3. Bundle ID: `com.neanderthalfilter.app`
4. SKU: `neanderthalfilter-v1`

### Generate API Key for Submission

1. In App Store Connect → Users and Access → Keys
2. Create new API Key with "App Manager" role
3. Download and save the `.p8` file
4. Note the Key ID and Issuer ID

## 3. Prepare Google Play Configuration

### Create App in Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new application "Neanderthal Filter"
3. Complete store listing
4. Create signed APK/AAB

### Generate Keystore

```bash
# Generate keystore for signing
keytool -genkey-keystore release.keystore \
  -keyalg RSA -keysize 2048 \
  -validity 10000 \
  -alias neanderthal-filter
```

Save the password securely.

## 4. Setup GitHub Actions Automation

### Add Repository Secrets

Go to: **Settings → Secrets and Variables → Actions**

Add these secrets:

#### EAS
- `EAS_TOKEN`: Your EAS authentication token
  ```bash
  # Get token:
  eas token
  ```

#### Apple (TestFlight)
- `APPLE_ID`: Your Apple ID email
- `APPLE_PASSWORD`: App-specific password (NOT regular password)
  - Create at [appleid.apple.com](https://appleid.apple.com)
  - Security → App-Specific Passwords
- `ASC_KEY_ID`: From App Store Connect API key
- `ASC_ISSUER_ID`: From App Store Connect API key
- `ASC_KEY_CONTENT`: Base64-encoded API key content
  ```bash
  base64 -i AuthKey_*.p8 | pbcopy
  ```

#### Android (Optional for now)
- `ANDROID_KEYSTORE_ALIAS`: `neanderthal-filter`
- `ANDROID_KEYSTORE_PASSWORD`: Your keystore password
- `ANDROID_KEY_PASSWORD`: Your key password

### Update Workflow

Edit `.github/workflows/build.yml` as needed for your setup.

## 5. Build & Submit Locally (Testing)

### Build for TestFlight

```bash
eas build --platform ios --build-profile=production
```

This will:
1. Build the app on EAS servers
2. Generate signed IPA
3. Upload to Apple's servers
4. Make available for 30 days

### Build for Google Play

```bash
eas build --platform android --build-profile=production
```

### Automatic Submission to TestFlight

```bash
eas build --platform ios --auto-submit --build-profile=production
```

This will automatically submit the build to TestFlight after completion.

## 6. Automated Deployment with GitHub

### Trigger Builds

Simply push to `main` branch:

```bash
git add .
git commit -m "Add new feature"
git push origin main
```

GitHub Actions will automatically:
1. ✅ Run tests
2. 📦 Build for iOS and Android
3. 🚀 Submit iOS to TestFlight
4. 📊 Log build status in GitHub

### Monitor Builds

View real-time progress:
- GitHub: Actions tab
- EAS: `eas build:list`

### Manual Builds

If automated build fails, trigger manually:

```bash
eas build --platform ios --build-profile=production
```

## 7. Submit to App Store

Once approved on TestFlight:

1. Go to App Store Connect
2. Navigate to your app
3. Select build from TestFlight
4. Complete app information:
   - Screenshots
   - Description
   - Keywords
   - Privacy policy
   - Support URL
5. Add pricing and availability
6. Submit for review

### Typical Review Time
- 24-48 hours for approval
- Can be rejected for policy issues (test carefully!)

## 8. Monitoring & Updates

### Check Build Status

```bash
eas build:list
```

### View Build Logs

```bash
eas build:view <build-id>
```

### Update Version

1. Increment version in `app.json`:
   ```json
   {
     "expo": {
       "version": "1.1.0"
     }
   }
   ```

2. Update build number in `eas.json`:
   ```json
   {
     "build": {
       "production": {
         "ios": {
           "buildNumber": "2"
         }
       }
     }
   }
   ```

3. Push changes → GitHub Actions handles the rest!

## 9. Troubleshooting

### Build Fails

Check logs:
```bash
eas build:view --platform ios
```

Common issues:
- Invalid provisioning profile
- Expired certificates
- Node version mismatch

### TestFlight Upload Fails

- Verify ASC API key has correct permissions
- Ensure app Bundle ID matches
- Check App Store Connect app exists

### GitHub Actions Failure

1. Check workflow logs: GitHub → Actions → Build and Deploy
2. Verify secrets are set correctly
3. Check if EAS CLI version is compatible
4. Re-authenticate if token expired:
   ```bash
   eas logout
   eas login
   eas token  # Get new token
   ```

## 10. Best Practices

✅ **Do:**
- Test locally before pushing
- Use meaningful commit messages
- Review builds before submitting to review
- Keep `main` branch production-ready
- Pin dependency versions
- Document any manual steps needed

❌ **Don't:**
- Commit secrets to repo (use GitHub Secrets)
- Push directly to main without testing
- Use test accounts in production
- Forget to update version numbers
- Leave failing builds unresolved

## Additional Resources

- [Expo Docs](https://docs.expo.dev/)
- [EAS Build Docs](https://docs.expo.dev/eas-update/introduction/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy Center](https://play.google.com/about/developer-content-policy/)

## Quick Command Reference

```bash
# Authentication
eas login                                    # Login to EAS
eas token                                   # Get auth token
eas logout                                  # Logout

# Building
eas build --platform ios --profile=preview  # Build for iOS preview
eas build --platform ios --auto-submit      # Build and auto-submit
eas build:list                             # List all builds
eas build:view <id>                        # View specific build

# Credentials
eas credentials                             # Manage credentials
eas credentials --platform ios --interactive  # Reset iOS credentials

# Local Testing
npm start                                   # Start Expo dev server
npm run ios                                 # Run on iOS simulator
npm run android                             # Run on Android emulator
```

---

**Status**: MVP Deployment Ready ✅

For issues or questions, open a GitHub issue!
