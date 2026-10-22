import { Suspense } from "react";
import WorkoutDetails from "./WorkoutDetails";

type WorkoutDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default function WorkoutDetailsPage({
  params,
}: WorkoutDetailsPageProps) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#0d0f12] px-4 text-white">
          <p className="text-lg text-gray-300">
            Loading workout details...
          </p>
        </main>
      }
    >
      <WorkoutDetailsRoute params={params} />
    </Suspense>
  );
}

async function WorkoutDetailsRoute({
  params,
}: WorkoutDetailsPageProps) {
  const { id } = await params;

  return <WorkoutDetails id={id} />;
}