const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://abacus.deveraa.com",
  "http://192.168.1.7:5173/",
  "https://test.abacus.deveraa.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

module.exports = cors(corsOptions);
