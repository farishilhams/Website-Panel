const { body, param, query, validationResult } = require("express-validator");

//////////////////////////////
// MIDDLEWARE HANDLER
//////////////////////////////

// Middleware untuk menangani hasil validasi
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorArray = errors.array();
    const firstMsg = errorArray[0]?.msg || "Data yang dikirim tidak valid";
    return res.status(400).json({
      status: "fail",
      message: firstMsg,
      errors: errorArray,
    });
  }
  next();
};

//////////////////////////////
//  USER VALIDATION
//////////////////////////////

// Validasi input untuk registrasi user
exports.validateUserRegister = [
  body("username_users").notEmpty().withMessage("Username tidak boleh kosong"),
  body("email_users").isEmail().withMessage("Email tidak valid"),
  body("password_users")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
  body("telpon_users")
    .optional()
    .isMobilePhone()
    .withMessage("No. HP tidak valid"),
  body("address_users").optional().isString().withMessage("Alamat tidak valid"),
  handleValidation,
];

// Validasi input untuk login user (bisa username atau email)
exports.validateUserLogin = [
  body("email_users").notEmpty().withMessage("Username atau Email tidak boleh kosong"),
  body("password_users").notEmpty().withMessage("Password tidak boleh kosong"),
  handleValidation,
];

// Validasi input untuk update user
exports.validateUpdateUser = [
  body("username_users")
    .optional()
    .notEmpty()
    .withMessage("Username tidak boleh kosong"),
  body("email_users").optional().isEmail().withMessage("Email tidak valid"),
  body("password_users")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
  body("telpon_users")
    .optional()
    .isMobilePhone()
    .withMessage("No. HP tidak valid"),
  body("address_users").optional().isString().withMessage("Alamat tidak valid"),
  handleValidation,
];

// Validasi input untuk reset password
exports.validateResetPassword = [
  body("password_users")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
  handleValidation,
];

// Validasi query parameter saat mengambil data user (pagination, filter, search)
exports.validateUsersQueryFilters = [
  // Pagination
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page harus berupa bilangan bulat positif >= 1"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit harus berupa bilangan bulat positif >= 1"),

  // Filter by role
  query("role")
    .optional()
    .isString()
    .trim()
    .isIn(["super_admin", "content_admin", "reseller", "marketing", "viewer"])
    .withMessage(
      "role harus berupa 'super_admin', 'content_admin', 'reseller', 'marketing', atau 'viewer'"
    ),

  // Keyword search
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("search tidak boleh kosong jika diisi"),

  handleValidation,
];

//////////////////////////////
//  PENGUMUMAN VALIDATION
//////////////////////////////

// Validasi Membuat Pengumuman dan Mengupdate Pengumuman
exports.validateCreateOrUpdatePengumuman = [
  body("title").notEmpty().withMessage("Judul tidak boleh kosong"),
  body("description").notEmpty().withMessage("Deskripsi tidak boleh kosong"),
  body("status").isIn(["1", "0"]).withMessage("Status harus '1' atau '0'"),
  handleValidation,
];

// Validasi query parameter saat mengambil data pengumuman (pagination, filter, search)
exports.validatePengumumanQueryFilters = [
  // Pagination
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page harus berupa bilangan bulat positif >= 1"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit harus berupa bilangan bulat positif >= 1"),

  // Filter status
  query("status")
    .optional()
    .isIn(["0", "1"])
    .withMessage("status hanya boleh bernilai '0' atau '1'"),

  // Keyword search
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("search tidak boleh kosong jika diisi"),

  handleValidation,
];

//////////////////////////////
//  NEWS VALIDATION
//////////////////////////////

// Validasi Membuat News dan Mengupdate News
exports.validateCreateOrUpdateNews = [
  body("title").notEmpty().withMessage("Judul wajib diisi"),
  body("description").notEmpty().withMessage("Deskripsi wajib diisi"),
  body("status")
    .isIn(["1", "0"])
    .withMessage("Status harus berupa '1' atau '0'"),
  body("category_id").optional().isString(),
  body("link").optional().isURL().withMessage("Link harus berupa URL valid"),
  body("type").optional().isString(),
  handleValidation,
];

