import { useEffect, useRef } from "react";
import { AnimatableNumericValue, Animated, StyleSheet, Text, View } from "react-native"

interface TimeProps {
  timeScale?: any,
  timeOpacity?: AnimatableNumericValue,
  time: number,
}

const Time: React.FC<TimeProps> = ({ timeScale, timeOpacity, time }) => {
  return (
    <View style={styles.timeContainer} pointerEvents="none">
      <Animated.View style={[styles.time, { transform: [{ scale: timeScale }] }]}>
        <Animated.Text style={[
          styles.text,
          { opacity: timeOpacity }
        ]}>
          {("0" + Math.floor((time / 3600000) % 60)).slice(-2)}:
        </Animated.Text>
        <Animated.Text style={[
          styles.text,
          { opacity: timeOpacity }
        ]}>
          {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
        </Animated.Text>
        <Animated.Text style={[
          styles.text,
          { opacity: timeOpacity }
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