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

type AnalysisResult = {
  id: string;
  title: string;
  summary: string;
  traits: string[];
  caption: string;
  imageUri: string;
  createdAt: string;
};

const palette = {
  bg: '#0D0F12',
  panel: '#171B21',
  panelSoft: '#20252D',
  line: '#2B313B',
  text: '#F5F7FA',
  muted: '#A7B0BE',
  accent: '#D49A52',
  accentSoft: '#F2D2A6',
};

const archetypes = [
  {
    title: 'The Cave Guardian',
    summary:
      'Your ancient look comes through with a heavy brow, grounded stare, and the kind of face that looks built for survival in hard weather.',
    traits: ['Strong brow ridge', 'Broader jawline', 'Deep-set eyes'],
    caption: 'Built for cold mornings, long hunts, and absolutely no small talk.',
  },
  {
    title: 'The Fire Keeper',
    summary:
      'Your features translate into something sturdy and alert, like the person everyone trusted to keep the fire alive after dark.',
    traits: ['Wide cheek structure', 'Powerful nose bridge', 'Steady expression'],
    caption: 'Ancient, calm, and probably the one who knew where the good shelter was.',
  },
  {
    title: 'The Valley Hunter',
    summary:
      'This version of you looks sharp, resilient, and slightly intimidating in the best way. Less polished, more born-ready.',
    traits: ['Heavier forehead', 'Compact facial structure', 'Weathered intensity'],
    caption: 'You look like you could spot danger from a hilltop and make it home by nightfall.',
  },
  {
    title: 'The Stone Age Chief',
    summary:
      'The analysis reads cinematic and commanding. Your Neanderthal version looks like someone people naturally followed.',
    traits: ['Leader energy', 'Dense facial framing', 'Dominant silhouette'],
    caption: 'If there was a mammoth plan, ancient-you definitely approved it.',
  },
  {
    title: 'The Ice Trail Survivor',
    summary:
      'You come across as durable and watchful, with the kind of face that looks shaped by rough landscapes and long winters.',
    traits: ['Survivalist profile', 'Broad facial base', 'Focused gaze'],
    caption: 'Not delicate. Not lost. Definitely making it through the Ice Age.',
  },
];

export default function App() {
  const [mode, setMode] = useState<ViewMode>('home');
  const [history, setHistory] = useState<AnalysisResult[]>([]);
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
          ? 'Take a selfie so the app can analyze your Neanderthal look.'
          : 'Choose a selfie from your library so the app can analyze your Neanderthal look.'
      );
      return;
    }

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], cameraType: ImagePicker.CameraType.front, quality: 0.8 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [3, 4], quality: 0.8 });

    if (result.canceled || !result.assets?.[0]) {
      return;
    }

    const template = archetypes[Math.floor(Math.random() * archetypes.length)];
    const analysis: AnalysisResult = {
      id: `${Date.now()}`,
      imageUri: result.assets[0].uri,
      createdAt: new Date().toLocaleString(),
      ...template,
    };

    setHistory((current) => [analysis, ...current].slice(0, 12));
    setMode('result');
  };

  const renderHome = () => (
    <View style={styles.content}>
      <Text style={styles.eyebrow}>Neanderthal Filter</Text>
      <Text style={styles.title}>See your ancient face.</Text>
      <Text style={styles.body}>
        Take a selfie, hit analyze, and see a realistic cinematic version of what you might have looked like as a Neanderthal.
      </Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>How it works</Text>
        <Text style={styles.heroText}>1. Take a selfie. 2. Analyze your face. 3. Get your ancient-human result.</Text>
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
          <Text style={styles.warningText}>Allow camera access when prompted so you can take a selfie for analysis.</Text>
        </View>
      ) : null}

      {latest ? (
        <View style={styles.previewCard}>
          <Text style={styles.heroLabel}>Latest analysis</Text>
          <Text style={styles.previewTitle}>{latest.title}</Text>
          <Text style={styles.previewText}>{latest.caption}</Text>
          <Pressable style={styles.linkButton} onPress={() => setMode('result')}>
            <Text style={styles.linkButtonText}>Open latest result</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  const renderResult = () => (
    <View style={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Analyze Me</Text>
        <Pressable style={styles.linkButton} onPress={() => pickImage('camera')}>
          <Text style={styles.linkButtonText}>New selfie</Text>
        </Pressable>
      </View>

      {!latest ? (
        <View style={styles.heroCard}>
          <Text style={styles.previewTitle}>No analysis yet</Text>
          <Text style={styles.previewText}>Take a selfie first and your Neanderthal result will show up here.</Text>
        </View>
      ) : (
        <View style={styles.resultCard}>
          <Image source={{ uri: latest.imageUri }} style={styles.resultImage} />
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

          <View style={styles.captionBox}>
            <Text style={styles.captionLabel}>Verdict</Text>
            <Text style={styles.captionText}>{latest.caption}</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderHistory = () => (
    <View style={styles.content}>
      <Text style={styles.title}>History</Text>
      {history.length === 0 ? (
        <View style={styles.heroCard}>
          <Text style={styles.previewTitle}>No selfies analyzed yet</Text>
          <Text style={styles.previewText}>Your recent Neanderthal looks will show up here.</Text>
        </View>
      ) : (
        history.map((item) => (
          <View key={item.id} style={styles.historyCard}>
            <Image source={{ uri: item.imageUri }} style={styles.historyImage} />
            <View style={styles.historyTextWrap}>
              <Text style={styles.historyTitle}>{item.title}</Text>
              <Text style={styles.historyMeta}>{item.createdAt}</Text>
              <Text style={styles.historyBody}>{item.caption}</Text>
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
          ['result', 'Analyze'],
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
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '800',
  },
  body: {
    color: palette.muted,
    fontSize: 17,
    lineHeight: 25,
  },
  heroCard: {
    backgroundColor: palette.panel,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: palette.line,
    gap: 8,
  },
  heroLabel: {
    color: palette.accentSoft,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroText: {
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
  previewCard: {
    backgroundColor: palette.panelSoft,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: palette.line,
    gap: 8,
  },
  previewTitle: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '800',
  },
  previewText: {
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
    gap: 12,
  },
  resultImage: {
    width: '100%',
    height: 360,
    borderRadius: 20,
    backgroundColor: palette.panelSoft,
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
  captionBox: {
    backgroundColor: '#221910',
    borderRadius: 18,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: palette.accent,
  },
  captionLabel: {
    color: palette.accentSoft,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  captionText: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 22,
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
