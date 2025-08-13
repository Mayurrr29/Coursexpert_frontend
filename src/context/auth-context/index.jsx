import { createContext, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(event) {
    event.preventDefault();

    try {
      const data = await registerService(signUpFormData);
      console.log("Register API Response:", data);

      if (data.success) {
        sessionStorage.setItem("accessToken", JSON.stringify(data.data.accessToken));
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        toast.success("Registration successful!");
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        toast.error(data.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setAuth({
        authenticate: false,
        user: null,
      });
      toast.error("Something went wrong during registration.");
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();

    try {
      const data = await loginService(signInFormData);
      console.log("Login API Response:", data);

      if (data.success) {
        sessionStorage.setItem("accessToken", JSON.stringify(data.data.accessToken));
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        toast.success("Login successful!");
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        toast.error(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setAuth({
        authenticate: false,
        user: null,
      });

      if (error.response && error.response.status === 401) {
        toast.error("Invalid email or password");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  }

  async function checkAuthUser() {
    const token = JSON.parse(sessionStorage.getItem("accessToken"));

    if (!token) {
      setAuth({ authenticate: false, user: null });
      setLoading(false);
      return;
    }

    try {
      const data = await checkAuthService(token);

      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      console.log("Auth check failed:", error);
      setAuth({
        authenticate: false,
        user: null,
      });
    } finally {
      setLoading(false);
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
