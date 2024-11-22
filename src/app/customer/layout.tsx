import React, { Suspense } from "react";
import SharedLayout from '@src/app/shared/SharedLayout';
import LoadingPage from '@src/app/shared/LoadingPage';
import ErrorBoundary from "@src/app/shared/ErrorBoundary";

export default function CustomerLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ErrorBoundary>
          <Suspense fallback={<LoadingPage />}>
            <SharedLayout>{children}</SharedLayout>
          </Suspense>
        </ErrorBoundary>
    );
}
