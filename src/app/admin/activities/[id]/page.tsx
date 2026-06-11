"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ActivityForm } from "@/components/admin/ActivityForm";
import type { Activity } from "@/lib/data";

export default function EditActivityPage() {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    fetch("/api/admin/activities")
      .then(r => r.json())
      .then((acts: Activity[]) => {
        const found = acts.find(a => a.id === id);
        setActivity(found || null);
      });
  }, [id]);

  if (!activity) return <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>טוען...</div>;

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/admin/activities" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>← חזרה לפעילויות</Link>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", marginTop: 8 }}>עריכת: {activity.name}</h1>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 4, padding: "2rem" }}>
        <ActivityForm initial={activity} />
      </div>
    </div>
  );
}
