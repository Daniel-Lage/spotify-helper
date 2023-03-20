import { Dimensions } from "react-native";
import request from "request";

var token = "";
var expires_in = 0;

export function useToken(Function) {
  if (new Date().getTime() < expires_in) Function(token);
  else
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
        console.log("request: get access token");

        expires_in = body.expires_in * 1000 + new Date().getTime();
        token = body.access_token;

        if (body.error) return console.error(body);

        Function(token);
      }
    );
}

export function isVertical() {
  const { height, width } = Dimensions.get("window");
  return height > width;
}
