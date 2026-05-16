import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Pill } from './src/components/Pill';
import { CardScannerPanel } from './src/components/CardScannerPanel';
import { ProgressRail } from './src/components/ProgressRail';
import { TodoRow } from './src/components/TodoRow';
import {
  API_URL,
  clearCompletedTodos,
  createScan,
  createTodo,
  getTodos,
  removeTodo,
  toggleTodo,
} from './src/api/cardquest';
import {
  getCompletionRatio,
  getLaneCount,
  type Todo,
} from './src/domain/todos';
import { colors, radii, spacing, taskLanes, type TaskLane } from './src/theme/tokens';

type Filter = 'all' | 'open' | 'done';

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'done', label: 'Done' },
];

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [selectedLane, setSelectedLane] = useState<TaskLane>('scan');
  const [filter, setFilter] = useState<Filter>('all');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async () => {
    setLoading(true);

    try {
      setTodos(await getTodos());
      setError(null);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTodos();
  }, [loadTodos]);

  const visibleTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filter === 'open') {
        return !todo.done;
      }

      if (filter === 'done') {
        return todo.done;
      }

      return true;
    });
  }, [filter, todos]);

  const completionRatio = getCompletionRatio(todos);
  const openCount = todos.filter((todo) => !todo.done).length;

  const addTodo = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle || syncing) {
      return;
    }

    setSyncing(true);

    try {
      const todo = await createTodo({ lane: selectedLane, title: trimmedTitle });
      setTodos((currentTodos) => [todo, ...currentTodos]);
      setTitle('');
      setError(null);
    } catch (addError) {
      setError(getErrorMessage(addError));
    } finally {
      setSyncing(false);
    }
  };

  const queueGuidedScan = async (imageUri?: string) => {
    if (syncing) {
      return;
    }

    setSyncing(true);

    try {
      const response = await createScan({
        imageUri,
        notes: 'Full card inside the border',
      });
      setTodos((currentTodos) => [response.todo, ...currentTodos]);
      setError(null);
      setScannerOpen(false);
    } catch (scanError) {
      setError(getErrorMessage(scanError));
      throw scanError;
    } finally {
      setSyncing(false);
    }
  };

  const handleToggleTodo = async (id: string) => {
    if (syncing) {
      return;
    }

    setSyncing(true);

    try {
      const todo = await toggleTodo(id);
      setTodos((currentTodos) =>
        currentTodos.map((currentTodo) => (currentTodo.id === id ? todo : currentTodo)),
      );
      setError(null);
    } catch (toggleError) {
      setError(getErrorMessage(toggleError));
    } finally {
      setSyncing(false);
    }
  };

  const handleRemoveTodo = async (id: string) => {
    if (syncing) {
      return;
    }

    setSyncing(true);

    try {
      await removeTodo(id);
      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
      setError(null);
    } catch (removeError) {
      setError(getErrorMessage(removeError));
    } finally {
      setSyncing(false);
    }
  };

  const handleClearCompleted = async () => {
    if (syncing) {
      return;
    }

    setSyncing(true);

    try {
      await clearCompletedTodos();
      setTodos((currentTodos) => currentTodos.filter((todo) => !todo.done));
      setError(null);
    } catch (clearError) {
      setError(getErrorMessage(clearError));
    } finally {
      setSyncing(false);
    }
  };

  const renderTodo = ({ item }: { item: Todo }) => (
    <TodoRow
      todo={item}
      onToggle={(id) => {
        void handleToggleTodo(id);
      }}
      onRemove={(id) => {
        void handleRemoveTodo(id);
      }}
    />
  );

  const statusCopy = loading
    ? `Loading tasks from ${API_URL}`
    : syncing
      ? 'Syncing with backend'
      : null;

  const retryLoad = () => {
    void loadTodos();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.keyboard}
      >
        <FlatList
          data={visibleTodos}
          keyExtractor={(item) => item.id}
          renderItem={renderTodo}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <View>
              <View style={styles.header}>
                <View>
                  <Text style={styles.eyebrow}>Expo + Nest API demo</Text>
                  <Text style={styles.title}>CardQuest Todo</Text>
                </View>
                <View style={styles.countBadge}>
                  <Text style={styles.countValue}>{openCount}</Text>
                  <Text style={styles.countLabel}>open</Text>
                </View>
              </View>

              {statusCopy ? (
                <View style={styles.statusBanner}>
                  <Text style={styles.statusText}>{statusCopy}</Text>
                </View>
              ) : null}

              {error ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={retryLoad}
                  style={styles.errorBanner}
                >
                  <Text style={styles.errorTitle}>Backend unavailable</Text>
                  <Text style={styles.errorText}>{error}</Text>
                  <Text style={styles.retryText}>Tap to retry</Text>
                </Pressable>
              ) : null}

              <View style={styles.heroPanel}>
                <Text style={styles.heroKicker}>Today's board</Text>
                <Text style={styles.heroTitle}>Plan scans, grade checks, trades, and shipping in one tactile mobile flow.</Text>
                <ProgressRail ratio={completionRatio} label="Vault progress" />
              </View>

              <View style={styles.laneGrid}>
                {taskLanes.map((lane) => {
                  const laneContent = (
                    <>
                      <View style={[styles.laneStripe, { backgroundColor: lane.color }]} />
                      <Text style={styles.laneValue}>{getLaneCount(todos, lane.id)}</Text>
                      <Text style={styles.laneLabel}>{lane.label}</Text>
                    </>
                  );

                  if (lane.id === 'scan') {
                    return (
                      <Pressable
                        key={lane.id}
                        accessibilityHint="Opens the guided card scanner"
                        accessibilityRole="button"
                        onPress={() => setScannerOpen(true)}
                        style={({ pressed }) => [
                          styles.laneStat,
                          styles.scanLaneStat,
                          pressed ? styles.pressedLaneStat : undefined,
                        ]}
                      >
                        {laneContent}
                        <Text style={styles.scanLaneAction}>Tap to scan</Text>
                      </Pressable>
                    );
                  }

                  return (
                    <View key={lane.id} style={styles.laneStat}>
                      {laneContent}
                    </View>
                  );
                })}
              </View>

              <View style={styles.composer}>
                <Text style={styles.sectionLabel}>Add a task</Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Example: Inspect holo surface under angled light"
                  placeholderTextColor="#9A9489"
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    void addTodo();
                  }}
                  style={styles.input}
                />
                <View style={styles.pillRow}>
                  {taskLanes.map((lane) => (
                    <Pill
                      key={lane.id}
                      label={lane.label}
                      color={lane.color}
                      selected={selectedLane === lane.id}
                      onPress={() => setSelectedLane(lane.id)}
                    />
                  ))}
                </View>
                <Pressable
                  disabled={syncing}
                  style={[styles.addButton, syncing ? styles.disabledButton : undefined]}
                  onPress={() => {
                    void addTodo();
                  }}
                >
                  <Text style={styles.addButtonText}>
                    {syncing ? 'Saving...' : 'Add to board'}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.toolbar}>
                <Text style={styles.sectionLabel}>Task queue</Text>
                <View style={styles.filterRow}>
                  {filters.map((item) => (
                    <Pill
                      key={item.id}
                      label={item.label}
                      selected={filter === item.id}
                      color={colors.ink}
                      onPress={() => setFilter(item.id)}
                    />
                  ))}
                </View>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                {loading ? 'Loading tasks' : 'No tasks in this view'}
              </Text>
              <Text style={styles.emptyCopy}>
                {loading
                  ? 'Waiting for the backend response.'
                  : 'Switch filters or add a new collector task above.'}
              </Text>
            </View>
          }
          ListFooterComponent={
            todos.some((todo) => todo.done) ? (
              <Pressable
                disabled={syncing}
                onPress={() => {
                  void handleClearCompleted();
                }}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>Clear completed tasks</Text>
              </Pressable>
            ) : null
          }
        />
        <Modal
          animationType="slide"
          onRequestClose={() => setScannerOpen(false)}
          presentationStyle="fullScreen"
          visible={scannerOpen}
        >
          <SafeAreaView style={styles.scannerModal}>
            <CardScannerPanel
              onClose={() => setScannerOpen(false)}
              onQueueScan={queueGuidedScan}
            />
          </SafeAreaView>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to reach the CardQuest API.';
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: radii.sm,
    minHeight: 50,
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '900',
  },
  clearButton: {
    alignItems: 'center',
    marginTop: spacing.md,
    padding: spacing.md,
  },
  clearButtonText: {
    color: colors.mutedInk,
    fontSize: 13,
    fontWeight: '800',
  },
  composer: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 44,
  },
  countBadge: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: radii.md,
    minWidth: 72,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  countLabel: {
    color: '#DAD5CC',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  countValue: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: '900',
  },
  disabledButton: {
    opacity: 0.64,
  },
  empty: {
    alignItems: 'center',
    backgroundColor: '#EEEAE1',
    borderRadius: radii.md,
    marginTop: spacing.sm,
    padding: spacing.lg,
  },
  emptyCopy: {
    color: colors.mutedInk,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  errorBanner: {
    backgroundColor: '#FFF0ED',
    borderColor: '#F6B7AD',
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.xs,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  errorText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  errorTitle: {
    color: colors.ember,
    fontSize: 13,
    fontWeight: '900',
  },
  eyebrow: {
    color: colors.mutedInk,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  heroKicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  heroPanel: {
    backgroundColor: '#24201D',
    borderRadius: radii.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  heroTitle: {
    color: colors.surface,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.canvas,
    borderColor: colors.line,
    borderRadius: radii.sm,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 15,
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  keyboard: {
    flex: 1,
  },
  laneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  laneLabel: {
    color: colors.mutedInk,
    fontSize: 12,
    fontWeight: '800',
  },
  laneStat: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flexBasis: '48%',
    flexGrow: 1,
    minHeight: 86,
    overflow: 'hidden',
    padding: spacing.md,
  },
  pressedLaneStat: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  retryText: {
    color: colors.ember,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 2,
  },
  scanLaneAction: {
    color: colors.sky,
    fontSize: 12,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  scanLaneStat: {
    borderColor: colors.sky,
  },
  scannerModal: {
    backgroundColor: colors.canvas,
    flex: 1,
    padding: spacing.md,
  },
  laneStripe: {
    borderRadius: 3,
    height: 6,
    marginBottom: spacing.sm,
    width: 42,
  },
  laneValue: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  safeArea: {
    backgroundColor: colors.canvas,
    flex: 1,
  },
  sectionLabel: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  statusBanner: {
    backgroundColor: '#EAF3FF',
    borderColor: '#C7DCF6',
    borderRadius: radii.md,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  statusText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
  },
  toolbar: {
    gap: spacing.sm,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
});
