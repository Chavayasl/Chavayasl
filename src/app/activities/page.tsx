"use client";
import { useEffect } from "react";

// אין עמוד פעילויות נפרד — מפנים לקטע הפעילויות בדף הבית
export default function ActivitiesPage() {
  useEffect(() => {
    window.location.replace("/#activities");
  }, []);
  return <div style={{ minHeight: "60vh" }} />;
}
