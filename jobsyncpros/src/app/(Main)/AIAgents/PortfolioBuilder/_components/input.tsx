import React, { useState } from "react";
import { toast } from "@/hooks/use-toast"; // Removed `useToast` destructuring since only `toast` is used
import { useRouter } from "next/navigation";

// Interface for form data
interface FormData {
  name: string;
  profession: string;
  preference: string;
}

// API endpoint
const PORTFOLIOAGENTS_CONTENT_URL = "/api/portfolio_agents";

const InputForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    profession: "",
    preference: "",
  });

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("profession", formData.profession);
    form.append("preference", formData.preference);

    try {
        const res = await fetch(PORTFOLIOAGENTS_CONTENT_URL, {
            method: "POST",
            body: form, // Use FormData here
            credentials: "include", // Include cookies if any
        });

        const data = await res.json();

        if (res.ok) {
            toast({
                title: "Submission Successful",
                description: "Your portfolio has been generated successfully!",
            });

        } else {
            toast({
                title: "Submission Failed",
                description: data.error || "Something went wrong. Please try again.",
                variant: "destructive",
            });
        }
    } catch (error) {
        toast({
            title: "Error",
            description: "Network error. Please check your connection and try again.",
            variant: "destructive",
        });
    }
};


  return (
    <form
      className="bg-white shadow-md rounded px-8 py-6 mt-6"
      onSubmit={handleSubmit}
    >
      <div>
        <h1 className="text-black font-medium">Your Details 🛠</h1>
      </div>

      {/* Name Input */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Your Name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      {/* Profession Input */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="profession"
        >
          Profession
        </label>
        <input
          type="text"
          id="profession"
          name="profession"
          placeholder="e.g., Photographer"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={formData.profession}
          onChange={handleChange}
          required
        />
      </div>

      {/* Preference Input */}
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="preference"
        >
          Preference
        </label>
        <textarea
          id="preference"
          name="preference"
          placeholder="Tell us about yourself and how you want to create it"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows={4}
          value={formData.preference}
          onChange={handleChange}
          required
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Generate Portfolio
        </button>
      </div>
    </form>
  );
};

export default InputForm;

