const supabase = require("../config/supabase");

// CREATE INTERAKSI
exports.createInteraksi = async ({ id_reseller, id_reference }) => {
  const { data: inserted, error } = await supabase
    .from("interaksi")
    .insert([
      {
        id_reseller: parseInt(id_reseller, 10),
        id_reference: parseInt(id_reference, 10),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (createInteraksi):", error);
    throw error;
  }
  return { insertId: inserted.id_interaksi, ...inserted };
};

// GET SEARCH PAGINATED INTERAKSI
exports.searchPaginatedInteraksi = async (filters = {}) => {
  let query = supabase.from("interaksi").select("*");

  if (filters.id_reseller) {
    query = query.eq("id_reseller", parseInt(filters.id_reseller, 10));
  }

  if (filters.id_reference) {
    query = query.eq("id_reference", parseInt(filters.id_reference, 10));
  }

  query = query.order("created_at", { ascending: false });

  if (filters.limit !== undefined && filters.offset !== undefined) {
    const limit = parseInt(filters.limit, 10) || 10;
    const offset = parseInt(filters.offset, 10) || 0;
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Supabase Error (searchPaginatedInteraksi):", error);
    throw error;
  }

  const list = data || [];

  // Ambil data users untuk mapping nama reseller dan reference
  const userIds = [
    ...new Set(
      list.flatMap((i) => [i.id_reseller, i.id_reference]).filter(Boolean)
    ),
  ];

  let userMap = {};
  if (userIds.length > 0) {
    const { data: usersData } = await supabase
      .from("users")
      .select("id_users, username_users, telpon_users")
      .in("id_users", userIds);

    (usersData || []).forEach((u) => {
      userMap[u.id_users] = u;
    });
  }

  let formatted = list.map((item) => ({
    id_interaksi: item.id_interaksi,
    id_reseller: item.id_reseller,
    id_reference: item.id_reference,
    reseller_name: userMap[item.id_reseller]?.username_users || `Reseller #${item.id_reseller}`,
    reference_name: userMap[item.id_reference]?.username_users || `Agen #${item.id_reference}`,
    telepon_reseller: userMap[item.id_reseller]?.telpon_users || "",
    telepon_reference: userMap[item.id_reference]?.telpon_users || "",
    nama_reseller: userMap[item.id_reseller]?.username_users || `Reseller #${item.id_reseller}`,
    nama_reference: userMap[item.id_reference]?.username_users || `Agen #${item.id_reference}`,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));

  if (filters.search) {
    const s = filters.search.toLowerCase();
    formatted = formatted.filter(
      (item) =>
        item.reseller_name.toLowerCase().includes(s) ||
        item.reference_name.toLowerCase().includes(s) ||
        (item.telepon_reseller && item.telepon_reseller.includes(s)) ||
        (item.telepon_reference && item.telepon_reference.includes(s))
    );
  }

  return formatted;
};

// STATISTIK INTERAKSI
exports.countInteraksiStats = async () => {
  const { data, error } = await supabase
    .from("interaksi")
    .select("id_reseller, id_reference");

  if (error) {
    console.error("Supabase Error (countInteraksiStats):", error);
    throw error;
  }

  const list = data || [];
  const resellers = new Set(list.map((i) => i.id_reseller));
  const references = new Set(list.map((i) => i.id_reference));

  return {
    total_interaksi: list.length,
    total_reseller: resellers.size,
    total_reference: references.size,
  };
};
