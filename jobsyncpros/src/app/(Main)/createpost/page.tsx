"use client";

import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; 



interface FormData {
    title: string;
    content: string;
    image: File | null;
    video: File | null;
  }


const page = () => {

    const [formData,setFormData]=useState<FormData>({
        title:"",
        content:"",
        image:null,
        video:null,

    })
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    
    const handleChange=(e:ChangeEvent<HTMLInputElement>)=>{
       
        const{name,files,value}=e.target;
        if (files &&files.length>0){
            setFormData((prev)=>({...prev,[name]:files[0]}));

        }else{
            setFormData((prev)=>({...prev,[name]:value}));
        }

    }

    const handleSubmit= async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setLoading(true);
        setError(null);

        const form=new FormData()
        form.append("title",formData.title);
        form.append("content",formData.content);
        if(formData.image) form.append("image",formData.image);
        if(formData.video) form.append("video",formData.video);

        try {
            const res = await fetch("/api/posts", {
              method: "POST",
              body: form,
            });
      
            if (res.ok) {
              const data = await res.json();
              toast({
                title: "Posts",
                description: 'Post added successfully!',
              });
            //   router.push("/posts"); // Redirect to homepage or posts listing page
            } else {
              throw new Error("Failed to create post.");
            }
          } catch (err) {
            setError((err as Error).message || "Something went wrong.");
            toast({
                title: "Error",
                description: "Error adding post",
                variant: "destructive",
              });
          } finally {
            setLoading(false);
          }
        };

    return (
        <form onSubmit={handleSubmit}
         className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">

            <h2 className="text-xl font-bold mb-4">Create a New Post</h2>
            <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                className="w-full p-2 border rounded mb-4"
                required
            />
       
        <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(value)=>
                setFormData((prev)=>({...prev,content:value}))
            }
                placeholder="Tell your story..."
                className="mb-4"
        />
           
            <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
                className="mb-4"
            />
            <input
                type="file"
                name="video"
                onChange={handleChange}
                accept="video/*"
                className="mb-4"
            />
            <button type="submit" 
            className="bg-blue-500 text-white py-2 px-4 rounded">
                Post
            </button>
        </form>
    );
}

export default page