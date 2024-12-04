import { useRef, useState } from "react";
import { Animated, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native"

interface TextFieldProps extends TextInputProps {
  label: string
}

const TextField: React.FC<TextFieldProps> = ({ label, value, onChangeText }) => {
  const [focused, setFocused] = useState(false);

  const borderOpacity = useRef(new Animated.Value(0)).current;
  const borderOpacityInter = borderOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(55, 58, 63, 0.2)", "rgba(55, 58, 63, 0.9)"]
  })

  const handleBorder = () => {
    // console.log(focused)
    Animated.timing(borderOpacity, {
      toValue: focused ? 0.2 : 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }

  const handleFocus = () => {
    handleBorder();
    setFocused(true);
  }

  const handleBlur = () => {
    handleBorder();
    setFocused(false);
  }

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <Animated.View style={[
        styles.textInputContainer,
        { borderColor: borderOpacityInter }
      ]}>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 16,
    fontSize: 24,
    fontFamily: "Inter",
    fontWeight: "300",
    letterSpacing: 1,
    color: "rgba(55, 58, 63, 1)",
    textAlign: "center"

  },
  textInputContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 1,
  },
  textInput: {
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: "300",
    letterSpacing: 1,
    color: "rgba(55, 58, 63, 1)",
    textAlign: "center"

  }
})

export default TextField;