import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { useEffect, useRef, useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalScreen from "./ModalScreen";
import { formatTime } from "../utils/formatTime";

interface TimesListProps {
  data: DataObject,
  setData: Function,
  showList: boolean,
  setShowList: Function,
}

type DataObject = {
  [key: string]: Object[]; // Date keys with arrays of objects
};

const TimesList: React.FC<TimesListProps> = ({ data, setData, showList, setShowList }) => {
  const listOpacity = useRef(new Animated.Value(0)).current;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [dates, setDates] = useState<string[]>([])

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
    } catch (e) {

    }
  }

  // const removeData = async (key: any) => {
  //   try {
  //     await AsyncStorage.removeItem(key);
  //     return true;
  //   }
  //   catch (exception) {
  //     return false;
  //   }
  // }

  const removeItem = async (date: string, index: number) => {
    const dataObj: any = { ...data }
    const dateArray = dataObj[date];
    const modifiedArray = dateArray;
    modifiedArray.splice(index, 1);
    const modifiedData = dataObj;
    if (modifiedArray.length === 0) {
      delete modifiedData[date];
    }

    setData(modifiedData);
    setDates(Object.keys(modifiedData))

    await storeData(modifiedData);
  }

  const renderDate = (date: string) => {
    const dateObj = new Date(date);
    const month = dateObj.toLocaleString('default', { month: 'long' });
    const day = dateObj.getDate() + 1;
    const year = dateObj.getFullYear();
    return `${month} ${day}, ${year}`
  }

  useEffect(() => {
    if (data) {
      const dataJSON = { ...data };
      setDates(Object.keys(dataJSON));
    }
  }, [data])

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
          stickyHeaderIndices={dates.map((_, index) => index * 2)}
        >
          {dates.length > 0 && dates.map((date, index) => {
            const dataIndex: any = data[date as keyof DataObject];

            return [
              <View style={styles.stickyHeader}>
                <Text style={styles.date}>
                  {renderDate(date)}
                </Text>
              </View>,
              <View style={{ marginBottom: index + 1 === dates.length ? 0 : 16 }}>
                {dataIndex.map((item: string[], index: number) => {
                  return (
                    <View key={index} style={[styles.taskItem, { marginBottom: index + 1 === dataIndex.length ? 0 : 8 }]}>
                      <Text style={[styles.text, styles.name]}>{Object.keys(item)}</Text>
                      <Text style={[styles.text, styles.time]}>{formatTime(Object.values(item))}</Text>
                      <Pressable
                        style={{ padding: 4, marginLeft: 12 }}
                        onPress={() => removeItem(date, index)}
                      >
                        <Icon name="delete-outline" size={20} color="rgba(55, 58, 63, 0.5)" />
                      </Pressable>
                    </View>
                  )
                })}
              </View>
            ]
          })}
          {dates.length === 0 &&
            <View style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Text style={styles.placeholder}>No times added yet</Text>
            </View>
          }
        </ScrollView>
      </View>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  stickyHeader: {
    backgroundColor: "rgb(230, 237, 246)",
    paddingVertical: 2
  },
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
  },
  name: {
    display: "flex",
    flex: 1,
    textAlign: "left",
  },
  time: {
    fontVariant: ["lining-nums", "tabular-nums"],
    width: 111,
    marginLeft: 16,
    textAlign: "right"
  },
  text: {
    color: "rgba(55, 58, 63, 1)",
    fontSize: 24,
    fontFamily: "Inter",
    fontWeight: "300",
    letterSpacing: 1,
  },
  placeholder: {
    color: "rgba(55, 58, 63, 0.5)",
    fontSize: 24,
    fontFamily: "Inter",
    fontWeight: "300",
    letterSpacing: 1,
  },
})

export default TimesList;