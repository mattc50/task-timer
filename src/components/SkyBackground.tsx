import { useEffect, useRef } from "react";
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
  secondImage,
  colorChanging,
  nextBgOpacity
  // image 
}) => {
  // console.log(nextColor)
  useEffect(() => {
    console.log(nextBgOpacity)
    // console.log(firstIndex, secondIndex, secondImage, colorChanging)
  }, [nextBgOpacity])
  const colorRef = useRef(new Animated.Value(0)).current;

  const topOpacity = useRef(new Animated.Value(0)).current;

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

  // console.log(nextColor)

  return (
    <Animated.View style={{
      opacity: bg,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%"
    }}>
      <Animated.View style={{ zIndex: 2, opacity: nextBgOpacity, width: "100%", height: "100%" }}>
        <ImageBackground source={IMAGES[secondIndex]} style={{ width: "100%", height: "100%" }} />
      </Animated.View>
      {colorChanging && <ImageBackground
        source={IMAGES[secondIndex]}
        style={{
          // backgroundColor: "red",
          zIndex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%"
        }} />}
      <ImageBackground source={IMAGES[firstIndex]} style={{
        position: "absolute", top: 0, left: 0,
        width: "100%", height: "100%"
      }} />
    </Animated.View>
  )
}

export default SkyBackground;