import {
  Logo01,
  Logo02,
  Logo03,
  Logo04,
} from "@/components/landing/Logos";

const LogoCloud = () => {
  return (
    <div className="py-16 px-6 bg-muted">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <p className="text-lg md:text-xl font-medium text-muted-foreground whitespace-nowrap">
            Trusted by fast-growing<br className="hidden md:block" />
            companies around the world.
          </p>

          <div className="flex items-center gap-8 md:gap-12 flex-wrap justify-center md:justify-end">
            <Logo01 />
            <Logo02 />
            <Logo03 />
            <Logo04 />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoCloud;
