import { View, Text, StyleSheet, BackHandler, useColorScheme } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Background } from '@react-navigation/elements'

const Customization = () => {

    const colorScheme = useColorScheme()
    const isDark = colorScheme === 'dark'

    const styles = getStyle(isDark)

  return (
    <SafeAreaView style={styles.container}>
      
    </SafeAreaView>
  )
}

export default Customization

function getStyle(isDark: boolean) {
    return StyleSheet.create({
        container: {
            backgroundColor: isDark ? "#2f2f2f" : "f2f2f2",
            flex: 1,
        },
    })
}