import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Customization = () => {
  const [selectedColor, setSelectedColor] = useState('#80e080');

  const colors = [
    '#80e080',
    '#1de1e5',
    '#2b59ef',
    '#aa00ff',
    '#ff00d9',
    '#ff2929',
    '#ffff00',
    '#b7ff00',
  ];

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyle(isDark);

  const handleSelect = async (color: string) => {
    setSelectedColor(color);
    try {
      await AsyncStorage.setItem('color', color);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Cor do Círculo</Text>

      <View style={styles.colorContainer}>
        {colors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.boxColor,
              { backgroundColor: color },
              selectedColor === color && styles.selectedBox,
            ]}
            onPress={() => handleSelect(color)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Customization;

const getStyle = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#2f2f2f' : '#f2f2f2',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 40,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: '600',
      color: isDark ? '#fff' : '#222',
      marginBottom: 20,
    },
    colorContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      justifyContent: 'center',
    },
    boxColor: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedBox: {
      borderColor: isDark ? '#f2f2f2': '#2f2f2f',
    },
  });
