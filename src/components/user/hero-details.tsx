import { FC } from "react";
import { HeroDetailsType } from "../auth/auth-context";
import { ProgressBar } from "../common";

type HeroDetailsProps = {
  details: HeroDetailsType;
};

export const HeroDetails: FC<HeroDetailsProps> = ({ details }) => {
  const { health, maxHealth, experience, level, neededExp } = details;
  return (
    <>
      <div>
        Health:
        <span>
          <ProgressBar
            value={health}
            maxValue={maxHealth}
            valueName="Health"
            maxValueName="Max health"
            showPercents={true}
          />
        </span>
      </div>
      <div>
        Level: <span>{level}</span>
      </div>
      <div>
        Experience:
        <span>
          <ProgressBar
            value={experience}
            maxValue={neededExp}
            valueName="Experience"
            maxValueName="Needed exp"
            showPercents={true}
          />
        </span>
      </div>
    </>
  );
};
