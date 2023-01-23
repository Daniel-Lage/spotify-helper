import request from "request";

export function useToken(Function) {
  request.post(
    {
      url: "https://accounts.spotify.com/api/token",
      form: {
        refresh_token: sessionStorage.getItem("refresh_token"),
        grant_type: "refresh_token",
      },
      headers: {
        Authorization:
          "Basic ZWQxMjMyODcxMTMzNDVjNDkzMzhkMWNmMjBiZWM5MGU6NjE2Mzg1ZjJlYzNkNGQ2M2E3OWJkMWIxZGZhM2M4MGM=",
      },
      json: true,
    },
    (error, response, body) => {
      console.log(body);
      Function(body.access_token);
    }
  );
}
