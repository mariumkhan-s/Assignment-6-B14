
import Link from "next/link";
import { Clock3, Flame, Star, ArrowUpRight } from "lucide-react";
import type { Workout } from "@/types/workout";

export default function WorkoutCard({
  workout,
}: {
  workout: Workout;
}) {
  return (
    <Link
      href={`/workout/${workout.id}`}
      aria-label={`View ${workout.name} details and add to your plan`}
      className="group block cursor-pointer overflow-hidden rounded-lg border border-[#242620] bg-[#151613] transition duration-300 hover:border-[#CCFF00] hover:shadow-[0_0_18px_rgba(204,255,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CCFF00]"
    >
      {/* Workout Image */}
      <div className="relative h-[170px] overflow-hidden bg-[#20221d]">
        <img
          src={workout.image}
          alt={workout.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        <span className="absolute right-2 top-2 flex items-center gap-1 rounded bg-black/75 px-2 py-1 text-[10px] font-semibold text-[#CCFF00] opacity-0 transition group-hover:opacity-100">
          View details
          <ArrowUpRight size={12} />
        </span>
      </div>

      {/* Workout Information */}
      <div className="p-3.5">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {workout.muscleGroups.map((group) => (
            <span
              key={group}
              className="rounded-sm bg-[#CCFF00] px-2 py-0.5 text-[9px] font-black uppercase text-black"
            >
              {group}
            </span>
          ))}
        </div>

        <h3 className="min-h-9 text-[13px] font-extrabold uppercase leading-5 transition group-hover:text-[#CCFF00]">
          {workout.name}
        </h3>

        <p className="mt-1 truncate text-[10px] text-[#92948b]">
          {workout.equipment}
        </p>

        <div className="mt-3 flex items-center justify-between border-t border-white/[0.07] pt-3 text-[10px] text-[#a3a59c]">
          <span className="flex items-center gap-1">
            <Clock3 size={11} />
            {workout.duration} min
          </span>

          <span className="flex items-center gap-1">
            <Flame size={11} className="text-[#CCFF00]" />
            {workout.caloriesBurned} kcal
          </span>

          <span className="flex items-center gap-1">
            <Star size={11} className="text-[#CCFF00]" />
            {workout.rating}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/[0.07] pt-3 text-[10px] font-bold uppercase tracking-wider text-[#CCFF00]">
          <span>View workout</span>
          <ArrowUpRight
            size={14}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </Link>
  );
}
