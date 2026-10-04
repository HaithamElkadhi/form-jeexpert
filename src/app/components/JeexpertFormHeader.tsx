import Image from "next/image";

export default function JeexpertFormHeader() {
  return (
    <header className="mb-7 flex items-center border-b border-[#D9E2EC] pb-5">
      <Image
        src="/images/jeexpert/01_logo_blue.png"
        width={2172}
        height={724}
        alt="JEExpert"
        className="h-10 w-auto sm:h-12"
        priority
      />
    </header>
  );
}
