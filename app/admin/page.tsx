"use client";

import { useState } from "react";

type Order = {
  id: string;
  createdAt: string;
  projectName: string;
  email: string;
  objective: string;
  sector: string;
  budgetUsd: number;
  timelineDays: number;
  references: string | null;
  status: string;
};

const STATUSES = ["NEW", "IN_REVIEW", "IN_PROGRESS", "DELIVERED", "CANCELLED"];

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", { headers: { "x-admin-token": token } });
      if (!res.ok) throw new Error(res.status === 401 ? "Invalid admin token" : "Failed to load");
      const data = await res.json();
      setOrders(data.orders);
    } catch (e: any) {
      setError(e.message);
      setOrders(null);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div className="min-h-screen bg-void text-white px-6 py-12 max-w-5xl mx-auto">
      <h1 className="font-display text-2xl mb-6">Mission Control — Admin</h1>

      <div className="flex gap-3 mb-10">
        <input
          type="password"
          placeholder="Admin token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="field-input max-w-xs"
        />
        <button
          onClick={load}
          disabled={!token || loading}
          className="font-mono text-xs uppercase px-5 py-2 rounded-lg bg-nebula-bright text-void disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load Orders"}
        </button>
      </div>

      {error && <p className="text-red-300 text-sm mb-6">{error}</p>}

      {orders && (
        <div className="space-y-4">
          {orders.length === 0 && <p className="text-white/40">No orders yet.</p>}
          {orders.map((o) => (
            <div key={o.id} className="glass rounded-xl p-5">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="font-display text-lg">{o.projectName}</p>
                  <p className="text-white/50 text-sm font-mono">{o.email}</p>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className="field-input w-auto bg-void"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-mist text-sm mt-3">{o.objective}</p>
              <div className="flex flex-wrap gap-4 mt-3 font-mono text-xs text-white/40">
                <span>{o.sector}</span>
                <span>${o.budgetUsd.toLocaleString()}</span>
                <span>{o.timelineDays} days</span>
                <span>{new Date(o.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
