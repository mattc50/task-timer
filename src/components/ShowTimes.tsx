import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Pressable, Text } from "react-native"

interface ShowTimesProps {
  data: Object,
  setData: Function,
  setShowList: Function
}

const ShowTimes: React.FC<ShowTimesProps> = ({ data, setData, setShowList }) => {
  const [count, setCount] = useState<Object>({})

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

  useEffect(() => {
    // const fetchData = async () => {
    //   const data = await getData();

    // console.log(data);
    let count = 0;
    if (data) {
      const dataJSON = data;
      // console.log("data:");
      // console.log(dataJSON);
      for (let date in dataJSON) {
        // console.log(date)
        for (let item of dataJSON[date]) {
          // console.log(item)
          count++;
        }
      }
      setCount(count);
    }
    // fetchData();
  }, [data])

  return (
    <Pressable onPress={() => setShowList(true)}>
      <Text>{`Times: ${count}`}</Text>
    </Pressable>
  )
}

export default ShowTimes;