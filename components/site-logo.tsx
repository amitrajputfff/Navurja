import Image from "next/image";

export function SiteLogo() {
  return (
    <a
      href="#top"
      className="glass fixed top-5 left-5 z-40 flex items-center gap-2 rounded-full py-2 pr-4 pl-2.5"
    >
      <Image
        src="/logo-icon.png"
        alt=""
        width={28}
        height={28}
        className="h-7 w-7 scale-125 object-contain"
      />
      <span className="text-sm font-semibold tracking-tight text-nav-primary">
        NavUrja
      </span>
    </a>
  );
}
