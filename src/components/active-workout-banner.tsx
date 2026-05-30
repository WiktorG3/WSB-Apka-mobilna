import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

type Props = {
  workoutId: number;
  name: string;
};

export function ActiveWorkoutBanner({ workoutId, name }: Props) {
  const router = useRouter();
  return (
    <View className="mx-4 my-2 flex-row items-center rounded-lg bg-primary px-4 py-3">
      <View className="flex-1">
        <Text className="text-xs text-foreground opacity-80">Trening w trakcie</Text>
        <Text className="text-base font-semibold text-foreground">{name}</Text>
      </View>
      <Pressable
        onPress={() => router.push({ pathname: '/workout/[id]', params: { id: workoutId } })}
        className="rounded-lg bg-card px-4 py-2 active:opacity-80">
        <Text className="text-sm font-semibold text-foreground">Wznów</Text>
      </Pressable>
    </View>
  );
}
