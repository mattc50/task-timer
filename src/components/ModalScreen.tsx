import { AnimatableNumericValue, Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import TextField from "./TextField";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface EntryFormProps {
  timeToSubmit?: number,
  modalOpacity: any,
  showModal: boolean,
  setShowModal: Function,
  closeModal: Function,
  children: React.ReactElement
}

const ModalScreen: React.FC<EntryFormProps> = ({ modalOpacity, showModal, setShowModal, closeModal, children }) => {
  const insets = useSafeAreaInsets();

  // const modalOpacity = useRef(new Animated.Value(0)).current;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // const closeModal = () => {
  //   Animated.timing(modalOpacity, {
  //     toValue: 0,
  //     duration: 100,
  //     useNativeDriver: true,
  //   }).start();
  //   timeoutRef.current = setTimeout(() => {
  //     setShowModal(false);
  //   }, 100);
  // };

  useEffect(() => {
    if (showModal)
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
  })

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [closeModal])

  return (
    <Animated.View style={[
      styles.formContainer,
      {
        top: insets.top,
        opacity: modalOpacity,
        paddingTop: 16
        // paddingTop: insets.top + 48,
      }
    ]}>
      {children}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: "rgba(230, 237, 246, 1)",
    position: "absolute",
    zIndex: 10,
    width: "100%",
    height: "100%",
    paddingHorizontal: 0,
  },
  button: {
    marginTop: 48,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(55, 58, 63, 0.2)"
  },
  buttonText: {
    color: "rgba(55, 58, 63, 1)",
    fontSize: 24,
    fontFamily: "Inter",
    fontWeight: "300",
    letterSpacing: 1,
    textAlign: "center"
  }
})

export default ModalScreen;