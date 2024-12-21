import React from "react";
import Link from "next/link";

export const metadata = {
    title: 'Terms and Conditions | AI Survey Generator',
    description: 'Read the terms and conditions of using AI Survey Generator to understand the guidelines and policies for generating surveys.'
};

const TermsAndConditions = () => {
    return (
        <div className="flex flex-col items-center bg-white px-5 py-10 hide-scrollbar animate-fadeIn">
            <div className="max-w-4xl h-fit w-full lg:w-3/4 bg-white rounded-lg px-0 py-8 md:p-8 relative lg:text-justify">
                <h1 className="text-3xl font-bold text-[#4e8d99] mb-6 text-center">Terms and Conditions</h1>
                
                <h2 className="text-xl font-semibold text-[#4e8d99] mb-4">1. Service Usage</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    By using AI Survey Generator, you agree to comply with these terms. Misuse of the platform, including unauthorized access or sharing of generated surveys, is strictly prohibited.
                </p>
                
                <h2 className="text-xl font-semibold text-[#4e8d99] mb-4">2. Pricing and Payments</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Users are charged based on the number of individual profiles generated per survey. Payments must be completed before accessing survey results.
                </p>
                
                <h2 className="text-xl font-semibold text-[#4e8d99] mb-4">3. Refunds and Cancellations</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Refunds are only issued in cases of technical errors where surveys are not generated as promised. Cancellation of services must be requested before survey generation.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    In the case of a payment being debited but the transaction being canceled, the amount will be refunded to your account within 7 business days.
                </p>
                
                <h2 className="text-xl font-semibold text-[#4e8d99] mb-4">4. Liability</h2>
                <p className="text-lg text-gray-700 leading-relaxed ">
                    AI Survey Generator is not liable for incorrect survey results caused by inaccurate input data. We strive to ensure high-quality outputs, but final usage decisions are the user&apos;s responsibility.
                </p>
            </div>
        </div>
    );
};

export default TermsAndConditions;
