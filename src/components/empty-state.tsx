import { Text, View } from 'react-native';

type Props = {
  message: string;
};

export function EmptyState({ message }: Props) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="text-center text-muted">{message}</Text>
    </View>
  );
}
