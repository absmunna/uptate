import http from "http";
import fs from "fs";

http.get("http://127.0.0.1:3000/src/main.tsx", (res) => {
  let data = "";
  res.on("data", c => data+=c);
  res.on("end", () => {
     fs.writeFileSync("output.js", data);
     console.log("STATUS:", res.statusCode);
     if (res.statusCode !== 200) console.log("DATA:", data.slice(0, 500));
  });
}).on("error", console.error);
