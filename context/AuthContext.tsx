import axios from "axios";
import React, { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/router";

interface IUser {
  email: string;
  username: string;
}

interface IContextProps {
  user: IUser | null;
  error: any;
  loading: boolean;
  login: (input: { identifier: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<Partial<IContextProps>>({});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  //Login
  const login = async ({
    identifier,
    password,
  }: {
    identifier: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `/api/login`,
        { identifier, password },
        config
      );

      // console.log(data);
      setLoading(false);
      setUser(data.user);
      router.push("/dashboard");
    } catch (error) {
      // console.log(error.response);
      console.log(error.response.data.msg);

      setLoading(false);
      setError(error.response.data.msg);
      //reset error stage
      setError(null);
    }
  };

  //Logout
  const logout = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/logout`);
      // console.log(data);
      setLoading(false);
      setUser(null);
      router.push("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error.response);
    }
  };

  //get User initially
  const checkUserLoggedIn = async () => {
    setLoading(true);
    try {
      const { data } = await axios(`/api/user`);

      setLoading(false);
      // console.log(data);

      setUser(data);
    } catch (error) {
      console.log(error);
      setLoading(false);

      setError(null);
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);
  return (
    <AuthContext.Provider value={{ user, error, loading, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
