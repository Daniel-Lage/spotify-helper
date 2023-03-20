import { Dimensions } from "react-native";
import request from "request";

export function useToken(Function) {
  request.post(
    {
      url: "https://accounts.spotify.com/api/token",
      form: {
        refresh_token: localStorage.refreshToken,
        grant_type: "refresh_token",
      },
      headers: {
        Authorization:
          "Basic ZWQxMjMyODcxMTMzNDVjNDkzMzhkMWNmMjBiZWM5MGU6NjE2Mzg1ZjJlYzNkNGQ2M2E3OWJkMWIxZGZhM2M4MGM=",
      },
      json: true,
    },
    (error, response, body) => {
      console.log("request: get access token", body);
      if (body.error) return;
      Function(body.access_token);
    }
  );
}

export function isVertical() {
  const { height, width } = Dimensions.get("window");
  return height > width;
}
