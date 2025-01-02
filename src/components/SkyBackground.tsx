import { useEffect, useRef, useState } from "react";
import { Animated, ImageBackground } from "react-native";

interface SkyBackgroundProps {
  bg: Animated.Value,
  bgInter: any,
  test?: boolean,
  nextColor: Animated.Value
  firstIndex: number,
  secondIndex: number,
  secondImage: number,
  colorChanging: boolean,
  nextBgOpacity: Animated.Value
  setColorChanging: Function
  // image: any
}

const IMAGES = [
  require('../../assets/sunrise1.jpg'),
  require('../../assets/sunrise2.jpg'),
  require('../../assets/sunrise3.jpg'),
  require('../../assets/sunrise4.jpg'),
  require('../../assets/sunset1.jpg'),
  require('../../assets/sunset2.jpg'),
  require('../../assets/sunset3.jpg'),
  require('../../assets/sunset4.jpg')
]

const COLORS = {
  image1: "rgb(51, 48, 81)",
  image2: "rgb(82, 57, 55)",
  image3: "rgb(79, 79, 129)",
  image4: "rgb(83, 126, 255)",
  image5: "rgb(74, 88, 244)",
  image6: "rgb(76, 70, 126)",
  image7: "rgb(84, 49, 68)",
  image8: "rgb(12, 22, 69)",
}

const SkyBackground: React.FC<SkyBackgroundProps> = ({
  bg,
  bgInter,
  test,
  nextColor,
  firstIndex,
  secondIndex,
  // secondImage,
  colorChanging,
  nextBgOpacity,
  setColorChanging
  // image 
}) => {
  console.log(colorChanging)
  // useEffect(() => {
  //   console.log("colorChanging:", colorChanging)
  //   console.log(firstIndex, secondIndex, secondImage, colorChanging)
  // }, [colorChanging])

  const [firstImage, setFirstImage] = useState<any>(IMAGES[firstIndex])
  const [secondImage, setSecondImage] = useState<any>(IMAGES[secondIndex])
  const [zIndex, setZIndex] = useState<number>(0)

  const colorRef = useRef(new Animated.Value(0)).current;

  const topOpacity = useRef(new Animated.Value(1)).current;

  const posTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const imageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [nextOpacity, setNextOpacity] = useState<number>(0)

  // const color = colorRef.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [bgInter, COLORS.image2]
  // })

  // const transitionColor = () => {
  //   Animated.timing(colorRef, {
  //     toValue: 1,
  //     duration: 1000,
  //     useNativeDriver: true
  //   })
  // }

  // useEffect(() => {
  //   console.log("colorchanging:", colorChanging)
  //   if (colorChanging) {
  //     setNextOpacity(0)
  //     console.log('changed bg')
  //     if (posTimeoutRef.current) {
  //       clearTimeout(posTimeoutRef.current);
  //       posTimeoutRef.current = null;
  //     }

  //     posTimeoutRef.current = setTimeout(() => {
  //       console.log('changing opacity;', nextOpacity)
  //       setNextOpacity(1)
  //     }, 1000)

  //     return () => {
  //       if (posTimeoutRef.current) clearTimeout(posTimeoutRef.current);
  //     }
  //   }
  // }, [colorChanging])

  useEffect(() => {
    // console.log("colorchanging:", colorChanging);

    if (colorChanging) {
      setSecondImage(IMAGES[secondIndex])
      setNextOpacity(0);
      setZIndex(0)
      // setSecondImage(IMAGES[secondIndex])

      if (posTimeoutRef.current) {
        clearTimeout(posTimeoutRef.current);
      }
      if (imageTimeoutRef.current) {
        clearTimeout(imageTimeoutRef.current);
      }

      // Animated.timing(nextBgOpacity, {
      //   toValue: 0,
      //   duration: 50,
      //   delay: 900,
      //   useNativeDriver: true
      // }).start();
      Animated.sequence([
        Animated.timing(topOpacity, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true
        }),
        Animated.timing(topOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ]).start();


      imageTimeoutRef.current = setTimeout(() => {
        setFirstImage(IMAGES[secondIndex])
      }, 900);

      posTimeoutRef.current = setTimeout(() => {
        setZIndex(2)
        // console.log('changing opacity;', nextOpacity); // Stale closure issue here
        setNextOpacity(1);
        setColorChanging(false)
      }, 1000);

      return () => {
        // console.log('Cleanup: clearing timeout');
        if (posTimeoutRef.current) {
          clearTimeout(posTimeoutRef.current);
        }
        if (imageTimeoutRef.current) {
          clearTimeout(imageTimeoutRef.current);
        }
      };
    }
  }, [colorChanging]);

  return (
    <Animated.View style={{
      opacity: bg,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%"
    }}>
      {nextOpacity === 0 && <Animated.View style={{ zIndex: 2, opacity: nextBgOpacity, width: "100%", height: "100%" }}>
        <ImageBackground source={IMAGES[secondIndex]} style={{ width: "100%", height: "100%" }} />
      </Animated.View>}
      {/* <ImageBackground
        source={IMAGES[secondIndex]}
        style={{
          // backgroundColor: "red",
          zIndex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%"
        }} /> */}


      {/* this is the background image */}
      <Animated.Image source={secondImage} style={{
        zIndex: zIndex, opacity: topOpacity, position: "absolute", top: 0, left: 0,
        width: "100%", height: "100%"
      }} />

      <ImageBackground source={firstImage} style={{
        zIndex: 1, position: "absolute", top: 0, left: 0,
        width: "100%", height: "100%"
      }} />
    </Animated.View>
  )
}

export default SkyBackground;