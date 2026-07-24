"use client";
import { useRef, useEffect } from "react";

const COLORS = ["#0F172A", "#CC2222", "#16a34a", "#2563EB", "#b45309", "#7c3aed", "#db2777"];

const tbBtn: React.CSSProperties = {
  minWidth: 30, height: 30, padding: "0 8px", border: "1px solid #e2e8f0", background: "#fff",
  borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: "Rubik, sans-serif", color: "#334155", lineHeight: 1,
};

/**
 * עורך טקסט עשיר פשוט (ללא תלויות חיצוניות) — שומר HTML.
 * מדגיש, נטוי, קו תחתון, כותרת, רשימות, צבעים, יישור וגודל.
 */
export function RichText({ value, onChange, placeholder }: { value: string; onChange: (html: string) => void; placeholder?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  // אתחול תוכן פעם אחת (כדי לא לקפוץ עם הסמן בכל הקלדה)
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== (value || "")) ref.current.innerHTML = value || "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = () => onChange(ref.current?.innerHTML || "");
  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    emit();
  };

  const Btn = ({ children, cmd, arg, title }: { children: React.ReactNode; cmd: string; arg?: string; title: string }) => (
    <button type="button" title={title} onMouseDown={e => { e.preventDefault(); exec(cmd, arg); }} style={tbBtn}>{children}</button>
  );

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: 6, background: "#f8fafc", borderBottom: "1px solid #eef0f3" }}>
        <Btn cmd="bold" title="מודגש"><b>B</b></Btn>
        <Btn cmd="italic" title="נטוי"><i>I</i></Btn>
        <Btn cmd="underline" title="קו תחתון"><u>U</u></Btn>
        <Btn cmd="formatBlock" arg="H3" title="כותרת">כותרת</Btn>
        <Btn cmd="fontSize" arg="5" title="טקסט גדול">A+</Btn>
        <Btn cmd="fontSize" arg="2" title="טקסט קטן">A-</Btn>
        <Btn cmd="insertUnorderedList" title="רשימת תבליטים">• רשימה</Btn>
        <Btn cmd="insertOrderedList" title="רשימה ממוספרת">1. רשימה</Btn>
        <Btn cmd="justifyRight" title="יישור לימין">⇥</Btn>
        <Btn cmd="justifyCenter" title="מרכוז">↔</Btn>
        {COLORS.map(c => (
          <button key={c} type="button" title="צבע טקסט" onMouseDown={e => { e.preventDefault(); exec("foreColor", c); }}
            style={{ width: 22, height: 22, borderRadius: "50%", border: "1px solid #cbd5e1", background: c, cursor: "pointer", padding: 0 }} />
        ))}
        <Btn cmd="removeFormat" title="נקה עיצוב">נקה</Btn>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        dir="rtl"
        data-placeholder={placeholder || "כתבו כאן את תיאור הפעילות..."}
        onInput={emit}
        onBlur={emit}
        className="rte-input"
        style={{ minHeight: 130, padding: 12, fontSize: 14, lineHeight: 1.75, outline: "none", direction: "rtl", textAlign: "right", color: "#1f2937" }}
      />
    </div>
  );
}