// Validasi input gambar news
exports.validateImageNews = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "Gambar tidak boleh kosong",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  // Validasi tipe file
  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "File yang diupload harus berupa gambar",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  next();
};

// Validasi input gambar news (opsional untuk update)
exports.validateImageNewsOptional = (req, res, next) => {
  if (!req.file) return next(); // Tidak ada file, lanjut saja

  // Validasi tipe file
  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "File yang diupload harus berupa gambar",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  next();
};

// Validasi query parameter saat mengambil data news (pagination, filter, search)
exports.validateNewsQueryFilters = [
  // Pagination
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page harus bilangan bulat >= 1"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit harus bilangan bulat >= 1"),

  // Filter by category_id
  query("category_id")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("category_id harus berupa string"),

  // Filter by type
  query("type")
    .optional()
    .isLength({ min: 1 })
    .withMessage("type harus berupa string"),

  // Filter by status
  query("status")
    .optional()
    .isIn(["0", "1"])
    .withMessage("status hanya boleh 0 atau 1"),

  // Keyword search
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("search tidak boleh kosong jika diisi"),

  handleValidation,
];

//////////////////////////////
//  REWARDS VALIDATION
//////////////////////////////

// Validasi Membuat Rewards
exports.validateCreateRewards = [
  body("title").notEmpty().withMessage("Judul reward tidak boleh kosong"),
  body("description")
    .notEmpty()
    .withMessage("Deskripsi reward tidak boleh kosong"),
  body("status")
    .notEmpty()
    .withMessage("Status tidak boleh kosong")
    .isIn(["1", "0"])
    .withMessage("Status harus berupa '1' atau '0'"),
  body("point")
    .notEmpty()
    .withMessage("Point reward wajib diisi")
    .isNumeric()
    .withMessage("Point harus berupa angka"),
  body("idhadiah").optional().isString(),
  body("category")
    .notEmpty()
    .withMessage("Kategori tidak boleh kosong")
    .isIn(["F", "D"])
    .withMessage("Kategori harus berupa 'F' (Fisik) atau 'D' (Digital)"),
  handleValidation,
];

// Validasi untuk update rewards
exports.validateUpdateRewards = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Judul reward tidak boleh kosong jika diisi"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Deskripsi reward tidak boleh kosong jika diisi"),
  body("status")
    .optional()
    .isIn(["1", "0"])
    .withMessage("Status harus berupa '1' atau '0'"),
  body("point").optional().isNumeric().withMessage("Point harus berupa angka"),
  body("idhadiah").optional().isString(),
  body("category")
    .optional()
    .isIn(["F", "D"])
    .withMessage("Kategori harus 'F' atau 'D'"),
  handleValidation,
];

// Validasi input gambar reward
exports.validateImageReward = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "Gambar tidak boleh kosong",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  // Validasi tipe file
  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "File yang diupload harus berupa gambar",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  next();
};

// Validasi input gambar rewards (opsional untuk update)
exports.validateImageRewardsOptional = (req, res, next) => {
  if (!req.file) return next();

  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "File yang diupload harus berupa gambar",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  next();
};

// Validasi query parameter saat mengambil data reward (pagination, filter, search)
exports.validateRewardQueryFilters = [
  // Pagination
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page harus bilangan bulat >= 1"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit harus bilangan bulat >= 1"),

  // Filter by category
  query("category")
    .optional()
    .isIn(["F", "D"])
    .withMessage("Kategori harus berupa 'F' (Fisik) atau 'D' (Digital)"),

  // Filter by point
  query("point").optional().isNumeric().withMessage("Point harus berupa angka"),

  // Filter by idhadiah
  query("idhadiah")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("idhadiah harus berupa string"),

  // Filter by status
  query("status")
    .optional()
    .isIn(["0", "1"])
    .withMessage("status hanya boleh 0 atau 1"),

  // Keyword search
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("search tidak boleh kosong jika diisi"),

  handleValidation,
];

