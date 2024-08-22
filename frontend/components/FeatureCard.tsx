import React, { FC } from "react";

interface Props {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: FC<Props> = ({ icon, title, description }) => {
  return (
    <div className="text-center max-w-xs w-full">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
