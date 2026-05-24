import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.card}>
        <Text style={styles.title}>Neanderthal Filter</Text>
        <Text style={styles.subtitle}>Baseline iOS test build</Text>
        <Text style={styles.body}>
          If this opens in TestFlight without crashing, the pipeline is healthy and the previous app issue is in app code rather than build infrastructure.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101418',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#1b232c',
    borderRadius: 20,
    padding: 24,
    gap: 12,
  },
  title: {
    color: '#f8fafc',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#60a5fa',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  body: {
    color: '#cbd5e1',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
