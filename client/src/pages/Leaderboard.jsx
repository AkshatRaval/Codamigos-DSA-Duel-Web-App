import React from "react";
import { motion } from "motion/react";
import { Badge } from "../../components/ui/badge.jsx";
import { Card, CardContent, CardHeader } from "../../components/ui/card.jsx";

const mockData = [
  { id: 1, username: "Alice", score: 2500, avatar: "https://i.pravatar.cc/60?img=1" },
  { id: 2, username: "Bob", score: 2480, avatar: "https://i.pravatar.cc/60?img=2" },
  { id: 3, username: "Charlie", score: 2410, avatar: "https://i.pravatar.cc/60?img=3" },
  { id: 4, username: "David", score: 2370, avatar: "https://i.pravatar.cc/60?img=4" },
  { id: 5, username: "Evelyn", score: 2320, avatar: "https://i.pravatar.cc/60?img=5" },
  { id: 6, username: "Fiona", score: 2290, avatar: "https://i.pravatar.cc/60?img=6" },
  { id: 7, username: "George", score: 2240, avatar: "https://i.pravatar.cc/60?img=7" },
  { id: 8, username: "Hannah", score: 2190, avatar: "https://i.pravatar.cc/60?img=8" },
  { id: 9, username: "Ian", score: 2140, avatar: "https://i.pravatar.cc/60?img=9" },
  { id: 10, username: "Julia", score: 2100, avatar: "https://i.pravatar.cc/60?img=10" },

  { id: 11, username: "Kevin", score: 2050, avatar: "https://i.pravatar.cc/60?img=11" },
  { id: 12, username: "Lara", score: 2010, avatar: "https://i.pravatar.cc/60?img=12" },
  { id: 13, username: "Mason", score: 1970, avatar: "https://i.pravatar.cc/60?img=13" },
  { id: 14, username: "Nora", score: 1920, avatar: "https://i.pravatar.cc/60?img=14" },
  { id: 15, username: "Oliver", score: 1890, avatar: "https://i.pravatar.cc/60?img=15" },
  { id: 16, username: "Priya", score: 1840, avatar: "https://i.pravatar.cc/60?img=16" },
  { id: 17, username: "Quinn", score: 1800, avatar: "https://i.pravatar.cc/60?img=17" },
  { id: 18, username: "Rohan", score: 1760, avatar: "https://i.pravatar.cc/60?img=18" },
  { id: 19, username: "Sofia", score: 1720, avatar: "https://i.pravatar.cc/60?img=19" },
  { id: 20, username: "Thomas", score: 1690, avatar: "https://i.pravatar.cc/60?img=20" }
];


const Leaderboard = () => {
  const sorted = [...mockData].sort((a, b) => b.score - a.score);
  const empty = sorted.length === 0;

  const rankColors = ["text-yellow-400", "text-gray-300", "text-amber-700"];

  return (
    <section className="relative min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col items-center pt-28 px-6 overflow-hidden">
      
      {/* Background Glows */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1.3 }}
        className="absolute top-20 left-10 w-72 h-72 bg-yellow-500 rounded-full blur-[140px] -z-10"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1.3, delay: 0.3 }}
        className="absolute bottom-10 right-10 w-72 h-72 bg-yellow-400 rounded-full blur-[150px] -z-10"
      />

      {/* Title */}
      <motion.h1 
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold text-yellow-500 tracking-tight drop-shadow-xl"
      >
        Leaderboard 🏆
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.4 }}
        className="text-neutral-400 mt-2 text-lg"
      >
        Track the best coders in the arena
      </motion.p>


      {/* Empty State */}
      {empty && (
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-semibold opacity-80">No players yet</h2>
          <p className="mt-2 text-neutral-400">Be the first to battle and claim rank #1</p>
        </div>
      )}

      {/* Desktop Table */}
      {!empty && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:block w-full max-w-5xl mt-12 rounded-xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl"
        >
          {/* Head */}
          <div className="bg-white/10 px-6 py-4 flex text-sm font-semibold text-neutral-300 uppercase tracking-wider">
            <div className="w-20">Rank</div>
            <div className="flex-1">Player</div>
            <div className="w-32 text-right">Score</div>
            <div className="w-32 text-center">Avatar</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/10">
            {sorted.map((user, index) => (
              <motion.div
                key={user.id}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.06)", scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="flex items-center px-6 py-4"
              >
                <div className={`w-20 font-bold ${rankColors[index] || "text-gray-500"}`}>
                  #{index + 1}
                </div>

                <div className="flex-1 font-medium">{user.username}</div>

                <div className="w-32 text-right font-semibold text-yellow-400">
                  {user.score}
                </div>

                <div className="w-32 flex justify-center">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-12 h-12 rounded-full border border-yellow-400/30 shadow-md object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Mobile Cards */}
      {!empty && (
        <div className="grid md:hidden gap-5 w-full max-w-md mt-10 pb-20">
          {sorted.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/10 border border-white/10 backdrop-blur-xl shadow-lg rounded-xl p-4 hover:bg-white/20 transition">
                <CardHeader className="flex flex-row items-center justify-between px-0 pb-2">
                  <div className="flex items-center gap-3">
                    <span className={`font-bold text-lg ${rankColors[index] || "text-gray-400"}`}>
                      #{index + 1}
                    </span>
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-12 h-12 rounded-full border border-yellow-400/40 shadow-md object-cover"
                    />
                    <h3 className="font-semibold text-white">{user.username}</h3>
                  </div>

                  <Badge className="bg-yellow-500 text-black text-sm px-4 py-1 rounded-full shadow">
                    {user.score}
                  </Badge>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

    </section>
  );
};

export default Leaderboard;
