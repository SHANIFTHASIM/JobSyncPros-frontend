'use client';

import React, { ChangeEvent, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import useSWR from 'swr';

import { Toaster } from "@/components/ui/toaster";
import { useToast } from '@/hooks/use-toast';

interface Profile {
  uuid: string;
  user: number;
  email: string;
  username: string;
  full_name: string;
  about: string;
  location: string;
  profile_picture: string;
  current_position: string;
  career_status: string;
  career_goals: string;
}

interface CareerStatusOption {
  value: string;
  label: string;
}

const PROFILE_UPDATE_API = '/api/profile';

const fetcher = async (url: string) => {
  const response = await fetch(url, { credentials: 'include' });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Fetch error:', errorData);
    throw new Error(errorData.error || 'Failed to fetch');
  }

  const data = await response.json();

  // Extract career status choices and profile
  const career_status_choices = data.data.career_status_choices || [];
  const profilesArray = data.data.profiles || [];
  const profile = profilesArray.length > 0 ? profilesArray[0] : null;

  return {
    profile,
    career_status_choices,
  };
};

const ProfileComponent: React.FC = () => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch profile data
  const { data: profileData, error: profileError, mutate } = useSWR<{ profile: Profile | null; career_status_choices: CareerStatusOption[] }>('/api/profile', fetcher);

  // Set default profile if none is found
  const defaultProfile: Profile = {
    uuid: '',
    user: 0,
    email: '',
    username: '',
    full_name: '',
    about: '',
    location: '',
    profile_picture: '',
    current_position: '',
    career_status: '',
    career_goals: '',
  };

  const profile = profileData?.profile || defaultProfile;
  const career_status_choices = profileData?.career_status_choices || [];

  if (!profileData) {
    return <p className="text-center mt-4 text-gray-600">Loading profile data...</p>;
  }

  if (!career_status_choices.length) {
    return <p className="text-center mt-4 text-red-600">Error: Career status options not available. Please check the API response.</p>;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (profile) {
      mutate({
        profile: {
          ...profile,
          [e.target.name]: e.target.value,
        },
        career_status_choices,
      }, false);
    }
  };

  const handleCareerStatusChange = (value: string) => {
    if (profile) {
      mutate({
        profile: {
          ...profile,
          career_status: value,
        },
        career_status_choices,
      }, false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('about', profile.about || '');
      formData.append('location', profile.location || '');
      formData.append('career_status', profile.career_status || '');
      formData.append('current_position', profile.current_position || '');
      formData.append('career_goals', profile.career_goals || '');

      if (imageFile) {
        formData.append('profile_picture', imageFile);
      }

      // Send the PUT request to update the profile
      const response = await fetch(PROFILE_UPDATE_API, {
        method: 'PUT',
        body: formData,
        headers: {} // No need to set Content-Type for FormData
      });

      // Log the raw response for debugging
      const textResponse = await response.text(); // Read as text first
      
      // Attempt to parse as JSON
      const jsonResponse = JSON.parse(textResponse); // This may throw if not valid JSON

      if (!response.ok) throw new Error(jsonResponse.error || 'Error updating profile');

      // Update the local profile state and refresh UI
      mutate({
        profile: jsonResponse.data || profile, // Use existing profile if no new data
        career_status_choices,
      }, false);

      // Disable edit mode and show success message
      setEditMode(false);
      toast({
        title: "Profile updated",
        description: 'Profile updated successfully!',
      });

    } catch (error) {
      toast({
        title: "Error",
        description: `Error updating profile: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  if (profileError) {
    return <p className="text-center mt-4 text-red-600">Error loading profile: {profileError.message}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-2xl mt-10">
      <h1 className="text-4xl font-bold mb-6 text-center text-indigo-600">Profile</h1>
      <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Profile Picture and Details */}
        <div className="flex items-center space-x-4">
          <div className="relative w-24 h-24">
            <Image
              src={profile.profile_picture || '/profile.webp'}
              layout="fill"
              objectFit="cover"
              alt="Profile"
              className="rounded-full border-4 border-indigo-600 shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-700">{profile.full_name || 'New User'}</h2>
            <p className="text-gray-600">Email: {profile.email || 'Not provided'}</p>
            <p className="text-gray-600">Username: {profile.username || 'Not provided'}</p>
          </div>
        </div>

        {editMode && (
          <div>
            <label className="block text-gray-700 font-semibold">Change Profile Picture</label>
            <input
              type="file"
              name="profile_picture"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
            />
          </div>
        )}

        {/* About */}
        <div>
          <label className="block text-gray-700 font-semibold">About</label>
          <textarea
            name="about"
            value={profile.about || ''}
            onChange={handleChange}
            readOnly={!editMode}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 ${!editMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
        </div>
        {/* Location */}
        <div>
          <label className="block text-gray-700 font-semibold">Location</label>
          <input
            type="text"
            name="location"
            value={profile.location || ''}
            onChange={handleChange}
            readOnly={!editMode}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${!editMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
        </div>

        {/* Current Position */}
        <div>
          <label className="block text-gray-700 font-semibold">Current Position</label>
          <input
            type="text"
            name="current_position"
            value={profile.current_position || ''}
            onChange={handleChange}
            readOnly={!editMode}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${!editMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
        </div>

        {/* Career Goals */}
        <div>
          <label className="block text-gray-700 font-semibold">Career Goals</label>
          <textarea
            name="career_goals"
            value={profile.career_goals || ''}
            onChange={handleChange}
            readOnly={!editMode}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${!editMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
        </div>

        {/* Career Status */}
        <div>
          <label className="block text-gray-700 font-semibold">Career Status</label>
          <Select 
          onValueChange={handleCareerStatusChange} 
          value={profile.career_status || ''}
          disabled={!editMode} // disable when editMode is false
          >
            <SelectTrigger className="w-full">
              
              <SelectValue placeholder="Choose One ..." />
            </SelectTrigger>
            <SelectContent>
              {career_status_choices.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Edit / Save Button */}
        <div className="text-center">
          {editMode ? (
            <div className="space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={toggleEditMode}
                className="px-4 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={toggleEditMode}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileComponent;



