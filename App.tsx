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
  PanResponder,
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
  const [bgColor, setBgColor] = useState(bgInter)

  const scale = useRef(new Animated.Value(1.06)).current;

  const DURATION = 1000;

  const fadeInInitial = (isPressed?: boolean) => {
    // console.log('pressed:', pressed)
    const el = pressed ? activeRunningShadow : initialBtn;
    const shadow = pressed ? runningShadow : activeShadow;
    // console.log(`shadow is ${pressed ? 'activeRunningShadow' : 'activeShadow'}`)
    // console.log(activeRunningShadow);
    // Animated.delay(DURATION / 20),
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
  }

  const fadeOutInitial = (notPressed?: boolean) => {
    // console.log('faded out')
    const val1 = notPressed === undefined || notPressed ? 1 : 0;
    // const val1 = notPressed ? 1 : 0;
    // const val2 = pressed ? 1 : 0;
    // console.log('pressed:', pressed)
    var el1, el2;
    el1 = pressed ? activeRunningShadow : initialBtn;
    console.log(`${pressed ? 'activeRunningShadow' : 'initialBtn'} will go to ${val1}`);
    // el2 = pressed ? initialBtn : activeRunningShadow;
    const shadow = pressed ? runningShadow : activeShadow;
    Animated.timing(el1, {
      toValue: val1,
      duration: DURATION,
      useNativeDriver: true,
    }).start();
    // Animated.timing(el2, {
    //   toValue: val2,
    //   duration: DURATION,
    //   useNativeDriver: true,
    // }).start();
    // Animated.sequence([
    // Animated.delay(DURATION / 20),
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
      // ])
    ]).start();
  }

  const twistIn = (isPressed?: boolean) => {
    // console.log('pressed in twist:', pressed)
    // const shadow = pressed ? activeRunningShadow : activeShadow;

    // if (pressed) fadeOutInitial(pressed)
    Animated.parallel([
      Animated.timing(initialBtn, {
        toValue: pressed ? 1 : 0,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(activeRunningShadow, {
        // toValue: 0,
        toValue: pressed ? 0 : 1,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(runningShadow, {
        // toValue: pressed ? 0 : 1,
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
    // console.log('running pressed')
    setPressed(!pressed);
  }

  const handleFadeIn = (bool?: boolean) => {
    if (held && pressed) {
      console.log('ran1')
      handleFadeOut(pressed);
      return;
    }
    if (held && !pressed) {
      console.log('ran2')
      handleFadeOut(pressed);
      return;
    }

    // const el = pressed ? runningShadow : bool ? runningShadow : activeShadow
    const shadow = pressed ? runningShadow : activeShadow
    Animated.timing(initialBtn, {
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
        Animated.timing(shadow, {
          toValue: pressed ? bg : 1,
          // toValue: bg,
          duration: DURATION,
          useNativeDriver: true,
        })
      ])
    ]).start();
  };


  const fadeOut = (bool?: boolean) => {
    console.log("fadeOut:", pressed);
    const newVal = bool;
    const el = pressed ? runningShadow : initialBtn
    Animated.parallel([
      Animated.sequence([
        Animated.delay(DURATION / 20),
        Animated.timing(el, {
          toValue: newVal
            ? 0
            : 1,
          duration: newVal
            ? DURATION / 2
            : DURATION,
          useNativeDriver: true,
        })
      ]),
      Animated.timing(scale, {
        toValue: 1.065,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(activeShadow, {
        toValue: 0,
        duration: DURATION / 2,
        useNativeDriver: true,
      })
    ]).start();
    setHeld(false);
  };

  const handleFadeOut = (bool?: boolean) => {
    fadeOut(bool);
  }

  const handlePressed = (bool: boolean) => {
    console.log('pressed')
    const newVal = bool;
    if (newVal) fadeOut(newVal);
    // if (!newVal) handleFadeIn(!newVal);
    // if (pressed && !newVal) fadeOut(newVal);
    console.log(newVal, bg)
    setPressed(newVal)
    console.log('animamtion running')
    Animated.parallel([
      // Animated.timing(activeShadow, {
      //   toValue: 0,
      //   duration: DURATION / 2,
      //   useNativeDriver: true,
      // }),
      Animated.timing(runningShadow, {
        toValue: 0,
        duration: DURATION / 2,
        useNativeDriver: true,
      }),
      Animated.timing(activeRunningShadow, {
        toValue: newVal ? 1 : 0,
        duration: DURATION / 2,
        useNativeDriver: true,
      }),
      Animated.timing(bg, {
        toValue: newVal ? 1 : 0,
        duration: DURATION,
        useNativeDriver: true,
      }),
    ]).start();
    // setTimeout(() => {
    //   console.log(bg)
    // }, 1000)
  }

  // console.log(pressed)

  return (
    <Animated.View style={[styles.container, {
      backgroundColor: bgInter
      // backgroundColor: `rgb(${rInter}, ${gInter}, ${bInter})` 
    }]}>
      <SafeAreaView style={styles.parent}>
        <TouchableOpacity
          activeOpacity={1}
          // onPressIn={() => { handleFadeIn(); setHeld(true) }}
          onPressIn={() => { fadeInInitial(pressed) }}
          // onPressOut={() => { handleFadeOut(pressed) }}
          onPressOut={() => { fadeOutInitial() }}
          onPress={() => { twistIn(!pressed) }}
          // {...panResponder.panHandlers}
          // ref={buttonRef}
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
    // shadowColor: "rgb(40, 48, 87)",
    // shadowColor: "rgb(40, 48, 87)",
    shadowColor: "rgb(77, 43, 38)",
    shadowOpacity: 0.04,
    shadowRadius: 60
  },
  shadow4: {
    shadowColor: "rgb(40, 48, 87)",
    // shadowColor: "rgb(77, 43, 38)",
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
  }
});

export default App;
