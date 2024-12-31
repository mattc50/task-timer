/**
 * Sample React Native App
 * https://github.com/facebook/react-native
*
* @format
*/
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs(true);//Ignore all log notifications
LogBox.ignoreLogs([
  'has a shadow set but cannot calculate shadow efficiently', // Match this part of the message
]);
console.warn = () => { };

import React, { useEffect, useRef, useState } from 'react';

import {
  Animated,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Time from './src/components/Time';
import Toast from './src/components/Toast';
import TimerButton from './src/components/TimerButton';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import EntryForm from './src/components/EntryForm';
import TimesList from './src/components/TimesList';
import ShowTimes from './src/components/ShowTimes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundTimer from 'react-native-background-timer';
import LocationAndSun from './src/components/LocationAndSun';
import ActionBar from './src/components/ActionBar';


type DataObject = {
  [key: string]: Object[]; // Date keys with arrays of objects
};

const COLORS = {
  image1: "rgb(103, 101, 126)",
  image4: "rgb(127, 159, 255)"
}
const NATIVE_DRIVER = true;

function App(): React.JSX.Element {
  const [held, setHeld] = useState(false);
  const [pressed, setPressed] = useState(false);

  const initialBtn = useRef(new Animated.Value(1)).current;
  const activeShadow = useRef(new Animated.Value(0)).current;
  const activeRunningShadow = useRef(new Animated.Value(0)).current;
  const runningShadow = useRef(new Animated.Value(0)).current;

  const bg = useRef(new Animated.Value(0)).current;
  const bgInter = bg.interpolate({
    inputRange: [0, 1],
    // outputRange: ["rgb(230, 237, 246)", "rgb(234, 197, 191)"]
    outputRange: ["rgb(230, 237, 246)", COLORS.image4]
    // outputRange: [0, 0.25]
  })
  const opacityInter = bg.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.75]
  })

  const scale = useRef(new Animated.Value(1.06)).current;

  const DURATION = 1000;

  const [time, setTime] = useState<number>(0);
  const [lastTime, setLastTime] = useState<number>(0);

  const timeOpacity = useRef(new Animated.Value(0.6)).current;
  const timeScale = useRef(new Animated.Value(1)).current;

  const [toastDisplay, setToastDisplay] = useState(false);

  const timerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [showList, setShowList] = useState<boolean>(false);

  const [data, setData] = useState<DataObject>({})

  const images = {
    image1: require('./assets/sunrise1.jpg'),
    image2: require('./assets/sunrise2.jpg'),
    image3: require('./assets/sunrise3.jpg'),
    image4: require('./assets/sunrise4.jpg'),
    image5: require('./assets/sunset1.jpg'),
    image6: require('./assets/sunset2.jpg'),
    image7: require('./assets/sunset3.jpg'),
    image8: require('./assets/sunset4.jpg')
  }

  const differenceInSeconds = (date1: Date, date2: Date) => {
    const diffInMilliseconds = date2.getTime() - date1.getTime();
    console.log(diffInMilliseconds)
    return Math.floor(diffInMilliseconds);
  }

  const startTimer = async () => {
    const currentTime = new Date(Date.now()); // Current timestamp in milliseconds
    await AsyncStorage.setItem('start_time', currentTime.toISOString());
  };

  useEffect(() => {
    // const os = Platform.OS;

    if (pressed) {
      startTimer();

      const fetchStartTime = async () => {
        const startTime = await AsyncStorage.getItem('start_time');
        if (startTime) {
          BackgroundTimer.runBackgroundTimer(() => {
            const now = new Date(Date.now());
            const elapsedSeconds = differenceInSeconds(new Date(Date.parse(startTime)), now);
            console.log(elapsedSeconds)
            setTime(elapsedSeconds);
          }, 100);
        }
      };

      fetchStartTime();

      setToastDisplay(false);

      if (timerTimeoutRef.current) {
        clearTimeout(timerTimeoutRef.current);
        timerTimeoutRef.current = null;
      }
    } else {
      BackgroundTimer.stopBackgroundTimer();

      if (time > 0) {
        setToastDisplay(true);
        timerTimeoutRef.current = setTimeout(() => {
          setToastDisplay(false);
          timerTimeoutRef.current = null;
        }, 5000);

        setLastTime(time);
        setTime(0);
      }
    }
    return () => {
      BackgroundTimer.stopBackgroundTimer();
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
    }
  }, [pressed]);

  const handleStop = async () => {
    setPressed(false);
    BackgroundTimer.stopBackgroundTimer();
    await AsyncStorage.removeItem('start_time'); // Clear the start time
  }

  const makePressEffects = () => {
    Animated.parallel([
      Animated.timing(timeOpacity, {
        toValue: held ? 0.6 : 0.5,
        duration: DURATION,
        useNativeDriver: NATIVE_DRIVER,
      }),
      Animated.timing(timeScale, {
        toValue: held ? 1 : pressed ? 0.985 : 0.99,
        duration: DURATION,
        useNativeDriver: NATIVE_DRIVER,
      })
    ]).start();
  }

  const fadeIn = () => {
    const el = pressed ? activeRunningShadow : initialBtn;
    const shadow = pressed ? runningShadow : activeShadow;
    Animated.parallel([
      Animated.timing(el, {
        toValue: 0,
        duration: DURATION,
        useNativeDriver: NATIVE_DRIVER,
      }),
      Animated.timing(scale, {
        toValue: 1.06,
        duration: DURATION,
        useNativeDriver: NATIVE_DRIVER,
      }),
      Animated.timing(shadow, {
        toValue: 1,
        duration: DURATION,
        useNativeDriver: NATIVE_DRIVER,
      })
    ]).start();
    makePressEffects();
    setHeld(true);
  }

  const fadeOut = (notPressed?: boolean) => {
    const val = notPressed === undefined || notPressed ? 1 : 0;
    const el = pressed ? activeRunningShadow : initialBtn;
    const shadow = pressed ? runningShadow : activeShadow;
    Animated.timing(el, {
      toValue: val,
      duration: DURATION,
      useNativeDriver: NATIVE_DRIVER,
    }).start();
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1.06,
        duration: DURATION,
        useNativeDriver: NATIVE_DRIVER,
      }),
      Animated.timing(shadow, {
        toValue: 0,
        duration: DURATION / 1.75,
        useNativeDriver: NATIVE_DRIVER,
      })
    ]).start();
    makePressEffects();
    setHeld(false);
  }

  const togglePress = () => {
    Animated.parallel([
      Animated.timing(initialBtn, {
        toValue: pressed ? 1 : 0,
        duration: DURATION,
        useNativeDriver: NATIVE_DRIVER,
      }),
      Animated.timing(activeRunningShadow, {
        toValue: pressed ? 0 : 1,
        duration: DURATION / 10,
        useNativeDriver: NATIVE_DRIVER,
      }),
      Animated.timing(runningShadow, {
        toValue: 0,
        duration: DURATION,
        useNativeDriver: NATIVE_DRIVER,
      }),
      Animated.timing(bg, {
        toValue: pressed ? 0 : 1,
        duration: DURATION,
        useNativeDriver: NATIVE_DRIVER,
      })
    ]).start();
    // Animated.timing(bg, {
    //   toValue: pressed ? 0 : 1,
    //   duration: DURATION,
    //   useNativeDriver: false,
    // }).start();
    if (pressed) {
      handleStop();
    } else {
      startTimer();
    }
    setPressed(!pressed);
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('data');
      if (value !== null) {
        return value;
      }
    } catch (e) {

    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      if (data) {
        setData(JSON.parse(data))
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
  }, [data])

  return (
    <SafeAreaProvider>
      <Animated.View style={[
        styles.container,
        // { backgroundColor: bgInter }
        { backgroundColor: "rgb(230, 237, 246)" }
      ]}>
        <Animated.View style={{ opacity: opacityInter, position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
          <ImageBackground source={images.image4} style={{ width: "100%", height: "100%" }} />
        </Animated.View>
        <SafeAreaView style={styles.parent}>
          <ActionBar
            data={data}
            // setData={setData}
            setShowList={setShowList}
            pressed={pressed}
          />
          <View style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 48
          }}>
            <TimerButton
              fadeIn={fadeIn}
              fadeOut={fadeOut}
              togglePress={togglePress}
              initialBtn={initialBtn}
              activeShadow={activeShadow}
              runningShadow={runningShadow}
              activeRunningShadow={activeRunningShadow}
              scale={scale}
              bgInter={bgInter}
            >
              <Time
                timeScale={timeScale}
                timeOpacity={timeOpacity}
                time={time}
                pressed={pressed}
              />
            </TimerButton>
          </View>
          <Toast
            time={lastTime}
            toastDisplay={toastDisplay}
            setShowForm={setShowForm}
          />
          {showForm && <EntryForm
            data={data}
            setData={setData}
            timeToSubmit={lastTime}
            showForm={showForm}
            setShowForm={setShowForm}
          />}
          {showList && <TimesList
            data={data}
            setData={setData}
            showList={showList}
            setShowList={setShowList}
          />}
        </SafeAreaView>
      </Animated.View>
    </SafeAreaProvider >
  )
}

const styles = StyleSheet.create({
  parent: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    display: "flex",
    flex: 1,
  },
});

export default App;
