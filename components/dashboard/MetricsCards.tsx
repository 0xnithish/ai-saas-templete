import { RevenueCard } from "./RevenueCard"
import { ActiveUsersCard } from "./ActiveUsersCard"

export function MetricsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <RevenueCard />
      <ActiveUsersCard />
    </div>
  )
}
