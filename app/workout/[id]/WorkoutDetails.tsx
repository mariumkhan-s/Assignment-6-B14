"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  LoaderCircle,
  Star,
} from "lucide-react";
import { toast } from "react-toastify";
import { usePlan } from "@/context/PlanContext";
import type { Workout } from "@/types/workout";

export default function WorkoutDetails({ id }: { id: string }) {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  const { todayPlan, savedWorkouts, addToPlan, addToSaved } = usePlan();

  useEffect(() => {
    let cancelled = false;

    async function loadWorkout() {
      try {
        setLoading(true);

        const response = await fetch(
          "https://api.abcz.workers.dev/api/fitlog"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }

        const data = await response.json();

        const workouts: Workout[] = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.workouts)
              ? data.workouts
              : [];

        const found = workouts.find(
          (item) => String(item.id) === String(id)
        );

        if (!cancelled) {
          setWorkout(found ?? null);
        }
      } catch (error) {
        console.error("Error loading workout:", error);

        if (!cancelled) {
          setWorkout(null);
          toast.error("Unable to load workout details.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadWorkout();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d0f12] text-white">
        <LoaderCircle
          className="animate-spin text-[#CCFF00]"
          size={32}
        />
        <span className="ml-3">Loading workout...</span>
      </main>
    );
  }

  if (!workout) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#0d0f12] px-4 text-center text-white">
        <Dumbbell size={40} className="mb-4 text-[#CCFF00]" />

        <h1 className="text-2xl font-bold">Workout not found</h1>

        <p className="mt-2 text-gray-400">
          This workout could not be loaded. Please return to the library.
        </p>

        <Link
          href="/"
          className="mt-6 rounded-lg bg-[#CCFF00] px-5 py-3 font-bold text-black"
        >
          Back to Workouts
        </Link>
      </main>
    );
  }

  const inPlan = todayPlan.some(
    (item) => String(item.id) === String(workout.id)
  );

  const isSaved = savedWorkouts.some(
    (item) => String(item.id) === String(workout.id)
  );

  function handleAddToPlan() {
    // Prevent passing null to addToPlan.
    if (!workout) return;

    if (inPlan) {
      toast.info("This workout is already in Today's Plan.");
      return;
    }

    addToPlan(workout);
    toast.success("Added to Today's Plan!");
  }

  function handleSave() {
    // Prevent passing null to addToSaved.
    if (!workout) return;

    if (isSaved) {
      toast.info("This workout is already saved.");
      return;
    }

    addToSaved(workout);
    toast.success("Workout saved!");
  }

  return (
    <main className="min-h-screen bg-[#0d0f12] px-4 py-8 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#CCFF00]"
        >
          <ArrowLeft size={18} />
          Back to Workouts
        </Link>

        <div className="grid items-start gap-8 lg:grid-cols-2">
          {/* Workout Image */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#171a20]">
            <img
              src={workout.image}
              alt={workout.name}
              className="max-h-[520px] min-h-[280px] w-full object-cover"
            />
          </div>

          {/* Workout Information */}
          <section>
            <div className="mb-4 flex flex-wrap gap-2">
              {workout.muscleGroups.map((group) => (
                <span
                  key={group}
                  className="rounded-md bg-[#CCFF00] px-3 py-1 text-xs font-bold uppercase text-black"
                >
                  {group}
                </span>
              ))}
            </div>

            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#CCFF00]">
              Workout Details
            </p>

            <h1 className="text-3xl font-black uppercase sm:text-4xl">
              {workout.name}
            </h1>

            {/* Duration, Calories, Rating */}
            <div className="mt-5 flex flex-wrap gap-5 text-sm text-gray-300">
              <span className="flex items-center gap-2">
                <Clock size={17} className="text-[#CCFF00]" />
                {workout.duration} min
              </span>

              <span className="flex items-center gap-2">
                <Flame size={17} className="text-orange-400" />
                {workout.caloriesBurned} kcal
              </span>

              <span className="flex items-center gap-2">
                <Star size={17} className="text-[#CCFF00]" />
                {workout.rating}
              </span>
            </div>

            {/* Workout Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-[#171a20] p-4">
                <p className="text-sm text-gray-400">Difficulty</p>
                <p className="mt-1 font-bold">{workout.difficulty}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#171a20] p-4">
                <p className="text-sm text-gray-400">Equipment</p>
                <p className="mt-1 font-bold">{workout.equipment}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#171a20] p-4">
                <p className="text-sm text-gray-400">Sets</p>
                <p className="mt-1 font-bold">{workout.sets}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#171a20] p-4">
                <p className="text-sm text-gray-400">Reps</p>
                <p className="mt-1 font-bold">{workout.reps}</p>
              </div>
            </div>

            {/* Description */}
            <h2 className="mt-7 text-xl font-bold">
              About This Workout
            </h2>

            <p className="mt-3 leading-7 text-gray-400">
              {workout.description}
            </p>

            {/* Instructions */}
            {workout.instructions?.length > 0 && (
              <section className="mt-7">
                <h2 className="text-xl font-bold">Instructions</h2>

                <ol className="mt-4 space-y-3">
                  {workout.instructions.map((instruction, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-gray-300"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#CCFF00] text-sm font-bold text-black">
                        {index + 1}
                      </span>

                      <span className="leading-6">
                        {instruction}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAddToPlan}
                disabled={inPlan}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#CCFF00] px-5 py-3.5 font-bold text-black hover:bg-[#D9FF33] disabled:opacity-60"
              >
                <CheckCircle2 size={19} />

                {inPlan
                  ? "Already in Today's Plan"
                  : "Add to Today's Plan"}
              </button>

              <button
                onClick={handleSave}
                disabled={isSaved}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#CCFF00]/40 px-5 py-3.5 font-bold text-[#CCFF00] hover:bg-[#CCFF00]/10 disabled:opacity-60"
              >
                <Bookmark size={19} />

                {isSaved ? "Saved" : "Save Workout"}
              </button>
            </div>

            {/* My Plan Link */}
            <Link
              href="/my-plan"
              className="mt-5 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#CCFF00]"
            >
              <Dumbbell size={16} />
              View My Plan
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}