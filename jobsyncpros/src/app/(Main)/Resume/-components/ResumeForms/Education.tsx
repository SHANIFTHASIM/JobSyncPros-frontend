import React, { useContext, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ResumeContext } from '@/app/(Main)/_components/Context';

const Education = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useContext must be used within a ResumeProvider');
  }
  
  const { resumeInfo, addEducation, updateEducation, deleteEducation } = context;
  const [educationalList, setEducationalList] = useState(resumeInfo?.education || []);
  const [loading, setLoading] = useState(false);

  interface EducationItem {
    id?: number;
    university_name: string;
    degree: string;
    major: string;
    start_date: string;
    end_date: string;
    description: string;
  }
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newEntries = [...educationalList];
    const { name, value } = event.target;
    newEntries[index][name as keyof EducationItem] = value;
    setEducationalList(newEntries);
  };
  
  const handleDescriptionChange = (value: string, index: number) => {
    const newEntries = [...educationalList];
    newEntries[index].description = value;
    setEducationalList(newEntries);
  };
  
  const validateEducation = (edu: EducationItem) => {
    if (!edu.university_name || !edu.start_date || !edu.end_date) {
      return 'University Name, Start Date, and End Date are required.';
    }
    return null;
  };
  

  const handleSave = async () => {
    setLoading(true);
  
    for (let i = 0; i < educationalList.length; i++) {
      const edu: Omit<Education, 'id'> = {
        university_name: educationalList[i].university_name,
        degree: educationalList[i].degree,
        major: educationalList[i].major,
        start_date: educationalList[i].start_date,
        end_date: educationalList[i].end_date,
        description: educationalList[i].description,
      };
  
      const validationError = validateEducation(edu);
      if (validationError) {
        alert(validationError);
        setLoading(false);
        return;
      }
  
      try {
        if (educationalList[i].id) {
          await updateEducation(educationalList[i].id, edu);
        } else {
          await addEducation(edu);
        }
      } catch (error) {
        console.error('Failed to save education:', error);
        const errorMessage = error instanceof Error ? JSON.parse(error.message) : { error: 'An unknown error occurred' };
        alert(`Error: ${JSON.stringify(errorMessage, null, 2)}`);
        setLoading(false);
        return;
      }
    }
  
    setLoading(false);
  };
  

  const addNewEducation = () => {
    setEducationalList([
      ...educationalList,
      {
        university_name: '',
        degree: '',
        major: '',
        start_date: '',
        end_date: '',
        description: '',
      },
    ]);
  };

  const removeEducation = () => {
    setEducationalList(educationalList.slice(0, -1));
  };

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Education</h2>
      <p>Add Your educational details</p>
      <div>
        {educationalList.map((item, index) => (
          <div key={index}>
            <div className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
              <div className='col-span-2'>
                <label>University Name</label>
                <Input
                  name="university_name"
                  onChange={(e) => handleChange(e, index)}
                  value={item.university_name}
                />
              </div>
              <div>
                <label>Degree</label>
                <Input
                  name="degree"
                  onChange={(e) => handleChange(e, index)}
                  value={item.degree}
                />
              </div>
              <div>
                <label>Major</label>
                <Input
                  name="major"
                  onChange={(e) => handleChange(e, index)}
                  value={item.major}
                />
              </div>
              <div>
                <label>Start Date</label>
                <Input
                  type="date"
                  name="start_date"
                  onChange={(e) => handleChange(e, index)}
                  value={item.start_date}
                />
              </div>
              <div>
                <label>End Date</label>
                <Input
                  type="date"
                  name="end_date"
                  onChange={(e) => handleChange(e, index)}
                  value={item.end_date}
                />
              </div>
              <div className='col-span-2'>
                <label>Description</label>
                <ReactQuill
                  theme="snow"
                  value={item.description}
                  onChange={(value) => handleDescriptionChange(value, index)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <Button variant="outline" onClick={addNewEducation} className="text-primary">+ Add More Education</Button>
          <Button variant="outline" onClick={removeEducation} className="text-primary">- Remove</Button>
        </div>
        <Button disabled={loading} onClick={handleSave}>
          {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default Education;




