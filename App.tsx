/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';

import {
  Animated,
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
    outputRange: ["rgb(230, 237, 246)", "rgb(234, 197, 191)"]
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

  const [data, setData] = useState<Object>({})

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (pressed) {
      interval = setInterval(() => {
        setTime((time) => time + 1000);
      }, 1000);

      setToastDisplay(false);

      if (timerTimeoutRef.current) {
        clearTimeout(timerTimeoutRef.current);
        timerTimeoutRef.current = null;
      }
    } else {
      clearInterval(interval);

      if (time > 0) {
        setToastDisplay(true);
        timerTimeoutRef.current = setTimeout(() => {
          // console.log('will hide toast')
          setToastDisplay(false);
          timerTimeoutRef.current = null;
        }, 5000);

        setLastTime(time);
        setTime(0);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
    }
  }, [pressed]);

  const handleStop = () => {
    setPressed(false);
  }

  const makePressEffects = () => {
    Animated.parallel([
      Animated.timing(timeOpacity, {
        toValue: held ? 0.6 : 0.5,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(timeScale, {
        toValue: held ? 1 : pressed ? 0.985 : 0.99,
        duration: DURATION,
        useNativeDriver: true,
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
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1.06,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(shadow, {
        toValue: 1,
        duration: DURATION,
        useNativeDriver: true,
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
      useNativeDriver: true,
    }).start();
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1.06,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(shadow, {
        toValue: 0,
        duration: DURATION / 1.75,
        useNativeDriver: true,
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
        useNativeDriver: true,
      }),
      Animated.timing(activeRunningShadow, {
        toValue: pressed ? 0 : 1,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(runningShadow, {
        toValue: 0,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(bg, {
        toValue: pressed ? 0 : 1,
        duration: DURATION,
        useNativeDriver: true,
      })
    ]).start();
    if (pressed) {
      handleStop();
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
    // console.log('run effect');
  }, [data])

  return (
    <SafeAreaProvider>
      <Animated.View style={[styles.container, { backgroundColor: bgInter }]}>
        <SafeAreaView style={styles.parent}>
          <ShowTimes
            data={data}
            setData={setData}
            setShowList={setShowList}
          />
          <View style={{
            // backgroundColor: "red",
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 48
          }}>
            <Time
              timeScale={timeScale}
              timeOpacity={timeOpacity}
              time={time}
            />
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
            />
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
    flex: 1
  },
});

export default App;
