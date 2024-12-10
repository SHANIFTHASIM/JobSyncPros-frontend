import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {
  fetchResume,
  fetchEducations,
  createEducation,
  updateEducation as updateEduApi,
  deleteEducation as deleteEduApi,
} from '../Resume/Api/ResumeApi';

// Assuming the API URL is available as a constant
const API_URL = 'http://127.0.0.1:8000/feature1';

interface Experience {
  id: number;
  title: string;
  company_name: string;
  city: string;
  state: string;
  start_date: string;
  end_date: string;
  currentlyWorking?: boolean;
  work_summary: string;
}

interface Education {
  id: number;
  universityName: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  id: number;
  name: string;
  rating: number;
}

export interface ResumeInfo {
  id: number;
  uuid: string;
  themeColor: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  first_name: string;
  last_name: string;
  job_title: string;
  address: string;
  phone: string;
  email: string;
  summary: string;
}

interface ResumeContextType {
  resumeInfo: ResumeInfo | null;
  setResumeInfo: React.Dispatch<React.SetStateAction<ResumeInfo | null>>;
  addEducation: (newEducation: Omit<Education, 'id'>) => Promise<void>;
  updateEducation: (id: number, updatedEducation: Omit<Education, 'id'>) => Promise<void>;
  deleteEducation: (id: number) => Promise<void>;
  addSkill: (newSkill: Omit<Skill, 'id'>) => Promise<void>;
  updateSkill: (id: number, updatedSkill: Omit<Skill, 'id'>) => Promise<void>;
  deleteSkill: (id: number) => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null);

  // Fetch skills function
  const fetchSkills = async (resumeUUID: string): Promise<Skill[]> => {
    try {
      const response = await fetch(`${API_URL}/skills/?resume_uuid=${resumeUUID}`);
      if (!response.ok) {
        throw new Error('Failed to fetch skills');
      }
      return response.json();
      setResumeInfo((prev) =>
      prev ? { ...prev, skills: [...prev.skills, skill] } : null
    );

    } catch (error) {
      console.error('Error fetching skills:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadResume = async () => {
      const resumeUUID = sessionStorage.getItem('resumeUUID');
      if (resumeUUID) {
        try {
          const resumeData = await fetchResume(resumeUUID);
          const educationData = await fetchEducations(resumeData.id);
          const skillsData = await fetchSkills(resumeUUID);

          const transformedResumeInfo: ResumeInfo = {
            id: resumeData.id,
            uuid: resumeData.uuid,
            themeColor: resumeData.theme_color || '',
            experience: resumeData.experience?.map(exp => ({
              id: exp.id,
              title: exp.title,
              company_name: exp.company_name,
              city: exp.city,
              state: exp.state,
              start_date: exp.start_date,
              end_date: exp.end_date,
              currentlyWorking: exp.currently_working,
              work_summary: exp.work_summary,
            })) || [],
            education: educationData || [],
            skills: skillsData || [], // Include skills in resumeInfo
            first_name: resumeData.first_name || '',
            last_name: resumeData.last_name || '',
            job_title: resumeData.job_title || '',
            address: resumeData.address || '',
            phone: resumeData.phone || '',
            email: resumeData.email || '',
            summary: resumeData.summary || '',
          };

          setResumeInfo(transformedResumeInfo);
        } catch (error) {
          console.error('Failed to load resume data:', error);
        }
      }
    };

    loadResume();
  }, []);

  // Define addEducation function
  const addEducation = async (newEducation: Omit<Education, 'id'>) => {
    try {
      if (!resumeInfo?.uuid) {
        throw new Error('Resume UUID is not available.');
      }

      const education = await createEducation({ ...newEducation, resume: resumeInfo.uuid });
      setResumeInfo((prev) => prev ? { ...prev, education: [...prev.education, education] } : null);
    } catch (error) {
      console.error('Failed to add education:', error);
    }
  };

  // Define updateEducation function
  const updateEducation = async (id: number, updatedEducation: Omit<Education, 'id'>) => {
    try {
      const education = await updateEduApi(id, updatedEducation);
      setResumeInfo((prev) => prev ? { ...prev, education: prev.education.map(edu => edu.id === id ? education : edu) } : null);
    } catch (error) {
      console.error('Failed to update education:', error);
    }
  };

  // Define deleteEducation function
  const deleteEducation = async (id: number) => {
    try {
      await deleteEduApi(id);
      setResumeInfo((prev) => prev ? { ...prev, education: prev.education.filter(edu => edu.id !== id) } : null);
    } catch (error) {
      console.error('Failed to delete education:', error);
    }
  };

  return (
    <ResumeContext.Provider value={{ resumeInfo, setResumeInfo, addEducation, updateEducation, deleteEducation }}>
      {children}
    </ResumeContext.Provider>
  );
};

export { ResumeProvider, ResumeContext };






