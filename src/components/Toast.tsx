import { useEffect, useRef, useState } from "react"
import { Animated, Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
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
        style={styles.toastContent}
      >
        <Text style={styles.text}>Recorded time: {formatTime(time)}</Text>
        <View pointerEvents="none" style={styles.button}>
          <Text style={styles.buttonText}>Add</Text>
        </View>
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)'
  },
  toastContent: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  text: {
    fontFamily: "Inter",
    color: "white",
    fontWeight: "500",
    letterSpacing: 0.4,
    fontSize: 16
  },
  button: {
    borderRadius: 8,
    backgroundColor: "rgb(230, 237, 246)",
    height: 48,
    width: 64,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.4,
    color: 'rgba(55, 58, 63, 1)'
  }
})

export default Toast;