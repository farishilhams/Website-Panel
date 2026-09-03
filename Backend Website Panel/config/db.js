// Membuat fungsi untuk menghubungkan ke database
const connect = require("./pool");

// Membuat fungsi untuk mengambil koneksi dari pool
const getConnection = async function () {
  return new Promise(function (resolve, reject) {
    try {
      // Membuat koneksi dengan pool
      connect.getConnection(function (err, connection) {
        if (err) return reject(err);
        // Mengembalikan koneksi jika berhasil
        resolve(connection);
      });
    } catch (error) {
      // Mengembalikan error jika terjadi kesalahan
      reject(error);
    }
  });
};

// Mengekspor fungsi getConnection
module.exports = getConnection;

