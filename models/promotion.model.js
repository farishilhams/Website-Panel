const supabase = require("../config/supabase");

// CREATE PROMOTION
exports.createPromotion = async (data) => {
  const { title, image, pdf, status } = data;
  const { data: inserted, error } = await supabase
    .from("promotion")
    .insert([
      {
        title,
        image,
        pdf,
        status: status !== undefined ? parseInt(status, 10) : 1,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (createPromotion):", error);
    throw error;
  }
  return { insertId: inserted.id, ...inserted };
};

// GET SEARCH PAGINATED PROMOTION
exports.searchPaginatedPromotion = async (filters = {}) => {
  let query = supabase.from("promotion").select("*");

  if (filters.status !== undefined && filters.status !== null && filters.status !== "") {
    query = query.eq("status", parseInt(filters.status, 10));
  }

  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  query = query.order("created_at", { ascending: false });

  const limit = parseInt(filters.limit, 10) || 10;
  const offset = parseInt(filters.offset, 10) || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) {
    console.error("Supabase Error (searchPaginatedPromotion):", error);
    throw error;
  }
  return data || [];
};

// GET PROMOTION BY ID
exports.getPromotionById = async (id) => {
  const { data, error } = await supabase
    .from("promotion")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase Error (getPromotionById):", error);
    throw error;
  }
  return data;
};

// UPDATE PROMOTION
exports.updatePromotion = async (id, data) => {
  const { title, image, pdf, status } = data;
  const updatePayload = {};

  if (title !== undefined) updatePayload.title = title;
  if (image !== undefined) updatePayload.image = image;
  if (pdf !== undefined) updatePayload.pdf = pdf;
  if (status !== undefined) updatePayload.status = parseInt(status, 10);

  const { data: updated, error } = await supabase
    .from("promotion")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (updatePromotion):", error);
    throw error;
  }
  return updated;
};

// DELETE PROMOTION
exports.deletePromotion = async (id) => {
  const { data, error } = await supabase.from("promotion").delete().eq("id", id);

  if (error) {
    console.error("Supabase Error (deletePromotion):", error);
    throw error;
  }
  return data;
};

// STATISTIK PROMOTION BERDASARKAN STATUS
exports.countPromotionByStatus = async () => {
  const { data, error } = await supabase.from("promotion").select("status");

  if (error) {
    console.error("Supabase Error (countPromotionByStatus):", error);
    throw error;
  }

  const list = data || [];
  return {
    total: list.length,
    Aktif: list.filter((item) => Number(item.status) === 1).length,
    NonAktif: list.filter((item) => Number(item.status) === 0).length,
  };
};
