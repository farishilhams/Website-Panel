const supabase = require("../config/supabase");

// CREATE INTRO
exports.createIntro = async (data) => {
  const { title, image, description, isActive } = data;
  const { data: inserted, error } = await supabase
    .from("intro")
    .insert([
      {
        title,
        image,
        description,
        isActive: isActive || "N",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (createIntro):", error);
    throw error;
  }
  return { insertId: inserted.id, ...inserted };
};

// GET INTRO BY ID
exports.getIntroById = async (id) => {
  const { data, error } = await supabase
    .from("intro")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase Error (getIntroById):", error);
    throw error;
  }
  return data;
};

// UPDATE INTRO
exports.updateIntro = async (id, data) => {
  const { title, image, description, isActive } = data;
  const updatePayload = {
    updated_at: new Date().toISOString(),
  };

  if (title !== undefined) updatePayload.title = title;
  if (image !== undefined) updatePayload.image = image;
  if (description !== undefined) updatePayload.description = description;
  if (isActive !== undefined) updatePayload.isActive = isActive;

  const { data: updated, error } = await supabase
    .from("intro")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (updateIntro):", error);
    throw error;
  }
  return updated;
};

// DELETE INTRO
exports.deleteIntro = async (id) => {
  const { data, error } = await supabase.from("intro").delete().eq("id", id);

  if (error) {
    console.error("Supabase Error (deleteIntro):", error);
    throw error;
  }
  return data;
};

// GET SEARCH PAGINATED INTRO
exports.getSearchPaginatedIntro = async (params = {}) => {
  const {
    limit,
    offset,
    search,
    isActive,
    sortBy = "created_at",
    sortOrder = "DESC",
  } = params;

  let query = supabase.from("intro").select("*", { count: "exact" });

  if (isActive) {
    query = query.eq("isActive", isActive);
  }

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%`
    );
  }

  const isAsc = String(sortOrder).toUpperCase() === "ASC";
  const validSortField = ["id", "title", "isActive", "created_at"].includes(sortBy)
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
    console.error("Supabase Error (getSearchPaginatedIntro):", error);
    throw error;
  }

  return {
    data: data || [],
    total: count !== null ? count : (data || []).length,
  };
};

// STATISTIK INTRO BERDASARKAN IS_ACTIVE
exports.countIntroByIsActive = async () => {
  const { data, error } = await supabase.from("intro").select("isActive");

  if (error) {
    console.error("Supabase Error (countIntroByIsActive):", error);
    throw error;
  }

  const list = data || [];
  return {
    total: list.length,
    Aktif: list.filter((item) => item.isActive === "Y").length,
    NonAktif: list.filter((item) => item.isActive === "N").length,
  };
};
