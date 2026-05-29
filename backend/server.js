require("dotenv").config();
const app = require("./src/app");
const { iniciarJobAlertas } = require("./src/jobs/alertas.job");

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\n🚀 PESV Digital API corriendo en http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌱 Seed: npm run seed\n`);
  iniciarJobAlertas();
});
