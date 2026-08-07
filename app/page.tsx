import Banner from "@/components/public/homePage/Banner";
import FeaturedSection from "@/components/public/homePage/FeaturedSection";

const HomePage = () => {
  return (
    <main className="">
    <div className="flex flex-col">
      <Banner/>
      <FeaturedSection/>
    </div>
    </main>
  );
};

export default HomePage;
