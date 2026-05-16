export const colors = {
  ink: '#171717',
  mutedInk: '#64615C',
  canvas: '#F6F7F3',
  surface: '#FFFFFF',
  line: '#E5E1D8',
  ember: '#F45D48',
  mint: '#1AAE8F',
  sky: '#2F7DD3',
  gold: '#D99A21',
  plum: '#6B4FD3',
  shadow: 'rgba(23, 23, 23, 0.12)',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radii = {
  sm: 8,
  md: 14,
  lg: 22,
};

export const taskLanes = [
  { id: 'scan', label: 'Scan', color: colors.sky },
  { id: 'grade', label: 'Grade', color: colors.plum },
  { id: 'trade', label: 'Trade', color: colors.mint },
  { id: 'ship', label: 'Ship', color: colors.ember },
] as const;

export type TaskLane = (typeof taskLanes)[number]['id'];
