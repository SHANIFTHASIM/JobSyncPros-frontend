import React from 'react';

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

interface ResumeInfo {
  themeColor: string;
  experience: Experience[];
}

interface ExperiencePreviewProps {
  resumeInfo: ResumeInfo | null;
}

const ExperiencePreview: React.FC<ExperiencePreviewProps> = ({ resumeInfo }) => {
  const themeColor = resumeInfo?.themeColor || '#3498db'; 
  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{ color: themeColor }}
      >
        Professional Experience
      </h2>
      <hr
       style={{ borderColor: themeColor }}
      />

      {resumeInfo?.experience?.map((experience) => (
        <div key={experience.id} className="my-5">
          <h2
            className="text-sm font-bold"
            style={{
              color: resumeInfo?.themeColor,
            }}
          >
            {experience?.title}
          </h2>
          <h2 className="text-xs flex justify-between">
            {experience?.company_name}, {experience?.city}, {experience?.state}
            <span>
              {experience?.start_date} To {experience?.currentlyWorking ? 'Present' : experience?.end_date}
            </span>
          </h2>
          <div className="text-xs my-2" dangerouslySetInnerHTML={{ __html: experience?.work_summary }} />
        </div>
      ))}
    </div>
  );
};

export default ExperiencePreview;


