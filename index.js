const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Zyvera PMS API is running",
    status: "healthy",
  });
});


// Connect to MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(` 🚀 Server active in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(` 🌐 API Endpoint: http://localhost:${PORT}/api`);
    console.log(` 📅 Launch Date Target: 25 September 2026`);
    console.log(`==================================================\n`);
  });
});

