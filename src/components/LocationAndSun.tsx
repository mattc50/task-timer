import { useEffect, useState } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import SunCalc from 'suncalc';

export const getLocation = async () => {
  // let location: any;
  // console.log("hello")

  const permission = await Geolocation.requestAuthorization("whenInUse");
  // const hasPermission = await hasLocationPermission();

  // if (!hasPermission) {
  if (permission !== 'granted' && permission !== 'restricted') {
    Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
    return;
  }

  const locate = async (): Promise<Geolocation.GeoPosition | undefined> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position: Geolocation.GeoPosition) => {
          resolve(position); // Resolve the Promise with the position
        },
        (error) => {
          Alert.alert('Error', `Code ${error.code}: ${error.message}`);
          reject(error); // Reject the Promise with the error
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  const location: any = await locate();

  // console.log(location)

  var times;
  if (location) {
    times = SunCalc.getTimes(new Date(), location.coords.latitude, location.coords.longitude);
    // console.log(times);
  }
  // console.log(new Date(Date.now()).toISOString());

  // console.log(new Date(Date.now()).getTime());
  // if (times) console.log(new Date(times.dawn).getTime())
  return { location: location, times: times };
};

const LocationAndSun = () => {
  const [location, setLocation] = useState<Geolocation.GeoPosition | null>(null);

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      return true; // iOS handles permissions automatically when requesting location.
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const setStateLocation = async () => {

    const result = await getLocation();
    if (result) {
      setLocation(result.location);
      // console.log(result.times)
    }
  }

  return (
    <View>
      <Button title="Get Location" onPress={setStateLocation} />
      {location && (
        <Text style={{ position: "absolute", top: 100, left: -100 }}>
          Latitude: {location.coords.latitude}, Longitude: {location.coords.longitude}
        </Text>
      )}
    </View>
  );
};

export default LocationAndSun;