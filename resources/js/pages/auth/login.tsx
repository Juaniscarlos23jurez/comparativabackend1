import { Form, Head, router } from '@inertiajs/react';
import { IconBrandGoogle, IconBrandApple } from '@tabler/icons-react';
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { app } from '@/lib/firebase';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const [socialLoading, setSocialLoading] = useState(false);
    const auth = getAuth(app);

    const handleGoogleLogin = async () => {
        if (socialLoading) {
            return;
        }

        setSocialLoading(true);
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            router.post('/auth/social-login', {
                email: user.email,
                name: user.displayName || 'User',
                uid: user.uid
            });
        } catch (error) {
            console.error('Google login error:', error);
            setSocialLoading(false);
        }
    };

    const handleAppleLogin = async () => {
        if (socialLoading) {
            return;
        }

        setSocialLoading(true);
        const provider = new OAuthProvider('apple.com');

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            router.post('/auth/social-login', {
                email: user.email,
                name: user.displayName || 'User',
                uid: user.uid
            });
        } catch (error) {
            console.error('Apple login error:', error);
            setSocialLoading(false);
        }
    };

    return (
        <>
            <Head title="Log in" />


            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm"
                                            tabIndex={5}
                                        >
                                            Forgot your password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full h-12 text-[17px] font-semibold rounded-xl bg-primary text-primary-foreground"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </div>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-sm uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                type="button"
                                className="w-full h-12 text-[17px] font-semibold rounded-xl border-border text-foreground hover:bg-muted"
                                onClick={handleGoogleLogin}
                                disabled={socialLoading || processing}
                            >
                                {socialLoading ? <Spinner className="mr-2" /> : <IconBrandGoogle className="mr-2" size={24} />}
                                Google
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                className="w-full h-12 text-[17px] font-semibold rounded-xl border-border text-foreground hover:bg-muted"
                                onClick={handleAppleLogin}
                                disabled={socialLoading || processing}
                            >
                                {socialLoading ? <Spinner className="mr-2" /> : <IconBrandApple className="mr-2" size={24} />}
                                Apple
                            </Button>
                        </div>

                        <div className="text-center text-[17px] text-muted-foreground mt-2">
                            Don't have an account?{' '}
                            <TextLink href={register()} tabIndex={5}>
                                Sign up
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
