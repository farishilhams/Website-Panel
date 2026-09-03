const supabase = require("../config/supabase");

// CREATE SLIDERS
exports.createSliders = async (data) => {
  const { title, link, image, status, jenis } = data;
  const { data: inserted, error } = await supabase
    .from("sliders")
    .insert([
      {
        title,
        link,
        image,
        status: status ? String(status) : "0",
        jenis: jenis || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (createSliders):", error);
    throw error;
  }
  return { insertId: inserted.id, ...inserted };
};

// GET SEARCH PAGINATED SLIDERS
exports.searchPaginatedSliders = async (filters = {}) => {
  let query = supabase.from("sliders").select("*");

  if (filters.status !== undefined && filters.status !== null && filters.status !== "") {
    query = query.eq("status", String(filters.status));
  }

  if (filters.jenis) {
    query = query.eq("jenis", filters.jenis);
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
    console.error("Supabase Error (searchPaginatedSliders):", error);
    throw error;
  }
  return data || [];
};

// GET SLIDERS BY ID
exports.getSlidersById = async (id) => {
  const { data, error } = await supabase
    .from("sliders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase Error (getSlidersById):", error);
    throw error;
  }
  return data;
};

// UPDATE SLIDERS
exports.updateSliders = async (id, data) => {
  const { title, link, image, status, jenis } = data;
  const updatePayload = {
    updated_at: new Date().toISOString(),
  };

  if (title !== undefined) updatePayload.title = title;
  if (link !== undefined) updatePayload.link = link;
  if (image !== undefined) updatePayload.image = image;
  if (status !== undefined) updatePayload.status = String(status);
  if (jenis !== undefined) updatePayload.jenis = jenis;

  const { data: updated, error } = await supabase
    .from("sliders")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (updateSliders):", error);
    throw error;
  }
  return updated;
};

// DELETE SLIDERS
exports.deleteSliders = async (id) => {
  const { data, error } = await supabase.from("sliders").delete().eq("id", id);

  if (error) {
    console.error("Supabase Error (deleteSliders):", error);
    throw error;
  }
  return data;
};
