const app = require("./app"); 
const { port } = require("./config/config"); 

// Menjalankan server pada port yang sudah ditentukan
app.listen(port, "0.0.0.0", () => {
  console.log(`Server berjalan di port ${port}`);
});
