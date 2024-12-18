import Link from 'next/link';
import React from 'react';

// About Us Component
export const metadata = {
    title: 'About AI Survey Generator',
    description: 'Learn more about AI Survey Generator, our mission, and how we provide customizable survey solutions powered by AI.'
};

const About = () => {
    return (
        <div className="flex-1 flex flex-col items-center bg-white overflow-y-scroll px-5 py-10 hide-scrollbar animate-fadeIn">
            <div className="max-w-4xl h-fit w-full lg:w-3/4 bg-white rounded-lg px-0 py-8 md:p-8 relative lg:text-justify">
                <Link href={'/'} className='top-4 right-4 absolute underline text-[#4e8d99]'>Back</Link>
                <h1 className="text-3xl font-bold text-[#4e8d99] mb-6 text-center">About Us</h1>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Welcome to <span className="font-semibold text-[#4e8d99]">AI Survey Generator</span>, a platform designed to help you create personalized surveys using advanced AI technology. Our goal is to simplify the process of gathering insights through customized surveys tailored to your specific needs.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Whether you're conducting market research, collecting feedback, or analyzing trends, our platform ensures efficient and accurate survey creation. We charge based on the number of individual profiles generated for your surveys, providing a scalable and transparent pricing model.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Our team is dedicated to improving our service and incorporating your feedback to make AI Survey Generator even better. Thank you for choosing us for your survey needs.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    For more information, feel free to <Link href="/contact" className="underline text-[#4e8d99]">contact us</Link> or review our <Link href="/terms-and-conditions" className="underline text-[#4e8d99]">Terms and Conditions</Link> and <Link href="/privacy-policy" className="underline text-[#4e8d99]">Privacy Policy</Link>.
                </p>
            </div>
        </div>
    );
};

export default About;