//////////////////////////////
//  PROMOTION VALIDATION
//////////////////////////////

// Validasi Membuat Promotion (mirip validateCreateRewards)
exports.validateCreatePromotion = [
  body("title").notEmpty().withMessage("Judul tidak boleh kosong"),
  body("pdf")
    .notEmpty()
    .withMessage("Link PDF tidak boleh kosong")
    .isURL()
    .withMessage("Link PDF harus berupa URL yang valid"),
  body("status")
    .notEmpty()
    .withMessage("Status tidak boleh kosong")
    .isIn(["1", "0"])
    .withMessage("Status harus berupa '1' (Aktif) atau '0' (Nonaktif)"),
  handleValidation,
];

// Validasi untuk update promotion (opsional field)
exports.validateUpdatePromotion = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Judul tidak boleh kosong jika diisi"),
  body("pdf")
    .optional()
    .isURL()
    .withMessage("Link PDF harus berupa URL yang valid"),
  body("status")
    .optional()
    .isIn(["1", "0"])
    .withMessage("Status harus berupa '1' (Aktif) atau '0' (Nonaktif)"),
  handleValidation,
];

// Validasi input gambar promotion (wajib untuk create)
exports.validateImagePromotion = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "Gambar tidak boleh kosong",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  // Validasi tipe file
  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "File yang diupload harus berupa gambar",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  next();
};

// Validasi input gambar promotion (opsional untuk update)
exports.validateImagePromotionOptional = (req, res, next) => {
  if (!req.file) return next(); // Tidak ada file, lanjut saja

  // Validasi tipe file
  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "File yang diupload harus berupa gambar",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  next();
};

// Validasi query parameter saat mengambil data promotion (pagination, filter, search)
exports.validatePromotionQueryFilters = [
  // Pagination
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page harus bilangan bulat >= 1"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit harus bilangan bulat >= 1"),

  // Filter by status
  query("status")
    .optional()
    .isIn(["0", "1"])
    .withMessage("Status hanya boleh '0' atau '1'"),

  // Keyword search
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Search tidak boleh kosong jika diisi"),

  handleValidation,
];

//////////////////////////////
//  SLIDERS VALIDATION
//////////////////////////////

// Validasi Membuat Sliders
exports.validateCreateSliders = [
  body("title").notEmpty().withMessage("Judul tidak boleh kosong"),
  body("link")
    .notEmpty()
    .withMessage("Link tidak boleh kosong")
    .isURL()
    .withMessage("Link harus berupa URL yang valid"),
  body("status")
    .notEmpty()
    .withMessage("Status tidak boleh kosong")
    .isIn(["1", "0"])
    .withMessage("Status harus berupa '1' (Aktif) atau '0' (Nonaktif)"),
  body("jenis").notEmpty().withMessage("Jenis tidak boleh kosong"),
  handleValidation,
];

// Validasi untuk update sliders
exports.validateUpdateSliders = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Judul tidak boleh kosong jika diisi"),
  body("link")
    .optional()
    .isURL()
    .withMessage("Link harus berupa URL yang valid"),
  body("status")
    .optional()
    .isIn(["1", "0"])
    .withMessage("Status harus berupa '1' (Aktif) atau '0' (Nonaktif)"),
  body("jenis").optional().isString().withMessage("Jenis harus berupa string"),
  handleValidation,
];

// Validasi input gambar sliders (wajib untuk create)
exports.validateImageSliders = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "Gambar tidak boleh kosong",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  // Validasi tipe file
  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "File yang diupload harus berupa gambar",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  next();
};

// Validasi input gambar sliders (opsional untuk update)
exports.validateImageSlidersOptional = (req, res, next) => {
  if (!req.file) return next(); // Tidak ada file, lanjut saja

  // Validasi tipe file
  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "File yang diupload harus berupa gambar",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  next();
};

