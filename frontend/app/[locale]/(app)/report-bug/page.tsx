import PageContainer from "@/components/PageContainer";
import ReportBugForm from "@/components/TypeForms/ReportBugForm";
import { genPageMetadata } from "@/app/seo";
import ReportBugFormWidget from "@/components/TypeForms/ReportBugFormWidget";
import SupportContact from "@/components/SupportContact";

export const metadata = genPageMetadata({
  title: "Signaler un bug",
  description:
    "Signalez un bug ou un problème technique que vous rencontrez sur Goodtobenaked. Vos retours sont précieux pour nous permettre d'améliorer et d'optimiser notre plateforme.",
});

const ReportBugPage = () => {
  return (
    <PageContainer>
      <SupportContact />
    </PageContainer>
  );
};

export default ReportBugPage;
