import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native"

interface ShowTimesProps {
  data: DataObject,
  // setData: Function,
  setShowList: Function,
  pressed: boolean
}

type DataObject = {
  [key: string]: Object[]; // Date keys with arrays of objects
};

const ShowTimes: React.FC<ShowTimesProps> = ({ data, setShowList, pressed }) => {
  const [count, setCount] = useState<Object>({})

  const timeCountOpacity = useRef(new Animated.Value(1)).current;

  const [timeCountDisplay, setTimeCountDisplay] = useState<boolean>(true);
  // const timeCountTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  // useEffect(() => {
  //   console.log(timerRunning)
  //   Animated.timing(timeCountOpacity, {
  //     toValue: timerRunning ? 0 : 1,
  //     duration: 100,
  //     delay: timerRunning ? 100 : 0,
  //     useNativeDriver: true,
  //   }).start();
  // }, [])

  // useEffect(() => {

  // }, [pressed])

  // useEffect(() => {
  //   if (pressed) {
  //     timeCountTimeoutRef.current = setTimeout(() => {
  //       setTimeCountDisplay(false);
  //       timeCountTimeoutRef.current = null;
  //     }, 100);
  //   } else {
  //     setTimeCountDisplay(true);
  //     if (timeCountTimeoutRef.current) {
  //       clearTimeout(timeCountTimeoutRef.current);
  //       timeCountTimeoutRef.current = null;
  //     }
  //   }
  //   Animated.timing(timeCountOpacity, {
  //     toValue: timeCountDisplay && pressed ? 0 : 1,
  //     duration: 100,
  //     // delay: timeCountDisplay ? 100 : 0,
  //     useNativeDriver: true,
  //   }).start();
  //   return () => {
  //     if (timeCountTimeoutRef.current) clearTimeout(timeCountTimeoutRef.current);
  //   }
  // }, [pressed]);

  useEffect(() => {
    let count = 0;
    if (data) {
      const dataJSON: DataObject = data;
      for (let date in dataJSON) {
        for (let item of dataJSON[date]) {
          count++;
        }
      }
      setCount(count);
    }
  }, [data])

  return (
    <Animated.View style={{
      // opacity: timeCountOpacity,
      // width: "100%",
      // paddingHorizontal: 16,
      display: "flex",
      flexDirection: "row",
      // justifyContent: "flex-start",
    }}>
      <Pressable
        disabled={pressed}
        style={styles.timesDisplay}
        onPress={() => setShowList(true)}
      >
        <Text style={styles.text}>Times</Text>
        <View pointerEvents="none" style={styles.count}>
          <Text style={[styles.text, { marginTop: -1, textAlign: "center" }]}>{`${count}`}</Text>
        </View>
      </Pressable>
    </Animated.View>
    // </View>
  )
}

const styles = StyleSheet.create({
  timesDisplay: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8
  },
  text: {
    color: "rgba(55, 58, 63, 1)",
    fontSize: 20,
    fontFamily: "Inter",
    fontWeight: "300",
    letterSpacing: 1,
  },
  count: {
    borderRadius: 20,
    height: 40,
    minWidth: 40,
    display: "flex",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(55, 58, 63, 0.2)"
  }
})

export default ShowTimes;