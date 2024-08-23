import React, { FC } from "react";

interface Props {
  title: string;
  description?: string;
}

const LandingHeader: FC<Props> = ({ title, description }) => {
  return (
    <div className="flex justify-center mb-12">
      <h2 className="font-rubik font-bold text-center text-4xl max-w-md">
        {title}
      </h2>
      {description && <p>{description}</p>}
    </div>
  );
};

export default LandingHeader;
