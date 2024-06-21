import { NextIntlClientProvider, useMessages } from "next-intl";
import React, { ReactNode, FC } from "react";

interface Props {
  children: ReactNode;
  locale: string;
}

const TranslationProvider: FC<Props> = ({ children, locale }) => {
  const messages = useMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};

export default TranslationProvider;
