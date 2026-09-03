const supabase = require("../config/supabase");

// CREATE NEWS
exports.createNews = async (data) => {
  const { title, image, description, status, category_id, link, type } = data;
  const { data: inserted, error } = await supabase
    .from("news")
    .insert([
      {
        title,
        image,
        description,
        status: status ? String(status) : "0",
        category_id,
        link,
        type,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (createNews):", error);
    throw error;
  }
  return { insertId: inserted.id, ...inserted };
};

// GET SEARCH PAGINATED NEWS
exports.searchPaginatedNews = async (filters = {}) => {
  let query = supabase.from("news").select("*");

  if (filters.type) {
    query = query.eq("type", filters.type);
  }

  if (filters.status !== undefined && filters.status !== null && filters.status !== "") {
    query = query.eq("status", String(filters.status));
  }

  if (filters.category_id) {
    query = query.eq("category_id", filters.category_id);
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
    console.error("Supabase Error (searchPaginatedNews):", error);
    throw error;
  }
  return data || [];
};

// GET NEWS BY ID
exports.getNewsById = async (id) => {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase Error (getNewsById):", error);
    throw error;
  }
  return data;
};

// UPDATE NEWS
exports.updateNews = async (id, data) => {
  const { title, image, description, status, category_id, link, type } = data;
  const updatePayload = {
    updated_at: new Date().toISOString(),
  };

  if (title !== undefined) updatePayload.title = title;
  if (image !== undefined) updatePayload.image = image;
  if (description !== undefined) updatePayload.description = description;
  if (status !== undefined) updatePayload.status = String(status);
  if (category_id !== undefined) updatePayload.category_id = category_id;
  if (link !== undefined) updatePayload.link = link;
  if (type !== undefined) updatePayload.type = type;

  const { data: updated, error } = await supabase
    .from("news")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (updateNews):", error);
    throw error;
  }
  return updated;
};

// DELETE NEWS
exports.deleteNews = async (id) => {
  const { data, error } = await supabase.from("news").delete().eq("id", id);

  if (error) {
    console.error("Supabase Error (deleteNews):", error);
    throw error;
  }
  return data;
};

// STATISTIK NEWS BERDASARKAN STATUS
exports.countNewsByStatus = async () => {
  const { data, error } = await supabase.from("news").select("status");

  if (error) {
    console.error("Supabase Error (countNewsByStatus):", error);
    throw error;
  }

  const list = data || [];
  return {
    total: list.length,
    Aktif: list.filter((item) => String(item.status) === "1").length,
    NonAktif: list.filter((item) => String(item.status) === "0").length,
  };
};
