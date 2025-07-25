import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Animated } from 'react-native';

interface ProgressBarCircleProps {
  progress: number; // Progresso de 0 a 1 (ou 0 a 100, dependendo da sua preferência)
  radius: number;
  strokeWidth: number;
  backgroundColor: string;
  foregroundColor: string;
}

export default function ProgressBarCircle({
  progress,
  radius,
  strokeWidth,
  backgroundColor,
  foregroundColor,
}: ProgressBarCircleProps) {
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const animatedProgress = useRef(new Animated.Value(progress)).current;
  const circumference = 2 * Math.PI * radius;
  const animatedStrokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 1000, // tempo da transição
      useNativeDriver: false, // SVG não suporta native driver
    }).start();
  }, [progress]);

  return (
    <View style={styles.container}>
      <Svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <Circle
          stroke={backgroundColor}
          fill="none"
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          stroke={foregroundColor}
          fill="none"
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={animatedStrokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${radius}, ${radius})`}
        />


      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Permite que o texto do timer fique sobre ele
    justifyContent: 'center',
    alignItems: 'center',
  },
});