import { z } from "zod";

export const SECTORS = [
  { value: "LANDING_PAGE", label: "Landing Page", desc: "Single page, fast launch" },
  { value: "FULL_WEBSITE", label: "Full Website", desc: "Multi-page marketing site" },
  { value: "WEB_APP", label: "Web App", desc: "Logins, dashboards, data" },
  { value: "ECOMMERCE", label: "E-Commerce", desc: "Storefront + checkout" },
  { value: "REDESIGN", label: "Redesign", desc: "Rebuild an existing site" },
] as const;

export const orderSchema = z.object({
  projectName: z.string().trim().min(2, "Give the mission a name").max(120),
  email: z.string().trim().email("Enter a valid email"),
  objective: z.string().trim().min(20, "Describe the objective in a bit more detail").max(2000),
  sector: z.enum([
    "LANDING_PAGE",
    "FULL_WEBSITE",
    "WEB_APP",
    "ECOMMERCE",
    "REDESIGN",
  ]),
  budgetUsd: z.coerce.number().int().min(100).max(1_000_000),
  timelineDays: z.coerce.number().int().min(1).max(365),
  references: z.string().trim().max(500).optional().or(z.literal("")),
});

export type OrderInput = z.infer<typeof orderSchema>;
