import { useEffect, useRef, useState } from "react"
import { AnimatableNumericValue, Animated, StyleSheet, TouchableOpacity, View } from "react-native"
import { Defs, Path, RadialGradient, Stop, Svg } from "react-native-svg"

interface TimerButtonProps {
  fadeIn: Function,
  fadeOut: Function,
  togglePress: Function,
  initialBtn: Animated.Value
  activeShadow: Animated.Value
  runningShadow: Animated.Value
  activeRunningShadow: Animated.Value
  bgInter: any,
  scale: Animated.Value,
  children: React.JSX.Element,
  pressed: boolean
  test?: boolean
  nextColor: Animated.Value
  nextColorInter: any,
  firstIndex: number,
  secondIndex: number,
}

const RGB = "0, 6, 35";

// const COLORS = {
//   image1: "rgb(51, 48, 81)",
//   image2: "rgb(82, 57, 55)",
//   image3: "rgb(79, 79, 129)",
//   image4: "rgb(83, 126, 255)",
//   image5: "rgb(74, 88, 244)",
//   image6: "rgb(76, 70, 126)",
//   image7: "rgb(84, 49, 68)",
//   image8: "rgb(12, 22, 69)",
// }

const TimerButton: React.FC<TimerButtonProps> = ({
  fadeIn,
  fadeOut,
  togglePress,
  initialBtn,
  activeShadow,
  runningShadow,
  activeRunningShadow,
  bgInter,
  scale,
  children,
  pressed,
  test,
  nextColor,
  nextColorInter,
  firstIndex,
  secondIndex
}) => {
  const [currentColor, setCurrentColor] = useState<Animated.Value>(bgInter);
  const colorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // console.log("COlor:", nextColorInter)

  const transitionColor = () => {
    console.log('transitioning')
    Animated.timing(nextColor, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start()
  }

  // useEffect(() => {
  //   if (test) {
  //     console.log("effect ran")
  //     transitionColor();
  //   }
  // }, [test])
  // useEffect(() => {
  //   console.log('ran')
  // }, [firstIndex, secondIndex])
  useEffect(() => {
    setCurrentColor(nextColorInter)
  }, [firstIndex, secondIndex])

  useEffect(() => {
    if (pressed) {
      colorTimeoutRef.current = setTimeout(() => {
        setCurrentColor(nextColorInter)
      }, 1000)
    } else {
      // if (colorTimeoutRef.current) {
      //   clearTimeout(colorTimeoutRef.current);
      //   colorTimeoutRef.current = null;
      // }
      setCurrentColor(bgInter)
    }
    return () => {
      if (colorTimeoutRef.current) clearTimeout(colorTimeoutRef.current);
    }
  }, [pressed])

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={() => { fadeIn() }}
      onPressOut={() => { fadeOut() }}
      onPress={() => { togglePress() }}
      style={styles.button}>
      <Animated.View style={[
        styles.shadowElement,
        { opacity: initialBtn }
      ]}>
        {!pressed && <Animated.View style={[
          styles.shadowElement,
          styles.shadow1,
          { backgroundColor: currentColor }]
        }></Animated.View>}
        <Animated.View style={[
          styles.shadowElement,
          styles.shadow2,
          { backgroundColor: currentColor }
        ]}>
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
                <Stop offset="0.828694" stopColor={`rgb(${RGB})`} stopOpacity="0" />
                <Stop offset="1" stopColor={`rgb(${RGB})`} stopOpacity="0.08" />
              </RadialGradient>
            </Defs>
          </Svg>
        </Animated.View>
      </Animated.View>
      <Animated.View style={[
        styles.shadowElement,
        {
          opacity: activeRunningShadow,
          transform: [{ scale: 1.025 }]
        }
      ]}>
        <Animated.View style={[
          styles.shadowElement,
          styles.shadow4,
          { backgroundColor: currentColor }
        ]}></Animated.View>
        <View style={styles.shadowElement}>
          <Svg width="280" height="280" viewBox="0 0 280 280" fill="none" style={styles.svg}>
            <Path d="M140 280C217.32 280 280 217.32 280 140C280 62.6801 217.32 0 140 0C62.6801 0 0 62.6801 0 140C0 217.32 62.6801 280 140 280Z" fill="url(#paint0_radial_39_37)" />
            <Defs>
              <RadialGradient id="paint0_radial_39_37" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(140 140) rotate(90) scale(140)">
                <Stop offset="0.863394" stopColor={`rgb(${RGB})`} stopOpacity="0" />
                <Stop offset="1" stopColor={`rgb(${RGB})`} stopOpacity="0.1" />
              </RadialGradient>
            </Defs>
          </Svg>
          <Svg width="280" height="280" viewBox="0 0 280 280" fill="none" style={styles.svg}>
            <Path d="M140 280C217.32 280 280 217.32 280 140C280 62.6801 217.32 0 140 0C62.6801 0 0 62.6801 0 140C0 217.32 62.6801 280 140 280Z" fill="url(#paint0_radial_39_38)" />
            <Defs>
              <RadialGradient id="paint0_radial_39_38" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(140 140) rotate(90) scale(140)">
                <Stop stopColor={`rgb(${RGB})`} stopOpacity="0" />
                <Stop offset="1" stopColor={`rgb(${RGB})`} stopOpacity="0.1" />
              </RadialGradient>
            </Defs>
          </Svg>
        </View>
      </Animated.View>
      <Animated.View style={[
        styles.shadowElement,
        {
          opacity: activeShadow,
          transform: [{ scale: 1.025 }]
        }
      ]}>
        <Animated.View style={[
          styles.shadowElement,
          styles.shadow3,
          { backgroundColor: currentColor }
        ]}></Animated.View>
        <View style={styles.shadowElement}>
          <Svg width="280" height="280" viewBox="0 0 280 280" fill="none" style={styles.svg}>
            <Path d="M140 280C217.32 280 280 217.32 280 140C280 62.6801 217.32 0 140 0C62.6801 0 0 62.6801 0 140C0 217.32 62.6801 280 140 280Z" fill="url(#paint0_radial_35_25)" />
            <Defs>
              <RadialGradient id="paint0_radial_35_25" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(140 152) rotate(90) scale(128)">
                <Stop offset="0.755" stopColor={`rgb(${RGB})`} stopOpacity="0" />
                <Stop offset="1" stopColor={`rgb(${RGB})`} stopOpacity="0.1" />
              </RadialGradient>
            </Defs>
          </Svg>
          <Svg width="280" height="280" viewBox="0 0 280 280" fill="none" style={styles.svg}>
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
      <Animated.View style={[
        styles.shadowElement,
        {
          opacity: runningShadow,
          transform: [{ scale: 1.025 }]
        }
      ]}>
        <Animated.View style={[
          styles.shadowElement,
          styles.shadow5,
          { backgroundColor: currentColor }
        ]}></Animated.View>
        <View style={styles.shadowElement}>
          <Svg width="280" height="280" viewBox="0 0 280 280" fill="none" style={styles.svg}>
            <Path d="M140 280C217.32 280 280 217.32 280 140C280 62.6801 217.32 0 140 0C62.6801 0 0 62.6801 0 140C0 217.32 62.6801 280 140 280Z" fill="url(#paint0_radial_35_25)" />
            <Defs>
              <RadialGradient id="paint0_radial_35_25" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(140 152) rotate(90) scale(128)">
                <Stop offset="0.755" stopColor={`rgb(${RGB})`} stopOpacity="0" />
                <Stop offset="1" stopColor={`rgb(${RGB})`} stopOpacity="0.1" />
              </RadialGradient>
            </Defs>
          </Svg>
          <Svg width="280" height="280" viewBox="0 0 280 280" fill="none" style={styles.svg}>
            <Path d="M140 280C217.32 280 280 217.32 280 140C280 62.6801 217.32 0 140 0C62.6801 0 0 62.6801 0 140C0 217.32 62.6801 280 140 280Z" fill="url(#paint0_radial_35_26)" />
            <Defs>
              <RadialGradient id="paint0_radial_35_26" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(140 140) rotate(90) scale(140)">
                <Stop offset="0.89" stopColor={`rgb(${RGB})`} stopOpacity="0" />
                <Stop offset="1" stopColor={`rgb(${RGB})`} stopOpacity="0.1" />
              </RadialGradient>
            </Defs>
          </Svg>
        </View>
      </Animated.View>
      <Animated.View style={{
        backgroundColor: bgInter,
        height: 280,
        width: 280,
        borderRadius: 140,
        zIndex: 2
      }}></Animated.View>
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    position: "relative",
    width: 280,
    height: 280,
    borderRadius: 140,
    // zIndex: 3,
  },
  shadowElement: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 140,
    zIndex: 3
  },
  shadow1: {
    shadowColor: "rgb(255, 255, 255)",
    shadowOffset: { width: 0, height: -24 },
    shadowOpacity: 1,
    shadowRadius: 100
  },
  shadow2: {
    shadowColor: "#283057",
    shadowOffset: { width: 0, height: 32 },
    shadowOpacity: 0.2,
    shadowRadius: 24
  },
  shadow3: {
    shadowColor: "#283057",
    shadowOpacity: 0.04,
    shadowRadius: 60
  },
  shadow4: {
    shadowColor: "#283057",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 28
  },
  shadow5: {
    shadowColor: "#283057",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 28
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0
  },
});

export default TimerButton;