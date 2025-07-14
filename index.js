// index.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/emoji", (req, res) => {
  const emojis = ["🌞", "🎨", "🚀", "📍", "🔥", "💻", "💡", "🧠"];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  res.json({ emoji });
});

app.get("/location", async (req, res) => {
  //const data = await fetch(`https://ipinfo.io/json?token=${process.env.IPINFO_TOKEN}`).then(r => r.json());
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  const data = await fetch(`https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`).then(r => r.json());

  res.json({ city: data.city, country: data.country });
});

app.get("/weather", async (req, res) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  const ipData = await fetch(`https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`).then(r => r.json());

  const [lat, lon] = ipData.loc.split(",");
  const weather = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
  ).then(r => r.json());

  res.json({
    temp: `${Math.round(weather.main.temp)}°C`,
    condition: weather.weather[0].main
  });
});


app.get("/views", async (req, res) => {
  const url = `https://api.countapi.xyz/hit/${process.env.COUNT_NAMESPACE}/${process.env.COUNT_KEY}`;
  const d = await fetch(url).then(r => r.json());
  res.json({ count: d.value });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));
