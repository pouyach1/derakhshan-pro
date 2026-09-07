import { Link } from "react-router-dom";
import { DONE_DEALS } from "../data/deals.js";
import Container from "../components/ui/Container.jsx";
import DealGrid from "../components/ui/DealGrid.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10">
      <Container>
        <PageHeader
          title="Here’s a look at our work"
          description="Browse a selection of our sales and leasing deals across Cape Town."
        />
        <Link
          to="/done-deals"
          className="inline-flex text-sm uppercase tracking-[0.14em] text-brand"
        >
          See our track record
        </Link>
      </Container>
      <DealGrid deals={DONE_DEALS.slice(0, 6)} />
    </div>
  );
}
