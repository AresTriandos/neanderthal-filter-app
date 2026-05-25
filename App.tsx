import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type ViewMode = 'home' | 'result' | 'history';

type MorphResult = {
  id: string;
  title: string;
  summary: string;
  traits: string[];
  imageUri: string;
  createdAt: string;
};

const palette = {
  bg: '#0C0E11',
  panel: '#171B21',
  panelSoft: '#20252D',
  line: '#2D343F',
  text: '#F5F7FA',
  muted: '#ABB4C2',
  accent: '#D39A54',
  accentSoft: '#F2D2A6',
  earth: '#6E4D33',
  earthSoft: '#9A6C44',
};

const morphProfiles = [
  {
    title: 'Ice Age Brow',
    summary:
      'The filter pushed your look toward a heavier brow ridge, rougher contrast, and a more survival-built face shape.',
    traits: ['Heavy brow effect', 'Stone-age contrast', 'Earth-tone grade'],
  },
  {
    title: 'Cave Chief',
    summary:
      'This version leans stronger and more commanding, with a denser forehead shadow and a tougher overall face profile.',
    traits: ['Forehead shadowing', 'Jaw emphasis', 'Ancient portrait tone'],
  },
  {
    title: 'Valley Hunter',
    summary:
      'The result gives your face a rougher, colder look, like someone built for wind, rock, and very little comfort.',
    traits: ['Sharper depth', 'Cold-weather grade', 'Survivalist look'],
  },
  {
    title: 'Fire Keeper',
    summary:
      'This version keeps your face recognizable but adds warmth, age, and a more primitive bone structure feel.',
    traits: ['Warm earth tones', 'Primitive face shape', 'Cinematic grit'],
  },
];

