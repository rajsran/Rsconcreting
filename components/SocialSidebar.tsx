import Image from "next/image";

export default function SocialSidebar() {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
      <a
        href="https://www.instagram.com/rsconcreting/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="flex items-center justify-center w-11 h-11 bg-white rounded-l-2xl shadow-md hover:scale-105 active:scale-95 transition-transform"
      >
        <Image src="/instagram.png" alt="Instagram" width={26} height={26} className="w-[26px] h-[26px] object-contain" />
      </a>
      <a
        href="https://www.facebook.com/profile.php?id=61550892891589"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="flex items-center justify-center w-11 h-11 bg-white rounded-l-2xl shadow-md hover:scale-105 active:scale-95 transition-transform"
      >
        <Image src="/fb.png" alt="Facebook" width={26} height={26} className="w-[26px] h-[26px] object-contain" />
      </a>
    </div>
  );
}
