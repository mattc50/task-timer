/**
 * Sample React Native App
 * https://github.com/facebook/react-native
*
* @format
*/
import { Button, LogBox } from 'react-native';
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
import LocationAndSun, { getLocation } from './src/components/LocationAndSun';
import ActionBar from './src/components/ActionBar';
import SkyBackground from './src/components/SkyBackground';


type DataObject = {
  [key: string]: Object[]; // Date keys with arrays of objects
};

const COLORS = [
  "rgb(51, 48, 81)",
  "rgb(82, 57, 55)",
  "rgb(79, 79, 129)",
  "rgb(83, 126, 255)",
  "rgb(74, 87, 204)",
  "rgb(76, 70, 126)",
  "rgb(84, 49, 68)",
  "rgb(12, 22, 69)",
  // "rgb(51, 48, 81)",
]
const NATIVE_DRIVER = true;

function App(): React.JSX.Element {
  const [test, setTest] = useState<boolean>(false);

  const [dateNow, setDateNow] = useState<Date>(new Date(Date.now()));
  const [sunTimes, setSunTimes] = useState<any>(null);

  const [held, setHeld] = useState(false);
  const [pressed, setPressed] = useState(false);

  const initialBtn = useRef(new Animated.Value(1)).current;
  const activeShadow = useRef(new Animated.Value(0)).current;
  const activeRunningShadow = useRef(new Animated.Value(0)).current;
  const runningShadow = useRef(new Animated.Value(0)).current;

  const [firstIndex, setFirstIndex] = useState<number>(0);
  const [secondIndex, setSecondIndex] = useState<number>(1);

  const nextColor = useRef(new Animated.Value(0)).current;
  const nextColorInter = nextColor.interpolate({
    inputRange: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    outputRange: [
      COLORS[0],
      COLORS[1],
      COLORS[2],
      COLORS[3],
      COLORS[4],
      COLORS[5],
      COLORS[6],
      COLORS[7],
      COLORS[0],
    ]
  })

  /**
   * Checks (initial) time in order to render correct initial color and background.
   */
  const checkTime = () => {
    // const timeNow = dateNow.getTime();
    const timeNow = new Date(Date.now()).getTime();

    // const timeNow = 1735848897681;
    // const timeNow = 1735952654470;

    // console.log(timeNow)
    // console.log(Object.values(sunTimes.times))
    // for (const key in sunTimes.times) {
    //   console.log(sunTimes.times[key])
    // }
    if (sunTimes?.times) {
      const vals: number[] = Object.values(sunTimes.times);
      const keys: string[] = Object.keys(sunTimes.times);
      let currZone: string = "";
      for (let i = 0; i < vals.length - 1; i++) {
        // console.log(`${timeNow - vals[i]} ${vals[i + 1] - timeNow}`)
        // console.log(`${vals[i] <= timeNow}, ${timeNow <= vals[i + 1]}`)
        if (vals[i] <= timeNow && timeNow <= vals[i + 1]) {
          // console.log(`right now, we are in ${keys[i]} (${vals[i]})`)
          currZone = Object.keys(sunTimes.times)[i];
        }
        if (!currZone) {
          // console.log(`right now, we are in ${keys[vals.length - 1]} (${vals[vals.length - 1]})`)
          currZone = Object.keys(sunTimes.times)[vals.length - 1];
        }
      }

      // console.log(currZone)
      // console.log(keys, keys.indexOf(currZone));
      const zone = vals[keys.indexOf(currZone)];
      // console.log(zone)
      let zoneIndex: number;

      // between nauticalDawn and dawn is image 1 (index 0) 
      if (sunTimes.times.nauticalDawn <= zone
        && zone <= sunTimes.times.dawn) {
        zoneIndex = 0;
      }
      // between dawn and sunriseEnd is image 2 (index 1) 
      else if (sunTimes.times.dawn <= zone
        && zone <= sunTimes.times.sunriseEnd) {
        zoneIndex = 1;
      }
      // between sunriseEnd and goldenHourEnd is image 3 (index 2) 
      else if (sunTimes.times.sunriseEnd <= zone
        && zone <= sunTimes.times.goldenHourEnd) {
        zoneIndex = 2;
      }
      // between goldenHourEnd and solarNoon is image 4 (index 3) 
      else if (sunTimes.times.goldenHourEnd <= zone
        && zone <= sunTimes.times.solarNoon) {
        zoneIndex = 3;
      }
      // between solarNoon and goldenHour is image 5 (index 4) 
      else if (sunTimes.times.solarNoon <= zone
        && zone <= sunTimes.times.goldenHour) {
        zoneIndex = 4;
      }
      // between goldenHour and sunset is image 6 (index 5) 
      else if (sunTimes.times.goldenHour <= zone
        && zone <= sunTimes.times.sunset) {
        zoneIndex = 5;
      }
      // between sunset and dusk is image 7 (index 6) 
      else if (sunTimes.times.sunset <= zone
        && zone <= sunTimes.times.dusk) {
        zoneIndex = 6;
      }
      // else is image 8 (index 7) 
      else {
        zoneIndex = 7;
      }

      return zoneIndex;
    }
  }

  const [colorChanging, setColorChanging] = useState<boolean>(false);

  // console.log(firstIndex, COLORS[firstIndex])

  const bg = useRef(new Animated.Value(0)).current;
  const bgInter = bg.interpolate({
    inputRange: [0, 1],
    // outputRange: ["rgb(230, 237, 246)", "rgb(234, 197, 191)"]
    // outputRange: ["rgb(230, 237, 246)", COLORS[firstIndex]]
    outputRange: ["rgb(230, 237, 246)", COLORS[firstIndex]]
    // outputRange: [0, 0.25]
  })

  // const opacityInter = bg.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [0, 0.75]
  // })

  const nextBgOpacity = useRef(new Animated.Value(0)).current;

  const changeColorRef = useRef<NodeJS.Timeout | null>(null);

  const incrementIndex = (index: number) => {
    // console.log('incrementing')

    if (index + 1 === 8) {
      return 0;
    }
    return index + 1;
  }

  const changeColor = (firstIndex: number, secondIndex: number) => {
    setColorChanging(true);
    console.log(`first: ${firstIndex}, second: ${secondIndex}`)
    if (changeColorRef.current) {
      clearTimeout(changeColorRef.current);
    }

    const newFirst = incrementIndex(firstIndex);
    const newFirstForAnimation = firstIndex + 1 === 8 ? firstIndex + 1 : newFirst;
    const newSecond = incrementIndex(secondIndex);

    console.log(`newfirst: ${newFirst}, newsecond: ${newSecond}, newforanim: ${newFirstForAnimation}`)

    Animated.parallel([
      Animated.sequence([
        Animated.timing(nextBgOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(nextBgOpacity, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true
        }),
      ]),
      Animated.sequence([
        Animated.timing(nextColor, {
          toValue: newFirstForAnimation,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(nextColor, {
          toValue: newFirstForAnimation === 8 ? 0 : newFirst,
          duration: 0,
          useNativeDriver: true
        })
      ])
    ]).start();

    changeColorRef.current = setTimeout(() => {
      // setColorChanging(false)
      setFirstIndex(newFirst)
      firstIndexRef.current = newFirst;
      setSecondIndex(newSecond)
      secondIndexRef.current = newSecond;
    }, 1000)
  }

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

  const differenceInSeconds = (date1: Date, date2: Date) => {
    const diffInMilliseconds = date2.getTime() - date1.getTime();
    // console.log(diffInMilliseconds)
    return Math.floor(diffInMilliseconds);
  }

  const startTimer = async () => {
    const currentTime = new Date(Date.now()); // Current timestamp in milliseconds
    await AsyncStorage.setItem('start_time', currentTime.toISOString());
  };

  const timeTicker = useRef<number | null>();

  const hourChecker = useRef<number | null>();
  const firstIndexRef = useRef<number>(0);
  const secondIndexRef = useRef<number>(1);
  const pressedRef = useRef<boolean>(false);

  useEffect(() => {
    // const os = Platform.OS;

    if (pressed) {
      startTimer();

      const fetchStartTime = async () => {
        const startTime = await AsyncStorage.getItem('start_time');
        if (startTime) {
          if (!timeTicker.current) {
            timeTicker.current = BackgroundTimer.setInterval(() => {
              const now = new Date(Date.now());
              const elapsedSeconds = differenceInSeconds(new Date(Date.parse(startTime)), now);
              // console.log(elapsedSeconds)
              setTime(elapsedSeconds);
            }, 100);
          }
        }
      };

      fetchStartTime();

      setToastDisplay(false);

      if (timerTimeoutRef.current) {
        clearTimeout(timerTimeoutRef.current);
        timerTimeoutRef.current = null;
      }
    } else {
      // BackgroundTimer.stopBackgroundTimer();
      if (timeTicker.current) {
        BackgroundTimer.clearInterval(timeTicker.current);
        timeTicker.current = null;
      }

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
      // BackgroundTimer.stopBackgroundTimer();
      if (timeTicker.current) {
        BackgroundTimer.clearInterval(timeTicker.current);
        timeTicker.current = null;
      }
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
    }
  }, [pressed]);

  // useEffect(() => {
  // }, [firstIndex, secondIndex])

  useEffect(() => {
    return () => {
      if (changeColorRef.current) {
        clearTimeout(changeColorRef.current);
      }
    };
  }, []); // Runs once, ensures cleanup on component unmount

  useEffect(() => {
    const getSunTimes = async () => {
      const locationTimes = await getLocation();

      const times = { ...locationTimes?.times };



      // Step 1: Preprocess the data to convert UTC dates to integers
      const entriesWithTimestamps = Object.entries(times).map(([key, value]) => {
        return [key, new Date(value).getTime()]; // Convert UTC string to milliseconds
      });

      // Step 2: Sort using the preprocessed integers
      entriesWithTimestamps.sort((a: any, b: any) => a[1] - b[1]);

      // Step 3: Reconstruct the object (if needed)
      const sortedTimeObject = Object.fromEntries(entriesWithTimestamps);

      // console.log(sortedTimeObject);

      // const sanitizeTimes = () => {
      //   if (locationTimes?.times) {
      //     const times = locationTimes?.times;
      //     const newObj: any = {};
      //     newObj.nightEnd = times?.nightEnd;
      //     newObj.nauticalDawn = times?.nauticalDawn;
      //     newObj.dawn = times?.dawn;
      //     newObj.sunrise = times?.sunrise;
      //     newObj.sunriseEnd = times?.sunriseEnd;
      //     newObj.goldenHourEnd = times?.goldenHourEnd;
      //     newObj.solarNoon = times?.solarNoon;
      //     newObj.goldenHour = times?.goldenHour;
      //     newObj.sunsetStart = times?.sunsetStart;
      //     newObj.sunset = times?.sunset;
      //     newObj.dusk = times?.dusk;
      //     newObj.nauticalDusk = times?.nauticalDusk;
      //     newObj.night = times?.night;
      //     newObj.nadir = times?.nadir;
      //   }
      // }
      setSunTimes({ location: locationTimes?.location, times: sortedTimeObject })
    }

    getSunTimes();
  }, [])

  useEffect(() => {
    if (sunTimes) {
      const time: number | undefined = checkTime();
      // console.log(`setting index to ${time}`)
      if (time !== undefined) {
        nextColor.setValue(time);
        setFirstIndex(time);
        setSecondIndex(incrementIndex(time));
      }
      firstIndexRef.current = firstIndex; // Update ref with the latest value
      secondIndexRef.current = incrementIndex(firstIndex);
      pressedRef.current = pressed;

      if (!hourChecker.current) {
        hourChecker.current = BackgroundTimer.setInterval(() => {
          const time: number | undefined = checkTime();
          // console.log(pressed)
          // console.log('checking')
          const pressed = pressedRef.current;
          const first = firstIndexRef.current;
          const second = secondIndexRef.current;
          if (pressed
            && time !== undefined && (firstIndex < time || (firstIndex === 7 && time === 0))
          ) {
            // console.log("checking hour")
            if (firstIndex < time || (firstIndex === 7 && time === 0)) {
              changeColor(first, second);
            }
            // changeColor(first, second);
          }
        },
          // 5000 // for testing
          60000
        );
      }
    }
    return () => {
      if (!pressed && hourChecker.current) {
        BackgroundTimer.clearInterval(hourChecker.current);
        hourChecker.current = null;
      }
    }
  }, [sunTimes, pressed])

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
        useNativeDriver: false,
      }),
      Animated.timing(timeScale, {
        toValue: held ? 1 : pressed ? 0.985 : 0.99,
        duration: DURATION,
        useNativeDriver: false,
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

  const getLocationFromStorage = async () => {
    try {
      const value = await AsyncStorage.getItem('location');
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
        <SkyBackground
          bg={bg}
          firstIndex={firstIndex}
          secondIndex={secondIndex}
          colorChanging={colorChanging}
          nextBgOpacity={nextBgOpacity}
          setColorChanging={setColorChanging}
        />
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
              pressed={pressed}
              nextColorInter={nextColorInter}
              firstIndex={firstIndex}
              secondIndex={secondIndex}
              colorChanging={colorChanging}
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
          {/* <Button title="Test" onPress={() => {
            console.log("pressed")
            // setTest(true)
            changeColor();
          }
          } /> */}
        </SafeAreaView>
      </Animated.View>
    </SafeAreaProvider>
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
