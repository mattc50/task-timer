/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef, useState } from 'react';
import Svg, { Defs, Path, RadialGradient, Stop } from 'react-native-svg';

import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

// import { BorderShadow } from 'react-native-shadow';

function App(): React.JSX.Element {
  const [held, setHeld] = useState(false);
  const [pressed, setPressed] = useState(false);

  const opacityValue1 = useRef(new Animated.Value(1)).current;
  const opacityValue2 = useRef(new Animated.Value(0)).current;
  const opacityValue3 = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1.06)).current;

  const DURATION = 1000;

  const handleFadeIn = () => {
    Animated.timing(opacityValue1, {
      toValue: 0,
      duration: DURATION,
      useNativeDriver: true,
    }).start();
    Animated.sequence([
      Animated.delay(DURATION / 20),
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1.06,
          duration: DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue2, {
          toValue: 1,
          duration: DURATION,
          useNativeDriver: true,
        })
      ])
    ]).start();
  };

  const handleFadeOut = (pressed: boolean) => {
    const newVal = !pressed;
    Animated.sequence([
      Animated.delay(DURATION / 20),
      Animated.timing(opacityValue1, {
        toValue: newVal ? 0 : 1,
        duration: newVal ? DURATION / 2 : DURATION,
        useNativeDriver: true,
      })
    ]).start();
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1.065,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue2, {
        toValue: 0,
        duration: DURATION,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handlePressed = (pressed: boolean) => {
    const newVal = !pressed;
    console.log("pressed:", !pressed)
    Animated.timing(opacityValue3, {
      toValue: newVal ? 1 : 0,
      duration: DURATION / 2,
      useNativeDriver: true,
    }).start();
    setPressed(newVal)
  }

  return (
    <SafeAreaView style={styles.parent}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => { handleFadeIn(); setHeld(true) }}
        onPressOut={() => { handleFadeOut(pressed); setHeld(false) }}
        onPress={() => { handlePressed(pressed) }}
        style={styles.button}>
        {/* <BorderShadow {...shadowSettings.shadow1}><View /></BorderShadow>
        <BorderShadow {...shadowSettings.shadow2}><View /></BorderShadow>
        <BorderShadow {...shadowSettings.shadow3}><View /></BorderShadow>
        <BorderShadow {...shadowSettings.shadow4}><View /></BorderShadow> */}
        <Animated.View style={[styles.shadowElement, { opacity: opacityValue1 }]}>
          <View style={[styles.shadowElement, styles.shadow1]}></View>
          <View style={[styles.shadowElement, styles.shadow2]}>
            <Svg width="280" height="280" viewBox="0 0 280 280" fill="none" style={styles.svg}>
              <Path d="M140 280C217.32 280 280 217.32 280 140C280 62.6801 217.32 0 140 0C62.6801 0 0 62.6801 0 140C0 217.32 62.6801 280 140 280Z" fill="url(#paint0_radial_4_12)" />
              <Defs>
                <RadialGradient id="paint0_radial_4_12" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(140 173.5) rotate(-90) scale(159)">
                  <Stop offset="0.85" stopColor="white" stopOpacity="0" />
                  <Stop offset="1" stopColor="white" stopOpacity="0.6" />
                </RadialGradient>
              </Defs>
            </Svg>
            <Svg width="280" height="280" viewBox="0 0 280 280" fill="none" style={styles.svg}>
              <Path d="M140 280C217.32 280 280 217.32 280 140C280 62.6801 217.32 0 140 0C62.6801 0 0 62.6801 0 140C0 217.32 62.6801 280 140 280Z" fill="url(#paint0_radial_4_13)" />
              <Defs>
                <RadialGradient id="paint0_radial_4_13" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(140 110) rotate(90) scale(162)">
                  <Stop offset="0.828694" stopColor="#283057" stopOpacity="0" />
                  <Stop offset="1" stopColor="#283057" stopOpacity="0.08" />
                </RadialGradient>
              </Defs>
            </Svg>
          </View>
        </Animated.View>
        <Animated.View style={[styles.shadowElement, { opacity: opacityValue3, transform: [{ scale: 1.025 }] }]}>
          <View style={[styles.shadowElement, styles.shadow4]}></View>
          <View style={styles.shadowElement}>
            <Svg width="280" height="280" viewBox="0 0 280 280" fill="none" style={styles.svg}>
              <Path d="M140 280C217.32 280 280 217.32 280 140C280 62.6801 217.32 0 140 0C62.6801 0 0 62.6801 0 140C0 217.32 62.6801 280 140 280Z" fill="url(#paint0_radial_39_37)" />
              <Defs>
                <RadialGradient id="paint0_radial_39_37" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(140 140) rotate(90) scale(140)">
                  <Stop offset="0.863394" stopColor="#283057" stopOpacity="0" />
                  <Stop offset="1" stopColor="#283057" stopOpacity="0.1" />
                </RadialGradient>
              </Defs>
            </Svg>
            <Svg width="280" height="280" viewBox="0 0 280 280" fill="none" style={styles.svg}>
              <Path d="M140 280C217.32 280 280 217.32 280 140C280 62.6801 217.32 0 140 0C62.6801 0 0 62.6801 0 140C0 217.32 62.6801 280 140 280Z" fill="url(#paint0_radial_39_38)" />
              <Defs>
                <RadialGradient id="paint0_radial_39_38" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(140 140) rotate(90) scale(140)">
                  <Stop stopColor="#E6EDF6" stopOpacity="0" />
                  <Stop offset="1" stopColor="#E6EDF6" stopOpacity="0.4" />
                </RadialGradient>
              </Defs>
            </Svg>
          </View>
        </Animated.View>
        <Animated.View style={[styles.shadowElement, { opacity: opacityValue2, transform: [{ scale: scale }] }]}>
          <View style={[styles.shadowElement, styles.shadow3]}></View>
          <View style={styles.shadowElement}>
            <Svg width="280" height="273" viewBox="0 0 280 273" fill="none" style={styles.svg}>
              <Path d="M140 280C217.32 280 280 217.32 280 140C280 62.6801 217.32 0 140 0C62.6801 0 0 62.6801 0 140C0 217.32 62.6801 280 140 280Z" fill="url(#paint0_radial_35_25)" />
              <Defs>
                <RadialGradient id="paint0_radial_35_25" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(140 152) rotate(90) scale(128)">
                  <Stop offset="0.755" stopColor="#283057" stopOpacity="0" />
                  <Stop offset="1" stopColor="#283057" stopOpacity="0.1" />
                </RadialGradient>
              </Defs>
            </Svg>
            <Svg width="280" height="273" viewBox="0 0 280 273" fill="none" style={styles.svg}>
              <Path d="M140 280C217.32 280 280 217.32 280 140C280 62.6801 217.32 0 140 0C62.6801 0 0 62.6801 0 140C0 217.32 62.6801 280 140 280Z" fill="url(#paint0_radial_35_26)" />
              <Defs>
                <RadialGradient id="paint0_radial_35_26" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(140 140) rotate(90) scale(140)">
                  <Stop offset="0.89" stopColor="#E6EDF6" stopOpacity="0" />
                  <Stop offset="1" stopColor="#E6EDF6" />
                </RadialGradient>
              </Defs>
            </Svg>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  parent: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6EDF6"
  },
  button: {
    position: "relative",
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  shadowElement: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "100%",
  },
  // shadow1: {
  //   shadowColor: "rgb(255, 255, 255)",
  //   shadowOffset: { width: 0, height: 24 },
  //   shadowOpacity: 0.6,
  //   shadowRadius: 24,
  // },
  shadow1: {
    backgroundColor: "#E6EDF6",
    shadowColor: "rgb(255, 255, 255)",
    shadowOffset: { width: 0, height: -24 },
    shadowOpacity: 1,
    shadowRadius: 100
  },
  // shadow3: {
  //   shadowColor: "rgb(40, 48, 87)",
  //   shadowOffset: { width: 0, height: -24 },
  //   shadowOpacity: 0.08,
  //   shadowRadius: 24,
  // },
  shadow2: {
    backgroundColor: "#E6EDF6",
    shadowColor: "rgb(40, 48, 87)",
    shadowOffset: { width: 0, height: 32 },
    shadowOpacity: 0.2,
    shadowRadius: 24
  },
  shadow3: {
    backgroundColor: "#E6EDF6",
    shadowColor: "rgb(40, 48, 87)",
    shadowOpacity: 0.04,
    shadowRadius: 60
  },
  shadow4: {
    backgroundColor: "#E6EDF6",
    shadowColor: "rgb(40, 48, 87)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 28
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0
  }
});

// const shadowSettings = {
//   shadow1: {
//     color: "rgb(255, 255, 255)",
//     opacity: 0.6,
//     border: 24,
//     y: 24,
//     inset: true
//   },
//   shadow2: {
//     color: "rgb(255, 255, 255)",
//     opacity: 1,
//     border: 100,
//     y: -24
//   },
//   shadow3: {
//     color: "rgb(40, 48, 87)",
//     opacity: 0.08,
//     border: 24,
//     y: -24,
//     inset: true
//   },
//   shadow4: {
//     color: "rgb(40, 48, 87)",
//     opacity: 0.2,
//     border: 32,
//   }
// }

export default App;