// Validasi query parameter saat mengambil data sliders (pagination, filter, search)
exports.validateSlidersQueryFilters = [
  // Pagination
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page harus berupa bilangan bulat positif >= 1"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit harus berupa bilangan bulat positif >= 1"),

  // Filter status
  query("status")
    .optional()
    .isIn(["0", "1"])
    .withMessage("status hanya boleh bernilai '0' atau '1'"),

  // Filter jenis
  query("jenis")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("jenis harus berupa string"),

  // Keyword search
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("search tidak boleh kosong jika diisi"),

  handleValidation,
];

//////////////////////////////
//  INTERAKSI VALIDATION
//////////////////////////////

// Validasi untuk membuat interaksi
exports.validateCreateInteraksi = [
  body("id_reference")
    .notEmpty()
    .withMessage("ID Reference harus diisi")
    .isInt({ min: 1 })
    .withMessage("ID Reference harus berupa bilangan bulat positif"),

  handleValidation,
];

// Validasi query parameter saat mengambil data interaksi (pagination, filter, search)
exports.validateInteraksiQueryFilters = [
  // Pagination
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page harus berupa bilangan bulat positif >= 1"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit harus berupa bilangan bulat positif >= 1"),

  // Filter by reseller ID
  query("id_reseller")
    .optional()
    .isInt({ min: 1 })
    .withMessage("id_reseller harus berupa bilangan bulat positif"),

  // Filter by reference ID
  query("id_reference")
    .optional()
    .isInt({ min: 1 })
    .withMessage("id_reference harus berupa bilangan bulat positif"),

  // Keyword search (untuk nama reseller atau reference)
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("search tidak boleh kosong jika diisi"),

  handleValidation,
];

//////////////////////////////
//  INTRO VALIDATION
//////////////////////////////

// Validasi Membuat Intro (pisah create / update seperti tips)
exports.validateCreateIntro = [
  body("title").notEmpty().withMessage("Judul tidak boleh kosong"),
  body("description").notEmpty().withMessage("Deskripsi tidak boleh kosong"),
  body("isActive")
    .notEmpty()
    .withMessage("isActive tidak boleh kosong")
    .isIn(["Y", "N"])
    .withMessage("Status aktif harus berupa 'Y' atau 'N'"),
  handleValidation,
];

// Validasi untuk update intro (opsional field)
exports.validateUpdateIntro = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Judul tidak boleh kosong jika diisi"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Deskripsi tidak boleh kosong jika diisi"),
  body("isActive")
    .optional()
    .isIn(["Y", "N"])
    .withMessage("isActive harus berupa 'Y' atau 'N'"),
  handleValidation,
];

// Validasi input gambar intro (wajib untuk create)
exports.validateImageIntro = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "Gambar tidak boleh kosong",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  // Validasi tipe file
  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "File yang diupload harus berupa gambar",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  next();
};

// Validasi input gambar intro (opsional untuk update)
exports.validateImageIntroOptional = (req, res, next) => {
  if (!req.file) return next();

  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "File yang diupload harus berupa gambar",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  next();
};

// Validasi query parameter saat mengambil data intro (pagination, filter, search)
exports.validateIntroQueryFilters = [
  // Pagination
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page harus bilangan bulat >= 1"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit harus bilangan bulat antara 1-100"),

  // Filter status
  query("isActive")
    .optional()
    .isIn(["Y", "N"])
    .withMessage("isActive hanya boleh bernilai 'Y' atau 'N'"),

  // Sort parameters
  query("sortBy")
    .optional()
    .isIn(["id", "title", "isActive", "created_at", "updated_at"])
    .withMessage(
      "sortBy harus salah satu dari: id, title, isActive, created_at, updated_at"
    ),

  query("sortOrder")
    .optional()
    .isIn(["ASC", "DESC"])
    .withMessage("sortOrder harus 'ASC' atau 'DESC'"),

  // Keyword search
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("search tidak boleh kosong jika diisi"),

  handleValidation,
];

//////////////////////////////
//  KUESIONER VALIDATION
//////////////////////////////

