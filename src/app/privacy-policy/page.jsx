import Link from "next/link";

export const metadata = {
    title: 'Privacy Policy | AI Survey Generator',
    description: 'Get insights into how AI Survey Generator collects, uses, and secures your data with our Privacy Policy. Your privacy is our top priority.'
};

const PrivacyPolicy = () => {
    return (
        <div className="flex flex-col items-center bg-white px-5 py-10 hide-scrollbar animate-fadeIn">
            <div className="max-w-4xl h-fit w-full lg:w-3/4 bg-white rounded-lg px-0 py-8 md:p-8 relative lg:text-justify">
                <Link href={'/about'} className='top-0 lg:top-4 right-4 absolute underline text-[#4e8d99]'>Back</Link>
                <h1 className="text-3xl font-bold text-[#4e8d99] mb-6 text-center">Privacy Policy</h1>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    At <span className="font-semibold text-[#4e8d99]">AI Survey Generator</span>, we prioritize the privacy of our users. This Privacy Policy outlines how we collect, use, and safeguard your information while you use our platform.
                </p>
                <h2 className="text-xl font-semibold text-[#4e8d99] mb-4">Information We Collect</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    We collect user data to provide and improve our services, including survey generation, payment processing, and user support. This includes information you provide directly (e.g., account details) and data collected automatically (e.g., usage logs).
                </p>
                <h2 className="text-xl font-semibold text-[#4e8d99] mb-4">How We Use Your Information</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Your data is used to deliver tailored surveys, process payments, and improve the overall experience. We do not sell or share your information with third parties without your consent.
                </p>
                <h2 className="text-xl font-semibold text-[#4e8d99] mb-4">Data Security</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    We implement robust measures to ensure the security of your data. While no system can guarantee absolute security, we continuously update our practices to protect your information.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;