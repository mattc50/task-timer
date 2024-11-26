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
  // const [hasDraggedOut, setHasDraggedOut] = useState(false);
  // const buttonRef = useRef<any>(null);

  // const panResponder = PanResponder.create({
  //   onStartShouldSetPanResponder: () => {
  //     console.log("ran")
  //     return true
  //   },
  //   onPanResponderGrant: () => {
  //     setPressed(true);
  //     setHasDraggedOut(false);
  //   },
  //   onPanResponderMove: (evt, gestureState) => {
  //     console.log('Triggered');
  //     buttonRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
  //       console.log('Button Bounds:', { x, y, width, height, pageX, pageY });

  //       const { moveX, moveY } = gestureState;

  //       // Check if the finger is outside the button bounds
  //       if (
  //         moveX < pageX || moveX > pageX + width ||
  //         moveY < pageY || moveY > pageY + height
  //       ) {
  //         setHasDraggedOut(true);
  //       } else {
  //         setHasDraggedOut(false);
  //       }
  //     });
  //   },
  //   onPanResponderRelease: () => {
  //     setPressed(false);
  //     setHasDraggedOut(false);
  //   },
  // });

  const opacityValue1 = useRef(new Animated.Value(1)).current;
  const opacityValue2 = useRef(new Animated.Value(0)).current;
  const opacityValue3 = useRef(new Animated.Value(0)).current;

  // red: rgb(234, 197. 191)
  // neutral: rgb(230, 237, 246)
  const red = useRef(new Animated.Value(0)).current;
  const rInter = red.interpolate({
    inputRange: [0, 1],
    outputRange: [230, 234]
  })
  const green = useRef(new Animated.Value(0)).current;
  const gInter = green.interpolate({
    inputRange: [0, 1],
    outputRange: [237, 197]
  })
  const blue = useRef(new Animated.Value(0)).current;
  const bInter = blue.interpolate({
    inputRange: [0, 1],
    outputRange: [246, 191]
  })

  const bg = useRef(new Animated.Value(0)).current;
  const bgInter = bg.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgb(230, 237, 246)", "rgb(234, 197, 191)"]
  })
  const [bgColor, setBgColor] = useState(bgInter)


  // useEffect(() => {
  //   const listenerId = bg.addListener((value) => {
  //     console.log('Animated Value:', value.value); // Access the current value
  //     setBgColor(bgInter)
  //   });

  //   return () => bg.removeListener(listenerId); // Cleanup on unmount
  // }, []);

  // const handleColorChange = () => {
  //   Animated.parallel([
  //     Animated.timing(red, {
  //       toValue: 1,
  //       duration: DURATION,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(green, {
  //       toValue: 1,
  //       duration: DURATION,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(blue, {
  //       toValue: 1,
  //       duration: DURATION,
  //       useNativeDriver: true,
  //     })
  //   ]).start();
  // }

  // const handleActivate = () => {
  //   Animated.timing(bg, {
  //     toValue: 1,
  //     duration: DURATION,
  //     useNativeDriver: true,
  //   })
  // }


  const scale = useRef(new Animated.Value(1.06)).current;

  const DURATION = 1000;

  const handleFadeIn = () => {
    // if (held) {
    //   console.log(held);
    //   handleFadeOut(pressed);
    //   setHeld(false);
    //   return;
    // }
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
    console.log('pressed out')
    const newVal = !pressed;
    Animated.sequence([
      Animated.delay(DURATION / 20),
      Animated.timing(opacityValue1, {
        toValue: newVal
          ? 0
          : 1,
        duration: newVal
          ? DURATION / 2
          : DURATION,
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
    // setHeld(false)
  };

  const handlePressed = (pressed: boolean) => {
    const newVal = !pressed;
    // console.log("pressed:", !pressed)
    Animated.timing(opacityValue1, {
      toValue: newVal
        ? 0
        : 1,
      duration: 100,
      useNativeDriver: true,
    }).start
    Animated.parallel([
      Animated.timing(opacityValue3, {
        toValue: newVal ? 1 : 0,
        duration: DURATION / 2,
        useNativeDriver: true,
      }),
      Animated.timing(bg, {
        toValue: newVal ? 1 : 0,
        duration: DURATION,
        useNativeDriver: true,
      })
    ]).start();
    setPressed(newVal)
  }

  console.log("fired")

  return (
    <Animated.View style={[styles.container, {
      backgroundColor: bgInter
      // backgroundColor: `rgb(${rInter}, ${gInter}, ${bInter})` 
    }]}>
      <SafeAreaView style={styles.parent}>
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={() => { handleFadeIn(); setHeld(true) }}
          onPressOut={() => { handleFadeOut(pressed); }}
          onPress={() => { handlePressed(pressed) }}
          // {...panResponder.panHandlers}
          // ref={buttonRef}
          style={styles.button}>
          <Animated.View style={[styles.shadowElement, { opacity: opacityValue1 }]}>
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
          <Animated.View style={[styles.shadowElement, { opacity: opacityValue3, transform: [{ scale: 1.025 }] }]}>
            <Animated.View style={[styles.shadowElement, styles.shadow4, { backgroundColor: bgInter }]}></Animated.View>
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
          <Animated.View style={[styles.shadowElement, { opacity: !pressed ? 0 : opacityValue2, transform: [{ scale: scale }] }]}>
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
          <Animated.View style={[styles.shadowElement, { opacity: pressed ? 0 : opacityValue2, transform: [{ scale: scale }] }]}>
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
