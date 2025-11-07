import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function PartnersSection() {
  const partners = [
    { id: 1, name: "Acme Corp", fallback: "AC" },
    { id: 2, name: "TechFlow", fallback: "TF" },
    { id: 3, name: "DataSync", fallback: "DS" },
    { id: 4, name: "CloudNine", fallback: "CN" },
    { id: 5, name: "InnovateLab", fallback: "IL" },
    { id: 6, name: "NextGen", fallback: "NG" },
  ]

  return (
    <section className="py-4 md:py-6 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-12">
          <p className="text-sm font-medium text-gray-300 whitespace-nowrap">
            Trusted by employees at:
          </p>

          {/* Horizontal row of partner logos */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center justify-center"
              >
                <Avatar className="h-10 w-10 md:h-12 md:w-12">
                  <AvatarImage
                    src={`/partner-logos/${partner.name.toLowerCase().replace(/\s+/g, '-')}.svg`}
                    alt={partner.name}
                  />
                  <AvatarFallback className="bg-gray-700 text-xs font-semibold text-gray-200">
                    {partner.fallback}
                  </AvatarFallback>
                </Avatar>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}