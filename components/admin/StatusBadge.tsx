const STYLES: Record<string, string> = {
  new:       "bg-violet-100 text-violet-700",
  contacted: "bg-sky-100 text-sky-700",
  won:       "bg-emerald-100 text-emerald-700",
  lost:      "bg-gray-100 text-gray-500",
  replied:   "bg-emerald-100 text-emerald-700",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${STYLES[status] ?? STYLES.lost}`}>
      {status}
    </span>
  );
}
