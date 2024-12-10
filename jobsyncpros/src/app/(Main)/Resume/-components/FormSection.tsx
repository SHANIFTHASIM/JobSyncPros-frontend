'use client';

import React, { useState, useEffect, useContext } from 'react';
import PersonalDetail from './ResumeForms/PersonalDetail';
import Experience from './ResumeForms/Experience';
import Education from './ResumeForms/Education';
import Skills from './ResumeForms/Skills';
import Summary from './ResumeForms/Summary';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { ResumeContext } from '@/app/(Main)/_components/Context';

const FormSection: React.FC = () => {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(true);
  const context = useContext(ResumeContext);

  if (!context) {
    throw new Error('FormSection must be used within a ResumeProvider');
  }

  const { resumeInfo, setResumeInfo } = context;

  useEffect(() => {
    const storedData = sessionStorage.getItem('resumeInfo');
    if (storedData) {
      setResumeInfo(JSON.parse(storedData));
    }
  }, [setResumeInfo]);

  const handleSave = async () => {
    if (resumeInfo) {
      try {
        sessionStorage.setItem('resumeInfo', JSON.stringify(resumeInfo));
      } catch (error) {
        console.error('Failed to save resume:', error);
      }
    }
  };

  const handleEnabledNext = (v: boolean) => {
    setEnableNext(v);
  };

  return (
    <div>
      <div className='flex justify-between items-center'>
        <div className='flex gap-5'>
          <Link href={"/dashboard"}>
            <Button><Home /></Button>
          </Link>
        </div>
        <div className='flex gap-2'>
          {activeFormIndex > 1 &&
            <Button size="sm" onClick={() => setActiveFormIndex(activeFormIndex - 1)}>
              <ArrowLeft />
            </Button>}
          <Button
            disabled={!enableNext}
            className="flex gap-2"
            size="sm"
            onClick={() => {
              handleSave();
              setActiveFormIndex(activeFormIndex + 1);
            }}
          >
            Next
            <ArrowRight />
          </Button>
        </div>
      </div>

      {activeFormIndex === 1 && <PersonalDetail enabledNext={handleEnabledNext} />}
      {activeFormIndex === 2 && <Summary enabledNext={handleEnabledNext} />}
      {activeFormIndex === 3 && <Experience />}
      {activeFormIndex === 4 && <Education />}
      {activeFormIndex === 5 && <Skills />}
    </div>
  );
};

export default FormSection;



