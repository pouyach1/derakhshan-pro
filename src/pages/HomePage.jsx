import { CATEGORIES, EXPERTISE_LINKS, MIXED, SHOWREEL } from "../data/site.js";
import homeProperties from "../data/homeProperties.json";
import news from "../data/news.json";
import HighlightedProperties from "../components/home/HighlightedProperties.jsx";
import PropertiesSlider from "../components/home/PropertiesSlider.jsx";
import MixedBlock from "../components/home/MixedBlock.jsx";
import ShowreelSection from "../components/home/ShowreelSection.jsx";
import NewsSection from "../components/home/NewsSection.jsx";

export default function HomePage() {
  const featured = CATEGORIES.find((item) => item.featured) || CATEGORIES[0];
  const rest = CATEGORIES.filter((item) => !item.featured);
  const countCategories = [featured, ...rest];

  return (
    <>
      <HighlightedProperties featured={featured} categories={countCategories} />
      <PropertiesSlider properties={homeProperties} />
      <MixedBlock data={MIXED.expertise} links={EXPERTISE_LINKS} mediaRight />
      <MixedBlock data={MIXED.universe} />
      <ShowreelSection src={SHOWREEL} />
      <NewsSection items={news} />
    </>
  );
}
