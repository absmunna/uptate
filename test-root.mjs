import http from "http";

http.get("http://127.0.0.1:3000/", (res) => {
  let data = "";
  res.on("data", c => data+=c);
  res.on("end", () => console.log(data));
}).on("error", console.error);
