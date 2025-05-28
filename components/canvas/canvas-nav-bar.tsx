import Switch from "@/app/components/Switch";
import { Shirt } from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  const id = "pacifico-font";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Pacifico&display=swap";
    document.head.appendChild(link);
  }
}

const CanvasNavBar = () => {
  return (
    <nav className="bg-background px-4 py-2 flex items-center justify-between w-full shadow-sm">
      {/* Left: Lucide Shirt and Tifinity */}
      <Link href="/">
        <div className="flex items-center gap-2">
          <Shirt color="#8B5CF6" size={36} />
          <span
            className="text-3xl font-bold text-foreground tracking-tight select-none"
            style={{ fontFamily: "Pacifico, cursive" }}
          >
            Tifinity
          </span>
        </div>
      </Link>
      {/* Right: Theme Switch */}
      <div className="flex items-center">
        <Switch />
      </div>
    </nav>
  );
};

export default CanvasNavBar;
