"use client";

import React, { useEffect, useState } from 'react';
import { FaCode, FaPaintBrush, FaPenNib, FaMapMarkerAlt, FaMoneyBillWave, FaLanguage, FaCheck, FaTimes } from 'react-icons/fa';
import parse from 'html-react-parser';
import Link from 'next/link';

interface Job {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  company_logo?: string;
  category?: { name: string };
  salary?: { name: string };
  required_skills?: string;
  languages_required?: string;
  job_state?: { state: string };
  contact_email?: string;
}

interface Filters {
  category?: string;
  description?: string;
  salary?: string;
  location?: string;
  required_skills?: string;
  languages_required?: string;
  jobState?: string;
  url?: string;
}

interface ListingsProps {
  filters: Filters;
  searchTerm: string;
  location: string; // Added location prop
}

const Listings: React.FC<ListingsProps> = ({ filters, searchTerm, location }) => {
  const [listings, setListings] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/feature2/api/fetch-jobs/?query=${encodeURIComponent(searchTerm)}&location=${encodeURIComponent(location)}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setListings(data);
        } else {
          setListings([]);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setListings([]);
      }
    };

    if (searchTerm || location) {
      fetchJobs();
    }
  }, [searchTerm, location]);

  const handleClick = (job: Job) => {
    setSelectedJob(job);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Software Development':
        return <FaCode className="text-blue-600 mr-2" />;
      case 'Design':
        return <FaPaintBrush className="text-pink-600 mr-2" />;
      case 'Writing':
        return <FaPenNib className="text-green-600 mr-2" />;
      default:
        return <FaCode className="text-gray-600 mr-2" />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="w-1/3 bg-white p-5 border-r border-gray-300 overflow-y-auto shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Job Listings</h3>
        {listings.length === 0 ? (
          <p className="text-gray-600">No jobs found</p>
        ) : (
          <ul className="space-y-6">
            {listings.map((job, index) => (
              <li
                key={index}
                className="p-5 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleClick(job)}
              >
                <div className="flex items-center">
                  {job.company_logo && (
                    <img
                      src={job.company_logo}
                      alt={job.company}
                      className="w-16 h-16 rounded-full mr-4 shadow-sm"
                    />
                  )}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                      {job.category ? getCategoryIcon(job.category.name) : getCategoryIcon('')}
                      {job.title}
                    </h4>
                    <h4 className="text-gray-700">{job.company}</h4>
                    
                    <h4 className="text-gray-500">{job.location}</h4> {/* Location added */}
                    <h4 className="text-gray-500">{job.url}</h4> {/* Location added */}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-2/3 p-8 overflow-y-auto bg-white shadow-lg">
        {selectedJob ? (
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">{selectedJob.title}</h3>
            <div className="flex items-center mb-6">
              {selectedJob.company_logo && (
                <img
                  src={selectedJob.company_logo}
                  alt={selectedJob.company}
                  className="w-24 h-24 rounded-full mr-6 shadow-sm"
                />
              )}
              <div>
                <h4 className="text-2xl font-semibold text-gray-900 mb-2">{selectedJob.company}</h4>
                {selectedJob.category && (
                  <p className="flex items-center mb-4">
                    {getCategoryIcon(selectedJob.category.name)}
                    <span className="ml-2 text-lg text-gray-800">{selectedJob.category.name}</span>
                  </p>
                )}
                {selectedJob.salary && (
                  <p className="flex items-center mb-4">
                    <FaMoneyBillWave className="text-gray-500 mr-2" />
                    <span className="text-lg font-medium">Salary:</span> {selectedJob.salary.name}
                  </p>
                )}
                <p className="flex items-center mb-4">
                  <FaMapMarkerAlt className="text-gray-500 mr-2" />
                  <span className="text-lg font-medium">Location:</span> {selectedJob.location}
                </p>
                <p className="flex items-center mb-4">
                  <FaCheck className="text-gray-500 mr-2" />
                  <span className="text-lg font-medium">Required Skills:</span> {selectedJob.required_skills}
                </p>
                <p className="flex items-center mb-4">
                  <FaLanguage className="text-gray-500 mr-2" />
                  <span className="text-lg font-medium">Languages Required:</span> {selectedJob.languages_required}
                </p>
                <p className="flex flex-col items-center mb-4">
                  {selectedJob.job_state?.state === 'Open' ? (
                    <FaCheck className="text-green-500 mr-2" />
                  ) : (
                    <FaTimes className="text-red-500 mr-2" />
                  )}
                  <span className="text-lg font-medium">Job State:</span> {selectedJob.job_state?.state}
                  <p className="text-gray-700 text-lg font-medium"> Job Discription: {parse(selectedJob.description)}</p>
                </p>
                <p className="flex items-center">
                 <Link href={selectedJob.url} ><span className="text-lg font-medium">Apply Link:</span> {selectedJob.url}</Link> 
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Select a job to view details</p>
        )}
      </div>
    </div>
  );
};

export default Listings;



