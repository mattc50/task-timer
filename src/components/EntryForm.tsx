import { Animated, Button, Keyboard, Pressable, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native"
import TextField from "./TextField";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";

interface EntryFormProps {
  timeToSubmit: number,
  showForm: boolean,
  setShowForm: Function
}

const EntryForm: React.FC<EntryFormProps> = ({ timeToSubmit, showForm, setShowForm }) => {
  const insets = useSafeAreaInsets();

  const [task, setTask] = useState<string>("");

  const formOpacity = useRef(new Animated.Value(0)).current;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const closeForm = () => {
    Animated.timing(formOpacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
    timeoutRef.current = setTimeout(() => {
      setShowForm(false);
    }, 100);
  };

  useEffect(() => {
    if (showForm)
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
  })

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [closeForm])


  // const handleShowForm = () => {
  //   Animated.timing(formOpacity, {
  //     toValue: 0,
  //     duration: 100,
  //     useNativeDriver: true,
  //   }).start();
  //   setShowForm(false)
  // }

  return (
    <Animated.View style={[
      styles.formContainer,
      {
        top: insets.top,
        opacity: formOpacity,
        paddingTop: insets.top + 48,
      }
    ]}>
      <ScrollView
        scrollEnabled={false}
        keyboardShouldPersistTaps='handled'
      >
        <View style={{
          alignItems: "flex-end",
          marginBottom: 32
        }}>
          <Pressable
            onPress={closeForm}
          >
            <Icon name="close" size={32} color="rgba(55, 58, 63, 0.5)" />
          </Pressable>
        </View>
        <Text>{timeToSubmit}</Text>
        <TextField
          label="Task Name"
          value={task}
          onChangeText={setTask}
        />
        <Pressable
          disabled={task.trim().length === 0}
          style={[
            styles.button,
            { opacity: task.trim().length > 0 ? 1 : 0.5 }
          ]}
          onPress={() => console.log(`${task}: ${timeToSubmit}`)}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </ScrollView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  formContainer: {
    // backgroundColor: "red",
    backgroundColor: "rgba(230, 237, 246, 1)",
    position: "absolute",
    zIndex: 10,
    width: "100%",
    height: "100%",
    paddingHorizontal: 16,
  },
  button: {
    marginTop: 48,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(55, 58, 63, 0.2)"
  },
  buttonText: {
    // color: "white",
    color: "rgba(55, 58, 63, 1)",
    fontSize: 24,
    fontFamily: "Inter",
    fontWeight: "300",
    letterSpacing: 1,
    textAlign: "center"
  }
})

export default EntryForm;