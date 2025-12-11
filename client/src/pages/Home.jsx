import React from "react";
import { Button } from "../../components/ui/button";
import { motion } from "motion/react";
import FakeCodeEditor from "../../components/ui/code-editor";
import BentoGrid from "../../components/ui/bento-grid";
import { useNavigate } from "react-router-dom";
import CheckinCard from "../components/CheckIn";
import { useAuth } from "../lib/AuthProvider";

const Home = () => {
  const navigate = useNavigate();
  const { userData} = useAuth();
  return (
    <>
      <CheckinCard userData={userData} refreshUser={fetchUser} />

      <section className="relative min-h-screen w-full flex flex-col justify-center items-center bg-[#0a0a0a] text-white">
        {/* Decorative Background Glows */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="absolute top-50 left-20 w-72 h-72 bg-yellow-500 rounded-full blur-[120px] opacity-20"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          className="absolute bottom-10 right-20 w-80 h-50 bg-yellow-400 rounded-full blur-[150px] opacity-20"
        />

        {/* Content Wrapper */}
        <div className="flex flex-col md:flex-row items-center justify-around w-full max-w-7xl px-8 z-10">
          {/* Left Text Section */}
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

          {/* Right Fake Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full flex justify-center items-center md:px-10"
          >
            <div className="w-full max-w-3xl md:ml-40">
              <FakeCodeEditor />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================== Bento Grid ================================== */}

      <motion.h1 initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mt-5 -mb-5 text-5xl font-bold italic ">Code, Win, Repeat</motion.h1>
      <section className="relative flex items-center justify-center w-full">
        <BentoGrid />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="absolute top-50 left-20 w-20 h-20 bg-yellow-500 rounded-full blur-[100px] opacity-20"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="absolute bottom-50 right-80 w-30 h-30 bg-yellow-500 rounded-full blur-[150px] opacity-20"
        />
      </section>
    </>
  );
};

export default Home;
