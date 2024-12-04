import { useEffect, useRef, useState } from "react"
import { Animated, Dimensions, Pressable, StyleSheet, Text, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { formatTime } from "../utils/formatTime"

interface ToastProps {
  style?: Object,
  time: number,
  toastDisplay: boolean,
  setShowForm: Function
}

const Toast: React.FC<ToastProps> = ({ time, toastDisplay, setShowForm }) => {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;

  const toastOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toastDisplay) {
      Animated.sequence([
        Animated.timing(toastOpacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 100,
          delay: 4800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [toastDisplay])

  return (
    toastDisplay && <Animated.View style={[
      styles.toast,
      {
        opacity: toastOpacity,
        bottom: insets.bottom,
        width: screenWidth - 32
      }
    ]}>
      <Pressable
        onPress={() => setShowForm(true)}
      >
        <Text style={styles.text}>Your time was: {formatTime(time)}</Text>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    backgroundColor: 'rgba(55, 58, 63, 0.9)',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8
  },
  text: {
    color: "white",
    fontWeight: "500"
  }
})

export default Toast;