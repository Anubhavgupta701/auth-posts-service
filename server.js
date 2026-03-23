require('dotenv').config();
const app=require("./src/app")
const connectdb=require("./src/config/db")

connectdb();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

