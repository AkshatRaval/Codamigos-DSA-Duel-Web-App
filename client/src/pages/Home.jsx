import React, { memo } from "react";
import { Button } from "../../components/ui/button";
import { motion } from "motion/react"; // Ensure this import path matches your version
import FakeCodeEditor from "../../components/ui/code-editor";
import { useNavigate } from "react-router-dom";
import { Code2, Trophy, History, Zap, Users, Globe } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { pricingTiers } from "../lib/constants";

// --- 1. MEMOIZED PRICING CARD (Prevents re-renders) ---
const PricingCard = memo(({ tier }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      // OPTIMIZATION: Reduced blur from xl to sm, added transform-gpu
      className="transform-gpu w-full max-w-sm rounded-2xl border bg-linear-to-b from-white/5 to-transparent backdrop-blur-sm p-8 border-neutral-800 flex flex-col will-change-transform"
    >
      <Badge
        variant="outline"
        className={`w-fit mb-6 text-sm ${tier.badgeColor}`}
      >
        {tier.name}
      </Badge>

      <h3 className="text-4xl font-semibold text-white mb-2">₹{tier.price}</h3>
      <p className="text-sm text-neutral-400 mb-6">
        To discover our product and its features
      </p>

      <div className="h-px w-full bg-neutral-800 mb-6" />

      <ul className="space-y-4 mb-8">
        {tier.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-neutral-300">
            <feature.icon className="h-4 w-4 text-neutral-400" />
            <span>{feature.label}</span>
          </li>
        ))}
      </ul>

      <button
        className={`mt-auto w-full rounded-xl py-3 text-sm font-medium transition-colors cursor-pointer ${
          tier.popular
            ? "bg-yellow-500 text-black hover:bg-yellow-400"
            : "bg-neutral-800 text-white hover:bg-neutral-700"
        }`}
      >
        {tier.cta}
      </button>
    </motion.div>
  );
});

// --- 2. MEMOIZED PROCESS STEP ---
const ProcessStep = memo(({ number, icon, title, desc }) => {
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={itemVariants}
      className="relative flex flex-col items-center text-center group"
    >
      <div className="w-[120px] h-[120px] bg-[#0a0a0a] border-4 border-[#1a1a1a] rounded-full flex items-center justify-center relative z-10 mb-6 group-hover:border-yellow-500 transition-colors duration-300">
        <div className="w-[100px] h-[100px] bg-[#111] rounded-full flex items-center justify-center">
          <div className="text-neutral-400 group-hover:text-yellow-400 transition-colors duration-300 transform group-hover:scale-110">
            {icon}
          </div>
        </div>
        <div className="absolute -top-2 -right-2 bg-neutral-800 text-white font-mono text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#0a0a0a] group-hover:bg-yellow-500 group-hover:text-black transition-colors">
          {number}
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-500 transition-colors">
        {title}
      </h3>
      <p className="text-neutral-400 leading-relaxed max-w-[280px]">{desc}</p>
    </motion.div>
  );
});

// --- 3. STAT ITEM ---
const StatItem = memo(({ icon, value, label }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    className="flex items-center gap-4 text-neutral-300"
  >
    <div className="text-yellow-500">{icon}</div>
    <div className="text-left">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-neutral-500 uppercase tracking-wider">
        {label}
      </div>
    </div>
  </motion.div>
));

