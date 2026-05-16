import { useMemo, useReducer, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Pill } from './src/components/Pill';
import { ProgressRail } from './src/components/ProgressRail';
import { TodoRow } from './src/components/TodoRow';
import {
  getCompletionRatio,
  getLaneCount,
  initialTodos,
  todoReducer,
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
  const [todos, dispatch] = useReducer(todoReducer, initialTodos);
  const [title, setTitle] = useState('');
  const [selectedLane, setSelectedLane] = useState<TaskLane>('scan');
  const [filter, setFilter] = useState<Filter>('all');

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

  const addTodo = () => {
    dispatch({ type: 'add', title, lane: selectedLane });
    setTitle('');
  };

  const renderTodo = ({ item }: { item: Todo }) => (
    <TodoRow
      todo={item}
      onToggle={(id) => dispatch({ type: 'toggle', id })}
      onRemove={(id) => dispatch({ type: 'remove', id })}
    />
  );

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
                  <Text style={styles.eyebrow}>Expo + React Native demo</Text>
                  <Text style={styles.title}>CardQuest Todo</Text>
                </View>
                <View style={styles.countBadge}>
                  <Text style={styles.countValue}>{openCount}</Text>
                  <Text style={styles.countLabel}>open</Text>
                </View>
              </View>

              <View style={styles.heroPanel}>
                <Text style={styles.heroKicker}>Today&apos;s board</Text>
                <Text style={styles.heroTitle}>Plan scans, grade checks, trades, and shipping in one tactile mobile flow.</Text>
                <ProgressRail ratio={completionRatio} label="Vault progress" />
              </View>

              <View style={styles.laneGrid}>
                {taskLanes.map((lane) => (
                  <View key={lane.id} style={styles.laneStat}>
                    <View style={[styles.laneStripe, { backgroundColor: lane.color }]} />
                    <Text style={styles.laneValue}>{getLaneCount(todos, lane.id)}</Text>
                    <Text style={styles.laneLabel}>{lane.label}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.composer}>
                <Text style={styles.sectionLabel}>Add a task</Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Example: Inspect holo surface under angled light"
                  placeholderTextColor="#9A9489"
                  returnKeyType="done"
                  onSubmitEditing={addTodo}
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
                <Pressable style={styles.addButton} onPress={addTodo}>
                  <Text style={styles.addButtonText}>Add to board</Text>
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
              <Text style={styles.emptyTitle}>No tasks in this view</Text>
              <Text style={styles.emptyCopy}>Switch filters or add a new collector task above.</Text>
            </View>
          }
          ListFooterComponent={
            todos.some((todo) => todo.done) ? (
              <Pressable
                onPress={() => dispatch({ type: 'clear-completed' })}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>Clear completed tasks</Text>
              </Pressable>
            ) : null
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
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
