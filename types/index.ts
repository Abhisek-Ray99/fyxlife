export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other',
    PreferNotToSay = 'PreferNotToSay',
}

export enum ActivityLevel {
    Sedentary = 'Sedentary',
    LightlyActive = 'Lightly Active',
    ModeratelyActive = 'Moderately Active',
    VeryActive = 'Very Active',
}

export interface UserProfile {
    name: string;
    age: number;
    phone: string;
    gender: Gender;
    activityLevel: ActivityLevel;
}

export interface FamilyMember {
    id: string;
    name: string;
    relationship: string;
    kpis: KpiData;
}

export interface Goal {
    id: string;
    title: string;
    category: 'Move' | 'Eat' | 'Calm';
    description: string;
    target: number;
    current: number;
    unit: string;
    completed: boolean;
}

export type KpiCategory = 'Cardio' | 'Metabolic' | 'Composition' | 'Mental';

export interface Kpi {
    label: string;
    value: number | { systolic: number; diastolic: number };
    unit: string;
    category: KpiCategory;
    timestamp: number;
}

export type KpiData = {
    hba1c?: Kpi[];
    bloodPressure?: Kpi[];
    restingHeartRate?: Kpi[];
    sleepQuality?: Kpi[];
    dailyActivity?: Kpi[];
    bmi?: Kpi[];
    waistCircumference?: Kpi[];
    cholesterol?: {
        total: Kpi[];
        ldl: Kpi[];
        hdl: Kpi[];
        triglycerides: Kpi[];
    };
    mentalWellbeing?: Kpi[];
};

export type BioSystem = 'Neuro' | 'Cardio' | 'Respiratory';

export interface RiskData {
    system: BioSystem;
    riskScore: number; // 0 to 100
    factors: string[];
}


export type ThemeMode = 'light' | 'dark';
export type PaletteName = 'neon' | 'minimal' | 'sunset' | 'nature';

export interface ThemeColors {
  background: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentSecondary: string;
  accentText: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
}

export interface AppTheme {
  colors: ThemeColors;
  barStyle: 'light-content' | 'dark-content';
}

export interface Palette {
  name: string;
  light: AppTheme;
  dark: AppTheme;
  // Visual representation for the switcher UI
  visuals: {
    top: string;
    bottom: string;
    left: string;
    right: string;
  }
}


export interface Preference {
    label: string;
    icon: React.ComponentProps<typeof import('@expo/vector-icons')['Ionicons']>['name'];
    color: string;
  }