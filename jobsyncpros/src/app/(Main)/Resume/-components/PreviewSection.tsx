"use client";

import React, { useContext } from 'react';
import PersonalDetailPreview from './Preview/PersonalDetailPreview';
import SummaryPreview from './Preview/SummaryPreview';
import ExperiencePreview from './Preview/ExperiencePreview';
import EducationalPreview from './Preview/EducationalPreview';
import SkillsPreview from './Preview/SkillsPreview';
import { ResumeContext } from '../../_components/Context';

const PreviewSection: React.FC = () => {
  const context = useContext(ResumeContext);

  if (!context) {
    return null; // Or return some fallback UI
  }

  const { resumeInfo } = context;
  const themeColor = resumeInfo?.themeColor || '#3498db';

  return (
    <div
      className="shadow-xl h-full p-14 border-t-[20px]"
      style={{
        borderColor: themeColor // Correctly mapped property
      }}
    >
      {/* Personal Detail */}
      <PersonalDetailPreview resumeInfo={resumeInfo} />

      {/* Summary */}
      <SummaryPreview resumeInfo={resumeInfo} />

      {/* Professional Experience */}
      <ExperiencePreview resumeInfo={resumeInfo} />

      {/* Education */}
      <EducationalPreview resumeInfo={resumeInfo} />

      {/* Skills */}
      <SkillsPreview resumeInfo={resumeInfo} />
    </div>
  );
};

export default PreviewSection;

