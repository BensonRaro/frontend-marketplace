import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home/home.tsx"),
  route("jobs", "routes/jobs/jobs.tsx"),
  route("auth/error", "routes/auth/error.tsx"),
  route("verify-email", "routes/auth/verify-email.tsx"),
  route("check-email", "routes/auth/check-email.tsx"),
  route("onboarding", "routes/onboarding/onboarding.tsx"),
  route("verify-stripe", "routes/verify-stripe.tsx"),
  // client dashboard — sidebar layout wraps all client routes
  layout("routes/dashboard/client/layout.tsx", [
    route("dashboard/client", "routes/dashboard/client/dashboard.tsx"),
    route("dashboard/client/jobs", "routes/dashboard/client/jobs.tsx"),
    route("dashboard/client/jobs/new", "routes/dashboard/client/jobs/new.tsx"),
    route("dashboard/client/jobs/:id", "routes/dashboard/client/jobs/detail.tsx"),
    route("dashboard/client/jobs/:id/edit", "routes/dashboard/client/jobs/edit.tsx"),
    route("dashboard/client/proposals", "routes/dashboard/client/proposals.tsx"),
    route("dashboard/client/contracts", "routes/dashboard/client/contracts.tsx"),
    route("dashboard/client/messages", "routes/dashboard/client/messages.tsx"),
    route("dashboard/client/settings", "routes/dashboard/client/settings.tsx"),
  ]),
  // freelancer dashboard — sidebar layout wraps all freelancer routes
  layout("routes/dashboard/freelancer/layout.tsx", [
    route("dashboard/freelancer", "routes/dashboard/freelancer/dashboard.tsx"),
    route("dashboard/freelancer/jobs", "routes/dashboard/freelancer/jobs.tsx"),
    route("dashboard/freelancer/jobs/:id", "routes/dashboard/freelancer/jobs/detail.tsx"),
    route("dashboard/freelancer/proposals", "routes/dashboard/freelancer/proposals.tsx"),
    route("dashboard/freelancer/contracts", "routes/dashboard/freelancer/contracts.tsx"),
    route("dashboard/freelancer/contracts/submit", "routes/dashboard/freelancer/contracts/submit.tsx"),
    route("dashboard/freelancer/messages", "routes/dashboard/freelancer/messages.tsx"),
    route("dashboard/freelancer/settings", "routes/dashboard/freelancer/settings.tsx"),
  ]),
  // admin dashboard — admin-role shell wraps all admin routes
  layout("routes/dashboard/admin/layout.tsx", [
    route("dashboard/admin", "routes/dashboard/admin/dashboard.tsx"),
    route("dashboard/admin/users", "routes/dashboard/admin/users.tsx"),
    route("dashboard/admin/activity-logs", "routes/dashboard/admin/activity-logs.tsx"),
    route("dashboard/admin/settings", "routes/dashboard/admin/settings.tsx"),
  ]),
  // auth — wrapped with layout that blocks logged-in users (except /auth/error)
  layout("routes/auth/layout.tsx", [
    route("login", "routes/auth/login.tsx"),
    route("signup", "routes/auth/signup.tsx"),
    route("register", "routes/auth/register.tsx"),
  ]),
] satisfies RouteConfig;
