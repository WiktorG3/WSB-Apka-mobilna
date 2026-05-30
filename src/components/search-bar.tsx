import { TextInput } from 'react-native';

import { palette } from '@/constants/theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChangeText, placeholder }: Props) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={palette.muted}
      className="mx-4 my-2 rounded-lg bg-card px-4 py-3 text-foreground"
    />
  );
}
