const supabase = require("../config/supabase");

// CREATE KUESIONER
exports.createKuesioner = async (data) => {
  const {
    id_users,
    role,
    pesan,
    parent_id = null,
    is_admin_reply = false,
  } = data;

  const { data: inserted, error } = await supabase
    .from("kuesioner")
    .insert([
      {
        id_users: parseInt(id_users, 10),
        role,
        pesan,
        parent_id: parent_id ? parseInt(parent_id, 10) : null,
        is_admin_reply: is_admin_reply ? 1 : 0,
        status: "unanswered",
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (createKuesioner):", error);
    throw error;
  }
  return { insertId: inserted.id, ...inserted };
};

// GET KUESIONER BY ID
exports.getKuesionerById = async (id) => {
  const { data, error } = await supabase
    .from("kuesioner")
    .select(`
      *,
      users:id_users ( username_users )
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase Error (getKuesionerById):", error);
    throw error;
  }

  if (!data) return null;
  return {
    ...data,
    username_users: data.users?.username_users || "Unknown",
  };
};

// UPDATE STATUS JIKA DIJAWAB
exports.updateStatusToAnswered = async (parent_id) => {
  const { data, error } = await supabase
    .from("kuesioner")
    .update({ status: "answered" })
    .eq("id", parent_id)
    .select();

  if (error) {
    console.error("Supabase Error (updateStatusToAnswered):", error);
    throw error;
  }
  return data;
};

// UPDATE PESAN BY ID
exports.updatePesanById = async (id, pesan) => {
  const { data, error } = await supabase
    .from("kuesioner")
    .update({ pesan })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Supabase Error (updatePesanById):", error);
    throw error;
  }
  return data;
};

// DELETE KUESIONER
exports.deleteKuesioner = async (id) => {
  const { data, error } = await supabase
    .from("kuesioner")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Supabase Error (deleteKuesioner):", error);
    throw error;
  }
  return data;
};

// GET SEARCH PAGINATED KUESIONER
exports.getSearchPaginatedKuesioner = async (params = {}) => {
  const {
    limit,
    offset,
    search,
    role,
    status,
    is_admin_reply,
    start_date,
    end_date,
    sortBy = "created_at",
    sortOrder = "DESC",
  } = params;

  let query = supabase.from("kuesioner").select(
    `
      id,
      id_users,
      role,
      pesan,
      parent_id,
      is_admin_reply,
      status,
      created_at,
      users:id_users ( username_users )
    `,
    { count: "exact" }
  );

  if (role !== null && role !== undefined && role !== "") {
    query = query.eq("role", role);
  }

  if (status !== null && status !== undefined && status !== "") {
    query = query.eq("status", status);
  }

  if (is_admin_reply !== null && is_admin_reply !== undefined && is_admin_reply !== "") {
    query = query.eq("is_admin_reply", parseInt(is_admin_reply, 10));
  }

  if (start_date && end_date) {
    query = query
      .gte("created_at", `${start_date}T00:00:00.000Z`)
      .lte("created_at", `${end_date}T23:59:59.999Z`);
  } else if (start_date) {
    query = query.gte("created_at", `${start_date}T00:00:00.000Z`);
  } else if (end_date) {
    query = query.lte("created_at", `${end_date}T23:59:59.999Z`);
  }

  const isAsc = String(sortOrder).toUpperCase() === "ASC";
  const validSortField = ["id", "created_at", "status", "role"].includes(sortBy)
    ? sortBy
    : "created_at";
  query = query.order(validSortField, { ascending: isAsc });

  if (limit !== null && limit !== undefined) {
    const l = parseInt(limit, 10) || 10;
    const o = parseInt(offset, 10) || 0;
    query = query.range(o, o + l - 1);
  }

  const { data, count, error } = await query;
  if (error) {
    console.error("Supabase Error (getSearchPaginatedKuesioner):", error);
    throw error;
  }

  let formatted = (data || []).map((item) => ({
    id: item.id,
    id_users: item.id_users,
    username_users: item.users?.username_users || "Unknown",
    role: item.role,
    pesan: item.pesan,
    parent_id: item.parent_id,
    is_admin_reply: item.is_admin_reply,
    status: item.status,
    created_at: item.created_at,
  }));

  if (search) {
    const s = search.toLowerCase();
    formatted = formatted.filter(
      (item) =>
        item.pesan.toLowerCase().includes(s) ||
        item.username_users.toLowerCase().includes(s)
    );
  }

  return {
    data: formatted,
    total: count !== null ? count : formatted.length,
  };
};

// STATISTIK KUESIONER BY ROLE
exports.statistikKuesionerByRole = async () => {
  const { data, error } = await supabase.from("kuesioner").select("role");

  if (error) {
    console.error("Supabase Error (statistikKuesionerByRole):", error);
    throw error;
  }

  const counts = {};
  (data || []).forEach((row) => {
    counts[row.role] = (counts[row.role] || 0) + 1;
  });

  return Object.keys(counts).map((role) => ({
    role,
    jumlah: counts[role],
  }));
};

// GET DAILY STATS KUESIONER
exports.getDailyStats = async () => {
  const { data, error } = await supabase
    .from("kuesioner")
    .select("created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Error (getDailyStats):", error);
    throw error;
  }

  const daily = {};
  (data || []).forEach((row) => {
    if (row.created_at) {
      const date = row.created_at.substring(0, 10);
      daily[date] = (daily[date] || 0) + 1;
    }
  });

  return Object.keys(daily)
    .slice(0, 30)
    .map((tanggal) => ({
      tanggal,
      jumlah: daily[tanggal],
    }));
};
