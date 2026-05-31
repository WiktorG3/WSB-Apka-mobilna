import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

type Props = {
  icon?: ReactNode;
  title: string;
  hint?: string;
};

export function EmptyState({ icon, title, hint }: Props) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      {icon && <View className="mb-4">{icon}</View>}
      <Text className="text-center text-lg font-semibold text-foreground">{title}</Text>
      {hint && <Text className="mt-2 text-center text-sm text-muted">{hint}</Text>}
    </View>
  );
}
