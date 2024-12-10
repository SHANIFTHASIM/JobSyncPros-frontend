'use client';

import React, { useState, useEffect, useContext } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { ResumeContext } from '@/app/(Main)/_components/Context';
import { updatePersonalDetails } from '../../Api/ResumeApi';

interface PersonalDetails {
  first_name: string;
  last_name: string;
  job_title: string;
  address: string;
  phone: string;
  email: string;
}

const PersonalDetail: React.FC<{ enabledNext: (enabled: boolean) => void }> = ({ enabledNext }) => {
  const context = useContext(ResumeContext);

  if (!context) {
    throw new Error('PersonalDetail must be used within a ResumeProvider');
  }

  const { resumeInfo, setResumeInfo } = context;

  const [formData, setFormData] = useState<PersonalDetails>({
    first_name: '',
    last_name: '',
    job_title: '',
    address: '',
    phone: '',
    email: ''
  });

  const [loading, setLoading] = useState(false);

  // Load saved data from sessionStorage or from resumeInfo if available
  useEffect(() => {
    const savedFormData = sessionStorage.getItem('personalDetails');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    } else if (resumeInfo) {
      setFormData({
        first_name: resumeInfo.first_name || '',
        last_name: resumeInfo.last_name || '',
        job_title: resumeInfo.job_title || '',
        address: resumeInfo.address || '',
        phone: resumeInfo.phone || '',
        email: resumeInfo.email || ''
      });
    }
  }, [resumeInfo]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);
    sessionStorage.setItem('personalDetails', JSON.stringify(updatedFormData)); // Save to sessionStorage
    enabledNext(true);
  };

  // Handle form submission and save the data
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (resumeInfo && resumeInfo.uuid) {
        const updatedResume = { ...resumeInfo, ...formData };
        setResumeInfo(updatedResume);  // Update context
        sessionStorage.setItem('personalDetails', JSON.stringify(updatedResume));  // Update sessionStorage

        // Update the backend
        await updatePersonalDetails(resumeInfo.uuid, formData);
      } else {
        console.error('Resume UUID is undefined');
      }
    } catch (error) {
      console.error('Failed to save personal details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Personal Detail</h2>
      <p>Get Started with the basic information</p>
      <form onSubmit={handleSave}>
        <div className='grid grid-cols-2 mt-5 gap-3'>
          <div>
            <label className='text-sm'>First Name</label>
            <Input
              name="first_name"
              value={formData.first_name}
              required
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className='text-sm'>Last Name</label>
            <Input
              name="last_name"
              required
              value={formData.last_name}
              onChange={handleInputChange}
            />
          </div>
          <div className='col-span-2'>
            <label className='text-sm'>Job Title</label>
            <Input
              name="job_title"
              required
              value={formData.job_title}
              onChange={handleInputChange}
            />
          </div>
          <div className='col-span-2'>
            <label className='text-sm'>Address</label>
            <Input
              name="address"
              required
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className='text-sm'>Phone</label>
            <Input
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className='text-sm'>Email</label>
            <Input
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className='mt-3 flex justify-end'>
          <Button type="submit" disabled={loading}>
            {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalDetail;




