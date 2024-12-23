import Footer from '@/components/Footer';
import SurveyForm from '@/components/SurveyForm';
import SurveyResults from '@/components/SurveyResults';

export default function HomePage() {
  return (
    <>
      <main className="w-full flex-1 bg-gray-100 mx-auto flex flex-col lg:flex-row ">
        <div className="flex-1 bg-white flex-col hide-scrollbar relative">
          <div className="flex flex-col gap-4 items-center px-5 py-10 border-b-2 border-gray-200 mx-auto">
            <h1 className="text-base font-semibold uppercase text-center text-gray-400">
              AI Survey Generator
            </h1>
            <h1 className="text-3xl lg:text-4xl text-center capitalize font-semibold text-[#4e8d99]">
              Generate AI <br /> Survey and get the results
            </h1>
          </div>
          <div className="px-4 lg:px-20">
            <SurveyForm />
          </div>
        </div>
        <div className="flex-1 h-full sticky top-20 bg-transparent z-10">
          <SurveyResults />
        </div>
      </main>
      <Footer />
    </>
  );
}
