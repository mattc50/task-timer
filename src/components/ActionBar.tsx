import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import ShowTimes from "./ShowTimes";
import LocationAndSun from "./LocationAndSun";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ActionBarProps {
  data: DataObject,
  setShowList: Function,
  pressed: boolean
}

type DataObject = {
  [key: string]: Object[]; // Date keys with arrays of objects
};

const ActionBar: React.FC<ActionBarProps> = ({ data, setShowList, pressed }) => {
  const insets = useSafeAreaInsets();

  const actionBarOpacity = useRef(new Animated.Value(1)).current;

  const [actionBarDisplay, setActionBarDisplay] = useState<boolean>(true);
  const actionBarTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (pressed) {
      actionBarTimeoutRef.current = setTimeout(() => {
        setActionBarDisplay(false);
        actionBarTimeoutRef.current = null;
      }, 100);
    } else {
      setActionBarDisplay(true);
      if (actionBarTimeoutRef.current) {
        clearTimeout(actionBarTimeoutRef.current);
        actionBarTimeoutRef.current = null;
      }
    }
    Animated.timing(actionBarOpacity, {
      toValue: actionBarDisplay && pressed ? 0 : 1,
      duration: 100,
      // delay: timeCountDisplay ? 100 : 0,
      useNativeDriver: true,
    }).start();
    return () => {
      if (actionBarTimeoutRef.current) clearTimeout(actionBarTimeoutRef.current);
    }
  }, [pressed]);

  return (
    actionBarDisplay && <Animated.View style={[
      styles.actionBar,
      {
        opacity: actionBarOpacity,
        top: insets.top
      }
    ]}>
      <ShowTimes data={data} setShowList={setShowList} pressed={pressed} />
      <LocationAndSun />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  actionBar: {
    position: "absolute",
    left: 0,
    paddingHorizontal: 16,
    width: "100%",
    height: 56,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  }
})

export default ActionBar;