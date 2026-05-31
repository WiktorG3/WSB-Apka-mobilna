import { Feather } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';

import { palette } from '@/constants/theme';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export function FilterButton({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 flex-row items-center justify-between rounded-lg border px-3 py-2 active:opacity-80 ${
        active ? 'border-primary bg-card' : 'border-border bg-card'
      }`}>
      <Text className="flex-1 text-sm text-foreground" numberOfLines={1}>
        {label}
      </Text>
      <Feather name="chevron-down" size={16} color={palette.muted} />
    </Pressable>
  );
}
