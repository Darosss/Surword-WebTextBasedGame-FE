import { FC } from "react";
import { useAuthContext } from "@/components/auth";
import { HeroDetails } from "./hero-details";

export const UserDetails: FC = () => {
  const {
    apiUser: { api },
  } = useAuthContext();

  const {
    user: { username, gold },
    heroDetails,
  } = api.data;

  if (!username) return null;

  return (
    <div className="flex justify-around">
      <div>
        Username: <span className="text-primary">{username}</span>
      </div>
      <div>
        Gold: <span className="text-warning">{gold}</span>
      </div>

      {heroDetails ? <HeroDetails details={heroDetails} /> : null}
    </div>
  );
};
