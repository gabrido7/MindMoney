export default function Eyebrow({
  children,
  align = "left",
}: {
  children: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`flex items-center gap-2.5 ${align === "center" ? "justify-center" : "justify-start"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
      <span className="font-data text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep">
        {children}
      </span>
    </div>
  );
}
