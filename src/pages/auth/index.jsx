import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { GraduationCap } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

function AuthPage() {


  const [activeTab, setActiveTab] = useState("signin");
  
  
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  function handleTabChange(value) {
    setActiveTab(value);
  }

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  }

  console.log(signInFormData);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]">
    <header className="px-5 lg:px-6 h-14 flex items-center border-b bg-white shadow-sm">
      <Link to={"/"} className="flex items-center justify-center">
        <GraduationCap className="h-10 w-10 mr-4 text-indigo-600" />
        <span className="font-extrabold text-[30px] sm:text-[36px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-transparent bg-clip-text">
          CourseXpert
        </span>
      </Link>
    </header>
    <div className="flex items-center justify-center min-h-screen">
      <Tabs
        value={activeTab}
        defaultValue="signin"
        onValueChange={handleTabChange}
        className="w-full max-w-md"
      >
        <TabsList className="grid w-full grid-cols-2 bg-white rounded-lg shadow-md">
          <TabsTrigger
            value="signin"
            className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600"
          >
            Sign In
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Card className="p-6 space-y-4 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-indigo-700">Sign in to your account</CardTitle>
              <CardDescription>
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <CommonForm
                formControls={signInFormControls}
                buttonText={"Sign In"}
                formData={signInFormData}
                setFormData={setSignInFormData}
                isButtonDisabled={!checkIfSignInFormIsValid()}
                handleSubmit={handleLoginUser}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card className="p-6 space-y-4 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-indigo-700">Create a new account</CardTitle>
              <CardDescription>
                Enter your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <CommonForm
                formControls={signUpFormControls}
                buttonText={"Sign Up"}
                formData={signUpFormData}
                setFormData={setSignUpFormData}
                isButtonDisabled={!checkIfSignUpFormIsValid()}
                handleSubmit={handleRegisterUser}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
  
  );
}

export default AuthPage;
