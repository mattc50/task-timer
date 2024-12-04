import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import TextField from "./TextField";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalScreen from "./ModalScreen";
import { formatTime } from "../utils/formatTime";

interface EntryFormProps {
  data: DataObject,
  setData: Function,
  timeToSubmit: number,
  showForm: boolean,
  setShowForm: Function,
}

type DataObject = {
  [key: string]: Object[]; // Date keys with arrays of objects
};

const EntryForm: React.FC<EntryFormProps> = ({ data, setData, timeToSubmit, showForm, setShowForm }) => {
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

  const testData = {
    "data": [
      { "task1": "1000" },
      { "task2": "2000" },
      { "task1": "1000" }
    ]
  }

  const date = new Date(Date.now());
  const dateID: string = date.toISOString().slice(0, 10)

  const TEST_DATE = new Date(date.setDate(date.getDate() + 1));
  const TEST_DATE_ID: string = TEST_DATE.toISOString().slice(0, 10)
  console.log(TEST_DATE_ID)

  const storeData = async (value: Object) => {
    try {
      if (data) {
        // console.log('there is data')
        const dataObj: DataObject = { ...data };
        console.log("dataObj:", dataObj)
        const dateArray: Object[] = dataObj[dateID as keyof Object];
        if (dateArray) {
          dateArray.push(value);
        } else {
          dataObj[dateID] = [value];
        }
        const JSONValue = JSON.stringify(dataObj);
        await AsyncStorage.setItem('data', JSONValue);
        // console.log('data updated')
        setData(dataObj)
      } else {
        const dataToStore = {
          [dateID]: [
            value
          ]
        }
        const JSONValue = JSON.stringify(dataToStore);
        await AsyncStorage.setItem('data', JSONValue);
        // console.log('new data uploaded')
      }
    } catch (e) {

    }
  }

  return (
    <ModalScreen
      modalOpacity={formOpacity}
      showModal={showForm}
      setShowModal={setShowForm}
      closeModal={closeForm}
    >
      <View style={{ flex: 1 }}>
        <View style={{
          alignItems: "center",
          flexDirection: "row",
          marginBottom: 32,
          paddingHorizontal: 16,
          justifyContent: "space-between"
        }}>
          <Text style={styles.time}>{formatTime(timeToSubmit)}</Text>
          <Pressable
            onPress={closeForm}
          >
            <Icon name="close" size={32} color="rgba(55, 58, 63, 0.5)" />
          </Pressable>
        </View>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 80 }}
          scrollEnabled={false}
          keyboardShouldPersistTaps='handled'
        >
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
            onPress={async () => {
              await storeData({ [task]: timeToSubmit });
              closeForm();
            }}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </ScrollView>
      </View>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: "rgba(230, 237, 246, 1)",
    position: "absolute",
    zIndex: 10,
    width: "100%",
    height: "100%",
    paddingHorizontal: 16,
  },
  time: {
    fontVariant: ["lining-nums", "tabular-nums"],
    color: "rgba(55, 58, 63, 0.5)",
    fontSize: 24,
    fontFamily: "Inter",
    fontWeight: "300",
    letterSpacing: 1,
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

export default EntryForm;