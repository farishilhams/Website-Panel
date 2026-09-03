const supabase = require("../config/supabase");

// CREATE TIPS
exports.createTips = async (data) => {
  const { title, image, youtube, description } = data;
  const { data: inserted, error } = await supabase
    .from("tips")
    .insert([
      {
        title: title || "",
        image,
        youtube,
        description,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (createTips):", error);
    throw error;
  }
  return { insertId: inserted.id, ...inserted };
};

// GET SEARCH PAGINATED TIPS
exports.searchPaginatedTips = async (filters = {}) => {
  let query = supabase.from("tips").select("*");

  if (filters.title) {
    query = query.ilike("title", `%${filters.title}%`);
  }

  if (filters.description) {
    query = query.ilike("description", `%${filters.description}%`);
  }

  if (filters.youtube) {
    query = query.ilike("youtube", `%${filters.youtube}%`);
  }

  if (filters.start_date && filters.end_date) {
    query = query
      .gte("created_at", `${filters.start_date}T00:00:00.000Z`)
      .lte("created_at", `${filters.end_date}T23:59:59.999Z`);
  }

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,youtube.ilike.%${filters.search}%`
    );
  }

  query = query.order("created_at", { ascending: false });

  if (filters.limit !== undefined && filters.offset !== undefined) {
    const limit = parseInt(filters.limit, 10) || 10;
    const offset = parseInt(filters.offset, 10) || 0;
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Supabase Error (searchPaginatedTips):", error);
    throw error;
  }
  return data || [];
};

// GET TIPS BY ID
exports.getTipsById = async (id) => {
  const { data, error } = await supabase
    .from("tips")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase Error (getTipsById):", error);
    throw error;
  }
  return data;
};

// UPDATE TIPS
exports.updateTips = async (id, data) => {
  const { title, image, youtube, description } = data;
  const updatePayload = {};

  if (title !== undefined) updatePayload.title = title;
  if (image !== undefined) updatePayload.image = image;
  if (youtube !== undefined) updatePayload.youtube = youtube;
  if (description !== undefined) updatePayload.description = description;

  const { data: updated, error } = await supabase
    .from("tips")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (updateTips):", error);
    throw error;
  }
  return updated;
};

// DELETE TIPS
exports.deleteTips = async (id) => {
  const { data, error } = await supabase.from("tips").delete().eq("id", id);

  if (error) {
    console.error("Supabase Error (deleteTips):", error);
    throw error;
  }
  return data;
};