export default function App() {
  const [mode, setMode] = useState<ViewMode>('home');
  const [history, setHistory] = useState<MorphResult[]>([]);
  const [cameraDenied, setCameraDenied] = useState(false);

  const latest = useMemo(() => history[0] ?? null, [history]);

  const pickImage = async (source: 'camera' | 'library') => {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    const granted = permission.granted || permission.status === 'granted';
    if (!granted) {
      setCameraDenied(source === 'camera');
      Alert.alert(
        source === 'camera' ? 'Camera access needed' : 'Photo access needed',
        source === 'camera'
          ? 'Take a selfie so Neanderthal Filter can build your prehistoric version.'
          : 'Choose a selfie from your library so Neanderthal Filter can build your prehistoric version.'
      );
      return;
    }

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            cameraType: ImagePicker.CameraType.front,
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.8,
          });

    if (result.canceled || !result.assets?.[0]) {
      return;
    }

    const profile = morphProfiles[Math.floor(Math.random() * morphProfiles.length)];
    const morph: MorphResult = {
      id: `${Date.now()}`,
      imageUri: result.assets[0].uri,
      createdAt: new Date().toLocaleString(),
      ...profile,
    };

    setHistory((current) => [morph, ...current].slice(0, 12));
    setMode('result');
  };

  const renderHome = () => (
    <View style={styles.content}>
      <Text style={styles.eyebrow}>Neanderthal Filter</Text>
      <Text style={styles.title}>Morph your face into the stone age.</Text>
      <Text style={styles.body}>
        This free phase-one version uses a smart cinematic filter approach: heavier brow, rougher tones, tougher shadows, and a prehistoric portrait feel.
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Phase 1</Text>
        <Text style={styles.infoText}>
          Take a selfie, then the app creates a local Neanderthal-style version using overlays, grading, and face-shape styling — no paid AI required.
        </Text>
      </View>

      <Pressable style={styles.primaryButton} onPress={() => pickImage('camera')}>
        <Text style={styles.primaryButtonText}>Take Selfie</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => pickImage('library')}>
        <Text style={styles.secondaryButtonText}>Use Existing Photo</Text>
      </Pressable>

      {cameraDenied ? (
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>Camera permission is off</Text>
          <Text style={styles.warningText}>Allow camera access when prompted so you can take a selfie for the morph.</Text>
        </View>
      ) : null}

      {latest ? (
        <View style={styles.latestCard}>
          <Text style={styles.infoLabel}>Latest morph</Text>
          <Text style={styles.latestTitle}>{latest.title}</Text>
          <Text style={styles.latestText}>{latest.summary}</Text>
          <Pressable style={styles.linkButton} onPress={() => setMode('result')}>
            <Text style={styles.linkButtonText}>View latest result</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  const renderMorphImage = (uri: string) => (
    <View style={styles.morphFrame}>
      <Image source={{ uri }} style={styles.morphImage} />
      <View style={styles.colorGradeOverlay} />
      <View style={styles.browRidgeBand} />
      <View style={styles.cheekShadowLeft} />
      <View style={styles.cheekShadowRight} />
      <View style={styles.noseBridge} />
      <View style={styles.jawShadow} />
      <View style={styles.vignetteTop} />
      <View style={styles.vignetteBottom} />
      <View style={styles.grainTint} />
    </View>
  );

  const renderResult = () => (
    <View style={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Before / After</Text>
        <Pressable style={styles.linkButton} onPress={() => pickImage('camera')}>
          <Text style={styles.linkButtonText}>New selfie</Text>
        </Pressable>
      </View>

      {!latest ? (
        <View style={styles.infoCard}>
          <Text style={styles.latestTitle}>No morph yet</Text>
          <Text style={styles.latestText}>Take a selfie first and your Neanderthal version will show up here.</Text>
        </View>
      ) : (
        <View style={styles.resultCard}>
          <View style={styles.compareSection}>
            <Text style={styles.compareLabel}>Original</Text>
            <Image source={{ uri: latest.imageUri }} style={styles.compareImage} />
          </View>

          <View style={styles.compareSection}>
            <Text style={styles.compareLabel}>Neanderthal Version</Text>
            {renderMorphImage(latest.imageUri)}
          </View>

          <Text style={styles.resultMeta}>{latest.createdAt}</Text>
          <Text style={styles.resultTitle}>{latest.title}</Text>
          <Text style={styles.resultSummary}>{latest.summary}</Text>

          <View style={styles.traitsWrap}>
            {latest.traits.map((trait) => (
              <View key={trait} style={styles.traitPill}>
                <Text style={styles.traitText}>{trait}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderHistory = () => (
    <View style={styles.content}>
      <Text style={styles.title}>History</Text>
      {history.length === 0 ? (
        <View style={styles.infoCard}>
          <Text style={styles.latestTitle}>No morphs yet</Text>
          <Text style={styles.latestText}>Your saved before/after prehistoric looks will show up here.</Text>
        </View>
      ) : (
        history.map((item) => (
          <View key={item.id} style={styles.historyCard}>
            <Image source={{ uri: item.imageUri }} style={styles.historyImage} />
            <View style={styles.historyTextWrap}>
              <Text style={styles.historyTitle}>{item.title}</Text>
              <Text style={styles.historyMeta}>{item.createdAt}</Text>
              <Text style={styles.historyBody}>{item.summary}</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {mode === 'home' && renderHome()}
        {mode === 'result' && renderResult()}
        {mode === 'history' && renderHistory()}
      </ScrollView>

      <View style={styles.tabBar}>
        {[
          ['home', 'Home'],
          ['result', 'Morph'],
          ['history', 'History'],
        ].map(([key, label]) => {
          const active = mode === key;
          return (
            <Pressable key={key} style={styles.tabItem} onPress={() => setMode(key as ViewMode)}>
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 110,
  },
  content: {
    gap: 18,
  },
  eyebrow: {
    color: palette.accent,
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: palette.text,
    fontSize: 35,
    lineHeight: 41,
    fontWeight: '800',
  },
  body: {
    color: palette.muted,
    fontSize: 17,
    lineHeight: 25,
  },
  infoCard: {
    backgroundColor: palette.panel,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: palette.line,
    gap: 8,
  },
  infoLabel: {
    color: palette.accentSoft,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  infoText: {
    color: palette.text,
    fontSize: 16,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: palette.accent,
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#111317',
    fontSize: 17,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: palette.panelSoft,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.line,
  },
  secondaryButtonText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '700',
  },
  warningCard: {
    backgroundColor: '#2A1E12',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#5C3E18',
  },
  warningTitle: {
    color: '#FFC98A',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  warningText: {
    color: '#F8D8AF',
    fontSize: 15,
    lineHeight: 22,
  },
  latestCard: {
    backgroundColor: palette.panelSoft,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: palette.line,
    gap: 8,
  },
  latestTitle: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '800',
  },
  latestText: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  linkButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  linkButtonText: {
    color: palette.accentSoft,
    fontWeight: '800',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  resultCard: {
    backgroundColor: palette.panel,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: palette.line,
    gap: 14,
  },
  compareSection: {
    gap: 8,
  },
  compareLabel: {
    color: palette.accentSoft,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  compareImage: {
    width: '100%',
    height: 320,
    borderRadius: 20,
    backgroundColor: palette.panelSoft,
  },
  morphFrame: {
    width: '100%',
    height: 320,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: palette.panelSoft,
    position: 'relative',
  },
  morphImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  colorGradeOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(98, 63, 34, 0.22)',
  },
  browRidgeBand: {
    position: 'absolute',
    top: 70,
    left: '15%',
    right: '15%',
    height: 34,
    borderRadius: 20,
    backgroundColor: 'rgba(48, 33, 19, 0.42)',
  },
  cheekShadowLeft: {
    position: 'absolute',
    top: 120,
    left: '7%',
    width: 90,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(55, 38, 21, 0.23)',
    transform: [{ rotate: '-10deg' }],
  },
  cheekShadowRight: {
    position: 'absolute',
    top: 120,
    right: '7%',
    width: 90,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(55, 38, 21, 0.23)',
    transform: [{ rotate: '10deg' }],
  },
  noseBridge: {
    position: 'absolute',
    top: 92,
    left: '46%',
    width: 28,
    height: 94,
    borderRadius: 18,
    backgroundColor: 'rgba(80, 56, 33, 0.25)',
  },
  jawShadow: {
    position: 'absolute',
    bottom: 36,
    left: '20%',
    right: '20%',
    height: 54,
    borderRadius: 28,
    backgroundColor: 'rgba(47, 31, 18, 0.28)',
  },
  vignetteTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 88,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  vignetteBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 96,
    backgroundColor: 'rgba(0,0,0,0.26)',
  },
  grainTint: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
    borderColor: 'rgba(245, 210, 166, 0.12)',
  },
  resultMeta: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  resultTitle: {
    color: palette.text,
    fontSize: 28,
    fontWeight: '800',
  },
  resultSummary: {
    color: palette.text,
    fontSize: 16,
    lineHeight: 24,
  },
  traitsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  traitPill: {
    backgroundColor: palette.panelSoft,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: palette.line,
  },
  traitText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '700',
  },
  historyCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: palette.panel,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.line,
  },
  historyImage: {
    width: 86,
    height: 108,
    borderRadius: 14,
    backgroundColor: palette.panelSoft,
  },
  historyTextWrap: {
    flex: 1,
    gap: 4,
  },
  historyTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '800',
  },
  historyMeta: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  historyBody: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: '#11151A',
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: palette.line,
  },
  tabItem: {
    paddingHorizontal: 8,
  },
  tabText: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  tabTextActive: {
    color: palette.text,
  },
});
