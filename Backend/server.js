const express = require("express");
const cluster = require("cluster");
const os = require("os");
const helmet = require("helmet"); // security headers like CSP, XSS, etc.
const morgan = require("morgan");  // logging every incomeing api request to the console
const limiter = require("./src/middlewares/rateLimiter"); // rate limiting middleware to prevent brute-force attacks
const corsConfig = require("./src/middlewares/corsConfig");
const userRoutes = require("./src/routes/UserRoutes");
const questionRoutes = require("./src/routes/QuestionRoutes");
const levelRoutes = require("./src/routes/LevelRoutes");
const examschedule = require("./src/routes/ExamScheduleRoutes");
const setRoutes = require("./src/routes/SetRoutes");
const resultRoutes = require("./src/routes/ResultRoutes");
const adminsetting = require("./src/routes/AdminSettingRoutes");
const summary = require("./src/routes/summaryroute")
const errorHandler = require("./src/utils/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");

const app = express();
const PORT = process.env.PORT || 4001;

if (cluster.isMaster) {
    // 🌟 Master process (manages workers)
    const numCPUs = os.cpus().length;
    console.log(`🟢 Master ${process.pid} is running`);
    console.log(`⚡ Forking ${numCPUs} workers...`);

    // Fork workers equal to CPU cores
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Restart worker if it crashes
    cluster.on("exit", (worker, code, signal) => {
        console.error(`❌ Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });

} else {

    // ✅ Global middlewares
    app.use(helmet());             // Security headers
    app.use(corsConfig);           // CORS policy
    app.use(limiter);              // Rate limiting
    app.use(express.json());       // Parse JSON
    app.use(morgan("combined"));   // Request logging

    // ✅ Routes
    app.use("/users", userRoutes);
    app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use("/questions", questionRoutes);
    app.use("/levels", levelRoutes);
    app.use("/sets", setRoutes);
    app.use("/exam-schedule", examschedule);
    app.use("/results", resultRoutes);
    app.use("/admin-settings", adminsetting);
    app.use("/summary", summary);




    // ✅ Error Handling
    app.use(errorHandler);

    // ✅ Start Server (same file)
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT} `);
        console.log(`📘 Swagger → http://localhost:${PORT}/swagger`);
    });

}
