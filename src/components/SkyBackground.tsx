import { useEffect, useRef, useState } from "react";
import { Animated, ImageBackground } from "react-native";

interface SkyBackgroundProps {
  bg: Animated.Value,
  firstIndex: number,
  secondIndex: number,
  colorChanging: boolean,
  nextBgOpacity: Animated.Value
  setColorChanging: Function
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

const SkyBackground: React.FC<SkyBackgroundProps> = ({
  bg,
  firstIndex,
  secondIndex,
  colorChanging,
  nextBgOpacity,
  setColorChanging
}) => {

  const [firstImage, setFirstImage] = useState<any>(IMAGES[firstIndex])
  const [secondImage, setSecondImage] = useState<any>(IMAGES[secondIndex])
  const [zIndex, setZIndex] = useState<number>(0)

  const topOpacity = useRef(new Animated.Value(1)).current;

  const posTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const imageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [nextOpacity, setNextOpacity] = useState<number>(0)

  useEffect(() => {
    if (colorChanging) {
      setSecondImage(IMAGES[secondIndex])
      setNextOpacity(0);
      setZIndex(0)

      if (posTimeoutRef.current) {
        clearTimeout(posTimeoutRef.current);
      }
      if (imageTimeoutRef.current) {
        clearTimeout(imageTimeoutRef.current);
      }

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
        setNextOpacity(1);
        setColorChanging(false)
      }, 1000);

      return () => {
        if (posTimeoutRef.current) {
          clearTimeout(posTimeoutRef.current);
        }
        if (imageTimeoutRef.current) {
          clearTimeout(imageTimeoutRef.current);
        }
      };
    }
  }, [colorChanging]);

  useEffect(() => {
    setFirstImage(IMAGES[firstIndex]);
    setSecondImage(IMAGES[firstIndex]);
  }, [firstIndex, secondIndex])

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