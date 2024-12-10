// API base URL
const API_URL = 'http://127.0.0.1:8000/feature1';  // Replace with your API base URL

// Define types for function parameters and responses
interface CreateResumeData {
  title: string;
  file?: File;
}

export interface ResumeResponse {
  
  uuid: string;
  first_name : string;
  last_name: string;
  job_title: string;
  address: string;
  phone: string;
  email: string;
  theme_color: string;
  summary: string;
  experience:string;
  skills:string;
}

interface UpdatePersonalDetailsData {
  first_name?: string;
  last_name?: string;
  job_title?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface Skill {
  id: number;
  name: string;
  rating: number;
}

export const createBasicResume = async (data: CreateResumeData): Promise<ResumeResponse> => {
  const formData = new FormData();
  formData.append('title', data.title);
  if (data.file) {
    formData.append('file', data.file);
  }

  try {
    const response = await fetch(`${API_URL}/resumes/create/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create resume');
    }

    const result: ResumeResponse = await response.json();
    const uuid = result.uuid;

    // Store the UUID in session storage
    sessionStorage.setItem('resumeUUID', uuid);

    return result;  // The response will include the UUID of the created resume
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'An unknown error occurred');
    throw error;
  }
};

// Function to fetch the resume data by UUID.
export const fetchResume = async (uuid: string): Promise<ResumeResponse> => {
  if (!uuid || uuid === "undefined") {
    throw new Error('Invalid UUID');
  }

  try {
    const response = await fetch(`${API_URL}/resumes/get_resume/?uuid=${uuid}`);
    if (!response.ok) {
      throw new Error('Failed to fetch resume');
    }
    const result: ResumeResponse = await response.json();

    // Store the UUID in session storage if it's not already there
    if (!sessionStorage.getItem('resumeUUID')) {
      sessionStorage.setItem('resumeUUID', result.uuid);
    }

    return result;
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'An unknown error occurred');
    throw error;
  }
};

// Function to update personal details of a resume by UUID.
export const updatePersonalDetails = async (uuid: string, data: UpdatePersonalDetailsData): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/resumes/${uuid}/update-personal-details/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update personal details');
    }

    return await response.json();
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'An unknown error occurred');
    throw error;
  }
};

// Function to update resume
export const updateResume = async (uuid: string, resumeData: any): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/resumes/${uuid}/update/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resumeData),
    });
    if (!response.ok) {
      throw new Error('Failed to update resume');
    }
    return await response.json();
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'An unknown error occurred');
    throw error;
  }
};


export const fetchSummaries = async (resumeId: string) => {
  try {
    const response = await fetch(`${API_URL}/resumes/${resumeId}/summaries/`);
    if (!response.ok) {
      throw new Error('Failed to fetch summaries');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching summaries:', error);
    throw error;
  }
};

export const generateSummary = async (resumeId: string) => {
  try {
    const response = await fetch(`${API_URL}/resumes/${resumeId}/summaries/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to generate summary');
    }
    return await response.json();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
};

export const saveSummary = async (resumeId: string, summary: string) => {
  try {
    const response = await fetch(`${API_URL}/resumes/${resumeId}/summaries/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resume: resumeId, content: summary }),  // Include resumeId here
    });
    if (!response.ok) {
      throw new Error('Failed to save summary');
    }
    return await response.json();
  } catch (error) {
    console.error('Error saving summary:', error);
    throw error;
  }
};


export const generateSummary_ai = async (resumeId: string) => {
  try {
      const response = await fetch(`${API_URL}/resumes/${resumeId}/summaries/generate/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ resume: resumeId }),
      });
      if (!response.ok) {
          throw new Error('Failed to generate summary');
      }
      const result = await response.json();
      return result;  // Ensure this is of type SummaryItem
  } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
  }
};

export const fetchExperiences = async (resumeUUID: string) => {
  const response = await fetch(`${API_URL}/experiences/?resume=${resumeUUID}`);
  if (!response.ok) throw new Error('Failed to fetch experiences');
  return await response.json();
};

// Update (or bulk update) experiences
export const updateExperiences = async (resumeUUID: string, experiences: Experience[]) => {
  const response = await fetch(`${API_URL}/experiences/update/bulk-update/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resume: resumeUUID,
      experiences: experiences.map(exp => ({
        ...exp,
        resume: resumeUUID, // Ensure the resume UUID is included
      })),
    }),
  });

  if (!response.ok) throw new Error('Failed to update experiences');
  return await response.json();
};


export const fetchEducations = async (resumeId: string) => {
  const response = await fetch(`${API_URL}/educations/?resume=${resumeId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch educations');
  }
  return await response.json();
};

export const createEducation = async (educationData: any) => {
  const response = await fetch(`${API_URL}/educations/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(educationData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData));
  }

  return await response.json();
};

export const updateEducation = async (educationId: number, educationData: any) => {
  const response = await fetch(`${API_URL}/educations/${educationId}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(educationData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData));
  }

  return await response.json();
};


export const deleteEducation = async (educationId: number) => {
  const response = await fetch(`${API_URL}/educations/${educationId}/`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to delete education');
};


// export const fetchSkills = async (resumeUUID: string | null): Promise<Skill[]> => {
//   if (!resumeUUID) throw new Error('Resume UUID is missing');

//   const response = await fetch(`${API_URL}/skills/?resume_uuid=${resumeUUID}`);
//   if (!response.ok) throw new Error('Network response was not ok');

//   const data = await response.json();
//   console.log('Fetched skills:', data);
//   return data;
// };

