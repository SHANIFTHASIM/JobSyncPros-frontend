import React from 'react';

interface Skill {
  id: number;
  name: string;
  rating: number;
}

interface ResumeInfo {
  themeColor: string;
  skills: Skill[];
  // other fields...
}

interface SkillsPreviewProps {
  resumeInfo: ResumeInfo | null;
}

const SkillsPreview: React.FC<SkillsPreviewProps> = ({ resumeInfo }) => {
  // Debugging: log the resumeInfo to check its structure and contents
  console.log('resumeInfo skill preview:', resumeInfo);

  if (!resumeInfo || !resumeInfo.skills || resumeInfo.skills.length === 0) {
    return null;
  }

  // Set a default theme color if none is provided
  const themeColor = resumeInfo.themeColor || '#3498db'; // Default color if themeColor is empty

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{ color: themeColor }}
      >
        Skills
      </h2>
      <hr
        className="my-2"
        style={{ borderColor: themeColor }}
      />
      <div className="grid grid-cols-2 gap-3 my-4">
        {resumeInfo.skills.map((skill) => (
          <div key={skill.id} className="flex items-center justify-between">
            <h3 className="text-xs font-semibold">{skill.name}</h3>
            <div className="relative flex items-center w-[120px] bg-gray-200 h-2 rounded">
              <div
                className="absolute top-0 left-0 h-2 rounded"
                style={{
                  backgroundColor: themeColor,
                  width: `${Math.min(skill.rating * 20, 100)}%`, // Cap width at 100%
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsPreview;




