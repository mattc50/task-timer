import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native"

interface ShowTimesProps {
  data: Object,
  setData: Function,
  setShowList: Function
}

const ShowTimes: React.FC<ShowTimesProps> = ({ data, setData, setShowList }) => {
  const [count, setCount] = useState<Object>({})

  useEffect(() => {
    let count = 0;
    if (data) {
      const dataJSON = data;
      for (let date in dataJSON) {
        for (let item of dataJSON[date]) {
          count++;
        }
      }
      setCount(count);
    }
  }, [data])

  return (
    <View style={{
      width: "100%",
      paddingHorizontal: 16,
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
    }}>
      <Pressable
        style={styles.timesDisplay}
        onPress={() => setShowList(true)}
      >
        <Text style={styles.text}>Times</Text>
        <View style={styles.count}>
          <Text style={[styles.text, { marginTop: -1, textAlign: "center" }]}>{`${count}`}</Text>
        </View>
      </Pressable>
    </View >
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