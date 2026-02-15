import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import { CompanyLogo } from "@/components/ui/company-logo";
import Image from "next/image";

const jobs = [
  {
    company: "Google",
    domain: "google.com",
    position: "Software Engineer",
    location: "Jakarta, Indonesia",
    description: "Bangun sistem AI dan cloud-scale apps bersama tim global.",
  },
  {
    company: "Tokopedia",
    domain: "tokopedia.com",
    position: "Frontend Developer",
    location: "Yogyakarta, Indonesia",
    description: "Kembangkan UI interaktif untuk jutaan pengguna marketplace.",
  },
  {
    company: "Shopee",
    domain: "shopee.co.id",
    position: "Data Analyst",
    location: "Jakarta, Indonesia",
    description:
      "Analisis data transaksi dan bantu keputusan bisnis strategis.",
  },
  {
    company: "Gojek",
    domain: "gojek.com",
    position: "Backend Engineer",
    location: "Bandung, Indonesia",
    description:
      "Rancang microservices untuk layanan transportasi & pembayaran.",
  },
  {
    company: "Telkom Indonesia",
    domain: "telkom.co.id",
    position: "Network Engineer",
    location: "Surabaya, Indonesia",
    description:
      "Optimalkan infrastruktur jaringan nasional berkecepatan tinggi.",
  },
  {
    company: "Bukalapak",
    domain: "bukalapak.com",
    position: "UI/UX Designer",
    location: "Jakarta, Indonesia",
    description: "Desain pengalaman pengguna yang modern dan inklusif.",
  },
  {
    company: "Traveloka",
    domain: "traveloka.com",
    position: "Product Manager",
    location: "Jakarta, Indonesia",
    description: "Pimpin pengembangan fitur baru untuk jutaan traveler.",
  },
  {
    company: "Indosat Ooredoo",
    domain: "indosatooredoo.com",
    position: "Cyber Security Specialist",
    location: "Jakarta, Indonesia",
    description: "Amankan sistem dan data pelanggan dari ancaman siber.",
  },
  {
    company: "Dana Indonesia",
    domain: "dana.id",
    position: "Mobile Developer",
    location: "Jakarta, Indonesia",
    description: "Bangun aplikasi fintech dengan performa tinggi dan UI mulus.",
  },
  {
    company: "Astra International",
    domain: "astra.co.id",
    position: "Project Coordinator",
    location: "Tangerang, Indonesia",
    description:
      "Koordinasikan proyek digitalisasi internal berskala nasional.",
  },
];

const firstRow = jobs.slice(0, jobs.length / 2);
const secondRow = jobs.slice(jobs.length / 2);
const thirdRow = jobs.slice(0, jobs.length / 2);
const fourthRow = jobs.slice(jobs.length / 2);

const JobCard = ({
  domain,
  company,
  position,
  location,
  description,
}: {
  domain: string;
  company: string;
  position: string;
  location: string;
  description: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-fit cursor-pointer overflow-hidden rounded-xl border p-4 sm:w-48",
        "border-gray-950/[.1] bg-gray-50 hover:bg-gray-100",
        "transition-all dark:border-gray-50/[.1] dark:bg-gray-800 dark:hover:bg-gray-700",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <CompanyLogo domain={domain} />

        <div className="flex flex-col">
          <figcaption className="text-sm font-semibold dark:text-white">
            {company}
          </figcaption>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-300">
            {location}
          </p>
        </div>
      </div>

      <blockquote className="text-primaryBlue mt-2 text-sm font-medium">
        {position}
      </blockquote>
      <p className="mt-1 line-clamp-3 text-xs text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </figure>
  );
};

export function InfiniteMovingJobs() {
  return (
    <div className="relative flex h-96 w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:300px]">
      <div
        className="flex flex-row items-center gap-4"
        style={{
          transform:
            "translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
        }}
      >
        <Marquee pauseOnHover vertical className="[--duration:20s]">
          {firstRow.map((job, i) => (
            <JobCard key={i} {...job} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]" vertical>
          {secondRow.map((job, i) => (
            <JobCard key={i} {...job} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]" vertical>
          {thirdRow.map((job, i) => (
            <JobCard key={i} {...job} />
          ))}
        </Marquee>
        <Marquee pauseOnHover className="[--duration:20s]" vertical>
          {fourthRow.map((job, i) => (
            <JobCard key={i} {...job} />
          ))}
        </Marquee>
      </div>

      <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b"></div>
      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  );
}
