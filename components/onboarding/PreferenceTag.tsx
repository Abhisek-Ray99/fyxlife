// PreferenceTag.tsx
import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Preference } from "@/types";

interface PreferenceTagProps {
  preference: Preference;
}

export function PreferenceTag({ preference }: PreferenceTagProps) {
  return (
    <View
      style={{
        backgroundColor: preference.color,
        borderColor: preference.color,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "120%",   // ✅ stretch inside wrapper
        height: 90,      // ✅ bigger height
        borderWidth: 2,
      }}
    >
      <Ionicons
        name={preference.icon}
        size={28}
        color="#000"
        style={{ marginRight: 10 }}
      />
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: "#000",
        }}
      >
        {preference.label}
      </Text>
    </View>
  );
}
