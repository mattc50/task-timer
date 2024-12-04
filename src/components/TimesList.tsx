import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import TextField from "./TextField";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalScreen from "./ModalScreen";
import { formatTime } from "../utils/formatTime";

interface TimesListProps {
  data: Object,
  setData: Function,
  showList: boolean,
  setShowList: Function,
}

const TimesList: React.FC<TimesListProps> = ({ data, setData, showList, setShowList }) => {
  const listOpacity = useRef(new Animated.Value(0)).current;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // const [data, setData] = useState<Object>({})
  const [dates, setDates] = useState<string[]>([])

  const [loading, setLoading] = useState<boolean>(true);

  const closeList = () => {
    Animated.timing(listOpacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
    timeoutRef.current = setTimeout(() => {
      setShowList(false);
    }, 100);
  };

  const storeData = async (value: Object) => {
    try {
      const JSONValue = JSON.stringify(value);
      await AsyncStorage.setItem('data', JSONValue);
      // console.log('data updated')
    } catch (e) {

    }
  }

  // const getData = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem('data');
  //     if (value !== null) {
  //       console.log(value)
  //       return value;
  //     }
  //   } catch (e) {

  //   }
  // }

  const removeData = async (key: any) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    }
    catch (exception) {
      return false;
    }
  }

  const removeItem = async (date: string, item: string, index: number) => {
    setLoading(true);
    // console.log('testing remove')
    const dataObj = { ...data }
    const dateArray = dataObj[date];
    const modifiedArray = dateArray;
    modifiedArray.splice(index, 1);
    const modifiedData = dataObj;
    if (modifiedArray.length === 0) {
      delete modifiedData[date];
    }

    setData(modifiedData);
    console.log(modifiedData)
    setDates(Object.keys(modifiedData))

    await storeData(modifiedData);
    setLoading(false);
  }

  const renderDate = (date: string) => {
    const dateObj = new Date(date);
    const month = dateObj.toLocaleString('default', { month: 'long' });
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    return `${month} ${day}, ${year}`
  }

  useEffect(() => {
    // const fetchData = async () => {
    //   setLoading(true);
    //   const data = await getData();
    //   console.log(data);
    if (data) {
      const dataJSON = data;
      // setData(dataJSON);
      setDates(Object.keys(dataJSON));
    }
    setLoading(false)
    // }

    // fetchData();
  }, [data])

  // console.log(data);
  // console.log(dates);

  return (
    <ModalScreen
      modalOpacity={listOpacity}
      showModal={showList}
      setShowModal={setShowList}
      closeModal={closeList}
    >
      <View style={{ flex: 1 }}>
        <View style={{
          alignItems: "flex-end",
          marginBottom: 32,
          paddingHorizontal: 16
        }}>
          <Pressable
            onPress={closeList}
          >
            <Icon name="close" size={32} color="rgba(55, 58, 63, 0.5)" />
          </Pressable>
        </View>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16 }}
          keyboardShouldPersistTaps='handled'
        >
          {dates.map((date, index) => {
            return (
              <View key={index} style={{ marginBottom: 24 }}>
                <Text style={styles.date}>
                  {renderDate(date)}
                </Text>
                {data[date].map((item, index) => {
                  return (
                    <View key={index} style={styles.taskItem}>
                      <Text style={[styles.text, styles.name]}>{Object.keys(item)}</Text>
                      <Text style={[styles.text, styles.time]}>{formatTime(Object.values(item))}</Text>
                      <Pressable
                        style={{ padding: 4, marginLeft: 12 }}
                        onPress={() => removeItem(date, item, index)}
                      >
                        <Icon name="delete-outline" size={20} color="rgba(55, 58, 63, 0.5)" />
                      </Pressable>
                    </View>
                  )
                })}

              </View>
            )
          })}
        </ScrollView>
      </View>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  date: {
    color: "rgba(55, 58, 63, 0.5)",
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "300",
    letterSpacing: 1,
    marginBottom: 12
  },
  taskItem: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8
  },
  name: {
    display: "flex",
    flex: 1,
    textAlign: "left"
  },
  time: {
    fontVariant: ["lining-nums", "tabular-nums"],
  },
  text: {
    color: "rgba(55, 58, 63, 1)",
    fontSize: 24,
    fontFamily: "Inter",
    fontWeight: "300",
    letterSpacing: 1,
    textAlign: "center"
  }
})

export default TimesList;