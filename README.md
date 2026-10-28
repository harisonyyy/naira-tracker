# Naira Tracker

A simple expense tracker app built with React Native and Expo. Track your income and expenses in Naira (₦) with a clean green and white UI.

## Features

- Add income and expense transactions in Naira
- View current balance, today's totals, and this week's totals
- Browse and filter transaction history
- Delete individual transactions or clear all
- All data stored locally on-device (AsyncStorage), no internet required
- AdMob banner ready (test IDs in development, swap in your real ad unit ID for production)

## Getting Started

```bash
npm install
npm run dev
```

## Building the APK

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

## AdMob Setup

1. Replace the placeholder app ID in `app.json`:
   `"androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"` with your real AdMob app ID
2. Replace the ad unit ID in `components/AdBanner.tsx`:
   `'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX'` with your real banner ad unit ID

## Tech Stack

- Expo SDK 57 / React Native 0.86
- Expo Router (tab navigation)
- AsyncStorage for local persistence
- react-native-google-mobile-ads for AdMob
- Inter font family
- Lucide icons
