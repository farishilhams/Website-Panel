const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const User = require("../models/user.model");
const { jwtSecret } = require("../config/config");

const AVATARS_FILE = path.join(__dirname, "../uploads/user_avatars.json");

const getAvatarsStore = () => {
  try {
    if (!fs.existsSync(AVATARS_FILE)) return {};
    const content = fs.readFileSync(AVATARS_FILE, "utf-8");
    return JSON.parse(content || "{}");
  } catch (err) {
    console.error("Error reading avatars store:", err);
    return {};
  }
};

const saveAvatarStore = (id, { avatar_custom, avatar_preset }) => {
  try {
    const store = getAvatarsStore();
    const strId = String(id);
    store[strId] = {
      avatar_custom: avatar_custom !== undefined ? avatar_custom : (store[strId]?.avatar_custom || ""),
      avatar_preset: avatar_preset !== undefined ? avatar_preset : (store[strId]?.avatar_preset || "from-blue-600 to-indigo-600"),
      updated_at: new Date().toISOString(),
    };
    fs.writeFileSync(AVATARS_FILE, JSON.stringify(store, null, 2), "utf-8");
    return store[strId];
  } catch (err) {
    console.error("Error saving avatar store:", err);
    return null;
  }
};

const allowedRoles = [
  "super_admin",
  "content_admin",
  "marketing",
  "reseller",
  "viewer",
];

