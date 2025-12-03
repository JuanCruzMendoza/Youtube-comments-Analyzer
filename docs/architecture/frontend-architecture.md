# Frontend Architecture

## Component Organization
The frontend is organized by feature, with shared components, hooks, and services in dedicated directories.
```text
apps/web/
├── app/              # Next.js App Router pages, layouts, and API routes
├── components/       # Shared, stateless UI components (e.g., Radix wrappers)
│   └── ui/
├── features/         # Components implementing specific business logic (e.g., video submission form)
├── hooks/            # Shared React hooks (e.g., useMediaQuery)
├── stores/           # Zustand stores for global client-side state
├── services/         # API client and other external service interactions
└── styles/           # Global styles and Tailwind configuration
```

## Component Template
This example shows a typical "dumb" component that receives data and renders it according to design specifications.
```typescript
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Cluster } from "@repo/shared/types";

export function InsightCard({ cluster }: { cluster: Cluster }) {
  return (
    <Card role="article" aria-label={`Tema ${cluster.label}`}>
      <CardHeader>
        <h3 className="text-lg font-semibold">{cluster.label}</h3>
        <p className="text-sm text-muted-foreground">
          {cluster.frequency}% · {cluster.category}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>{cluster.recommendations?.[0]}</p>
        <ul className="list-disc pl-4 text-sm">
          {cluster.examples.map((example) => (
            <li key={example}>{example}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
```
