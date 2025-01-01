import { useEffect, useRef } from "react";
import { Animated, ImageBackground } from "react-native";

interface SkyBackgroundProps {
  bg: Animated.Value,
  bgInter: any,
  test?: boolean

  // image: any
}

const images = {
  image1: require('../../assets/sunrise1.jpg'),
  image2: require('../../assets/sunrise2.jpg'),
  image3: require('../../assets/sunrise3.jpg'),
  image4: require('../../assets/sunrise4.jpg'),
  image5: require('../../assets/sunset1.jpg'),
  image6: require('../../assets/sunset2.jpg'),
  image7: require('../../assets/sunset3.jpg'),
  image8: require('../../assets/sunset4.jpg')
}

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
  test
  // image 
}) => {
  const colorRef = useRef(new Animated.Value(0)).current;

  const color = colorRef.interpolate({
    inputRange: [0, 1],
    outputRange: [bgInter, COLORS.image2]
  })

  const transitionColor = () => {
    Animated.timing(colorRef, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    })
  }

  return (
    <Animated.View style={{
      opacity: bg,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%"
    }}>
      <ImageBackground source={images.image1} style={{ width: "100%", height: "100%" }} />
    </Animated.View>
  )
}

export default SkyBackground;