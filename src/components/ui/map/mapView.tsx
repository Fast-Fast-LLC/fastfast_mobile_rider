import RNMapView, {Circle, Marker} from 'react-native-maps';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Box} from 'native-base';
import {MapTypes} from '@types/mapTypes';
import MapViewDirections from 'react-native-maps-directions';
import {addressesStore} from '@store/addresses';
import mapStyle from './mapStyles.json';
import {observer} from 'mobx-react-lite';
import {useGeolocation} from '@hooks/useGeoLocation';

const MapView = observer((props: MapTypes) => {
  const {markers} = props;
  const mapRef = useRef<RNMapView>(null);

  const selectedAddress = addressesStore.selectedAddress;

  // const [location, setLocation] = useState<GeoPosition | null>(null);
  const [initialRegion, setInitialRegion] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const {location} = useGeolocation({enableFetchLocation: true});

  useEffect(() => {
    setTimeout(() => {
      if (selectedAddress.latitude) {
        setInitialRegion({
          latitude: parseFloat(selectedAddress.latitude ?? ''),
          longitude: parseFloat(selectedAddress.longitude ?? ''),
        });
      } else if (location) {
        setInitialRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        setInitialRegion(null);
      }
    }, 500);
  }, [location, selectedAddress.latitude, selectedAddress.longitude]);

  useEffect(() => {
    if (initialRegion?.latitude && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: initialRegion.latitude,
          longitude: initialRegion.longitude,
        },
        pitch: 1,
        heading: 0,
        altitude: 2000,
        zoom: markers ? 12 : 13,
      });
    }
  }, [initialRegion?.latitude, initialRegion?.longitude, markers]);

  // get the passed in markers and set distance
  useEffect(() => {
    console.log('passed markers', markers);
  }, [markers]);

  return (
    <Box flex={1}>
      {initialRegion?.latitude && (
        <RNMapView
          ref={mapRef}
          provider="google"
          customMapStyle={mapStyle}
          initialCamera={{
            altitude: 15000,
            center: {
              latitude: initialRegion?.latitude,
              longitude: initialRegion?.longitude,
            },
            heading: 0,
            pitch: 1,
            zoom: markers ? 12 : 13,
          }}
          loadingEnabled
          zoomEnabled={false}
          // followsUserLocation
          // showsUserLocation
          showsMyLocationButton={false}
          showsCompass={false}
          // loadingBackgroundColor="white"
          style={StyleSheet.absoluteFillObject}
          rotateEnabled={false}>
          <Marker
            anchor={{x: 0.5, y: 0.6}}
            coordinate={{
              latitude: initialRegion.latitude,
              longitude: initialRegion.longitude,
            }}
            flat
            title={(markers && markers[0]?.title) ?? 'You'}
            style={{
              transform: [
                {
                  rotate: '0deg',
                },
              ],
            }}>
            <View style={styles.dotContainer}>
              <View style={[styles.arrow]} />
              <View style={styles.dot} />
            </View>
          </Marker>
          <Circle
            center={{
              latitude: initialRegion.latitude,
              longitude: initialRegion.longitude,
            }}
            radius={2000}
            // strokeWidth={3}
            strokeColor="#E5F9EE"
            fillColor="#E5F9EE"
          />
          {markers && markers?.length > 1 && (
            <>
              <Marker
                anchor={{x: 0.5, y: 0.6}}
                coordinate={{
                  latitude: markers[1].latitude,
                  longitude: markers[1].longitude,
                }}
                title={markers[1].title}
                flat
                style={{
                  transform: [
                    {
                      rotate: '0deg',
                    },
                  ],
                }}>
                <View style={styles.dotContainer}>
                  <View style={[styles.arrow2]} />
                  <View style={styles.dot2} />
                </View>
              </Marker>
              <Circle
                center={{
                  latitude: markers[1].latitude,
                  longitude: markers[1].longitude,
                }}
                radius={2000}
                // strokeWidth={3}
                strokeColor="#FBE1C2"
                fillColor="#FBE1C2"
              />
              <MapViewDirections
                origin={{
                  latitude: markers[0].latitude,
                  longitude: markers[0].longitude,
                }}
                destination={{
                  latitude: markers[1].latitude,
                  longitude: markers[1].longitude,
                }}
                apikey={process.env.GOOGLE_API_KEY ?? ''}
                strokeWidth={3} // Customize the line width
                // lineDashPattern={[5, 5]}
                strokeColor="#1B7A41" // Customize the line color
              />
            </>
          )}
        </RNMapView>
      )}
    </Box>
  );
});

export default MapView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  dotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    backgroundColor: '#499D6A',
    width: 24,
    height: 24,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 12,
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
    elevation: 4,
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#009655',
  },
  dot2: {
    backgroundColor: '#F2AC57',
    width: 24,
    height: 24,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 12,
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
    elevation: 4,
  },
  arrow2: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#F2AC57',
  },
});
