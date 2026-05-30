import { Pressable, Text } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'danger';
  disabled?: boolean;
};

export function PrimaryButton({ title, onPress, variant = 'primary', disabled }: Props) {
  const bg = variant === 'danger' ? 'bg-danger' : 'bg-primary';
  const opacity = disabled ? 'opacity-50' : '';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`${bg} ${opacity} mx-4 my-2 items-center rounded-lg px-4 py-3 active:opacity-80`}>
      <Text className="text-base font-semibold text-foreground">{title}</Text>
    </Pressable>
  );
}
