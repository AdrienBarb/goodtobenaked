import PageContainer from "@/components/PageContainer";
import ReportContentFormWidget from "@/components/TypeForms/ReportContentFormWidget";
import { genPageMetadata } from "@/app/seo";
import SupportContact from "@/components/SupportContact";

export const metadata = genPageMetadata({
  title: "Signaler un contenu",
  description:
    "Signalez un contenu inapproprié ou enfreignant les règles sur KYYNK. Aidez-nous à maintenir une communauté sûre et respectueuse pour tous les utilisateurs.",
});

const ReportContentPage = () => {
  return (
    <PageContainer>
      <SupportContact />
    </PageContainer>
  );
};

export default ReportContentPage;
