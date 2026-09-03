/**
 * exportToCSV — Mengekspor array objek ke file CSV yang kompatibel dengan Excel.
 * Menggunakan UTF-8 BOM agar huruf dan karakter Indonesia terbuka sempurna di Excel.
 * 
 * @param {Array<Object>} data — data array yang akan diekspor
 * @param {string} filename — nama file tanpa ekstensi .csv
 * @param {Array<{ key: string, label: string }>} columns — daftar kolom dan header
 */
export function exportToCSV(data = [], filename = "export-mpstore", columns = []) {
  if (!data || data.length === 0) {
    alert("Tidak ada data untuk diekspor.");
    return;
  }

  // Jika columns tidak ditentukan, ambil dari keys objek pertama
  const cols = columns.length > 0
    ? columns
    : Object.keys(data[0]).map((k) => ({ key: k, label: k }));

  // Header row
  const headerRow = cols.map((c) => `"${(c.label || c.key).replace(/"/g, '""')}"`).join(",");

  // Data rows
  const dataRows = data.map((item) =>
    cols
      .map((c) => {
        let val = item[c.key];
        if (val === null || val === undefined) val = "";
        if (typeof val === "object") val = JSON.stringify(val);
        val = String(val).replace(/"/g, '""');
        return `"${val}"`;
      })
      .join(",")
  );

  const csvContent = "\uFEFF" + [headerRow, ...dataRows].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default {
  exportToCSV,
};
