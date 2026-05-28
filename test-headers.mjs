import http from "http";

http.get("http://127.0.0.1:3000", (res) => {
  console.log("HEADERS:", res.headers);
}).on("error", console.error);
