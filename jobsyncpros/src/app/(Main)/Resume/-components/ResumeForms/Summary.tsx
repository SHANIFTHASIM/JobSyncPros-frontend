"use client";

import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Brain, LoaderCircle } from 'lucide-react';
import { ResumeContext } from '@/app/(Main)/_components/Context';
import { fetchSummaries, generateSummary_ai, saveSummary } from '../../Api/ResumeApi';

// Assuming ResumeResponse is the correct type for resumeInfo
interface ResumeResponse {
    summary: string;
    uuid: string;
    first_name?: string;
    last_name?: string;
    job_title?: string;
    address?: string;
    phone?: string;
    email?: string;
    theme_color?: string;
}

const Summary: React.FC = () => {
    const context = useContext(ResumeContext);

    // Safely handle undefined context
    if (!context) {
        console.error('ResumeContext is not defined');
        return null;
    }

    const { resumeInfo, setResumeInfo } = context;
    const [summary, setSummary] = useState<string>(resumeInfo?.summary || '');
    const [loading, setLoading] = useState<boolean>(false);
    const [aiGeneratedSummaryList, setAiGeneratedSummaryList] = useState<any[]>([]);

    const resumeId = sessionStorage.getItem('resumeUUID');

    useEffect(() => {
        const loadSummaries = async () => {
            if (!resumeId) {
                console.error('Resume UUID is not available in sessionStorage');
                return;
            }

            try {
                const summaries = await fetchSummaries(resumeId);
                setAiGeneratedSummaryList(summaries);
            } catch (error) {
                console.error('Failed to load summaries:', error);
            }
        };

        loadSummaries();
    }, [resumeId]);

    const onSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!resumeId) {
                console.error('Resume UUID is not available in sessionStorage');
                return;
            }

            const savedSummary = await saveSummary(resumeId, summary);
            setResumeInfo((prevInfo) => {
                if (!prevInfo) {
                    return null;
                }
                return {
                    ...prevInfo,
                    summary: savedSummary.content,
                };
            });
            sessionStorage.setItem('resumeSummary', savedSummary.content);
            console.log('Summary saved:', savedSummary.content);
        } catch (error) {
            console.error('Error saving summary:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateSummary = async () => {
        if (!resumeId) {
            console.error('Resume UUID is not available in sessionStorage');
            return;
        }
        console.log('Generating summary for resume ID:', resumeId);
        setLoading(true);
        try {
            const generatedSummary = await generateSummary_ai(resumeId);  // Calls the updated AI API function
            setSummary(generatedSummary.content);
            setResumeInfo((prevInfo) => {
                if (!prevInfo) {
                    return null;
                }
                return {
                    ...prevInfo,
                    summary: generatedSummary.content,
                };
            });
            setAiGeneratedSummaryList((prev) => [...prev, generatedSummary]);
            sessionStorage.setItem('resumeSummary', generatedSummary.content);
        } catch (error) {
            console.error('Error generating summary:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
                <h2 className='font-bold text-lg'>Summary</h2>
                <p>Add a summary for your job title</p>
                <form className='mt-7' onSubmit={onSave}>
                    <div className='flex justify-between items-end'>
                        <label>Add Summary</label>
                        <Button
                            variant="outline"
                            onClick={handleGenerateSummary}
                            type="button"
                            size="sm"
                            className="border-primary text-primary flex gap-2"
                            disabled={loading}
                        >
                            <Brain className='h-4 w-4' /> {loading ? <LoaderCircle className='animate-spin' /> : 'Generate from AI'}
                        </Button>
                    </div>
                    <Textarea
                        className="mt-5"
                        required
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                    />
                    <div className='mt-2 flex justify-end'>
                        <Button type="submit" disabled={loading}>
                            {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                        </Button>
                    </div>
                </form>
            </div>

            {aiGeneratedSummaryList.length > 0 && (
                <div className='my-5'>
                    <h2 className='font-bold text-lg'>Suggestions</h2>
                    {aiGeneratedSummaryList.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => setSummary(item.content)}
                            className='p-5 shadow-lg my-4 rounded-lg cursor-pointer'
                        >
                            <p>{item.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Summary;

