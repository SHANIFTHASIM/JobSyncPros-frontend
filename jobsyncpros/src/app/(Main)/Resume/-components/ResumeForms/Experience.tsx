"use client";

import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoaderCircle } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchExperiences, updateExperiences } from '../../Api/ResumeApi';
import { ResumeContext } from '@/app/(Main)/_components/Context';

interface Experience {
  id?: string; // UUID of the experience
  title: string;
  company_name: string;
  city: string;
  state: string;
  start_date: string;
  end_date: string;
  work_summary: string;
}

interface ResumeContextType {
  resumeInfo: { [key: string]: any } | null;
  setResumeInfo: React.Dispatch<React.SetStateAction<{ [key: string]: any } | null>>;
}

const Experience: React.FC = () => {
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const { resumeInfo, setResumeInfo } = useContext(ResumeContext) as ResumeContextType;
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const resumeUUID = sessionStorage.getItem('resumeUUID');
        if (!resumeUUID) throw new Error('Resume UUID is not available');
        const experiences = await fetchExperiences(resumeUUID);
        setExperienceList(experiences);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      }
    };

    if (resumeInfo?.experience) {
      setExperienceList(resumeInfo.experience);
    } else {
      loadExperiences();
    }
  }, [resumeInfo]);

  const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setExperienceList(prevList => {
      const newEntries = [...prevList];
      newEntries[index] = { ...newEntries[index], [name]: value };
      return newEntries;
    });
  };

  const handleRichTextEditorChange = (value: string, name: string, index: number) => {
    setExperienceList(prevList => {
      const newEntries = [...prevList];
      newEntries[index] = { ...newEntries[index], [name]: value };
      return newEntries;
    });
  };

  const addNewExperience = () => {
    setExperienceList(prevList => [
      ...prevList,
      {
        title: '',
        company_name: '',
        city: '',
        state: '',
        start_date: '',
        end_date: '',
        work_summary: '',
      },
    ]);
  };

  const removeExperience = () => {
    setExperienceList(prevList => prevList.slice(0, -1));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const resumeUUID = sessionStorage.getItem('resumeUUID');
      if (!resumeUUID) throw new Error('Resume UUID is not available');

      // Use the correct API call based on whether the experience already has an ID (update) or not (create)
      const experiencesToUpdate = experienceList.map(exp => ({
        ...exp,
        resume: resumeUUID, 
        id: exp.id || '',  // Include ID if available
      }));

      const updatedExperiences = await updateExperiences(resumeUUID, experiencesToUpdate);

      setResumeInfo(prevResumeInfo => ({
        ...prevResumeInfo,
        experience: updatedExperiences
      }));
      console.log('Experience saved:', updatedExperiences);
    } catch (error) {
      console.error('Error saving experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Professional Experience</h2>
        <p>Add Your previous Job experience</p>
        <div>
          {experienceList.map((item, index) => (
            <div key={index} className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
              <div>
                <label className='text-xs'>Position Title</label>
                <Input
                  name="title"
                  onChange={(event) => handleChange(index, event)}
                  value={item.title}
                />
              </div>
              <div>
                <label className='text-xs'>Company Name</label>
                <Input
                  name="company_name"
                  onChange={(event) => handleChange(index, event)}
                  value={item.company_name}
                />
              </div>
              <div>
                <label className='text-xs'>City</label>
                <Input
                  name="city"
                  onChange={(event) => handleChange(index, event)}
                  value={item.city}
                />
              </div>
              <div>
                <label className='text-xs'>State</label>
                <Input
                  name="state"
                  onChange={(event) => handleChange(index, event)}
                  value={item.state}
                />
              </div>
              <div>
                <label className='text-xs'>Start Date</label>
                <Input
                  type="date"
                  name="start_date"
                  onChange={(event) => handleChange(index, event)}
                  value={item.start_date}
                />
              </div>
              <div>
                <label className='text-xs'>End Date</label>
                <Input
                  type="date"
                  name="end_date"
                  onChange={(event) => handleChange(index, event)}
                  value={item.end_date}
                />
              </div>
              <div className='col-span-2'>
                <label className='text-xs'>Work Summary</label>
                <ReactQuill
                  theme="snow"
                  value={item.work_summary}
                  onChange={(value) => handleRichTextEditorChange(value, 'work_summary', index)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className='flex justify-between'>
          <div className='flex gap-2'>
            <Button variant="outline" onClick={addNewExperience} className="text-primary">
              + Add More Experience
            </Button>
            <Button variant="outline" onClick={removeExperience} className="text-primary">
              - Remove
            </Button>
          </div>
          <Button disabled={loading} onClick={handleSave}>
            {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Experience;




