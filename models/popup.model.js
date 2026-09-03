const supabase = require("../config/supabase");

// CREATE POPUP
exports.createPopup = async (data) => {
  const { title, deskripsi, image, status, link, type, display_day } = data;
  const { data: inserted, error } = await supabase
    .from("popup")
    .insert([
      {
        title,
        deskripsi,
        image,
        status: status ? String(status) : "0",
        link,
        type: type || "T",
        display_day: display_day || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (createPopup):", error);
    throw error;
  }
  return { insertId: inserted.id, ...inserted };
};

// GET SEARCH PAGINATED POPUP
exports.searchPaginatedPopup = async (filters = {}) => {
  let query = supabase.from("popup").select("*");

  if (filters.type) {
    query = query.eq("type", filters.type);
  }

  if (filters.status !== undefined && filters.status !== null && filters.status !== "") {
    query = query.eq("status", String(filters.status));
  }

  if (filters.display_day) {
    query = query.eq("display_day", filters.display_day);
  }

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,deskripsi.ilike.%${filters.search}%`
    );
  }

  query = query.order("created_at", { ascending: false });

  const limit = parseInt(filters.limit, 10) || 10;
  const offset = parseInt(filters.offset, 10) || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) {
    console.error("Supabase Error (searchPaginatedPopup):", error);
    throw error;
  }
  return data || [];
};

// GET POPUP BY ID
exports.getPopupById = async (id) => {
  const { data, error } = await supabase
    .from("popup")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase Error (getPopupById):", error);
    throw error;
  }
  return data;
};

// UPDATE POPUP
exports.updatePopup = async (id, data) => {
  const { title, deskripsi, image, status, link, type, display_day } = data;
  const updatePayload = {
    updated_at: new Date().toISOString(),
  };

  if (title !== undefined) updatePayload.title = title;
  if (deskripsi !== undefined) updatePayload.deskripsi = deskripsi;
  if (image !== undefined) updatePayload.image = image;
  if (status !== undefined) updatePayload.status = String(status);
  if (link !== undefined) updatePayload.link = link;
  if (type !== undefined) updatePayload.type = type;
  if (display_day !== undefined) updatePayload.display_day = display_day;

  const { data: updated, error } = await supabase
    .from("popup")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (updatePopup):", error);
    throw error;
  }
  return updated;
};

// DELETE POPUP
exports.deletePopup = async (id) => {
  const { data, error } = await supabase.from("popup").delete().eq("id", id);

  if (error) {
    console.error("Supabase Error (deletePopup):", error);
    throw error;
  }
  return data;
};

// TOGGLE POPUP STATUS
exports.togglePopupStatus = async (id, status) => {
  const { data, error } = await supabase
    .from("popup")
    .update({
      status: String(status),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (togglePopupStatus):", error);
    throw error;
  }
  return data;
};
