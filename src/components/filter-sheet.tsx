import { Feather } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette } from '@/constants/theme';

type Option<T> = { value: T; label: string };

type Props<T> = {
  visible: boolean;
  title: string;
  options: Option<T>[];
  current: T;
  onSelect: (value: T) => void;
  onClose: () => void;
};

export function FilterSheet<T>({
  visible,
  title,
  options,
  current,
  onSelect,
  onClose,
}: Props<T>) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1">
        <Pressable className="flex-1 bg-black/50" onPress={onClose} />
        <View
          style={{ paddingBottom: insets.bottom }}
          className="rounded-t-2xl bg-background pt-3">
          <View className="mx-auto mb-3 h-1 w-12 rounded-full bg-border" />
          <Text className="px-4 pb-2 text-lg font-semibold text-foreground">{title}</Text>
          <ScrollView contentContainerStyle={{ paddingBottom: 8 }}>
            {options.map((opt, idx) => (
              <Pressable
                key={String(opt.value ?? `null-${idx}`)}
                onPress={() => {
                  onSelect(opt.value);
                  onClose();
                }}
                className="flex-row items-center justify-between px-4 py-3 active:bg-card">
                <Text className="text-base text-foreground">{opt.label}</Text>
                {opt.value === current && (
                  <Feather name="check" size={20} color={palette.primary} />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
