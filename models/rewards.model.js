const supabase = require("../config/supabase");

// CREATE REWARDS
exports.createRewards = async (data) => {
  const { title, image, status, point, description, idhadiah, category } = data;
  const { data: inserted, error } = await supabase
    .from("rewards")
    .insert([
      {
        title,
        image,
        status: status ? String(status) : "0",
        point: point !== undefined ? String(point) : "0",
        description,
        idhadiah,
        category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (createRewards):", error);
    throw error;
  }
  return { insertId: inserted.id, ...inserted };
};

// GET REWARDS BY ID
exports.getRewardsById = async (id) => {
  const { data, error } = await supabase
    .from("rewards")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase Error (getRewardsById):", error);
    throw error;
  }
  return data;
};

// GET SEARCH PAGINATED REWARDS
exports.searchPaginatedRewards = async (filters = {}) => {
  let query = supabase.from("rewards").select("*");

  if (filters.status !== undefined && filters.status !== null && filters.status !== "") {
    query = query.eq("status", String(filters.status));
  }

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  if (filters.point) {
    query = query.eq("point", String(filters.point));
  }

  if (filters.idhadiah) {
    query = query.eq("idhadiah", filters.idhadiah);
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
    console.error("Supabase Error (searchPaginatedRewards):", error);
    throw error;
  }
  return data || [];
};

// UPDATE REWARDS
exports.updateRewards = async (id, data) => {
  const { title, image, status, point, description, idhadiah, category } = data;
  const updatePayload = {
    updated_at: new Date().toISOString(),
  };

  if (title !== undefined) updatePayload.title = title;
  if (image !== undefined) updatePayload.image = image;
  if (status !== undefined) updatePayload.status = String(status);
  if (point !== undefined) updatePayload.point = String(point);
  if (description !== undefined) updatePayload.description = description;
  if (idhadiah !== undefined) updatePayload.idhadiah = idhadiah;
  if (category !== undefined) updatePayload.category = category;

  const { data: updated, error } = await supabase
    .from("rewards")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (updateRewards):", error);
    throw error;
  }
  return updated;
};

// DELETE REWARDS
exports.deleteRewards = async (id) => {
  const { data, error } = await supabase.from("rewards").delete().eq("id", id);

  if (error) {
    console.error("Supabase Error (deleteRewards):", error);
    throw error;
  }
  return data;
};

// STATISTIK REWARDS BERDASARKAN STATUS
exports.countRewardsByStatus = async () => {
  const { data, error } = await supabase.from("rewards").select("status");

  if (error) {
    console.error("Supabase Error (countRewardsByStatus):", error);
    throw error;
  }

  const list = data || [];
  return {
    total: list.length,
    Aktif: list.filter((item) => String(item.status) === "1").length,
    NonAktif: list.filter((item) => String(item.status) === "0").length,
  };
};
