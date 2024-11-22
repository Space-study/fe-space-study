import React, { Suspense } from "react";
import SharedLayout from '@src/app/shared/SharedLayout';
import LoadingPage from '@src/app/shared/LoadingPage';
import ErrorBoundary from "@src/app/shared/ErrorBoundary";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ErrorBoundary>
            <Suspense fallback={<LoadingPage />}>
                {children}
            </Suspense>
        </ErrorBoundary>
    );
}
