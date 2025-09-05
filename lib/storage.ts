import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveString = async (key: string, value: string): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

export const loadString = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
};

export const save = async (key: string, value: object): Promise<boolean> => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
};

export const load = async (key: string): Promise<any | null> => {
    try {
        const item = await AsyncStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch {
        return null;
    }
};

export const remove = async (key: string): Promise<boolean> => {
    try {
        await AsyncStorage.setItem(key, '');
        return true;
    } catch {
        return false;
    }
};