const supabase = require("../config/supabase");

// CREATE USER
exports.createUser = async ({
  username_users,
  password_users,
  email_users,
  telpon_users,
  address_users,
  role,
}) => {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        username_users,
        password_users,
        email_users,
        telpon_users,
        address_users,
        role: role || "viewer",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (createUser):", error);
    throw error;
  }

  return { insertId: data.id_users, ...data };
};

// LOGIN - FIND BY EMAIL OR USERNAME
exports.getUserByEmailOrUsername = async (identifier) => {
  const cleanId = String(identifier || "").trim();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .or(`email_users.eq.${cleanId},username_users.eq.${cleanId}`)
    .maybeSingle();

  if (error) {
    console.error("Supabase Error (getUserByEmailOrUsername):", error);
    throw error;
  }
  return data;
};

// LOGIN - FIND BY EMAIL
exports.getUsersByEmail = async (email) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email_users", email)
    .maybeSingle();

  if (error) {
    console.error("Supabase Error (getUsersByEmail):", error);
    throw error;
  }
  return data;
};

// GET USER BY USERNAME
exports.getUsersByUsername = async (username) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username_users", username)
    .maybeSingle();

  if (error) {
    console.error("Supabase Error (getUsersByUsername):", error);
    throw error;
  }
  return data;
};

// GET USER BY ID
exports.getUserById = async (id) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id_users", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase Error (getUserById):", error);
    throw error;
  }
  return data;
};

// GET SEARCH PAGINATED USER
exports.searchPaginatedUsers = async (filters = {}) => {
  let query = supabase.from("users").select("*");

  if (filters.role) {
    query = query.eq("role", filters.role);
  }

  if (filters.search) {
    query = query.or(
      `username_users.ilike.%${filters.search}%,email_users.ilike.%${filters.search}%`
    );
  }

  query = query.order("created_at", { ascending: false });

  const limit = parseInt(filters.limit, 10) || 10;
  const offset = parseInt(filters.offset, 10) || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) {
    console.error("Supabase Error (searchPaginatedUsers):", error);
    throw error;
  }
  return data || [];
};

// UPDATE USER
exports.updateUser = async (id, data) => {
  const updatePayload = {
    ...data,
    updated_at: new Date().toISOString(),
  };

  const { data: updatedData, error } = await supabase
    .from("users")
    .update(updatePayload)
    .eq("id_users", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (updateUser):", error);
    throw error;
  }
  return updatedData;
};

// DELETE USER
exports.deleteUser = async (id) => {
  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("id_users", id);

  if (error) {
    console.error("Supabase Error (deleteUser):", error);
    throw error;
  }
  return data;
};

// RESET PASSWORD
exports.resetUserPassword = async (id_users, password_users) => {
  const { data, error } = await supabase
    .from("users")
    .update({
      password_users,
      updated_at: new Date().toISOString(),
    })
    .eq("id_users", id_users)
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (resetUserPassword):", error);
    throw error;
  }
  return data;
};

// STATISTIK USER BERDASARKAN ROLE
exports.countUsersByRole = async () => {
  const { data, error } = await supabase.from("users").select("role");

  if (error) {
    console.error("Supabase Error (countUsersByRole):", error);
    throw error;
  }

  const users = data || [];
  const stats = {
    total: users.length,
    super_admin: users.filter((u) => u.role === "super_admin").length,
    content_admin: users.filter((u) => u.role === "content_admin").length,
    marketing: users.filter((u) => u.role === "marketing").length,
    reseller: users.filter((u) => u.role === "reseller").length,
    viewer: users.filter((u) => u.role === "viewer").length,
  };

  return stats;
};
