import { Pressable, Text } from 'react-native';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function FilterChip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-3 py-1 ${
        selected ? 'border-primary bg-primary' : 'border-border bg-card'
      }`}>
      <Text className={`text-sm ${selected ? 'text-foreground' : 'text-muted'}`}>{label}</Text>
    </Pressable>
  );
}
