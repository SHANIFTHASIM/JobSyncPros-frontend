"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";


interface formData{
  email:string,
  password:string,
}

const LOGIN_URL="api/login/"

const Login = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<formData>({
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      credentials: "include",
    });
    
    let data = {}
    try {
      data = await res.json()
      
    } catch (error) {
      
    }
    if (res.ok) {
      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      });
      router.push("/"); // Redirect to the home page
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOAuthLogin = (provider: "google" | "github") => {
    const backendOAuthUrl =
      provider === "google"
        ? "http://localhost:8000/oauth/login/google-oauth2/"  // Use Django's Google OAuth login URL
        : "http://localhost:8000/oauth/login/github/";  // Use Django's GitHub OAuth login URL

    window.location.href = backendOAuthUrl;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">Login</button>

        <div className="flex justify-between mt-4">
          <button type="button" className="bg-slate-200 text-white py-2 px-4 rounded-lg" onClick={() => handleOAuthLogin("google")}>
            <Image src='/google.png' alt="Google OAuth" width={30} height={30} />
          </button>
          <button type="button" className="bg-slate-200 text-white py-2 px-4 rounded-lg" onClick={() => handleOAuthLogin("github")}>
            <Image src='/github.png' alt="GitHub OAuth" width={40} height={40} className=" " />
          </button>
        </div>
      </form>
      <Toaster /> {/* To show notifications */}
    </div>
  );
};

export default Login;




