import { Head, useForm } from '@inertiajs/react';
import { Smartphone, RefreshCw, AlertTriangle, Link2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface Settings {
    min_version: string;
    latest_version: string;
    app_store_url: string;
    play_store_url: string;
}

export default function VersionSettings({ settings }: { settings: Settings }) {
    const { data, setData, post, processing, errors } = useForm({
        min_version: settings.min_version || '1.0.0',
        latest_version: settings.latest_version || '1.0.0',
        app_store_url: settings.app_store_url || '',
        play_store_url: settings.play_store_url || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/version', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Version configuration saved successfully.');
            },
            onError: () => {
                toast.error('Failed to save version configuration. Please check the fields.');
            }
        });
    };

    return (
        <>
            <Head title="App Version Control" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground flex items-center gap-3">
                        <Smartphone className="w-8 h-8 text-primary" />
                        App Version Control
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Configure client app updates and minimum versions required for Android and iOS clients.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="border border-border shadow-sm bg-card text-card-foreground">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <RefreshCw className="w-5 h-5 text-muted-foreground" />
                                Version Configuration
                            </CardTitle>
                            <CardDescription>
                                Set the version thresholds to control application update alerts.
                            </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="min_version" className="text-sm font-medium">
                                        Minimum Required Version
                                    </Label>
                                    <Input
                                        id="min_version"
                                        value={data.min_version}
                                        onChange={(e) => setData('min_version', e.target.value)}
                                        placeholder="e.g. 1.1.0"
                                        className="bg-background border-input"
                                    />
                                    {errors.min_version && (
                                        <p className="text-sm text-destructive font-medium mt-1">{errors.min_version}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Users on a version lower than this will be forced to update to proceed.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="latest_version" className="text-sm font-medium">
                                        Latest Version
                                    </Label>
                                    <Input
                                        id="latest_version"
                                        value={data.latest_version}
                                        onChange={(e) => setData('latest_version', e.target.value)}
                                        placeholder="e.g. 1.2.0"
                                        className="bg-background border-input"
                                    />
                                    {errors.latest_version && (
                                        <p className="text-sm text-destructive font-medium mt-1">{errors.latest_version}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        The current version in the App Stores. Users below this will see a soft update recommendation.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-border shadow-sm bg-card text-card-foreground">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <Link2 className="w-5 h-5 text-muted-foreground" />
                                App Store Links
                            </CardTitle>
                            <CardDescription>
                                Specify store destination URLs for users when redirecting them to update.
                            </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="app_store_url" className="text-sm font-medium">
                                    Apple App Store URL
                                </Label>
                                <Input
                                    id="app_store_url"
                                    type="url"
                                    value={data.app_store_url}
                                    onChange={(e) => setData('app_store_url', e.target.value)}
                                    placeholder="https://apps.apple.com/app/..."
                                    className="bg-background border-input"
                                />
                                {errors.app_store_url && (
                                    <p className="text-sm text-destructive font-medium mt-1">{errors.app_store_url}</p>
                                )}
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label htmlFor="play_store_url" className="text-sm font-medium">
                                    Google Play Store URL
                                </Label>
                                <Input
                                    id="play_store_url"
                                    type="url"
                                    value={data.play_store_url}
                                    onChange={(e) => setData('play_store_url', e.target.value)}
                                    placeholder="https://play.google.com/store/apps/details?id=..."
                                    className="bg-background border-input"
                                />
                                {errors.play_store_url && (
                                    <p className="text-sm text-destructive font-medium mt-1">{errors.play_store_url}</p>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="flex items-center justify-between border-t border-border bg-muted/30 p-6">
                            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 max-w-[70%]">
                                <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                                <span>
                                    Changes take effect immediately for all active app instances checking version limits.
                                </span>
                            </div>
                            <Button type="submit" disabled={processing} className="font-semibold px-6">
                                {processing ? 'Saving...' : 'Save Configuration'}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </>
    );
}

VersionSettings.layout = {
    breadcrumbs: [
        {
            title: 'App Version Control',
            href: '/admin/version',
        },
    ],
};
