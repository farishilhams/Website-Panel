const supabase = require("../config/supabase");

// INSERT OR UPDATE REPORT
exports.insertOrUpdateReport = async ({ id_users, id_berita }) => {
  const { data: existing, error: findError } = await supabase
    .from("news_reports")
    .select("*")
    .eq("id_users", id_users)
    .eq("id_berita", id_berita)
    .maybeSingle();

  if (findError) {
    console.error("Supabase Error (insertOrUpdateReport - find):", findError);
    throw findError;
  }

  if (existing) {
    const { data: updated, error: updateError } = await supabase
      .from("news_reports")
      .update({ jumlah: (existing.jumlah || 1) + 1 })
      .eq("id", existing.id)
      .select()
      .single();

    if (updateError) throw updateError;
    return updated;
  } else {
    const { data: inserted, error: insertError } = await supabase
      .from("news_reports")
      .insert([
        {
          id_users,
          id_berita,
          jumlah: 1,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;
    return { insertId: inserted.id, ...inserted };
  }
};

// GET SEARCH PAGINATED NEWS REPORTS
exports.searchPaginatedNewsReports = async (filters = {}) => {
  let query = supabase.from("news_reports").select("*");

  if (filters.id_users) {
    query = query.eq("id_users", filters.id_users);
  }

  if (filters.id_berita) {
    query = query.eq("id_berita", filters.id_berita);
  }

  if (filters.min_views) {
    query = query.gte("jumlah", filters.min_views);
  }

  query = query.order("created_at", { ascending: false });

  if (filters.limit !== undefined && filters.offset !== undefined) {
    const limit = parseInt(filters.limit, 10) || 10;
    const offset = parseInt(filters.offset, 10) || 0;
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Supabase Error (searchPaginatedNewsReports):", error);
    throw error;
  }

  const list = data || [];
  const userIds = [...new Set(list.map((i) => i.id_users).filter(Boolean))];
  const newsIds = [...new Set(list.map((i) => i.id_berita).filter(Boolean))];

  let userMap = {};
  let newsMap = {};

  if (userIds.length > 0) {
    const { data: usersData } = await supabase
      .from("users")
      .select("id_users, username_users")
      .in("id_users", userIds);
    (usersData || []).forEach((u) => {
      userMap[u.id_users] = u;
    });
  }

  if (newsIds.length > 0) {
    const { data: newsData } = await supabase
      .from("news")
      .select("id, title")
      .in("id", newsIds);
    (newsData || []).forEach((n) => {
      newsMap[n.id] = n;
    });
  }

  let formatted = list.map((item) => ({
    id: item.id,
    id_users: item.id_users,
    username: userMap[item.id_users]?.username_users || `User #${item.id_users || ""}`,
    id_berita: item.id_berita,
    judul_berita: newsMap[item.id_berita]?.title || `Berita #${item.id_berita || ""}`,
    title: newsMap[item.id_berita]?.title || `Berita #${item.id_berita || ""}`,
    views: item.jumlah || 1,
    jumlah: item.jumlah || 1,
    created_at: item.created_at,
  }));

  if (filters.search) {
    const s = filters.search.toLowerCase();
    formatted = formatted.filter(
      (item) =>
        item.username.toLowerCase().includes(s) ||
        item.judul_berita.toLowerCase().includes(s)
    );
  }

  return formatted;
};

// GET NEWS REPORT BY ID
exports.getNewsReportById = async (id) => {
  const { data, error } = await supabase
    .from("news_reports")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase Error (getNewsReportById):", error);
    throw error;
  }

  if (!data) return null;

  let username = `User #${data.id_users || ""}`;
  let judul_berita = `Berita #${data.id_berita || ""}`;

  if (data.id_users) {
    const { data: u } = await supabase
      .from("users")
      .select("username_users")
      .eq("id_users", data.id_users)
      .maybeSingle();
    if (u) username = u.username_users;
  }

  if (data.id_berita) {
    const { data: n } = await supabase
      .from("news")
      .select("title")
      .eq("id", data.id_berita)
      .maybeSingle();
    if (n) judul_berita = n.title;
  }

  return {
    id: data.id,
    id_users: data.id_users,
    username,
    id_berita: data.id_berita,
    judul_berita,
    title: judul_berita,
    jumlah: data.jumlah,
    views: data.jumlah,
    created_at: data.created_at,
  };
};
