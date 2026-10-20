import Image from "next/image";

export default function JeexpertFormHeader() {
  return (
    <header className="mb-7 flex items-center border-b border-[#D9E2EC] pb-5">
      <Image
        src="/images/jeexpert/sidebar-logo-blue.png"
        width={1254}
        height={1254}
        alt="Jeexpert"
        className="h-24 w-24 object-contain sm:h-[132px] sm:w-[132px]"
        priority
      />
    </header>
  );
}