// Validasi membuat kuesioner
exports.validateCreateKuesioner = [
  body("pesan").notEmpty().withMessage("Pesan tidak boleh kosong"),
  body("parent_id")
    .optional()
    .isNumeric()
    .withMessage("Parent ID harus berupa angka"),
  body("is_admin_reply")
    .optional()
    .isBoolean()
    .withMessage("is_admin_reply harus berupa boolean"),
  handleValidation,
];

// Validasi balasan kuesioner
exports.validateReplyKuesioner = [
  body("pesan").notEmpty().withMessage("Pesan balasan tidak boleh kosong"),
  param("parent_id")
    .notEmpty()
    .isNumeric()
    .withMessage("Parent ID harus berupa angka"),
  handleValidation,
];

// Validasi untuk mengupdate kuesioner
exports.validateUpdateKuesioner = [
  body("pesan").notEmpty().withMessage("Pesan tidak boleh kosong"),
  handleValidation,
];

// Validasi query parameter saat mengambil data kuesioner (pagination, filter, search)
exports.validateKuesionerQueryFilters = [
  // Pagination
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page harus berupa bilangan bulat positif >= 1"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit harus berupa bilangan bulat antara 1-100"),

  // Filter by role
  query("role")
    .optional()
    .isIn(["super_admin", "content_admin", "marketing", "reseller", "viewer"])
    .withMessage(
      "role harus salah satu dari: super_admin, content_admin, marketing, reseller, viewer"
    ),

  // Filter by status
  query("status")
    .optional()
    .isIn(["unanswered", "answered"])
    .withMessage("status harus 'unanswered' atau 'answered'"),

  // Filter by is_admin_reply
  query("is_admin_reply")
    .optional()
    .isIn(["true", "false", "1", "0"])
    .withMessage("is_admin_reply harus 'true', 'false', '1', atau '0'"),

  // Date range filters
  query("start_date")
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("start_date harus berformat YYYY-MM-DD"),

  query("end_date")
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("end_date harus berformat YYYY-MM-DD"),

  // Sort parameters
  query("sortBy")
    .optional()
    .isIn(["id", "pesan", "role", "status", "is_admin_reply", "created_at"])
    .withMessage(
      "sortBy harus salah satu dari: id, pesan, role, status, is_admin_reply, created_at"
    ),

  query("sortOrder")
    .optional()
    .isIn(["ASC", "DESC"])
    .withMessage("sortOrder harus 'ASC' atau 'DESC'"),

  // Keyword search
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("search tidak boleh kosong jika diisi"),

  // Custom validation untuk memastikan start_date <= end_date
  query("start_date").custom((value, { req }) => {
    if (value && req.query.end_date) {
      if (new Date(value) > new Date(req.query.end_date)) {
        throw new Error("start_date tidak boleh lebih besar dari end_date");
      }
    }
    return true;
  }),

  handleValidation,
];

//////////////////////////////
//  MPOINT VALIDATION
//////////////////////////////

// Validasi untuk membuat Mpoint dan mengupdate Mpoint
exports.validateCreateOrUpdateMpoint = [
  body("nama_toko").notEmpty().withMessage("Nama toko tidak boleh kosong"),
  body("alamat").notEmpty().withMessage("Alamat tidak boleh kosong"),
  body("status")
    .isIn(["1", "0"])
    .withMessage("Status harus berupa '1' (Aktif) atau '0' (Nonaktif)"),
  body("latitude")
    .optional()
    .isFloat()
    .withMessage("Latitude harus berupa angka desimal"),
  body("longitude")
    .optional()
    .isFloat()
    .withMessage("Longitude harus berupa angka desimal"),
  body("telp")
    .optional()
    .isMobilePhone()
    .withMessage("Nomor telepon tidak valid"),
  body("tipe_toko")
    .optional()
    .isString()
    .withMessage("Tipe toko harus berupa string"),
  body("jam_buka")
    .optional()
    .isString()
    .withMessage("Jam buka harus berupa string"),
  handleValidation,
];

