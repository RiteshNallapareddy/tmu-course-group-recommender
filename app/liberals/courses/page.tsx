import Link from "next/link";
import { getAllCourses } from "@/lib/recommendation";

export default function CoursesPage() {
  const courses = [...getAllCourses()].sort((a, b) =>
    a.courseCode.localeCompare(b.courseCode)
  );

  return (
    <main className="min-h-screen bg-paper">
      <header className="border-b border-line px-6 py-14 md:py-20">
        <div className="max-w-4xl mx-auto">
          <p className="eyebrow text-xs text-blueprint mb-3">
            Table A · Liberal Studies
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-black text-blueprint tracking-tight mb-4">
            All Courses
          </h1>
          <p className="font-body text-ink-soft max-w-lg leading-relaxed">
            Every Engineering-eligible Table A Liberal Studies course we
            have data on. Not sure where to start?{" "}
            <Link
              href="/liberals/quiz"
              className="text-blueprint hover:text-ink underline underline-offset-4"
            >
              Find your match instead →
            </Link>
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div
              key={course.courseCode}
              className="rounded border border-line bg-white p-5 hover:border-blueprint transition-colors"
            >
              <p className="eyebrow text-[0.65rem] text-blueprint mb-2">
                {course.courseCode}
              </p>
              <h2 className="font-display text-lg font-bold text-ink leading-snug mb-2">
                {course.courseName}
              </h2>
              {course.verified.description && (
                <p className="font-body text-sm text-ink-soft leading-relaxed line-clamp-3">
                  {course.verified.description}
                </p>
              )}
              {course.verified.programRestrictions && (
                <p className="font-body text-[0.8rem] text-ink font-medium mt-3">
                  Restriction: {course.verified.programRestrictions}
                </p>
              )}
              {course.verified.descriptionSourceUrl && (
                <a
                  href={course.verified.descriptionSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-display font-bold text-sm text-white bg-blueprint hover:bg-ink transition-colors rounded px-4 py-2 mt-4"
                >
                  View Course
                  <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
