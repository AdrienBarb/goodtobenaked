import { genPageMetadata } from "@/app/seo";
import PageContainer from "@/components/PageContainer";
import SupportContact from "@/components/SupportContact";
import ContactForm from "@/components/TypeForms/ContactForm";

export const metadata = genPageMetadata({
  title: "Contactez-nous",
  description:
    "Contactez l'équipe de Goodtobenaked pour toute question, demande de support ou proposition de partenariat. Nous sommes à votre écoute et nous ferons de notre mieux pour vous aider.",
});

const ContactUsPage = () => {
  return (
    <PageContainer>
      <SupportContact />
    </PageContainer>
  );
};

export default ContactUsPage;
