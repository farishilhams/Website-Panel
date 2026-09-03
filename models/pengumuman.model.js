const supabase = require("../config/supabase");

// CREATE PENGUMUMAN
exports.createPengumuman = async ({ title, description, status }) => {
  const { data, error } = await supabase
    .from("pengumuman")
    .insert([
      {
        title,
        description,
        status: status ? String(status) : "0",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (createPengumuman):", error);
    throw error;
  }
  return { insertId: data.id, ...data };
};

// GET SEARCH PAGINATED PENGUMUMAN
exports.searchPaginatedPengumuman = async (filters = {}) => {
  let query = supabase.from("pengumuman").select("*");

  if (filters.status !== undefined && filters.status !== null && filters.status !== "") {
    query = query.eq("status", String(filters.status));
  }

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  query = query.order("created_at", { ascending: false });

  const limit = parseInt(filters.limit, 10) || 10;
  const offset = parseInt(filters.offset, 10) || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) {
    console.error("Supabase Error (searchPaginatedPengumuman):", error);
    throw error;
  }
  return data || [];
};

// GET PENGUMUMAN BY ID
exports.getPengumumanById = async (id) => {
  const { data, error } = await supabase
    .from("pengumuman")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase Error (getPengumumanById):", error);
    throw error;
  }
  return data;
};

// UPDATE PENGUMUMAN
exports.updatePengumuman = async (id, data) => {
  const { title, description, status } = data;
  const updatePayload = {
    updated_at: new Date().toISOString(),
  };

  if (title !== undefined) updatePayload.title = title;
  if (description !== undefined) updatePayload.description = description;
  if (status !== undefined) updatePayload.status = String(status);

  const { data: updated, error } = await supabase
    .from("pengumuman")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (updatePengumuman):", error);
    throw error;
  }
  return updated;
};

// DELETE PENGUMUMAN
exports.deletePengumuman = async (id) => {
  const { data, error } = await supabase.from("pengumuman").delete().eq("id", id);

  if (error) {
    console.error("Supabase Error (deletePengumuman):", error);
    throw error;
  }
  return data;
};

// STATISTIK PENGUMUMAN BERDASARKAN STATUS
exports.countPengumumanByStatus = async () => {
  const { data, error } = await supabase.from("pengumuman").select("status");

  if (error) {
    console.error("Supabase Error (countPengumumanByStatus):", error);
    throw error;
  }

  const list = data || [];
  return {
    total: list.length,
    Aktif: list.filter((item) => String(item.status) === "1").length,
    NonAktif: list.filter((item) => String(item.status) === "0").length,
  };
};
