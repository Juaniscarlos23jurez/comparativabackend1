import type { UrlMethodPair } from '@inertiajs/core';
import { router } from '@inertiajs/react';
import { usePasskeyVerify } from '@laravel/passkeys/react';
import { Separator } from '@/components/ui/separator';

type Props = {
    routes?: {
        options: UrlMethodPair;
        submit: UrlMethodPair;
    };
    label?: string;
    loadingLabel?: string;
    separator?: string;
};

export default function PasskeyVerify({
    routes,
    separator,
}: Props = {}) {
    const { isSupported } = usePasskeyVerify({
        ...(routes && {
            routes: {
                options: routes.options.url,
                submit: routes.submit.url,
            },
        }),
        onSuccess: (response) => {
            router.visit(response.redirect ?? '/dashboard');
        },
    });

    if (!isSupported) {
        return null;
    }

    return (
        <>
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        {separator ?? 'Or continue with email'}
                    </span>
                </div>
            </div>
        </>
    );
}
