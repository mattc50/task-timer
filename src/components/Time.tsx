import { useEffect, useRef } from "react";
import { AnimatableNumericValue, Animated, StyleSheet, Text, View } from "react-native"

interface TimeProps {
  timeScale?: any,
  timeOpacity?: AnimatableNumericValue,
  time: number,
  style?: Object
}

const Time: React.FC<TimeProps> = ({ timeScale, timeOpacity, time, style }) => {
  return (
    <View style={style}>
      {/* <Text>{time}</Text> */}
      <Animated.View style={[styles.time, { transform: [{ scale: timeScale }] }]}>
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
        {/* <Text>
          {("0" + ((time / 10) % 100)).slice(-2)}
        </Text> */}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  time: {
    display: "flex",
    flexDirection: "row"
  },
  text: {
    fontSize: 48,
    fontWeight: 500,
    color: "#333333",
    // opacity: 0.75,
    fontFamily: "Inter",
    fontVariant: ["lining-nums", "tabular-nums"],
  }
});

export default Time;