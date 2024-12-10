import React from 'react';

interface Education {
  id: number;
  universityName: string;
  start_date: string;
  end_date: string;
  degree: string;
  major: string;
  description: string;
}

interface ResumeInfo {
  themeColor: string;
  education: Education[];
}

interface EducationalPreviewProps {
  resumeInfo: ResumeInfo | null;
}

const EducationalPreview: React.FC<EducationalPreviewProps> = ({ resumeInfo }) => {
  const themeColor = resumeInfo?.themeColor || '#3498db';
  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{ color: themeColor }}
      >
        Education
      </h2>
      <hr
       style={{ borderColor: themeColor }}
      />

      {resumeInfo?.education.map((education) => (
        <div key={education.id} className="my-5">
          <h2
            className="text-sm font-bold"
            style={{
              color: resumeInfo?.themeColor,
            }}
          >
            {education.universityName}
          </h2>
          <h2 className="text-xs flex justify-between">
            {education?.degree} in {education?.major}
            <span>{education?.start_date} - {education?.end_date}</span>
          </h2>
          
          <div className="text-xs my-2" dangerouslySetInnerHTML={{ __html: education?.description }} />
        </div>
      ))}
    </div>
  );
};

export default EducationalPreview;
