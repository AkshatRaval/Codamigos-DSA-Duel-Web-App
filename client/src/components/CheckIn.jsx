// client/src/components/CheckinCard.jsx
import React, { useEffect, useState } from "react";
import api from "../lib/api";


export default function CheckinCard({ userData, refreshUser }) {
  const [loading, setLoading] = useState(false);
  const [checkedToday, setCheckedToday] = useState(false);
  const [error, setError] = useState(null);

  // Utility to detect if lastCheckInDate is today (UTC/local depending on your backend)
  useEffect(() => {
    if (!userData) {
      setCheckedToday(false);
      return;
    }
    const last = userData.lastCheckInDate;
    if (!last) {
      setCheckedToday(false);
      return;
    }

    // Firestore timestamp object has `seconds` (serverTimestamp); handle both forms
    const lastDate = last.seconds ? new Date(last.seconds * 1000) : new Date(last);
    const today = new Date();

    const isSameUTCDate =
      lastDate.getUTCFullYear() === today.getUTCFullYear() &&
      lastDate.getUTCMonth() === today.getUTCMonth() &&
      lastDate.getUTCDate() === today.getUTCDate();

    setCheckedToday(isSameUTCDate);
  }, [userData]);

  async function handleCheckin() {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/check-in"); // your route
      const data = res.data;

      if (data.success) {
        // if backend returned updated coins/streak, you can optimistically update or re-fetch
        if (typeof refreshUser === "function") {
          await refreshUser();
        }
      } else {
        setError(data.error || "Check-in failed");
      }
    } catch (err) {
      console.error("check-in failed:", err);
      setError(err.response?.data?.error || err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 bg-white/5 rounded-md border border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-white">Daily Check-in</div>
          <div className="text-xs text-white/60">
            Streak: <strong>{userData?.streak?.current ?? 0}</strong> | Best: <strong>{userData?.streak?.best ?? 0}</strong>
          </div>
          <div className="text-xs text-white/60">Coins: <strong>{userData?.coins ?? 0}</strong></div>
        </div>

        <div>
          <button
            onClick={handleCheckin}
            disabled={loading || checkedToday}
            className={`px-3 py-1 rounded ${checkedToday ? "bg-white/10 text-white/60" : "bg-amber-400 text-black"} disabled:opacity-50`}
          >
            {loading ? "…" : (checkedToday ? "Checked in" : "Claim +10")}
          </button>
        </div>
      </div>

      {error && <div className="mt-2 text-xs text-red-400">{error}</div>}
    </div>
  );
}
