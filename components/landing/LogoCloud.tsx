import {
  Logo01,
  Logo02,
  Logo03,
  Logo04,
  Logo05,
  Logo06,
  Logo07,
  Logo08,
} from "@/components/landing/Logos";

const LogoCloud = () => {
  return (
    <div className="py-(--section-padding-y) px-(--container-padding-x) bg-background border-y">
      <div className="max-w-(--container-max-w) mx-auto">
        <div className="flex flex-col items-center gap-12">
          <p className="text-sm md:text-base font-medium text-muted-foreground text-center">
            Trusted by teams building at scale.
          </p>

          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center opacity-80 grayscale hover:grayscale-0 transition-all duration-300">
            <Logo01 />
            <Logo02 />
            <Logo03 />
            <Logo04 />
            <Logo05 />
            <Logo06 />
            <Logo07 />
            <Logo08 />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoCloud;
