import { useEffect, useRef, useState } from "react";
import { AnimatableNumericValue, Animated, StyleSheet, Text, View } from "react-native"

interface TimeProps {
  timeScale?: any,
  timeOpacity: Animated.Value,
  time: number,
  pressed: boolean,
}

const Time: React.FC<TimeProps> = ({ timeScale, timeOpacity, time, pressed }) => {
  // const timeColorRef = useRef(new Animated.Value(0)).current;
  const [timeColor, setTimeColor] = useState<string>("rgb(51, 51, 51")

  const colorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (pressed) {
      colorTimeoutRef.current = setTimeout(() => {
        setTimeColor("rgba(255, 255, 255, 0.75)")
        // setTimeColor("rgb(211, 222, 244)")
      }, 500)
    } else {
      // if (colorTimeoutRef.current) {
      //   clearTimeout(colorTimeoutRef.current);
      //   colorTimeoutRef.current = null;
      // }
      setTimeColor("rgb(51, 51, 51)")
    }
    return () => {
      if (colorTimeoutRef.current) clearTimeout(colorTimeoutRef.current);
    }
  }, [pressed])

  // useEffect(() => {
  //   Animated.timing(timeColorRef, {
  //     toValue: pressed ? 1 : 0,
  //     duration: pressed ? 500 : 0,
  //     useNativeDriver: false
  //   }).start();
  // }, [pressed])

  // const timeColor = timeColorRef.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ["rgb(51, 51, 51)", "rgb(255, 255, 255)"]
  // })

  return (
    <View style={styles.timeContainer} pointerEvents="none">
      <Animated.View style={[styles.time, { transform: [{ scale: timeScale }] }]}>
        <Animated.Text style={[
          styles.text,
          {
            opacity: timeOpacity,
            // color: pressed ? "rgb(255, 255, 255)" : "rgb(51, 51, 51)"
            // color: timeColor

          }
        ]}>
          {("0" + Math.floor((time / 3600000) % 60)).slice(-2)}:
        </Animated.Text>
        <Animated.Text style={[
          styles.text,
          {
            opacity: timeOpacity,
            // color: pressed ? "rgb(255, 255, 255)" : "rgb(51, 51, 51)"
            // color: timeColor

          }
        ]}>
          {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
        </Animated.Text>
        <Animated.Text style={[
          styles.text,
          {
            opacity: timeOpacity,
            // color: pressed ? "rgb(255, 255, 255)" : "rgb(51, 51, 51)"
            // color: timeColor

          }
        ]}>
          {("0" + Math.floor((time / 1000) % 60)).slice(-2)}
        </Animated.Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  timeContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 280,
    height: 60,
    zIndex: 2,
    transform: [
      { translateX: -140 }, { translateY: -30 }
    ],
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  time: {
    display: "flex",
    flexDirection: "row"
  },
  text: {
    fontSize: 48,
    fontWeight: 500,
    color: "#333333",
    fontFamily: "Inter",
    fontVariant: ["lining-nums", "tabular-nums"],
  }
});

export default Time;