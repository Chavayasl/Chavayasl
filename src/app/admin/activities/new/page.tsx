import { ActivityForm } from "@/components/admin/ActivityForm";
import Link from "next/link";

export default function NewActivityPage() {
  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/admin/activities" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>← חזרה לפעילויות</Link>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", marginTop: 8 }}>פעילות חדשה</h1>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 4, padding: "2rem" }}>
        <ActivityForm />
      </div>
    </div>
  );
}
