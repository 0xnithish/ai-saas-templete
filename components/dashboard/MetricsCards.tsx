import { RevenueCard } from "./RevenueCard"
import { SubscriptionCard } from "./SubscriptionCard"
import { ActiveUsersCard } from "./ActiveUsersCard"

export function MetricsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <SubscriptionCard />
      <RevenueCard />
      <ActiveUsersCard />
    </div>
  )
}
