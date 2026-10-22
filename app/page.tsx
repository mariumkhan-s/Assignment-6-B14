
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Dumbbell,
  ArrowDown,
  LoaderCircle,
  ArrowUpDown,
} from "lucide-react";

import WorkoutCard from "@/components/WorkoutCard";
import { getWorkouts } from "@/lib/api";
import type { Workout } from "@/types/workout";

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("duration");

  useEffect(() => {
    async function loadWorkouts() {
      try {
        setLoading(true);
        setError("");

        const data = await getWorkouts();
        setWorkouts(data);
      } catch {
        setError("Unable to load workouts. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadWorkouts();
  }, []);

  const sortedWorkouts = [...workouts]
    .sort((a, b) => {
      if (sortBy === "calories") {
        return b.caloriesBurned - a.caloriesBurned;
      }

      if (sortBy === "rating") {
        return b.rating - a.rating;
      }

      return a.duration - b.duration;
    })
    .slice(0, 12);

  return (
    <main className="min-h-screen bg-[#0c0d0f] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.08]">
        <nav className="container-fitlog flex h-[58px] items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <Dumbbell size={17} className="text-[#ccff00]" />
            <span className="text-[12px] font-black">FITLOG</span>
          </Link>

          <div className="flex items-center gap-1 text-[10px]">
            <Link
              href="/"
              className="rounded-full bg-[#ccff00] px-3 py-1.5 font-bold text-black"
            >
              Workout
            </Link>

            <Link
              href="/my-plan"
              className="rounded-full px-3 py-1.5 text-white/60 hover:text-white"
            >
              My Plan
            </Link>
          </div>

          <div className="flex items-center gap-3 text-[10px]">
            <Link
              href="/my-plan"
              className="flex items-center gap-1.5"
            >
              Plan
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ccff00] px-1 font-bold text-black">
                0
              </span>
            </Link>

            <Link
              href="/my-plan"
              className="hidden items-center gap-1.5 text-white/60 sm:flex"
            >
              Saved
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full border border-white/20 px-1">
                0
              </span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Banner */}
      <section className="container-fitlog pt-5 sm:pt-8">
        <div className="grid min-h-[225px] overflow-hidden rounded-xl border border-white/[0.04] bg-[#17181c] md:grid-cols-[1.2fr_0.8fr]">
          {/* Left Side: Text */}
          <div className="flex flex-col items-start justify-center p-6 sm:p-9">
            <p className="mb-3 text-[9px] font-black tracking-[0.2em] text-[#ccff00]">
              WORKOUT LIBRARY
            </p>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              TRAIN WITH INTENT. LOG
              <br />
              EVERY SET.
            </h1>

            <p className="mt-3 max-w-[350px] text-[10px] leading-[1.7] text-white/55">
              FitLog is a dark, no-nonsense gym companion: pick a
              lift, lock it into today&apos;s plan, and watch the
              week&apos;s work add up.
            </p>

            <a
              href="#library"
              className="mt-4 inline-flex items-center gap-2 rounded-sm bg-[#ccff00] px-4 py-2.5 text-[9px] font-black text-black hover:bg-white"
            >
              BROWSE WORKOUTS
              <ArrowDown size={12} />
            </a>
          </div>

          {/* Right Side: Banner Image */}
          <div className="relative hidden min-h-[225px] items-center justify-center overflow-hidden bg-[#17181c] md:flex">
            <Image
              src="/banner.png"
              alt="FitLog workout banner"
              fill
              priority
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Workout Library */}
      <section
        id="library"
        className="container-fitlog scroll-mt-6 pb-12 pt-7 sm:pt-9"
      >
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              THE LIBRARY
            </h2>

            <p className="mt-1 text-[9px] text-white/50">
              Twelve lifts covering every major muscle group.
            </p>
          </div>

          {/* Sort Workouts */}
          <label className="flex items-center gap-1 rounded-md border border-white/10 bg-[#151613] px-2.5 py-2 text-[10px] text-white/70">
            <ArrowUpDown size={12} />
            Sort:

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="max-w-[95px] bg-transparent text-white outline-none"
              aria-label="Sort workouts"
            >
              <option value="duration" className="bg-[#151613]">
                Duration
              </option>

              <option value="calories" className="bg-[#151613]">
                Calories
              </option>

              <option value="rating" className="bg-[#151613]">
                Rating
              </option>
            </select>
          </label>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-[250px] flex-col items-center justify-center gap-3 text-white/50">
            <LoaderCircle
              size={26}
              className="animate-spin text-[#ccff00]"
            />
            <p className="text-xs">Loading workouts...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="py-12 text-center">
            <p className="text-sm text-red-300">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-xs font-bold text-[#ccff00]"
            >
              Try again
            </button>
          </div>
        )}

        {/* Workout Cards */}
        {!loading && !error && workouts.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && workouts.length === 0 && (
          <p className="py-16 text-center text-sm text-white/50">
            No workouts found.
          </p>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.07]">
        <div className="container-fitlog flex min-h-[55px] flex-wrap items-center justify-between gap-3 py-4">
          <Link href="/" className="flex items-center gap-1.5">
            <Dumbbell size={13} className="text-[#ccff00]" />
            <span className="text-[10px] font-black">FITLOG</span>
          </Link>

          <p className="text-[8px] text-white/35">
            © 2026 FitLog — Workout Library. Train hard, log honest.
          </p>
        </div>
      </footer>
    </main>
  );
}
