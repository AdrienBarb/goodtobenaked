import React, { FC } from "react";

interface Props {
  title: string;
  description?: string;
}

const LandingHeader: FC<Props> = ({ title, description }) => {
  return (
    <div className="flex items-center flex-col text-center justify-center mb-12">
      <h2 className="font-rubik font-bold text-center text-4xl max-w-md">
        {title}
      </h2>
      {description && <p className="uppercase">{description}</p>}
    </div>
  );
};

export default LandingHeader;
