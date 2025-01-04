import React, { useState } from "react";

interface FormData {
  name: string;
  profession: string;
  description: string;
}

const InputForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    profession: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted! Check console for data.");
    console.log(formData);
  };

  return (
    <form className="bg-white shadow-md rounded px-8 py-6 mt-6" onSubmit={handleSubmit}>
        <div>
            <h1>Your Details 🛠</h1>

        </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
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
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profession">
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
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Tell us about yourself"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows={4}
          value={formData.description}
          onChange={handleChange}
        />
        {/* <input
          type="file"
          id="profession"
          name="profession"
          placeholder="e.g., Photographer"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={formData.profession}
          onChange={handleChange}
        /> */}
      </div>
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
