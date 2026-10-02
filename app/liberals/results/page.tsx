import { Suspense } from "react";
import ResultsClient from "./ResultsClient";

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <ResultsClient />
    </Suspense>
  );
}
