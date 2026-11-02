
/*
 * AdminSectionPage
 * -------------------------------------------------------
 * Shared layout for secondary Admin Panel pages.
 *
 * Why this component exists:
 * - Keeps page headings and layouts consistent.
 * - Avoids repeating the same JSX in every admin page.
 * - Makes future design changes easier.
 */

import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminSectionPage({
  title,
  description,
  icon: Icon,
  status = "Setup",
  children,
}) {
  return (
    <section className="space-y-6">
      {/* Page heading and navigation context */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            {Icon && <Icon size={15} />}
            Admin Workspace
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>

        <Link
          to="/admin"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
        >
          Dashboard
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Page-specific content is rendered here */}
      {children || (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            {Icon && <Icon size={26} />}
          </div>

          <h2 className="mt-5 text-lg font-bold text-slate-800">
            {title} workspace
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            This page structure is ready. Its management features and backend
            integration will be added in the next development step.
          </p>

          <span className="mt-5 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            {status}
          </span>
        </div>
      )}
    </section>
  );
}
