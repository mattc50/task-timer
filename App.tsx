/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';

import {
  Animated,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import Time from './src/components/Time';
import Toast from './src/components/Toast';
import TimerButton from './src/components/TimerButton';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import EntryForm from './src/components/EntryForm';

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
  // const [toastTime, setToastTime] = useState<number>(time);
  const timeOpacity = useRef(new Animated.Value(0.6)).current;
  const timeScale = useRef(new Animated.Value(1)).current;

  const [toastDisplay, setToastDisplay] = useState(false);
  // const toastPosition = useRef(new Animated.Value(0)).current;

  const timerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [showForm, setShowForm] = useState<boolean>(false);
  // const formOpacity = useRef(new Animated.Value(0)).current;
  // const formTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    // let timeout: any = null;

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
          console.log('will hide toast')
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

  // useEffect(() => {
  //   console.log(showForm)
  //   if (showForm) {
  //     Animated.timing(formOpacity, {
  //       toValue: 1,
  //       duration: 100,
  //       useNativeDriver: true,
  //     }).start();
  //   } else {
  //     Animated.timing(formOpacity, {
  //       toValue: 0,
  //       duration: 100,
  //       useNativeDriver: true,
  //     }).start();
  //     timerTimeoutRef.current = setTimeout(() => {
  //       setShowForm(false);
  //     }, 100);
  //   }
  //   return () => {
  //     if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
  //   }
  // }, [openForm, closeForm])

  const handleStop = () => {
    setPressed(false);
    // setLastTime(time);
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

  return (
    <SafeAreaProvider>
      <Animated.View style={[styles.container, { backgroundColor: bgInter }]}>
        <SafeAreaView style={styles.parent}>
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
          <Toast
            time={lastTime}
            toastDisplay={toastDisplay}
            setShowForm={setShowForm}
          />
          {showForm && <EntryForm
            timeToSubmit={lastTime}
            showForm={showForm}
            setShowForm={setShowForm}
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
  // button: {
  //   position: "relative",
  //   width: 280,
  //   height: 280,
  //   borderRadius: 140,
  // },
  // shadowElement: {
  //   position: "absolute",
  //   top: 0,
  //   left: 0,
  //   width: "100%",
  //   height: "100%",
  //   borderRadius: "100%",
  // },
  // shadow1: {
  //   shadowColor: "rgb(255, 255, 255)",
  //   shadowOffset: { width: 0, height: -24 },
  //   shadowOpacity: 1,
  //   shadowRadius: 100
  // },
  // shadow2: {
  //   shadowColor: "rgb(40, 48, 87)",
  //   shadowOffset: { width: 0, height: 32 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 24
  // },
  // shadow3: {
  //   shadowColor: "rgb(77, 43, 38)",
  //   shadowOpacity: 0.04,
  //   shadowRadius: 60
  // },
  // shadow4: {
  //   shadowColor: "rgb(40, 48, 87)",
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.04,
  //   shadowRadius: 28
  // },
  // shadow5: {
  //   shadowColor: "rgb(77, 43, 38)",
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.04,
  //   shadowRadius: 28
  // },
  // svg: {
  //   position: "absolute",
  //   top: 0,
  //   left: 0
  // },
});

export default App;
