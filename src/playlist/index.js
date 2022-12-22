import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import LoadingScreen from "../load";
import request from "request";

export default function ({
  navigation,
  route: {
    params: { colors, refreshToken, playlist },
  },
}) {
  const [tracks, setTracks] = useState();

  useEffect(() => {
    request.post(
      {
        url: "https://accounts.spotify.com/api/token",
        form: {
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        },
        headers: {
          Authorization:
            "Basic ZWQxMjMyODcxMTMzNDVjNDkzMzhkMWNmMjBiZWM5MGU6NjE2Mzg1ZjJlYzNkNGQ2M2E3OWJkMWIxZGZhM2M4MGM=",
        },
        json: true,
      },
      (error, response, body) => {
        request.get(
          {
            url: playlist.tracks,
            headers: { Authorization: "Bearer " + body.access_token },
            json: true,
          },
          (error, response, body) => {
            setTracks(body.items);
          }
        );
      }
    );
  }, []);

  if (!tracks) return <LoadingScreen colors={colors} />;

  console.log(tracks);

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        backgroundColor: colors.background,
        gap: 20,
      }}
    >
      <Pressable
        onPress={() =>
          navigation.navigate("Home", {
            refreshToken: refreshToken,
            colors: colors,
          })
        }
      >
        <AntDesign name="leftcircle" size={24} color={colors.primary} />
      </Pressable>
      <Image
        source={playlist.image}
        style={{
          width: 100,
          height: 100,
          margin: 10,
          borderWidth: 2,
          borderColor: colors.primary,
          borderRadius: 5,
        }}
      />
      <Text
        style={{
          fontSize: "300%",
          fontWeight: "bold",
          color: colors.primary,
          textAlign: "center",
          padding: 10,
        }}
      >
        {playlist.name}
      </Text>
      <View></View>
    </View>
  );
}
