
import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PlanProvider } from "@/context/PlanContext";

export const metadata: Metadata = {
  title: "FitLog | Workout Library",
  description:
    "Choose your workouts, plan your training, and track your progress with FitLog.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PlanProvider>
          {children}
          <ToastContainer
            position="bottom-right"
            autoClose={2500}
            theme="dark"
          />
        </PlanProvider>
      </body>
    </html>
  );
}
