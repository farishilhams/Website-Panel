const supabase = require("../config/supabase");

// CREATE MPOINT
exports.createMpoint = async (data) => {
  const {
    idreseller,
    nama_toko,
    alamat,
    status,
    latitude,
    longitude,
    created_by,
    updated_by,
    telp,
    tipe_toko,
    jam_buka,
  } = data;

  const { data: inserted, error } = await supabase
    .from("mpoint")
    .insert([
      {
        idreseller,
        nama_toko: nama_toko || "",
        alamat: alamat || "",
        status: status !== undefined ? parseInt(status, 10) : 1,
        latitude: latitude ? String(latitude) : null,
        longitude: longitude ? String(longitude) : null,
        created_by: created_by ? parseInt(created_by, 10) : null,
        updated_by: updated_by ? parseInt(updated_by, 10) : null,
        telp,
        tipe_toko,
        jam_buka,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (createMpoint):", error);
    throw error;
  }
  return inserted;
};

// GET SEARCH PAGINATED MPOINT
exports.searchPaginatedMpoint = async (filters = {}) => {
  let query = supabase.from("mpoint").select("*");

  if (filters.status !== undefined && filters.status !== null && filters.status !== "") {
    query = query.eq("status", parseInt(filters.status, 10));
  }

  if (filters.tipe_toko) {
    query = query.eq("tipe_toko", filters.tipe_toko);
  }

  if (filters.created_by) {
    query = query.eq("created_by", parseInt(filters.created_by, 10));
  }

  if (filters.start_date && filters.end_date) {
    query = query
      .gte("created_at", `${filters.start_date}T00:00:00.000Z`)
      .lte("created_at", `${filters.end_date}T23:59:59.999Z`);
  }

  if (filters.search) {
    query = query.or(
      `idreseller.ilike.%${filters.search}%,nama_toko.ilike.%${filters.search}%,alamat.ilike.%${filters.search}%,tipe_toko.ilike.%${filters.search}%`
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
    console.error("Supabase Error (searchPaginatedMpoint):", error);
    throw error;
  }
  return data || [];
};

// GET MPOINT BY IDRESELLER
exports.getMpointById = async (idreseller) => {
  const { data, error } = await supabase
    .from("mpoint")
    .select("*")
    .eq("idreseller", idreseller)
    .maybeSingle();

  if (error) {
    console.error("Supabase Error (getMpointById):", error);
    throw error;
  }
  return data;
};

// UPDATE MPOINT
exports.updateMpoint = async (id_reseller, data) => {
  const {
    nama_toko,
    alamat,
    status,
    latitude,
    longitude,
    updated_by,
    telp,
    tipe_toko,
    jam_buka,
  } = data;

  const updatePayload = {
    updated_at: new Date().toISOString(),
  };

  if (nama_toko !== undefined) updatePayload.nama_toko = nama_toko;
  if (alamat !== undefined) updatePayload.alamat = alamat;
  if (status !== undefined) updatePayload.status = parseInt(status, 10);
  if (latitude !== undefined) updatePayload.latitude = String(latitude);
  if (longitude !== undefined) updatePayload.longitude = String(longitude);
  if (updated_by !== undefined) updatePayload.updated_by = parseInt(updated_by, 10);
  if (telp !== undefined) updatePayload.telp = telp;
  if (tipe_toko !== undefined) updatePayload.tipe_toko = tipe_toko;
  if (jam_buka !== undefined) updatePayload.jam_buka = jam_buka;

  const { data: updated, error } = await supabase
    .from("mpoint")
    .update(updatePayload)
    .eq("idreseller", id_reseller)
    .select()
    .single();

  if (error) {
    console.error("Supabase Error (updateMpoint):", error);
    throw error;
  }
  return updated;
};

// DELETE MPOINT
exports.deleteMpoint = async (idreseller) => {
  const { data, error } = await supabase
    .from("mpoint")
    .delete()
    .eq("idreseller", idreseller);

  if (error) {
    console.error("Supabase Error (deleteMpoint):", error);
    throw error;
  }
  return data;
};

// STATISTIK MPOINT BERDASARKAN STATUS
exports.statistikMpointByStatus = async () => {
  const { data, error } = await supabase.from("mpoint").select("status");

  if (error) {
    console.error("Supabase Error (statistikMpointByStatus):", error);
    throw error;
  }

  const list = data || [];
  return {
    total: list.length,
    Aktif: list.filter((item) => Number(item.status) === 1).length,
    NonAktif: list.filter((item) => Number(item.status) === 0).length,
  };
};
