import React from 'react';

interface ResumeInfo {
  themeColor: string;
  first_name: string;
  last_name: string;
  job_title: string;
  address: string;
  phone: string;
  email: string;
}

interface PersonalDetailPreviewProps {
  resumeInfo: ResumeInfo | null;
}

const PersonalDetailPreview: React.FC<PersonalDetailPreviewProps> = ({ resumeInfo }) => {
  const themeColor = resumeInfo?.themeColor || '#3498db'; 
  return (
    <div>
      <h2
        className="font-bold text-xl text-center"
        style={{ color: themeColor }}
      >
        {resumeInfo?.first_name} {resumeInfo?.last_name}
      </h2>
      <h2 className="text-center text-sm font-medium">{resumeInfo?.job_title}</h2>
      <h2
        className="text-center font-normal text-xs"
        style={{ color: resumeInfo?.themeColor }}
      >
        {resumeInfo?.address}
      </h2>
      <div className="flex justify-between">
        <h2 className="font-normal text-xs" style={{ color: resumeInfo?.themeColor }}>
          {resumeInfo?.phone}
        </h2>
        <h2 className="font-normal text-xs" style={{ color: resumeInfo?.themeColor }}>
          {resumeInfo?.email}
        </h2>
      </div>
      <hr className="border-[1.5px] my-2" style={{ borderColor: themeColor }} />
    </div>
  );
};

export default PersonalDetailPreview;




