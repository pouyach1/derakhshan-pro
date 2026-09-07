import { DONE_DEALS } from "../data/deals.js";
import Container from "../components/ui/Container.jsx";
import DealGrid from "../components/ui/DealGrid.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";

export default function DoneDealsPage() {
  return (
    <div className="flex flex-col gap-10">
      <Container>
        <PageHeader
          title="Done Deals"
          description="Sales and leasing deals across Cape Town."
        />
      </Container>
      <DealGrid deals={DONE_DEALS} />
    </div>
  );
}
