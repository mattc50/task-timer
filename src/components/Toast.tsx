import { Animated, Text } from "react-native"

interface ToastProps {
  style?: Object
}

const Toast: React.FC<ToastProps> = ({ style }) => {
  return (
    <Animated.View style={style}>
      <Text>Hello</Text>
    </Animated.View>
  )
}

export default Toast;