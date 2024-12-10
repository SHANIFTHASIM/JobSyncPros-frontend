import React from 'react';

interface ResumeInfo {
    summary: string;
}

interface SummaryPreviewProps {
    resumeInfo: ResumeInfo | null;
}

const SummaryPreview: React.FC<SummaryPreviewProps> = ({ resumeInfo }) => {
    const summaryContent = typeof resumeInfo?.summary === 'object' && resumeInfo?.summary !== null
        ? resumeInfo.summary.content
        : resumeInfo?.summary;

    return <p className="text-xs">{summaryContent}</p>;
};

export default SummaryPreview;

