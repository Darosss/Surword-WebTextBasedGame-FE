"use client";

import Cookies from "js-cookie";
import { FC, createContext, useContext, useEffect, useState } from "react";
import { ApiResponseBody, COOKIE_TOKEN_NAME } from "@/api/fetch";
import { User } from "@/api/types";
import { useFetch } from "@/hooks/useFetch";

export type HeroDetailsType = {
  health: number;
  maxHealth: number;
  level: number;
  experience: number;
  neededExp: number;
};

type ProfileResponseType = {
  user: User;
  heroDetails: HeroDetailsType | null;
};

type ProfileUser = ProfileResponseType["user"];
type ProfileHeroDetails = ProfileResponseType["heroDetails"];

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user: ProfileUser;
  heroDetails: ProfileHeroDetails;
  updateHeroDetails: (update: Partial<ProfileHeroDetails>) => void;
  updateUserDetails: (update: Partial<ProfileUser>) => void;
  fetchProfile: () => Promise<ApiResponseBody<ProfileResponseType> | null>;
};

type AuthContextProps = {
  children: React.ReactNode;
};

const defaultUserData: ProfileUser = {
  id: "",
  username: "",
  email: "",
  roles: [],
  lastLogin: new Date().toISOString(),
  gold: 0,
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: FC<AuthContextProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user, setUser] = useState<ProfileUser>(defaultUserData);
  const [heroDetails, setHeroDetails] = useState<ProfileHeroDetails>(null);

  const {
    api: userApiResponse,
    fetchData: fetchProfile,
    clearCache,
  } = useFetch<ProfileResponseType>(
    {
      url: "profile",
      method: "GET",
    },
    { manual: true }
  );
  useEffect(() => {
    setIsLoggedIn(!!Cookies.get(COOKIE_TOKEN_NAME));
  }, []);

  useEffect(() => {
    const responseData = userApiResponse.responseData;
    const { data } = responseData || {};

    if (data?.user) setUser(data.user);
    if (data?.heroDetails) setHeroDetails(data.heroDetails);
  }, [userApiResponse.responseData]);

  const updateHeroDetails = (update: Partial<ProfileHeroDetails>) => {
    setHeroDetails((prevState) => prevState && { ...prevState, ...update });
  };
  const updateUserDetails = (update: Partial<ProfileUser>) => {
    setUser((prevState) => ({ ...prevState, ...update }));
  };

  useEffect(() => {
    isLoggedIn ? fetchProfile() : clearCache();
  }, [clearCache, fetchProfile, isLoggedIn]);
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        heroDetails,
        updateHeroDetails,
        updateUserDetails,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): Required<AuthContextType> => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
  return authContext as AuthContextType;
};
