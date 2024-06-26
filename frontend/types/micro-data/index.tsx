export interface FAQMicroDataTypes {
    "@context": string;
    "@type": string;
    mainEntity: MainEntityItem[];
}

interface MainEntityItem {
    "@type": string;
    name: string;
    acceptedAnswer: AcceptedAnswer;
}

interface AcceptedAnswer {
    "@type": string;
    text: string;
}