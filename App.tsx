/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';
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
import Time from './src/components/Time';
import Toast from './src/components/Toast';

function App(): React.JSX.Element {
  const [held, setHeld] = useState(false);
  const [pressed, setPressed] = useState(false);

  const initialBtn = useRef(new Animated.Value(1)).current;
  const activeShadow = useRef(new Animated.Value(0)).current;
  const activeRunningShadow = useRef(new Animated.Value(0)).current;
  const runningShadow = useRef(new Animated.Value(0)).current;

  const bg = useRef(new Animated.Value(0)).current;
  const bgInter = bg.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgb(230, 237, 246)", "rgb(234, 197, 191)"]
  })

  const scale = useRef(new Animated.Value(1.06)).current;

  const DURATION = 1000;

  const [time, setTime] = useState<number>(0);
  const timeOpacity = useRef(new Animated.Value(0.6)).current;
  const timeScale = useRef(new Animated.Value(1)).current;

  const [toastDisplay, setToastDisplay] = useState(false);
  const toastPosition = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    let interval: any = 0;

    if (pressed) {
      interval = setInterval(() => {
        setTime((time) => time + 1000);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    }
  }, [pressed]);

  const handleStop = () => {
    setPressed(false);
    setTime(0);
  }

  const makePressEffects = () => {
    Animated.parallel([
      Animated.timing(timeOpacity, {
        toValue: held ? 0.6 : 0.5,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(timeScale, {
        toValue: held ? 1 : 0.99,
        duration: DURATION,
        useNativeDriver: true,
      })
    ]).start();
  }

  const fadeInInitial = () => {
    const el = pressed ? activeRunningShadow : initialBtn;
    const shadow = pressed ? runningShadow : activeShadow;
    Animated.parallel([
      Animated.timing(el, {
        toValue: 0,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1.06,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(shadow, {
        toValue: 1,
        duration: DURATION,
        useNativeDriver: true,
      })
    ]).start();
    makePressEffects();
    setHeld(true);
  }

  const fadeOutInitial = (notPressed?: boolean) => {
    const val = notPressed === undefined || notPressed ? 1 : 0;
    const el = pressed ? activeRunningShadow : initialBtn;
    const shadow = pressed ? runningShadow : activeShadow;
    Animated.timing(el, {
      toValue: val,
      duration: DURATION,
      useNativeDriver: true,
    }).start();
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1.06,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(shadow, {
        toValue: 0,
        duration: DURATION / 1.75,
        useNativeDriver: true,
      })
    ]).start();
    makePressEffects();
    setHeld(false);
  }

  const twistIn = () => {
    Animated.parallel([
      Animated.timing(initialBtn, {
        toValue: pressed ? 1 : 0,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(activeRunningShadow, {
        toValue: pressed ? 0 : 1,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(runningShadow, {
        toValue: 0,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(bg, {
        toValue: pressed ? 0 : 1,
        duration: DURATION,
        useNativeDriver: true,
      })
    ]).start();
    if (pressed) handleStop();
    setPressed(!pressed);
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgInter }]}>
      <SafeAreaView style={styles.parent}>
        <Time
          timeScale={timeScale}
          timeOpacity={timeOpacity}
          time={time}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            zIndex: 2,
            transform: [
              { translateX: "-50%" }, { translateY: "50%" }
            ]
          }}
        />
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={() => { fadeInInitial() }}
          onPressOut={() => { fadeOutInitial() }}
          onPress={() => { twistIn() }}
          style={styles.button}>
          <Animated.View style={[styles.shadowElement, { opacity: initialBtn }]}>
            <Animated.View style={[styles.shadowElement, styles.shadow1, { backgroundColor: bgInter }]}></Animated.View>
            <Animated.View style={[styles.shadowElement, styles.shadow2, { backgroundColor: bgInter }]}>
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
            </Animated.View>
          </Animated.View>
          <Animated.View style={[styles.shadowElement, { opacity: activeRunningShadow, transform: [{ scale: 1.025 }] }]}>
            <Animated.View style={[styles.shadowElement, styles.shadow4, { backgroundColor: bgInter }]}></Animated.View>
            <View style={styles.shadowElement}>
              <Svg width="280" height="280" viewBox="0 0 280 280" fill="none" style={styles.svg}>
                <Path d="M140 280C217.32 280 280 217.32 280 140C280 62.6801 217.32 0 140 0C62.6801 0 0 62.6801 0 140C0 217.32 62.6801 280 140 280Z" fill="url(#paint0_radial_39_37)" />
                <Defs>
                  <RadialGradient id="paint0_radial_39_37" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(140 140) rotate(90) scale(140)">
                    <Stop offset="0.863394" stopColor="#4D2B26" stopOpacity="0" />
                    <Stop offset="1" stopColor="#4D2B26" stopOpacity="0.1" />
                  </RadialGradient>
                </Defs>
              </Svg>
              <Svg width="280" height="280" viewBox="0 0 280 280" fill="none" style={styles.svg}>
                <Path d="M140 280C217.32 280 280 217.32 280 140C280 62.6801 217.32 0 140 0C62.6801 0 0 62.6801 0 140C0 217.32 62.6801 280 140 280Z" fill="url(#paint0_radial_39_38)" />
                <Defs>
                  <RadialGradient id="paint0_radial_39_38" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(140 140) rotate(90) scale(140)">
                    <Stop stopColor="#ECC9C4" stopOpacity="0" />
                    <Stop offset="1" stopColor="#ECC9C4" stopOpacity="0.4" />
                  </RadialGradient>
                </Defs>
              </Svg>
            </View>
          </Animated.View>
          <Animated.View style={[styles.shadowElement, { opacity: activeShadow, transform: [{ scale: scale }] }]}>
            <Animated.View style={[styles.shadowElement, styles.shadow3, { backgroundColor: bgInter }]}></Animated.View>
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
                    <Stop offset="0.89" stopColor={"#E6EDF6"} stopOpacity="0" />
                    <Stop offset="1" stopColor={"#E6EDF6"} />
                  </RadialGradient>
                </Defs>
              </Svg>
            </View>
          </Animated.View>
          <Animated.View style={[styles.shadowElement, { opacity: runningShadow, transform: [{ scale: scale }] }]}>
            <Animated.View style={[styles.shadowElement, styles.shadow5, { backgroundColor: bgInter }]}></Animated.View>
            <View style={styles.shadowElement}>
              <Svg width="280" height="273" viewBox="0 0 280 273" fill="none" style={styles.svg}>
                <Path d="M140 280C217.32 280 280 217.32 280 140C280 62.6801 217.32 0 140 0C62.6801 0 0 62.6801 0 140C0 217.32 62.6801 280 140 280Z" fill="url(#paint0_radial_35_25)" />
                <Defs>
                  <RadialGradient id="paint0_radial_35_25" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(140 152) rotate(90) scale(128)">
                    <Stop offset="0.755" stopColor="#4D2B26" stopOpacity="0" />
                    <Stop offset="1" stopColor="#4D2B26" stopOpacity="0.1" />
                  </RadialGradient>
                </Defs>
              </Svg>
              <Svg width="280" height="273" viewBox="0 0 280 273" fill="none" style={styles.svg}>
                <Path d="M140 280C217.32 280 280 217.32 280 140C280 62.6801 217.32 0 140 0C62.6801 0 0 62.6801 0 140C0 217.32 62.6801 280 140 280Z" fill="url(#paint0_radial_35_26)" />
                <Defs>
                  <RadialGradient id="paint0_radial_35_26" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(140 140) rotate(90) scale(140)">
                    <Stop offset="0.89" stopColor={"#ECC9C4"} stopOpacity="0" />
                    <Stop offset="1" stopColor={"#ECC9C4"} />
                  </RadialGradient>
                </Defs>
              </Svg>
            </View>
          </Animated.View>
        </TouchableOpacity>
        <Toast style={styles.toast} />
      </SafeAreaView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  parent: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    display: "flex",
    flex: 1
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
  shadow1: {
    shadowColor: "rgb(255, 255, 255)",
    shadowOffset: { width: 0, height: -24 },
    shadowOpacity: 1,
    shadowRadius: 100
  },
  shadow2: {
    shadowColor: "rgb(40, 48, 87)",
    shadowOffset: { width: 0, height: 32 },
    shadowOpacity: 0.2,
    shadowRadius: 24
  },
  shadow3: {
    shadowColor: "rgb(77, 43, 38)",
    shadowOpacity: 0.04,
    shadowRadius: 60
  },
  shadow4: {
    shadowColor: "rgb(40, 48, 87)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 28
  },
  shadow5: {
    shadowColor: "rgb(77, 43, 38)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 28
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0
  },
  toast: {
    position: "absolute",
    bottom: 0
  }
});

export default App;
