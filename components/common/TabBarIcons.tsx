import { Ionicons } from '@expo/vector-icons';
import React from 'react';

// Define a simple props interface for consistency
interface IconProps {
  color: string;
  size: number;
}

export const DashboardIcon = ({ color, size }: IconProps) => (
  <Ionicons name="flash-outline" color={color} size={size} />
);

export const ProgressIcon = ({ color, size }: IconProps) => (
  <Ionicons name="stats-chart-outline" color={color} size={size} />
);

export const RiskIcon = ({ color, size }: IconProps) => (
  <Ionicons name="shield-checkmark-outline" color={color} size={size} />
);