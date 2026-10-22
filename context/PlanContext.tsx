
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Workout } from "@/types/workout";

interface PlanContextType {
  todayPlan: Workout[];
  savedWorkouts: Workout[];
  doneIds: string[];

  addToPlan: (workout: Workout) => void;
  addToSaved: (workout: Workout) => void;

  removeFromPlan: (id: Workout["id"]) => void;
  removeFromSaved: (id: Workout["id"]) => void;

  markAsDone: (id: Workout["id"]) => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [todayPlan, setTodayPlan] = useState<Workout[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
  const [doneIds, setDoneIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load saved FitLog data when the app starts.
  useEffect(() => {
    try {
      const plan = localStorage.getItem("fitlog-today-plan");
      const saved = localStorage.getItem("fitlog-saved-workouts");
      const done = localStorage.getItem("fitlog-done-ids");

      if (plan) {
        setTodayPlan(JSON.parse(plan));
      }

      if (saved) {
        setSavedWorkouts(JSON.parse(saved));
      }

      if (done) {
        setDoneIds(JSON.parse(done));
      }
    } catch (error) {
      console.error("Unable to load FitLog data:", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(
        "fitlog-today-plan",
        JSON.stringify(todayPlan)
      );

      localStorage.setItem(
        "fitlog-saved-workouts",
        JSON.stringify(savedWorkouts)
      );

      localStorage.setItem(
        "fitlog-done-ids",
        JSON.stringify(doneIds)
      );
    } catch (error) {
      console.error("Unable to save FitLog data:", error);
    }
  }, [todayPlan, savedWorkouts, doneIds, hydrated]);

  function addToPlan(workout: Workout) {
    setTodayPlan((current) => {
      const alreadyExists = current.some(
        (item) => String(item.id) === String(workout.id)
      );

      if (alreadyExists) return current;

      return [...current, workout];
    });
  }

  function addToSaved(workout: Workout) {
    setSavedWorkouts((current) => {
      const alreadyExists = current.some(
        (item) => String(item.id) === String(workout.id)
      );

      if (alreadyExists) return current;

      return [...current, workout];
    });
  }

  function removeFromPlan(id: Workout["id"]) {
    const key = String(id);

    setTodayPlan((current) =>
      current.filter((item) => String(item.id) !== key)
    );

    setDoneIds((current) =>
      current.filter((item) => item !== key)
    );
  }

  function removeFromSaved(id: Workout["id"]) {
    setSavedWorkouts((current) =>
      current.filter((item) => String(item.id) !== String(id))
    );
  }

  function markAsDone(id: Workout["id"]) {
    const key = String(id);

    setDoneIds((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    );
  }

  return (
    <PlanContext.Provider
      value={{
        todayPlan,
        savedWorkouts,
        doneIds,
        addToPlan,
        addToSaved,
        removeFromPlan,
        removeFromSaved,
        markAsDone,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);

  if (!context) {
    throw new Error("usePlan must be used inside PlanProvider");
  }

  return context;
}
