import React, { useState } from "react";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";
import { Badge } from "../../../components/ui/badge";
import { motion, AnimatePresence } from "motion/react";

const Pricing = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24">
      {/* ================= HEADER ================= */}
      <motion.div
        className="w-full flex flex-col items-center justify-center text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Badge
          variant="outline"
          className="text-sm md:text-md px-4 py-1.5 flex gap-2 border-primary/20 bg-secondary/30 backdrop-blur-md text-foreground/80 rounded-full shadow-sm"
        >
          <FaRupeeSign className="text-yellow-500" />
          <span>Pricing</span>
        </Badge>

        <h1 className="mt-4 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter bg-linear-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
          Plan Comparison
        </h1>

        <p className="mt-5 text-lg md:text-xl font-light text-muted-foreground max-w-2xl">
          Clear limits. No hidden tricks. Upgrade only when it helps you.
        </p>
      </motion.div>

      {/* ================= TABLE ================= */}
      <motion.div
        className="mt-20 overflow-x-auto rounded-2xl border border-neutral-800"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <table className="w-full border-collapse text-sm">
          {/* ---------- HEAD ---------- */}
          <thead className="bg-neutral-900">
            <tr>
              <th className="text-left py-4 px-5 text-neutral-300 font-medium">
                Features
              </th>
              <PlanHead title="Free" />
              <PlanHead title="Bronze" />
              <PlanHead title="Silver" highlight />
              <PlanHead title="Gold" />
            </tr>
          </thead>

          {/* ---------- BODY ---------- */}
          <tbody>
            <Row index={0} label="Daily duels" values={["5", "15", "Unlimited", "Unlimited"]} />
            <Row index={1} label="Question selection" values={["Random", "Partial", "Full", "Priority"]} />
            <Row index={2} label="Problem pool size" values={["Limited", "Expanded", "Full", "Extended"]} />
            <Row index={3} label="Matchmaking speed" values={["Standard", "Standard", "Fast", "Priority"]} />
            <Row index={4} label="Duel cooldown" values={["10 min", "5 min", "None", "None"]} />
            <Row index={5} label="Daily coins" values={["5", "15", "30", "50"]} />

            {/* ---------- EXPANDABLE ROWS ---------- */}
            <AnimatePresence initial={false}>
              {expanded && (
                <>
                  <AnimatedRow index={6} label="Rematches per duel" values={["0", "0", "Unlimited", "Unlimited"]} />
                  <AnimatedRow index={7} label="Peak hour access" values={["Limited", "Limited", "Full", "Priority"]} />
                  <AnimatedRow index={8} label="Retry failed duel" values={[false, true, true, true]} />
                  <AnimatedRow index={9} label="Streak tracking" values={[false, true, true, true]} />
                  <AnimatedRow index={10} label="New problem access" values={["Delayed", "Delayed", "Instant", "Early"]} />
                  <AnimatedRow index={11} label="Queue priority" values={[false, false, true, true]} />
                  <AnimatedRow index={12} label="Experimental features" values={[false, false, false, true]} />
                </>
              )}
            </AnimatePresence>

            {/* ---------- READ MORE ---------- */}
            <tr className="bg-neutral-900/60 border-t border-neutral-800">
              <td colSpan={5} className="py-4 px-5 text-center">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white transition"
                >
                  {expanded ? (
                    <>
                      Show less <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Read more details <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              </td>
            </tr>

            {/* ---------- CTA ---------- */}
            <tr className="bg-neutral-900 border-t border-neutral-800">
              <td className="py-5 px-5" />
              <CTA label="Get Started" />
              <CTA label="Upgrade" />
              <CTA label="Go Silver" highlight />
              <CTA label="Go Gold" />
            </tr>
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default Pricing;

/* ================= HELPERS ================= */

const PlanHead = ({ title, highlight }) => (
  <th
    className={`py-4 px-5 font-medium text-center ${
      highlight ? "text-yellow-400" : "text-white"
    }`}
  >
    {title}
  </th>
);

const Row = ({ label, values, index }) => (
  <tr
    className={`border-t border-neutral-800 ${
      index % 2 === 0 ? "bg-neutral-900/60" : "bg-transparent"
    }`}
  >
    <td className="py-4 px-5 text-neutral-300 font-medium bg-neutral-900/80">
      {label}
    </td>
    {values.map((value, i) => (
      <td key={i} className="py-4 px-5 text-center text-neutral-200">
        {typeof value === "boolean" ? (
          value ? (
            <Check className="h-4 w-4 text-green-400 mx-auto" />
          ) : (
            <X className="h-4 w-4 text-neutral-600 mx-auto" />
          )
        ) : (
          value
        )}
      </td>
    ))}
  </tr>
);

const AnimatedRow = ({ label, values, index }) => (
  <motion.tr
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 8 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    className={`border-t border-neutral-800 ${
      index % 2 === 0 ? "bg-neutral-900/60" : "bg-transparent"
    }`}
  >
    <td className="py-4 px-5 text-neutral-300 font-medium bg-neutral-900/80">
      {label}
    </td>
    {values.map((value, i) => (
      <td key={i} className="py-4 px-5 text-center text-neutral-200">
        {typeof value === "boolean" ? (
          value ? (
            <Check className="h-4 w-4 text-green-400 mx-auto" />
          ) : (
            <X className="h-4 w-4 text-neutral-600 mx-auto" />
          )
        ) : (
          value
        )}
      </td>
    ))}
  </motion.tr>
);

const CTA = ({ label, highlight }) => (
  <td className="py-4 px-5">
    <button
      className={`w-full rounded-lg py-2.5 text-sm font-medium transition-colors cursor-pointer ${
        highlight
          ? "bg-yellow-500 text-black hover:bg-yellow-400"
          : "bg-neutral-800 text-white hover:bg-neutral-700"
      }`}
    >
      {label}
    </button>
  </td>
);
