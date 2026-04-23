import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardCards from "../components/DashboardCards";
import CashflowChart from "../components/CashflowChart";
import InsightsPanel from "../components/InsightsPanel";
import TransactionsList from "../components/TransactionsList";
import ExperiencePanel from "../components/ExperiencePanel";

export default function Dashboard() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[30%] h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_20%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <main className="flex-1 px-4 py-4 md:px-6 md:py-6 lg:px-8">
          <Header />
          <DashboardCards />

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
            <CashflowChart />
            <InsightsPanel />
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <TransactionsList />
            <ExperiencePanel />
          </section>
        </main>
      </div>
    </div>
  );
}