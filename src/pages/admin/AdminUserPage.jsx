import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api";
import Header from "../../components/admin/Header";
import ConfirmModal from "../../components/shared/ConfirmModal";
import {
  UserCog,
  Plus,
  Search,
  Edit2,
  Trash2,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Clock,
  X,
  Lock,
  Download,
  Eye,
  MapPin,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { exportToCSV } from "../../utils/exportUtils";

export default function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Detail Profile Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailUser, setDetailUser] = useState(null);

  // Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    telpon: "",
    address: "",
    role: "viewer",
  });
  const [editLoading, setEditLoading] = useState(false);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3500);
  };

  const getUserAvatarPreset = (user) => {
    if (!user) return "from-blue-600 to-indigo-600";
    return (
      localStorage.getItem(`mp_user_avatar_preset_${user.id_users}`) ||
      user.avatar_preset ||
      "from-blue-600 to-indigo-600"
    );
  };

  const getUserAvatarCustom = (user) => {
    if (!user) return "";
    return (
      localStorage.getItem(`mp_user_avatar_custom_${user.id_users}`) ||
      user.avatar_custom ||
      ""
    );
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, searchTerm]);

  // Real-time listen for profile updates from any role
  useEffect(() => {
    const handleProfileChange = () => {
      fetchUsers();
    };
    window.addEventListener("user-profile-updated", handleProfileChange);
    return () => window.removeEventListener("user-profile-updated", handleProfileChange);
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "8",
      });
      if (roleFilter) params.append("role", roleFilter);
      if (searchTerm) params.append("search", searchTerm);

      const res = await api.get(`/api/user?${params.toString()}`);
      const data = res.data?.data || [];
      setUsers(data);
      setTotalPages(Math.ceil((res.data?.total || data.length) / 8) || 1);
    } catch (err) {
      console.error("Fetch Users Error:", err);
      showToast("Gagal memuat data pengguna", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setEditFormData({
      username: user.username_users || "",
      email: user.email_users || "",
      telpon: user.telpon_users || "",
      address: user.address_users || "",
      role: user.role || "viewer",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      await api.put(`/api/user/update/${selectedUser.id_users}`, {
        username_users: editFormData.username,
        email_users: editFormData.email,
        telpon_users: editFormData.telpon,
        address_users: editFormData.address,
        role: editFormData.role,
      });

      showToast("Data pengguna berhasil diperbarui!");
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("Update User Error:", err);
      showToast(err.response?.data?.message || "Gagal memperbarui pengguna", "error");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/user/delete/${deleteTarget.id_users}`);
      showToast("Pengguna berhasil dihapus!");
      setDeleteModalOpen(false);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      console.error("Delete Error:", err);
      showToast(err.response?.data?.message || "Gagal menghapus pengguna", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "super_admin":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "content_admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "marketing":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "reseller":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <Header />

      {toast.show && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl text-white text-xs font-bold animate-fade-in ${
            toast.type === "error" ? "bg-rose-600" : "bg-emerald-600"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
              <UserCog className="text-slate-800" />
              <span>Manajemen Akun & Hak Akses</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Atur akun pengelola, admin konten, tim marketing, dan akun reseller
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => {
                exportToCSV(users, "daftar_pengguna_mpstore", [
                  { key: "id_users", label: "ID User" },
                  { key: "username_users", label: "Username" },
                  { key: "email_users", label: "Email" },
                  { key: "role", label: "Hak Akses (Role)" },
                  { key: "telpon_users", label: "No. HP" },
                  { key: "address_users", label: "Alamat" },
                  { key: "created_at", label: "Tanggal Dibuat" },
                ]);
                showToast("Data pengguna berhasil diekspor ke CSV!");
              }}
              className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Download size={15} />
              <span>Ekspor CSV</span>
            </button>

            <Link
              to="/admin/tambah-user"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>Tambah User Baru</span>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari username atau email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-800 transition"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-800 cursor-pointer"
          >
            <option value="">Semua Role</option>
            <option value="super_admin">Super Admin</option>
            <option value="content_admin">Content Admin</option>
            <option value="marketing">Marketing</option>
            <option value="reseller">Reseller</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        {/* Grid Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-56 bg-white rounded-3xl border border-slate-200 animate-shimmer"
              />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <UserCog size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Belum Ada Pengguna
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tidak ada akun yang sesuai dengan kriteria pencarian Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {users.map((u) => (
              <div
                key={u.id_users}
                className="group bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    {getUserAvatarCustom(u) ? (
                      <img
                        src={getUserAvatarCustom(u)}
                        alt={u.username_users}
                        className="w-11 h-11 rounded-2xl object-cover border-2 border-blue-500/40 shadow-sm shrink-0"
                      />
                    ) : (
                      <div
                        className={`w-11 h-11 rounded-2xl text-white font-black flex items-center justify-center text-sm shadow-sm shrink-0 bg-gradient-to-tr ${getUserAvatarPreset(
                          u
                        )}`}
                      >
                        {u.username_users?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getRoleBadge(
                        u.role
                      )}`}
                    >
                      {u.role?.replace("_", " ")}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-blue-600 transition truncate">
                      {u.username_users}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 truncate">
                      <Mail size={12} className="text-slate-400 shrink-0" />
                      <span>{u.email_users || "Tidak ada email"}</span>
                    </p>
                    {u.telpon_users && (
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 font-mono">
                        <Phone size={12} className="text-slate-400 shrink-0" />
                        <span>{u.telpon_users}</span>
                      </p>
                    )}
                    {u.address_users && (
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 truncate">
                        <MapPin size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">{u.address_users}</span>
                      </p>
                    )}
                    {u.updated_at && (
                      <p className="text-[10px] text-blue-600/80 font-medium mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 animate-pulse"></span>
                        <span>Diedit: {new Date(u.updated_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock size={11} />
                    ID #{u.id_users}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setDetailUser(u);
                        setDetailModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                      title="Lihat Detail Profil Pengguna"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(u)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                      title="Edit User"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteTarget(u);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Hapus User"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition"
            >
              Sebelumnya
            </button>
            <span className="text-xs text-slate-500 font-semibold px-2">
              Halaman {page} dari {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setIsEditModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 animate-fade-in">
            <div className="p-5 px-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <UserCog size={18} className="text-blue-400" />
                <span>Edit Data Pengguna</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.username}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      username: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No. Telepon / WA
                  </label>
                  <input
                    type="text"
                    value={editFormData.telpon}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        telpon: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Role Akses
                  </label>
                  <select
                    value={editFormData.role}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, role: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800 cursor-pointer"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="reseller">Reseller</option>
                    <option value="marketing">Marketing</option>
                    <option value="content_admin">Content Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat
                </label>
                <textarea
                  rows={2}
                  value={editFormData.address}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      address: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-800 transition resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
                >
                  {editLoading && (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Profile Modal — Superadmin View */}
      {detailModalOpen && detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 animate-scale-up">
            {/* Header with Avatar & Role */}
            <div className="relative p-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-4">
                {getUserAvatarCustom(detailUser) ? (
                  <img
                    src={getUserAvatarCustom(detailUser)}
                    alt={detailUser.username_users}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-lg shrink-0"
                  />
                ) : (
                  <div
                    className={`w-16 h-16 rounded-2xl font-black text-2xl flex items-center justify-center shadow-lg shrink-0 bg-gradient-to-tr ${getUserAvatarPreset(
                      detailUser
                    )}`}
                  >
                    {detailUser.username_users?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-1 bg-white/10 border border-white/20 text-white`}
                  >
                    {detailUser.role?.replace("_", " ")}
                  </span>
                  <h3 className="text-lg font-extrabold text-white leading-tight">
                    {detailUser.username_users}
                  </h3>
                  <p className="text-xs text-blue-200/80 font-mono mt-0.5">
                    User ID #{detailUser.id_users}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Fields Body */}
            <div className="p-6 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                <Mail size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Akun</p>
                  <p className="font-semibold text-slate-800 break-all">{detailUser.email_users || "—"}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                <Phone size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nomor Telepon / WhatsApp</p>
                  <p className="font-semibold text-slate-800 font-mono">{detailUser.telpon_users || "Belum diisi"}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                <MapPin size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Alamat Domisili</p>
                  <p className="font-semibold text-slate-800">{detailUser.address_users || "Belum diisi"}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                <Clock size={16} className="text-purple-600 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Terakhir Diperbarui</p>
                  <p className="font-semibold text-slate-800">
                    {detailUser.updated_at
                      ? new Date(detailUser.updated_at).toLocaleString("id-ID", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })
                      : "Belum pernah diperbarui"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  setDetailModalOpen(false);
                  handleOpenEdit(detailUser);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Edit2 size={13} />
                <span>Edit Akun Ini</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Akun Pengguna"
        message={`Apakah Anda yakin ingin menghapus akun user "${deleteTarget?.username_users}"?`}
        confirmText="Ya, Hapus"
        isLoading={deleteLoading}
      />
    </div>
  );
}