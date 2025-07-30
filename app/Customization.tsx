import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';


const bannerAdUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-xxxx/yyyy';
const rewardedAdUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-2167342388104312/9954032513';

const rewarded = RewardedAd.createForAdRequest(rewardedAdUnitId, {
  keywords: ['fashion', 'clothing'],
});

const Customization = () => {
  const [selectedColor, setSelectedColor] = useState('#80e080');
  const [loaded, setLoaded] = useState(false);

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

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      }
    );

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
        rewarded.load();
      }
    );

    const unsubscribeClosed = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        setLoaded(false); 
        rewarded.load(); 
      }
    );

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
    };
  }, []);

  useEffect(() => {
    const getUserColor = async () => {
      const cor = await AsyncStorage.getItem('color');
      if (cor) {
        setSelectedColor(cor);
      }
    };
    getUserColor();
  }, []);

  const handleSelect = async (color: string) => {
    try {
      if (loaded) {
        setSelectedColor(color);
        await AsyncStorage.setItem('color', color);
        rewarded.show();
      } else {
        console.warn('Anúncio ainda não carregado. Por favor, tente novamente em breve.');
      }
    } catch (error: any) {
      console.error('Erro ao selecionar cor ou exibir anúncio:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BannerAd unitId={bannerAdUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
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

      <Text style={styles.title}>Configurações</Text>

      <View>
        <Text>Tela sempre ativa:</Text>
        <TouchableOpacity onPress={() => {}}>
          <Text>Ativado</Text>
        </TouchableOpacity>
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
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: '600',
      color: isDark ? '#fff' : '#222',
      marginBottom: 20,
      marginTop: 30,
    },
    colorContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    boxColor: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: 'transparent',
      margin: 8,
    },
    selectedBox: {
      borderColor: isDark ? '#f2f2f2' : '#2f2f2f',
    },
  });