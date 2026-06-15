import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <AppLogoIcon className="size-8 object-contain rounded-md" />
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-serif font-bold text-base text-[#3A6FA8]">
                    MedPrice
                </span>
            </div>
        </>
    );
}
