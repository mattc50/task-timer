import { useEffect, useState } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import SunCalc from 'suncalc';

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

  const getLocation = async () => {
    // let location;

    const permission = await Geolocation.requestAuthorization("whenInUse");
    // const hasPermission = await hasLocationPermission();

    // if (!hasPermission) {
    if (permission !== 'granted' && permission !== 'restricted') {
      Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
      return;
    }

    Geolocation.getCurrentPosition(
      (position: Geolocation.GeoPosition) => {
        // location = position;
        setLocation(position);
      },
      (error) => {
        Alert.alert('Error', `Code ${error.code}: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );

    var times;
    if (location) {
      times = SunCalc.getTimes(new Date(), location.coords.latitude, location.coords.longitude);
      console.log(times);
    }
    console.log(new Date(Date.now()).toISOString());

  };

  return (
    <View>
      <Button title="Get Location" onPress={getLocation} />
      {/* {location && (
        <Text>
          Latitude: {location.coords.latitude}, Longitude: {location.coords.longitude}
        </Text>
      )} */}
    </View>
  );
};

export default LocationAndSun;
