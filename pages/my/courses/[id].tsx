import { useRouter } from "next/router";
import React from "react";

export default function MyCoursePage() {
  const router = useRouter();
  const { id } = router.query;

  React.useEffect(() => {
    if (!router.isReady) return;
    // Requested placeholder behavior
    // eslint-disable-next-line no-console
    console.log("my/courses/[id] =>", id);
  }, [id, router.isReady]);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-lg font-semibold text-foreground">My Course</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Course ID: {String(id ?? "")}
        </p>
      </div>
    </main>
  );
}
