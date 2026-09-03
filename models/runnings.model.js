const supabase = require("../config/supabase");

// CREATE RUNNINGS
exports.createRunnings = async (data) => {
  const { text } = data;
  const { data: inserted, error } = await supabase
    .from("runnings")
    .insert([
      {
        text,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (createRunnings):", error);
    throw error;
  }
  return { insertId: inserted.id, ...inserted };
};

// GET SEARCH PAGINATED RUNNINGS
exports.searchPaginatedRunnings = async (filters = {}) => {
  let query = supabase.from("runnings").select("*");

  if (filters.search) {
    query = query.ilike("text", `%${filters.search}%`);
  }

  query = query.order("created_at", { ascending: false });

  const limit = parseInt(filters.limit, 10) || 10;
  const offset = parseInt(filters.offset, 10) || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) {
    console.error("Supabase Error (searchPaginatedRunnings):", error);
    throw error;
  }
  return data || [];
};

// GET RUNNINGS BY ID
exports.getRunningsById = async (id) => {
  const { data, error } = await supabase
    .from("runnings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase Error (getRunningsById):", error);
    throw error;
  }
  return data;
};

// UPDATE RUNNINGS
exports.updateRunnings = async (id, data) => {
  const { text } = data;
  const updatePayload = {
    updated_at: new Date().toISOString(),
  };

  if (text !== undefined) updatePayload.text = text;

  const { data: updated, error } = await supabase
    .from("runnings")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (updateRunnings):", error);
    throw error;
  }
  return updated;
};

// DELETE RUNNINGS
exports.deleteRunnings = async (id) => {
  const { data, error } = await supabase.from("runnings").delete().eq("id", id);

  if (error) {
    console.error("Supabase Error (deleteRunnings):", error);
    throw error;
  }
  return data;
};
