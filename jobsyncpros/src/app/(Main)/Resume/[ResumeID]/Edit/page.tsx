// Page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import FormSection from '../../-components/FormSection';
import PreviewSection from '../../-components/PreviewSection';
import { ResumeProvider } from '@/app/(Main)/_components/Context';
import Dummy from '@/app/(Main)/_components/Dummy';

const Page: React.FC = () => {
  const [resumeInfo, setResumeInfo] = useState<typeof Dummy | null>(null);

  useEffect(() => {
    setResumeInfo(Dummy);
  }, []);

  return (
    <ResumeProvider value={{ resumeInfo, setResumeInfo }}>
      <div className="grid grid-cols-1 p-10 gap-10 md:grid-cols-2">
        {/* Form Section */}
        <FormSection />

        {/* Preview Section */}
        <PreviewSection />
      </div>
    </ResumeProvider>
  );
};

export default Page;
