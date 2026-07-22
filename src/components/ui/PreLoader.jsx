import { useEffect, useState } from "react";
import CountUp from "./CountUp";

const Preloader = ({ onFinish }) => {
  const [step, setStep] = useState("count1");
  // count1 | count2 | done | exit

  // DONE → EXIT
  useEffect(() => {
    if (step === "done") {
      const timer = setTimeout(() => {
        setStep("exit");
      }, 150); // waktu tampil "Selamat Datang!"
      return () => clearTimeout(timer);
    }
  }, [step]);

  // EXIT → APP
  useEffect(() => {
    if (step === "exit") {
      const timer = setTimeout(() => {
        onFinish();
      }, 250); // fade-out duration
      return () => clearTimeout(timer);
    }
  }, [step, onFinish]);

  return (
    <div
      className={`
        fixed inset-0 z-[9999]
        flex items-center justify-center
        backdrop-blur-xl bg-black/60
        transition-opacity duration-300
        ${step === "exit" ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
    >
      {/* 0 → 90 (FAST) */}
      {step === "count1" && <CountUp from={0} to={90} duration={0.35} onEnd={() => setStep("count2")} className="text-6xl font-bold text-white font-[Space_Grotesk]" />}

      {/* 90 → 100 (SATISFYING) */}
      {step === "count2" && <CountUp from={90} to={100} duration={0.25} onEnd={() => setStep("done")} className="text-6xl font-bold text-white font-[Space_Grotesk]" />}

      {/* DONE */}
      {step === "done" && <span className="text-5xl font-bold text-white font-[Space_Grotesk] animate-fade-in">Selamat Datang!</span>}
    </div>
  );
};

export default Preloader;
