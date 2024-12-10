"use client";

import React, { useState, useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { LoaderCircle } from 'lucide-react';
import { ResumeInfo,ResumeContext } from '@/app/(Main)/_components/Context';
 

type Skill = {
  id: number;
  name: string;
  rating: number;
};

const API_URL = 'http://127.0.0.1:8000/feature1';

const Skills: React.FC = () => {
  const context = useContext(ResumeContext);

  if (!context) {
    console.error('ResumeContext is undefined');
    return null;
  }

  const { resumeInfo, setResumeInfo } = context;
  const [loading, setLoading] = useState<boolean>(false);
  const [newSkill, setNewSkill] = useState<Skill>({ id: 0, name: '', rating: 0 });

  useEffect(() => {
    if (resumeInfo?.uuid) {
      loadSkills(resumeInfo.uuid);
    }
  }, [resumeInfo?.uuid]);

  const loadSkills = async (resumeUUID: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/skills/?resume_uuid=${resumeUUID}`);
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setResumeInfo?.((prev: ResumeInfo | null) =>
        prev ? { ...prev, skills: data } : prev
      );
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSkill = async (skill: Skill): Promise<Skill | null> => {
    try {
      const response = await fetch(`${API_URL}/skills/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...skill, resume_uuid: resumeInfo?.uuid }),
      });

      if (!response.ok) throw new Error('Failed to create skill');

      const createdSkill = await response.json();
      setResumeInfo?.((prev: ResumeInfo | null) =>
        prev ? { ...prev, skills: [...prev.skills, createdSkill] } : prev
      );
      return createdSkill;
    } catch (error) {
      console.error('Failed to create skill:', error);
      return null;
    }
  };

  const updateSkill = async (skill: Skill): Promise<Skill | null> => {
    try {
      const response = await fetch(`${API_URL}/skills/${skill.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...skill, resume_uuid: resumeInfo?.uuid }),
      });
      if (!response.ok) throw new Error('Failed to update skill');

      const updatedSkill = await response.json();
      setResumeInfo?.((prev: ResumeInfo | null) =>
        prev
          ? {
              ...prev,
              skills: prev.skills.map((s: Skill) =>
                s.id === skill.id ? updatedSkill : s
              ),
            }
          : prev
      );
      return updatedSkill;
    } catch (error) {
      console.error('Failed to update skill:', error);
      return null;
    }
  };

  const deleteSkill = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/skills/${id}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_uuid: resumeInfo?.uuid }),
      });
      if (!response.ok) throw new Error('Failed to delete skill');

      setResumeInfo?.((prev: ResumeInfo | null) =>
        prev ? { ...prev, skills: prev.skills.filter((skill: Skill) => skill.id !== id) } : prev
      );
    } catch (error) {
      console.error('Failed to delete skill:', error);
    }
  };

  const handleChange = (index: number, field: keyof Skill, value: any) => {
    const updatedSkills = [...(resumeInfo?.skills || [])];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setResumeInfo?.((prev: ResumeInfo | null) =>
      prev ? { ...prev, skills: updatedSkills } : prev
    );
  };

  const handleNewSkillChange = (field: keyof Skill, value: any) => {
    setNewSkill((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!resumeInfo?.uuid) {
      console.error('No resumeId found');
      return;
    }

    setLoading(true);

    try {
      for (const skill of resumeInfo.skills) {
        if (skill.id !== 0) {
          await updateSkill(skill);
        }
      }

      if (newSkill.name.trim() && newSkill.rating) {
        await createSkill(newSkill);
        setNewSkill({ id: 0, name: '', rating: 0 });
      }

      await loadSkills(resumeInfo.uuid);
    } catch (error) {
      console.error('Failed to save skills:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Skills</h2>
      <p>Add your top professional key skills</p>

      <div>
        {resumeInfo?.skills.map((item: Skill, index: number) => (
          <div key={item.id} className='flex justify-between mb-2 border rounded-lg p-3'>
            <div className='flex-1 mr-2'>
              <label className='text-xs'>Name</label>
              <Input
                className="w-full"
                value={item.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
              />
            </div>
            <div className='flex-1 mr-2'>
              <label className='text-xs'>Rating</label>
              <Rating
                style={{ maxWidth: 120 }}
                value={item.rating}
                onChange={(v: number) => handleChange(index, 'rating', v)}
              />
            </div>
            <Button onClick={() => deleteSkill(item.id)}>Delete</Button>
          </div>
        ))}
      </div>

      <div className='flex flex-col mt-4'>
        <h3 className='font-bold text-lg'>Add New Skill</h3>
        <div className='flex justify-between mb-2 border rounded-lg p-3'>
          <div className='flex-1 mr-2'>
            <label className='text-xs'>Name</label>
            <Input
              className="w-full"
              value={newSkill.name}
              onChange={(e) => handleNewSkillChange('name', e.target.value)}
            />
          </div>
          <div className='flex-1 mr-2'>
            <label className='text-xs'>Rating</label>
            <Rating
              style={{ maxWidth: 120 }}
              value={newSkill.rating}
              onChange={(v: number) => handleNewSkillChange('rating', v)}
            />
          </div>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save
        </Button>
      </div>
    </div>
  );
};

export default Skills;




