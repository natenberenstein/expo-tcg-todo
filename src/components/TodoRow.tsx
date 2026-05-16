import { Pressable, StyleSheet, Text, View } from 'react-native';

import { type Todo } from '../domain/todos';
import { colors, radii, spacing, taskLanes } from '../theme/tokens';

const fallbackLane = { id: 'scan', label: 'Scan', color: colors.sky } as const;

type TodoRowProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
};

export function TodoRow({ todo, onToggle, onRemove }: TodoRowProps) {
  const lane = taskLanes.find((item) => item.id === todo.lane) ?? fallbackLane;

  return (
    <View style={[styles.card, todo.done ? styles.completedCard : undefined]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: todo.done }}
        onPress={() => onToggle(todo.id)}
        style={[styles.check, todo.done ? { backgroundColor: lane.color, borderColor: lane.color } : undefined]}
      >
        <Text style={styles.checkText}>{todo.done ? '✓' : ''}</Text>
      </Pressable>

      <View style={styles.content}>
        <Text style={[styles.title, todo.done ? styles.doneTitle : undefined]}>{todo.title}</Text>
        <View style={styles.metaRow}>
          <View style={[styles.dot, { backgroundColor: lane.color }]} />
          <Text style={styles.meta}>{lane.label} lane</Text>
        </View>
      </View>

      <Pressable
        accessibilityLabel={`Remove ${todo.title}`}
        hitSlop={10}
        onPress={() => onRemove(todo.id)}
        style={styles.removeButton}
      >
        <Text style={styles.removeText}>Remove</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  check: {
    alignItems: 'center',
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 2,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  checkText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 18,
  },
  completedCard: {
    opacity: 0.72,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  doneTitle: {
    color: colors.mutedInk,
    textDecorationLine: 'line-through',
  },
  dot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  meta: {
    color: colors.mutedInk,
    fontSize: 12,
    fontWeight: '700',
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  removeButton: {
    minHeight: 32,
    justifyContent: 'center',
  },
  removeText: {
    color: colors.ember,
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
});
