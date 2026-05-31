import { Text, View } from 'react-native';

type Props = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: Props) {
  return (
    <View className="mx-4 my-2 rounded-lg bg-card p-4">
      <Text className="text-sm text-muted">{label}</Text>
      <Text className="mt-1 text-3xl font-bold text-foreground">{value}</Text>
    </View>
  );
}
