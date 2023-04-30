//setting up the server

const http = require("http");
const fs = require("fs");
var requests = require("requests");
const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceValues = (tempVal, obj) => {
  function financial(x) {
    return Number.parseFloat(x).toFixed(1);
  }
  let temprature = tempVal.replace(
    "{%currTemp%}",
    financial(obj.main.temp - 273.15)
  );
  temprature = temprature.replace("{%location%}", obj.name);
  temprature = temprature.replace("{%country%}", obj.sys.country);
  temprature = temprature.replace(
    "{%minTemp%}",
    financial(obj.main.temp_min - 273.15)
  );
  temprature = temprature.replace(
    "{%maxTemp%}",
    financial(obj.main.temp_max - 273.15)
  );
  temprature = temprature.replace("{%tempStat%}", obj.weather[0].main);
  return temprature;
};
const server = http.createServer((req, res) => {
  requests(
    `https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=9a4dbc9037a45f8e14cb94fe5f3dda4e`
  )
    .on("data", function (chunk) {
      const objData = JSON.parse(chunk);
      const arrData = [objData];
      const currTempData = arrData
        .map((e) => {
          return replaceValues(homeFile, e);
        })
        .join("");

      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(currTempData);
    })
    .on("end", function (err) {
      res.end();
      if (err) return console.log("connection closed due to errors", err);
    });
});

server.listen(8000, "127.0.0.1", () => {
  console.log("server is running on port 8000");
});