const Home = () => {
  const navigate = useNavigate();

  // Variant for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Reduced stagger time for snappier feel
        delayChildren: 0.2,
      },
    },
  };

  return (
    <main className="bg-[#0a0a0a] min-h-screen w-full overflow-x-hidden selection:bg-yellow-500/30">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen w-full flex flex-col justify-center items-center text-white overflow-hidden">
        {/* Optimized Blobs: Added will-change-transform */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="will-change-transform absolute top-50 left-20 w-72 h-72 bg-yellow-500 rounded-full blur-[120px] opacity-20 pointer-events-none"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          className="will-change-transform absolute bottom-10 right-20 w-80 h-50 bg-yellow-400 rounded-full blur-[150px] opacity-20 pointer-events-none"
        />

        <div className="flex flex-col md:flex-row items-center justify-around w-full max-w-7xl px-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6 text-center md:text-left w-full md:w-1/2"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-500 leading-tight">
                Two Coders. One Arena.
              </h1>
              <h2 className="text-4xl md:text-5xl font-extrabold text-yellow-500 leading-tight">
                Infinite Replay.
              </h2>
            </div>

            <p className="text-neutral-400 text-base md:text-lg max-w-md mx-auto md:mx-0">
              Real-time head-to-head DSA battles - create rooms, join instantly,
              and relive every code move.
            </p>

            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <Button
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-lg px-6 py-3 rounded-xl transition-all cursor-pointer"
                onClick={() => navigate("/room")}
              >
                CREATE ROOM
              </Button>
              <Button
                className="border border-yellow-400 bg-transparent hover:bg-yellow-400/10 text-yellow-400 font-semibold text-lg px-6 py-3 rounded-xl transition-all cursor-pointer"
                onClick={() => navigate("/room")}
              >
                JOIN ROOM
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full flex justify-center items-center md:px-10 mt-10 md:mt-0"
          >
            <div className="w-full max-w-3xl md:ml-40">
              <FakeCodeEditor />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== PROCESS SECTION ==================== */}
      <section className="w-full py-32 bg-[#0d0d0d] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              The Path to <span className="text-yellow-500">Victory</span>
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              No setup required. Just pure algorithmic competition.
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-0.5 bg-neutral-800">
              <motion.div
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="h-full bg-gradient-to-r from-yellow-500/0 via-yellow-500 to-yellow-500/0 opacity-50"
              />
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8"
            >
              <ProcessStep
                number="01"
                icon={<Users size={28} />}
                title="Create Lobby"
                desc="Generate a secure room code instantly. Invite a rival and select your difficulty."
              />
              <ProcessStep
                number="02"
                icon={<Code2 size={28} />}
                title="Code Live"
                desc="Real-time synchronized editor. Run test cases and debug before the clock runs out."
              />
              <ProcessStep
                number="03"
                icon={<Trophy size={28} />}
                title="Rank Up"
                desc="Pass all test cases first to win. Gain Elo and climb the global leaderboard."
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== STATS TICKER ==================== */}
      <section className="w-full py-12 border-y border-[#222] bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around items-center gap-8">
          <StatItem icon={<Globe />} value="Global" label="Server Region" />
          <StatItem icon={<Zap />} value="50ms" label="Avg Latency" />
          <StatItem icon={<History />} value="24/7" label="Uptime" />
          <StatItem icon={<Code2 />} value="100+" label="DSA Problems" />
        </div>
      </section>

      {/* ==================== PRICING SECTION (Optimized) ==================== */}
      <section className="relative w-full py-32 bg-[#0a0a0a]">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="will-change-transform absolute bottom-10 right-20 w-80 h-50 bg-yellow-400/20 rounded-full blur-[100px] opacity-20 pointer-events-none"
        />

        <div className="w-full mx-auto mb-5 px-6 text-center relative z-10">
          <Badge
            variant="outline"
            className="mx-auto py-2 px-5 bg-[#231F17] text-[#ffedc8] border-[#ffedc860]"
          >
            Pricing
          </Badge>
        </div>

        <div className="text-center max-w-7xl mx-auto px-6 mb-12 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
          >
            Choose The Plan That Suits You Best
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-5 text-lg md:text-xl font-light text-neutral-400 text-center max-w-2xl mx-auto"
          >
            Simple and transparent pricing. No hidden fees. Upgrade anytime as
            you climb the ranks.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid sm:grid-cols-2 md:grid-cols-4 w-full max-w-7xl mx-auto px-6 gap-8 relative z-10"
        >
          {pricingTiers.map((tier, index) => (
            <PricingCard key={index} tier={tier} />
          ))}
        </motion.div>

        <div className="mt-10 flex flex-col items-center justify-center relative z-10 text-neutral-400">
          <p>More Details and Compare all plans</p>
          <Button
            onClick={() => navigate("/services/pricing")}
            variant={"link"}
            className="underline -mt-2 text-yellow-300 cursor-pointer hover:text-yellow-400"
          >
            View Pricing
          </Button>
        </div>
      </section>

      {/* ==================== FOOTER CTA ==================== */}
      <section className="relative w-full py-32 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="will-change-transform absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Ready to <span className="text-yellow-500">Compete?</span>
          </h2>
          <p className="text-neutral-400 text-lg mb-10 max-w-2xl mx-auto">
            Stop coding in isolation. Step into the arena, challenge your peers,
            and master Data Structures & Algorithms the hard way.
          </p>
          <Button
            onClick={() => navigate("/room")}
            className="bg-yellow-500 text-black font-bold text-xl px-10 py-6 rounded-2xl hover:bg-yellow-400 hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(234,179,8,0.5)] cursor-pointer"
          >
            ENTER THE ARENA
          </Button>
        </motion.div>
      </section>
    </main>
  );
};

export default Home;