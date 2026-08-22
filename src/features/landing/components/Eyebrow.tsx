export default function Eyebrow({
  children,
  align = "left",
}: {
  children: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`flex flex-col gap-2 ${align === "center" ? "items-center" : "items-start"}`}>
      <span className="font-script uppercase text-2xl leading-none text-[var(--brand)]">{children}</span>
      <span className="h-1 w-14 rounded-full bg-[var(--brand)]" />
    </div>
  );
}
