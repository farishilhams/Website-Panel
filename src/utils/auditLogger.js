import { getAuthUsername, getAuthRole } from "./authHelper";

/**
 * Audit Logger Utility for MPStore Website Panel
 * Mencatat seluruh aktivitas penting (Autentikasi, CRUD Data, Ekspor)
 * untuk audit trail dan kepatuhan standar keamanan enterprise.
 */

const STORAGE_KEY = "mpstore_audit_logs";

const INITIAL_LOGS = [
  {
    id: "LOG-1001",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    actor: "super-admin",
    role: "super_admin",
    action: "LOGIN",
    target: "Sesi Dashboard Eksekutif",
    status: "SUCCESS",
    ip: "127.0.0.1 (Localhost)",
  },
  {
    id: "LOG-1002",
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    actor: "content-admin",
    role: "content_admin",
    action: "UPDATE_NEWS",
    target: "Artikel: Peluang Bisnis PPOB Modern",
    status: "SUCCESS",
    ip: "127.0.0.1 (Localhost)",
  },
  {
    id: "LOG-1003",
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    actor: "marketing",
    role: "marketing",
    action: "CREATE_PROMOTION",
    target: "Promo Cashback Spesial 10%",
    status: "SUCCESS",
    ip: "127.0.0.1 (Localhost)",
  },
  {
    id: "LOG-1004",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    actor: "super-admin",
    role: "super_admin",
    action: "EXPORT_DATA",
    target: "Ekspor Log Aktivitas Sistem",
    status: "SUCCESS",
    ip: "127.0.0.1 (Localhost)",
  },
  {
    id: "LOG-1005",
    timestamp: new Date().toISOString(),
    actor: "super-admin",
    role: "super_admin",
    action: "SYSTEM_OPTIMIZE",
    target: "Penyelarasan Arsitektur & Cache Frontend",
    status: "SUCCESS",
    ip: "127.0.0.1 (Localhost)",
  },
];

export const getAuditLogs = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LOGS));
      return INITIAL_LOGS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading audit logs:", err);
    return INITIAL_LOGS;
  }
};

export const recordAuditLog = (action, target, status = "SUCCESS") => {
  try {
    const currentLogs = getAuditLogs();
    const actor = getAuthUsername() || "system";
    const role = getAuthRole() || "super_admin";

    const newEntry = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      actor,
      role,
      action,
      target,
      status,
      ip: "127.0.0.1 (Localhost)",
    };

    const updated = [newEntry, ...currentLogs].slice(0, 200); // Batasi 200 riwayat terbaru
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newEntry;
  } catch (err) {
    console.error("Error recording audit log:", err);
    return null;
  }
};

export const clearAuditLogs = () => {
  localStorage.removeItem(STORAGE_KEY);
};
