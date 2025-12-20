import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Badge } from "../../components/ui/badge.jsx";
import { Card, CardContent, CardHeader } from "../../components/ui/card.jsx";
import {doc, getDoc } from "firebase/firestore";
import { useAuth } from "../lib/AuthProvider.jsx";
import { db } from "../../firebase.js";
import { RefreshCw } from "lucide-react";

const Leaderboard = () => {
  const [discoverUsers, setDiscoverUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuth?.() || {};

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const fetchTopPlayers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Reference the single metadata document
      const metadataRef = doc(db, "system", "metadata");
      const snapshot = await getDoc(metadataRef);

      if (!snapshot.exists()) {
        console.warn("Metadata not found, leaderboard might be empty.");
        setDiscoverUsers([]);
        setCurrentPage(1);
        return;
      }

      const data = snapshot.data();
      // 2. Get the pre-calculated leaderboard array
      const rawLeaderboard = data.leaderboard || [];

      // 3. Map it to your UI structure
      // Note: 'leaderboard' contains up to 100 users. We slice(0, 20) to match your old limit(20).
      const users = rawLeaderboard.slice(0, 20).map((entry) => {
        return {
          id: entry.uid,
          avatar: entry.photoURL ?? null,
          username: entry.username || "Anonymous",
          handle: null, // The metadata script aggregates display name into 'username'
          score: typeof entry.elo === "number" ? entry.elo : 0,
        };
      });

      setDiscoverUsers(users);
      setCurrentPage(1);
    } catch (e) {
      console.error("Error fetching top players from metadata", e);
      setError("Failed to load leaderboard — showing demo data.");
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopPlayers();
  }, [fetchTopPlayers]);

  const sorted = [...discoverUsers].sort((a, b) => b.score - a.score);
  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const empty = totalItems === 0;

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const start = (currentPage - 1) * pageSize;
  const paged = sorted.slice(start, start + pageSize);

  const goTo = (page) => {
    const p = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(p);
    const el = document.querySelector("[data-leaderboard-top]");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    show: (i = 1) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04 } }),
  };

  // Helper to form img src from avatar field in DB
  const imgSrcFromAvatarField = (avatarField) =>
    avatarField ? `/avatars/${avatarField}` : "/avatars/default.png";

  return (
    <section className="relative min-h-screen w-full text-white flex flex-col items-center pt-28 px-6 overflow-hidden">
      {/* header */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4" data-leaderboard-top>
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl font-bold text-neutral-100"
          >
            Leaderboard
          </motion.h1>
          <p className="text-neutral-400 mt-2 text-sm">
            Top players — showing {totalItems || 0}
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={fetchTopPlayers}
            className="px-3 py-2 rounded-md bg-white/6 hover:bg-white/10 transition text-sm"
            aria-label="Refresh leaderboard"
          >
            <RefreshCw size={15} />
          </button>

          <div className="text-sm text-neutral-300">
            Page <span className="font-medium text-neutral-100">{currentPage}</span> of <span className="font-medium text-neutral-100">{totalPages}</span>
          </div>
        </div>
      </div>

      {/* error */}
      {error && (
        <div className="mt-6 px-4 py-2 rounded-md bg-red-600/10 text-red-200 text-sm max-w-5xl w-full">
          {error}
        </div>
      )}

      {/* loading skeleton */}
      {loading && (
        <div className="w-full max-w-5xl mt-8">
          <div className="bg-white/4 border border-white/8 rounded-xl p-6 animate-pulse">
            <div className="h-5 w-2/12 bg-white/10 rounded mb-6" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <div className="w-12 h-12 rounded-full bg-white/10" />
                <div className="flex-1">
                  <div className="h-4 w-1/3 bg-white/10 rounded mb-2" />
                  <div className="h-3 w-1/6 bg-white/10 rounded" />
                </div>
                <div className="w-16 h-6 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && empty && (
        <div className="mt-20 text-center">
          <h2 className="text-xl font-semibold text-neutral-100">No players yet</h2>
          <p className="mt-2 text-neutral-400">Be the first to play and claim the top rank</p>
        </div>
      )}

      {!loading && !empty && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="hidden md:block w-full max-w-5xl mt-8 rounded-xl overflow-hidden bg-white/3 border border-white/6"
          role="table"
          aria-label="Leaderboard table"
        >
          <div className="px-6 py-3 flex items-center justify-between text-sm font-medium text-neutral-300 border-b border-white/6">
            <div className="flex items-center gap-6">
              <div className="w-20">Rank</div>
              <div className="flex-1">Player</div>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-32 text-right">Score</div>
              <div className="w-32 text-center">Avatar</div>
            </div>
          </div>

          <div className="divide-y divide-white/6">
            {paged.map((user, idx) => {
              const absoluteIndex = start + idx;
              const isCurrent = currentUser && currentUser.uid === user.id;
              return (
                <div key={user.id} className={`flex items-center px-6 py-4 ${isCurrent ? "bg-white/5" : ""}`}>
                  <div className="w-20 font-semibold">#{absoluteIndex + 1}</div>

                  <div className="flex-1 text-sm">{user.username}</div>

                  <div className="w-32 text-right font-medium">{user.score}</div>

                  <div className="w-32 flex justify-center">
                    <img
                      src={imgSrcFromAvatarField(user.avatar)}
                      alt={`${user.username} avatar`}
                      className="w-10 h-10 rounded-full object-cover border"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/avatars/default.png";
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-6 py-3 flex items-center justify-between border-t border-white/6 bg-white/2">
            <div className="text-sm text-neutral-300">
              Showing <span className="text-neutral-100 font-medium">{start + 1}</span>–<span className="text-neutral-100 font-medium">{Math.min(start + pageSize, totalItems)}</span> of <span className="text-neutral-100 font-medium">{totalItems}</span>
            </div>

            <div className="inline-flex items-center gap-2">
              <button
                onClick={() => goTo(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : "bg-white/6 hover:bg-white/8"}`}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                // keep pagination simple: show all pages if <= 7, otherwise show neighbors
                const showAll = totalPages <= 7;
                const show = showAll || p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1;
                if (!show) {
                  // show ellipsis only where appropriate
                  const before = p === 2 && currentPage > 3;
                  const after = p === totalPages - 1 && currentPage < totalPages - 2;
                  if (before || after) {
                    return <span key={p} className="px-2 text-sm text-neutral-400">…</span>;
                  }
                  return null;
                }
                return (
                  <button
                    key={p}
                    onClick={() => goTo(p)}
                    aria-current={p === currentPage ? "page" : undefined}
                    className={`px-3 py-1 rounded-md text-sm ${p === currentPage ? "bg-neutral-100 text-black font-medium" : "bg-white/6 hover:bg-white/8"}`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => goTo(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md text-sm ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "bg-white/6 hover:bg-white/8"}`}
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mobile list */}
      {!loading && !empty && (
        <div className="grid md:hidden gap-4 w-full max-w-md mt-6 pb-8">
          {paged.map((user, idx) => {
            const absoluteIndex = start + idx;
            const isCurrent = currentUser && currentUser.uid === user.id;
            return (
              <motion.div key={user.id} initial="hidden" animate="show" custom={idx} variants={cardVariants}>
                <Card className={`p-3 ${isCurrent ? "bg-white/5" : "bg-white/3"} border`}>
                  <CardHeader className="flex items-center justify-between px-0 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold">#{absoluteIndex + 1}</div>

                      <img
                        src={imgSrcFromAvatarField(user.avatar)}
                        alt={`${user.username} avatar`}
                        className="w-10 h-10 rounded-full object-cover border"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/avatars/default.png";
                        }}
                      />

                      <div>
                        <h3 className="font-medium text-sm truncate">{user.username}</h3>

                        <div className="flex gap-2 items-center">
                          {(user.handle) && (
                            <span className="text-xs text-neutral-400 truncate">
                              @{user.handle}
                            </span>
                          )}

                          <span className="text-xs text-neutral-400">
                            {isCurrent ? "You" : "Player"}
                          </span>
                        </div>
                      </div>

                    </div>

                    <Badge className="bg-white/7 text-black px-3 py-1 rounded">
                      {user.score}
                    </Badge>
                  </CardHeader>

                  <CardContent className="px-0 pt-2 text-xs text-neutral-300">
                    <div className="flex items-center justify-between">
                      <span>ELO: <span className="font-medium">{user.score}</span></span>
                      <span className="text-xs text-neutral-400">{user.id}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {/* Mobile pagination */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <button
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-md text-sm ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : "bg-white/6 hover:bg-white/8"}`}
            >
              Prev
            </button>

            <div className="inline-flex items-center gap-1 bg-white/6 rounded-md px-2 py-1">
              <button onClick={() => goTo(1)} className={`px-2 py-1 rounded-md text-sm ${currentPage === 1 ? "bg-neutral-100 text-black font-medium" : "hover:bg-white/8"}`}>1</button>
              {currentPage > 3 && <span className="px-2 text-sm text-neutral-400">…</span>}
              {currentPage > 1 && currentPage < totalPages && <button onClick={() => goTo(currentPage)} className="px-2 py-1 rounded-md text-sm bg-white/6">{currentPage}</button>}
              {currentPage < totalPages - 1 && <span className="px-2 text-sm text-neutral-400">…</span>}
              {totalPages > 1 && <button onClick={() => goTo(totalPages)} className={`px-2 py-1 rounded-md text-sm ${currentPage === totalPages ? "bg-neutral-100 text-black font-medium" : "hover:bg-white/8"}`}>{totalPages}</button>}
            </div>

            <button
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-md text-sm ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "bg-white/6 hover:bg-white/8"}`}
            >
              Next
            </button>
          </div>

          <div className="text-xs text-neutral-400 text-center mt-2">
            Showing <span className="text-neutral-100 font-medium">{start + 1}</span>–<span className="text-neutral-100 font-medium">{Math.min(start + pageSize, totalItems)}</span> of <span className="text-neutral-100 font-medium">{totalItems}</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default Leaderboard;
