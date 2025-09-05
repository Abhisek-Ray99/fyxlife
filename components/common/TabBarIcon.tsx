import { FontAwesome, Ionicons } from '@expo/vector-icons';

type IconSetName = 'FontAwesome' | 'Ionicons';

export function TabBarIcon({
  name,
  color,
  iconSet = 'Ionicons',
}: {
  name: React.ComponentProps<typeof Ionicons>['name'] | React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  iconSet?: IconSetName;
}) {
  const IconComponent = iconSet === 'FontAwesome' ? FontAwesome : Ionicons;
  // @ts-ignore
  return <IconComponent size={28} style={{ marginBottom: -3 }} name={name} color={color} />;
}