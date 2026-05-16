import { useRef, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing } from '../theme/tokens';

type CardScannerPanelProps = {
  onClose: () => void;
  onQueueScan: (imageUri?: string) => Promise<void> | void;
};

const scanChecks = ['Full card visible', 'Inside border', 'Even light'];

export function CardScannerPanel({ onClose, onQueueScan }: CardScannerPanelProps) {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [scanMessage, setScanMessage] = useState(
    'Place the entire card inside the border before scanning for the most accurate match.',
  );

  const canCapture = Boolean(permission?.granted && cameraReady && !capturing);

  const captureScan = async () => {
    if (!permission?.granted) {
      const response = await requestPermission();

      if (!response.granted) {
        setScanMessage('Camera access is required to scan cards.');
      }

      return;
    }

    if (!cameraRef.current || !cameraReady || capturing) {
      return;
    }

    setCapturing(true);
    setScanMessage('Hold steady while the card is captured.');

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        skipProcessing: false,
      });
      await onQueueScan(photo?.uri);
    } catch {
      setScanMessage('Unable to save the card scan. Keep it inside the border and try again.');
    } finally {
      setCapturing(false);
    }
  };

  return (
    <View style={styles.panel}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.kicker}>Card scanner</Text>
          <Text style={styles.title}>Align before you scan</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close scanner"
          hitSlop={10}
          onPress={onClose}
          style={styles.closeButton}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </View>

      <View style={styles.scannerWindow}>
        {permission?.granted ? (
          <CameraView
            active
            animateShutter
            autofocus="on"
            facing="back"
            flash="off"
            mode="picture"
            onCameraReady={() => {
              setCameraReady(true);
              setScanMessage(
                'Place the entire card inside the border before scanning for the most accurate match.',
              );
            }}
            onMountError={() => {
              setScanMessage('The camera could not start. Close the scanner and try again.');
            }}
            ref={cameraRef}
            style={styles.cameraPreview}
          />
        ) : (
          <View style={styles.permissionPanel}>
            <Text style={styles.permissionTitle}>Camera access needed</Text>
            <Text style={styles.permissionCopy}>
              Allow camera access to scan cards inside the border.
            </Text>
          </View>
        )}
        <View style={styles.accuracyBadge}>
          <Text style={styles.accuracyValue}>98%</Text>
          <Text style={styles.accuracyLabel}>target</Text>
        </View>
        <View pointerEvents="none" style={styles.cardFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          <View style={styles.centerGuide} />
        </View>
      </View>

      <Text style={styles.guidance}>{scanMessage}</Text>

      <View style={styles.checkRow}>
        {scanChecks.map((check) => (
          <View key={check} style={styles.checkItem}>
            <View style={styles.checkDot} />
            <Text style={styles.checkText}>{check}</Text>
          </View>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={permission?.granted ? 'Capture card scan' : 'Grant camera access'}
        disabled={permission?.granted ? !canCapture : false}
        onPress={permission?.granted ? captureScan : requestPermission}
        style={[
          styles.scanButton,
          permission?.granted && !canCapture ? styles.disabledScanButton : undefined,
        ]}
      >
        <Text style={styles.scanButtonText}>
          {permission?.granted
            ? capturing
              ? 'Capturing...'
              : cameraReady
                ? 'Capture scan'
                : 'Camera loading'
            : 'Grant camera access'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  accuracyBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: radii.sm,
    left: spacing.md,
    minWidth: 62,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    position: 'absolute',
    top: spacing.md,
    zIndex: 1,
  },
  accuracyLabel: {
    color: colors.mutedInk,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  accuracyValue: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  bottomLeft: {
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    bottom: -2,
    left: -2,
  },
  bottomRight: {
    borderBottomWidth: 4,
    borderRightWidth: 4,
    bottom: -2,
    right: -2,
  },
  cameraPreview: {
    ...StyleSheet.absoluteFillObject,
  },
  cardFrame: {
    alignItems: 'center',
    aspectRatio: 0.716,
    borderColor: 'rgba(217, 154, 33, 0.96)',
    borderRadius: radii.md,
    borderWidth: 2,
    justifyContent: 'center',
    maxHeight: 286,
    minHeight: 238,
    padding: spacing.md,
    width: '68%',
  },
  centerGuide: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.32)',
    borderRadius: radii.sm,
    borderWidth: 1,
    height: '82%',
    width: '82%',
  },
  checkDot: {
    backgroundColor: colors.mint,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  checkItem: {
    alignItems: 'center',
    backgroundColor: colors.canvas,
    borderColor: colors.line,
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: 34,
    paddingHorizontal: spacing.sm,
  },
  checkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  checkText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '800',
  },
  closeButton: {
    alignItems: 'center',
    borderColor: colors.line,
    borderRadius: radii.sm,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: spacing.md,
  },
  closeButtonText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  corner: {
    borderColor: colors.gold,
    height: 34,
    position: 'absolute',
    width: 34,
  },
  disabledScanButton: {
    backgroundColor: '#9CA4A9',
  },
  guidance: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kicker: {
    color: colors.sky,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.lg,
    borderWidth: 1,
    flex: 1,
    gap: spacing.md,
    padding: spacing.md,
  },
  permissionCopy: {
    color: '#DAD5CC',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'center',
  },
  permissionPanel: {
    alignItems: 'center',
    backgroundColor: '#2A2722',
    borderRadius: radii.md,
    gap: spacing.sm,
    padding: spacing.lg,
    width: '86%',
  },
  permissionTitle: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: '900',
  },
  scanButton: {
    alignItems: 'center',
    backgroundColor: colors.sky,
    borderRadius: radii.sm,
    justifyContent: 'center',
    minHeight: 48,
  },
  scanButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '900',
  },
  scannerWindow: {
    alignItems: 'center',
    backgroundColor: '#211F1B',
    borderRadius: radii.md,
    flex: 1,
    justifyContent: 'center',
    minHeight: 360,
    overflow: 'hidden',
    padding: spacing.md,
  },
  title: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 25,
    marginTop: 2,
  },
  topLeft: {
    borderLeftWidth: 4,
    borderTopWidth: 4,
    left: -2,
    top: -2,
  },
  topRight: {
    borderRightWidth: 4,
    borderTopWidth: 4,
    right: -2,
    top: -2,
  },
});