// Controller untuk register user (Public & Admin Creation)
exports.register = async (req, res) => {
  try {
    const {
      username_users,
      email_users,
      password_users,
      telpon_users,
      address_users,
      role,
    } = req.body;

    // Validasi input wajib
    if (!username_users || !email_users || !password_users) {
      return res.status(400).json({ message: "Username, email, dan password wajib diisi" });
    }

    // Periksa apakah request membawa token Super Admin
    let isSuperAdmin = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, jwtSecret);
        if (decoded && decoded.role === "super_admin") {
          isSuperAdmin = true;
        }
      } catch (e) {
        // token invalid, dianggap registrasi publik biasa
      }
    }

    // Tentukan role akhir:
    let finalRole = "viewer";
    if (isSuperAdmin) {
      finalRole = allowedRoles.includes(role) ? role : "viewer";
    } else {
      if (role === "reseller") {
        finalRole = "reseller";
      } else {
        finalRole = "viewer";
      }
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.getUsersByEmail(email_users.trim());
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan oleh akun lain" });
    }

    // Cek apakah username sudah digunakan
    const existingUsername = await User.getUsersByUsername(username_users.trim());
    if (existingUsername) {
      return res.status(400).json({ message: "Username sudah digunakan, silakan pilih yang lain" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password_users, 10);

    const newData = {
      username_users: username_users.trim(),
      email_users: email_users.trim(),
      password_users: hashedPassword,
      telpon_users: telpon_users || "",
      address_users: address_users || "",
      role: finalRole,
    };

    const result = await User.createUser(newData);

    res.status(201).json({
      message: `User berhasil terdaftar dengan role ${finalRole}`,
      id_users: result.insertId,
      role: finalRole,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Gagal membuat akun user" });
  }
};

// Controller untuk login user (Support Email ATAU Username)
exports.login = async (req, res) => {
  try {
    const { email_users, password_users, username } = req.body;
    const identifier = email_users || username;

    if (!identifier || !password_users) {
      return res.status(400).json({ message: "Username / Email dan password wajib diisi" });
    }

    // Cari user berdasarkan email ATAU username
    const user = await User.getUserByEmailOrUsername(identifier);
    if (!user) {
      return res.status(401).json({ message: "Akun dengan email / username tersebut tidak ditemukan" });
    }

    const isPasswordValid = await bcrypt.compare(
      password_users,
      user.password_users
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Kata sandi yang Anda masukkan salah" });
    }

    const token = jwt.sign(
      { id_users: user.id_users, role: user.role, username: user.username_users },
      jwtSecret,
      { expiresIn: "24h" }
    );

    const avatarData = getAvatarsStore()[String(user.id_users)] || {};

    res.status(200).json({
      message: "Login berhasil",
      token,
      role: user.role,
      id_users: user.id_users,
      username: user.username_users,
      avatar_custom: avatarData.avatar_custom || "",
      avatar_preset: avatarData.avatar_preset || "from-blue-600 to-indigo-600",
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Gagal melakukan login" });
  }
};

// Controller untuk memperbarui profil user
exports.updateUserById = async (req, res) => {
  try {
    const {
      username_users,
      email_users,
      password_users,
      telpon_users,
      address_users,
      role,
      avatar_custom,
      avatar_preset,
    } = req.body;

    const { id } = req.params;

    if (parseInt(req.userId) !== parseInt(id) && req.role !== "super_admin") {
      return res
        .status(403)
        .json({ message: "Tidak memiliki hak akses mengubah data pengguna lain" });
    }

    const user = await User.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    if (username_users && username_users !== user.username_users) {
      const existingUsername = await User.getUsersByUsername(username_users);
      if (existingUsername && existingUsername.id_users !== parseInt(id)) {
        return res.status(400).json({ message: "Username sudah digunakan oleh akun lain" });
      }
    }

    if (email_users && email_users !== user.email_users) {
      const existingEmail = await User.getUsersByEmail(email_users);
      if (existingEmail && existingEmail.id_users !== parseInt(id)) {
        return res.status(400).json({ message: "Email sudah digunakan oleh akun lain" });
      }
    }

    const hashedPassword = password_users && password_users.trim()
      ? await bcrypt.hash(password_users, 10)
      : undefined;

    let updatedRole = user.role;
    if (req.role === "super_admin" && role && allowedRoles.includes(role)) {
      updatedRole = role;
    }

    const data = {
      username_users: username_users !== undefined ? username_users : user.username_users,
      email_users: email_users !== undefined ? email_users : user.email_users,
      password_users: hashedPassword || user.password_users,
      telpon_users: telpon_users !== undefined ? telpon_users : user.telpon_users,
      address_users: address_users !== undefined ? address_users : user.address_users,
      role: updatedRole,
    };

    await User.updateUser(id, data);

    // Simpan avatar jika dikirim
    let savedAvatar = {};
    if (avatar_custom !== undefined || avatar_preset !== undefined) {
      savedAvatar = saveAvatarStore(id, { avatar_custom, avatar_preset }) || {};
    } else {
      savedAvatar = getAvatarsStore()[String(id)] || {};
    }

    res.status(200).json({
      status: "success",
      message: "Profil berhasil diperbarui",
      data: {
        id_users: parseInt(id),
        username_users: data.username_users,
        email_users: data.email_users,
        telpon_users: data.telpon_users,
        address_users: data.address_users,
        role: updatedRole,
        avatar_custom: savedAvatar.avatar_custom || "",
        avatar_preset: savedAvatar.avatar_preset || "from-blue-600 to-indigo-600",
      },
    });
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Controller untuk mendapatkan user berdasarkan ID
exports.getUserId = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.getUserById(id);
    if (!user)
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });

    const avatarData = getAvatarsStore()[String(id)] || {};

    res.status(200).json({
      ...user,
      avatar_custom: avatarData.avatar_custom || "",
      avatar_preset: avatarData.avatar_preset || "from-blue-600 to-indigo-600",
    });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Controller untuk menghapus user
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    // Cegah admin menghapus akunnya sendiri
    if (req.userId && parseInt(req.userId) === parseInt(id)) {
      return res.status(400).json({ message: "Anda tidak dapat menghapus akun Anda sendiri" });
    }

    const user = await User.getUserById(id);
    if (!user)
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });

    // Cegah menghapus Super Admin terakhir pada sistem
    if (user.role === "super_admin") {
      const stats = await User.countUsersByRole();
      if ((stats.super_admin || 0) <= 1) {
        return res.status(400).json({
          message: "Tidak dapat menghapus Super Admin terakhir pada sistem",
        });
      }
    }

    await User.deleteUser(id);
    res.status(200).json({ message: "User berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Controller untuk mendapatkan users dengan pagination & search & filter role
exports.getSearchPaginatedUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || null;
    const role = req.query.role || null;

    const users = await User.searchPaginatedUsers({
      search,
      role,
      limit,
      offset,
    });

    const avatars = getAvatarsStore();
    const enrichedUsers = users.map((u) => ({
      ...u,
      avatar_custom: avatars[String(u.id_users)]?.avatar_custom || "",
      avatar_preset: avatars[String(u.id_users)]?.avatar_preset || "from-blue-600 to-indigo-600",
    }));

    res.status(200).json({
      message: "User berhasil diambil",
      total: enrichedUsers.length,
      page,
      limit,
      data: enrichedUsers,
    });
  } catch (err) {
    console.error("Get Paginated Users Error:", err);
    res.status(500).json({ message: "Gagal mengambil data user" });
  }
};

// Controller untuk reset password user
exports.resetUserPasswordById = async (req, res) => {
  try {
    const { id } = req.params;
    const { password_users } = req.body;

    const hashedPassword = await bcrypt.hash(password_users, 10);
    const user = await User.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    await User.resetUserPassword(id, hashedPassword);
    res.status(200).json({ message: "Password berhasil direset" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Controller untuk statistik user berdasarkan role
exports.getUsersStats = async (req, res) => {
  try {
    const stats = await User.countUsersByRole();
    res.status(200).json(stats);
  } catch (err) {
    console.error("Get Users Stats Error:", err);
    res.status(500).json({ message: "Gagal mengambil data statistik user" });
  }
};

// Controller untuk reset password publik (Lupa Kata Sandi dari login)
exports.publicResetPassword = async (req, res) => {
  try {
    const { username_users, new_password, email_users } = req.body;
    const identifier = username_users || email_users;

    if (!identifier || !new_password) {
      return res.status(400).json({
        message: "Username/Email dan kata sandi baru wajib diisi",
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        message: "Kata sandi baru minimal 6 karakter",
      });
    }

    const user = await User.getUserByEmailOrUsername(identifier.trim());
    if (!user) {
      return res.status(404).json({
        message: "Akun dengan username atau email tersebut tidak ditemukan",
      });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await User.resetUserPassword(user.id_users, hashedPassword);

    res.status(200).json({
      status: "success",
      message: "Kata sandi berhasil diperbarui. Silakan login kembali.",
    });
  } catch (err) {
    console.error("Public Reset Password Error:", err);
    res.status(500).json({ message: "Gagal memperbarui kata sandi" });
  }
};
