import { Suspense } from "react";
import GroupsResultsClient from "./GroupsResultsClient";

export default function GroupsResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <GroupsResultsClient />
    </Suspense>
  );
}
