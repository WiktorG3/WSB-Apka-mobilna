import { Text, TextInput, View } from 'react-native';

import { palette } from '@/constants/theme';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function TextField({ label, value, onChangeText, placeholder }: Props) {
  return (
    <View className="mx-4 my-2">
      <Text className="mb-1 text-sm text-muted">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.muted}
        className="rounded-lg bg-card px-4 py-3 text-foreground"
      />
    </View>
  );
}
