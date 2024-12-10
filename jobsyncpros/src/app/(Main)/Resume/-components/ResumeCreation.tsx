"use client"



import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, PlusSquare } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { createBasicResume } from '../Api/ResumeApi';

const AddResume: React.FC = () => {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    interface CreateResumeData {
      title: string;
      file?: File | null;  // Updated to allow null
    }



    const handleCreateResume = async () => {
        setLoading(true);
        try {
          const data: CreateResumeData = { title, file: file || undefined };
            const newResume = await createBasicResume(data);
            console.log('Resume created:', newResume);

            // Reset the form fields
            setTitle('');
            setFile(null);

            // Store the UUID in session storage
            sessionStorage.setItem('resumeUUID', newResume.uuid);

            // Redirect to the Edit page of the created resume using its UUID
            router.push(`/Resume/${newResume.uuid}/Edit`);
        } catch (error) {
            console.error('Failed to create resume:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <div
                        className="p-14 py-24 border 
                        items-center flex 
                        justify-center bg-secondary
                        shadow-md
                        rounded-lg h-[280px]
                        hover:scale-105 transition-all hover:shadow-lg
                        cursor-pointer border-dashed"
                    >
                        <PlusSquare />
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Resume</DialogTitle>
                        <DialogDescription>
                            <Input
                                className="my-2"
                                placeholder="Add a title for your new resume"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </DialogDescription>
                        <DialogDescription>
                            <DialogTitle className='text-black'>Upload Resume</DialogTitle>
                            <Input
                                type='file'
                                className="my-2"
                                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            />
                        </DialogDescription>
                        <div className="flex justify-end gap-5">
                            <Button variant="ghost">Cancel</Button>
                            <Button onClick={handleCreateResume} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin mr-2" /> : 'Create'}
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddResume;



