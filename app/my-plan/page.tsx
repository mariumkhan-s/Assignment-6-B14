
"use client";

import Link from "next/link";
import { usePlan } from "@/context/PlanContext";
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  Trash2,
  Circle,
} from "lucide-react";

export default function MyPlanPage() {
  const {
    todayPlan,
    savedWorkouts,
    doneIds,
    removeFromPlan,
    removeFromSaved,
    markAsDone,
  } = usePlan();

  const completedCount = todayPlan.filter((workout) =>
    doneIds.includes(String(workout.id))
  ).length;

  const totalCalories = todayPlan.reduce(
    (total, workout) => total + workout.caloriesBurned,
    0
  );

  const totalMinutes = todayPlan.reduce(
    (total, workout) => total + workout.duration,
    0
  );

  return (
    <main className="min-h-screen bg-[#0d0f12] px-4 py-8 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#CCFF00]"
        >
          <ArrowLeft size={18} />
          Back to Workouts
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#CCFF00]">
            Your fitness dashboard
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            My <span className="text-[#CCFF00]">Plan</span>
          </h1>

          <p className="mt-3 text-gray-400">
            Track your daily workouts and manage your saved exercises.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Exercises"
            value={todayPlan.length}
            icon={<Dumbbell size={21} />}
          />

          <SummaryCard
            label="Minutes"
            value={totalMinutes}
            icon={<Clock size={21} />}
          />

          <SummaryCard
            label="Calories"
            value={totalCalories}
            icon={<Flame size={21} />}
          />
        </div>

        {/* Today's Plan */}
        <section className="mb-12">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Today's Plan</h2>
              <p className="mt-1 text-sm text-gray-400">
                {todayPlan.length} workout(s) in your plan
              </p>
            </div>

            <span className="rounded-full border border-[#CCFF00]/20 bg-[#CCFF00]/10 px-3 py-1 text-sm text-[#CCFF00]">
              {completedCount}/{todayPlan.length} done
            </span>
          </div>

          {todayPlan.length === 0 ? (
            <EmptyState
              icon={<Dumbbell size={30} />}
              title="Your plan is empty"
              description="Explore the workout library and add exercises to your daily plan."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {todayPlan.map((workout) => {
                const isDone = doneIds.includes(String(workout.id));

                return (
                  <article
                    key={workout.id}
                    className={`overflow-hidden rounded-2xl border bg-[#171a20] transition ${
                      isDone
                        ? "border-[#CCFF00]/50"
                        : "border-white/10 hover:border-[#CCFF00]/30"
                    }`}
                  >
                    <Link href={`/workout/${workout.id}`} className="block">
                      <div className="relative h-48 overflow-hidden bg-[#22262d]">
                        <img
                          src={workout.image}
                          alt={workout.name}
                          className={`h-full w-full object-cover transition duration-300 hover:scale-105 ${
                            isDone ? "opacity-60" : ""
                          }`}
                        />

                        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                          {workout.difficulty}
                        </span>

                        {isDone && (
                          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#CCFF00] px-3 py-1 text-xs font-semibold text-black">
                            <CheckCircle2 size={14} />
                            Completed
                          </span>
                        )}
                      </div>
                    </Link>

                    <div className="p-5">
                      <Link href={`/workout/${workout.id}`}>
                        <h3 className="text-lg font-bold transition hover:text-[#CCFF00]">
                          {workout.name}
                        </h3>
                      </Link>

                      <p className="mt-2 text-sm text-gray-400">
                        {workout.muscleGroups.join(" · ")}
                      </p>

                      <div className="my-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock size={16} className="text-[#CCFF00]" />
                          {workout.duration} min
                        </div>

                        <div className="flex items-center gap-2 text-gray-300">
                          <Flame size={16} className="text-orange-400" />
                          {workout.caloriesBurned} kcal
                        </div>
                      </div>

                      <div className="mb-4 text-sm text-gray-400">
                        {workout.sets} sets · {workout.reps} reps
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => markAsDone(workout.id)}
                          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                            isDone
                              ? "border border-[#CCFF00]/30 bg-[#CCFF00]/10 text-[#CCFF00] hover:bg-[#CCFF00]/20"
                              : "bg-[#CCFF00] text-black hover:bg-[#D9FF33]"
                          }`}
                        >
                          {isDone ? (
                            <>
                              <Circle size={16} />
                              Undo
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={16} />
                              Mark Done
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => removeFromPlan(workout.id)}
                          aria-label={`Remove ${workout.name} from today's plan`}
                          className="rounded-lg border border-white/10 p-2.5 text-gray-400 transition hover:border-red-400/40 hover:text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Saved Workouts */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold">
              Saved <span className="text-[#CCFF00]">Workouts</span>
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Workouts you bookmarked for later.
            </p>
          </div>

          {savedWorkouts.length === 0 ? (
            <EmptyState
              icon={<Bookmark size={30} />}
              title="No saved workouts yet"
              description="Save exercises from the workout library to find them here."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {savedWorkouts.map((workout) => (
                <article
                  key={workout.id}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-[#171a20] p-4 transition hover:border-[#CCFF00]/30"
                >
                  <Link
                    href={`/workout/${workout.id}`}
                    className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#22262d]"
                  >
                    <img
                      src={workout.image}
                      alt={workout.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link href={`/workout/${workout.id}`}>
                      <h3 className="line-clamp-2 font-semibold transition hover:text-[#CCFF00]">
                        {workout.name}
                      </h3>
                    </Link>

                    <p className="mt-2 text-sm text-gray-400">
                      {workout.duration} min · {workout.difficulty}
                    </p>

                    <button
                      onClick={() => removeFromSaved(workout.id)}
                      className="mt-3 inline-flex items-center gap-1 text-xs text-red-400 transition hover:text-red-300"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#171a20] p-4 transition hover:border-[#CCFF00]/30 sm:p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#CCFF00]/10 text-[#CCFF00]">
        {icon}
      </div>

      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-[#171a20] px-5 py-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#CCFF00]/10 text-[#CCFF00]">
        {icon}
      </div>

      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">
        {description}
      </p>

      <Link
        href="/"
        className="mt-5 inline-flex rounded-lg bg-[#CCFF00] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#D9FF33]"
      >
        Explore Workouts
      </Link>
    </div>
  );
}