// Validasi query parameter saat mengambil data Mpoint (pagination, filter, search)
exports.validateMpointQueryFilters = [
  // Pagination
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page harus berupa bilangan bulat positif >= 1"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit harus berupa bilangan bulat positif"),

  // Filter by status
  query("status")
    .optional()
    .isIn(["0", "1"])
    .withMessage("status harus '0' (Nonaktif) atau '1' (Aktif)"),

  // Filter by tipe_toko
  query("tipe_toko")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("tipe_toko harus berupa string"),

  // Filter by created_by
  query("created_by")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("created_by harus berupa string"),

  // Date range filters
  query("start_date")
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("start_date harus berformat YYYY-MM-DD"),

  query("end_date")
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("end_date harus berformat YYYY-MM-DD"),

  // Keyword search
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("search tidak boleh kosong jika diisi"),

  // Custom validation untuk memastikan start_date <= end_date
  query("start_date").custom((value, { req }) => {
    if (value && req.query.end_date) {
      if (new Date(value) > new Date(req.query.end_date)) {
        throw new Error("start_date tidak boleh lebih besar dari end_date");
      }
    }
    return true;
  }),

  handleValidation,
];

//////////////////////////////
//  NEWS REPORTS VALIDATION
//////////////////////////////

// Validasi untuk menghitung views berita
exports.validateTrackNewsViews = [
  param("id_berita")
    .notEmpty()
    .isNumeric()
    .withMessage("ID berita harus berupa angka"),
  handleValidation,
];

// Validasi query parameter saat mengambil data berita (pagination, filter, search)
exports.validateNewsReportsQueryFilters = [
  // Pagination
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page harus berupa bilangan bulat positif >= 1"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit harus berupa bilangan bulat positif >= 1"),

  // Keyword search
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("search tidak boleh kosong jika diisi"),

  // id_users
  query("id_users")
    .optional()
    .isInt({ min: 1 })
    .withMessage("id_users harus berupa bilangan bulat positif"),

  // id_berita
  query("id_berita")
    .optional()
    .isInt({ min: 1 })
    .withMessage("id_berita harus berupa bilangan bulat positif"),

  // min_views
  query("min_views")
    .optional()
    .isInt({ min: 0 })
    .withMessage("min_views harus berupa bilangan bulat >= 0"),

  handleValidation,
];

//////////////////////////////
//  POPUP VALIDATION
//////////////////////////////

// Validasi untuk membuat popup
exports.validateCreatePopup = [
  body("title").notEmpty().withMessage("Judul tidak boleh kosong"),
  body("deskripsi").notEmpty().withMessage("Deskripsi tidak boleh kosong"),
  body("status")
    .isIn(["1", "0"])
    .withMessage("Status harus berupa '1' (Aktif) atau '0' (Nonaktif)"),
  body("link")
    .notEmpty()
    .withMessage("Link tidak boleh kosong")
    .isURL()
    .withMessage("Link harus berupa URL yang valid"),
  body("type").notEmpty().withMessage("Type tidak boleh kosong"),
  body("display_day").notEmpty().withMessage("Display day tidak boleh kosong"),
  handleValidation,
];

// Validasi untuk update popup
exports.validateUpdatePopup = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Judul tidak boleh kosong jika diisi"),
  body("deskripsi")
    .optional()
    .notEmpty()
    .withMessage("Deskripsi tidak boleh kosong jika diisi"),
  body("status")
    .optional()
    .isIn(["1", "0"])
    .withMessage("Status harus berupa '1' (Aktif) atau '0' (Nonaktif)"),
  body("link")
    .optional()
    .isURL()
    .withMessage("Link harus berupa URL yang valid"),
  body("type").optional().isString().withMessage("Type harus berupa string"),
  body("display_day")
    .optional()
    .isString()
    .withMessage("Display day harus berupa string"),
  handleValidation,
];

