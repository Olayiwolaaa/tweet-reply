"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { usePostHog } from "posthog-js/react";

function PostHogPageView() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const posthog = usePostHog();

    useEffect(() => {
        if (!posthog || !posthog.__loaded) return; // Ensure PostHog is ready

        let url = window.origin + pathname;
        if (searchParams.toString()) {
            url = `${url}?${searchParams.toString()}`;
        }

        posthog.capture("$pageview", { $current_url: url });

        return () => {
            posthog.capture("$pageleave", { $current_url: url });
        };
    }, [pathname, searchParams, posthog]);

    return null;
}

export default function SuspendedPostHogPageView() {
    return (
        <Suspense fallback={null}>
            <PostHogPageView />
        </Suspense>
    );
}
