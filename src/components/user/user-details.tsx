import { FC } from "react";
import styles from "./user-details.module.scss";
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
    <div className={styles.userDetailsWrapper}>
      <div>
        Username: <span>{username}</span>
      </div>
      <div>
        Gold: <span>{gold}</span>
      </div>

      {heroDetails ? <HeroDetails details={heroDetails} /> : null}
    </div>
  );
};