// Validasi input gambar news
exports.validateImagePopup = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "Gambar tidak boleh kosong",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  // Validasi tipe file
  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "File yang diupload harus berupa gambar",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  next();
};

// Validasi input gambar news (opsional untuk update)
exports.validateImagePopupOptional = (req, res, next) => {
  if (!req.file) return next(); // Tidak ada file, lanjut saja

  // Validasi tipe file
  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "File yang diupload harus berupa gambar",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  next();
};

// Validasi query parameter saat mengambil data popup (pagination, filter, search)
exports.validatePopupQueryFilters = [
  // Pagination
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page harus berupa bilangan bulat positif >= 1"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit harus berupa bilangan bulat positif >= 1"),

  // Filter status
  query("status")
    .optional()
    .isIn(["0", "1"])
    .withMessage("status hanya boleh bernilai '0' atau '1'"),

  // Filter type
  query("type")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("type harus berupa string"),

  // Filter display_day
  query("display_day")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("display_day harus berupa string"),

  // Keyword search
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("search tidak boleh kosong jika diisi"),

  handleValidation,
];

// Validasi untuk mengubah status popup
exports.validateTogglePopupStatus = [
  body("status")
    .isIn(["1", "0"])
    .withMessage("Status harus berupa '1' atau '0'"),
  handleValidation,
];

//////////////////////////////
//  RUNNINGS VALIDATION
//////////////////////////////

// Validasi untuk membuat atau mengupdate runnings
exports.validateCreateOrUpdateRunnings = [
  body("text").notEmpty().withMessage("Text tidak boleh kosong"),
  handleValidation,
];

// Validasi query parameter saat mengambil data runnings (pagination, filter, search)
exports.validateRunningsQueryFilters = [
  // Pagination
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page harus berupa bilangan bulat positif >= 1"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit harus berupa bilangan bulat positif >= 1"),

  // Keyword search
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("search tidak boleh kosong jika diisi"),

  handleValidation,
];

//////////////////////////////
//  TIPS VALIDATION
//////////////////////////////

// Validasi Membuat Tips (mirip struktur promotion)
exports.validateCreateTips = [
  body("title").notEmpty().withMessage("Judul tidak boleh kosong"),
  body("youtube")
    .optional()
    .isURL()
    .withMessage("Link YouTube harus berupa URL yang valid"),
  body("description").notEmpty().withMessage("Deskripsi tidak boleh kosong"),
  handleValidation,
];

// Validasi untuk update tips (opsional field)
exports.validateUpdateTips = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Judul tidak boleh kosong jika diisi"),
  body("youtube")
    .optional()
    .isURL()
    .withMessage("Link YouTube harus berupa URL yang valid"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Deskripsi tidak boleh kosong jika diisi"),
  handleValidation,
];

// Validasi input gambar tips (wajib untuk create)
exports.validateImageTips = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "Gambar tidak boleh kosong",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "File yang diupload harus berupa gambar",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  next();
};

// Validasi input gambar tips (opsional untuk update)
exports.validateImageTipsOptional = (req, res, next) => {
  if (!req.file) return next();

  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({
      errors: [
        {
          type: "field",
          msg: "File yang diupload harus berupa gambar",
          path: "image",
          location: "file",
        },
      ],
    });
  }

  next();
};

// Validasi query parameter saat mengambil data tips (pagination, filter, search)
exports.validateTipsQueryFilters = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page harus bilangan bulat >= 1"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit harus bilangan bulat >= 1"),
  query("title")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title harus berupa string jika diisi"),
  query("description")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Description harus berupa string jika diisi"),
  query("youtube")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Youtube harus berupa string jika diisi"),
  query("start_date")
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("start_date harus berformat YYYY-MM-DD"),
  query("end_date")
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("end_date harus berformat YYYY-MM-DD"),
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Search tidak boleh kosong jika diisi"),
  handleValidation,
];

//////////////////////////////
// EXPORT DEFAULT HANDLER
//////////////////////////////

// Middleware untuk menangani hasil validasi
exports.handleValidation = handleValidation;
