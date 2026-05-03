"use client";

import React, { useState } from 'react'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader, Send } from "lucide-react";
import { suggestions } from '@/data/constant';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { randomUUID } from 'crypto';
import axios from 'axios';
import { toast } from 'sonner';

const Hero = () => {
    const{user}=useUser();
    const[userInput, setUserInput] = useState<string>();
    const [deviceType, setDeviceType] = useState<string>('website');
    const[loading, setLoading] = useState<boolean>(false);
    const router=useRouter();
        const onCreateProject=async ()=>{
            if(!user){
                router.push('/sign-in');
                return;
            }
            if(!userInput){
                alert('Please enter a prompt');
                return;
            }
           //create new project
           setLoading(true);
           const projectId=crypto.randomUUID();
           const result=await axios.post('/api/project',{
            userInput:userInput,
            device:deviceType,
            projectId:projectId
           })
           if(result.data.msg=='Limit Exceed'){
            setLoading(false);
            toast.error('You have reached the maximum project limit for free users. Please upgrade to the premium plan for unlimited projects.');
            return;
           }
           setLoading(false);
           console.log(result.data)
           //naviagte to project page
           router.push(`/project/${projectId}`);
        }
    return (
        <div className='p-10 md:px-24 lg:px-48 xl:px-60 mt-10'>
            {/* <h2>Design High Quality Designs for Your Web Projects</h2>
        <p className='text-center text-gray-600 text-lg mt-3'>FluxUI is a collection of high-quality React components and templates that you can use to quickly build beautiful websites and applications.</p>
         */}
            <h2 className="text-5xl font-bold text-center text-gray-900">
                <span className="text-primary">AI-Generated</span> UIs for Mobile & Websites
            </h2>
            <p className="text-center text-gray-600 text-lg mt-3">
                FluxUI crafts responsive React components and full templates from prompts.
                <br />
                Perfect for apps, sites—customize and deploy instantly.
            </p>
            <div className="flex w-full  gap-6 items-center justify-center mt-10">
                <InputGroup className='max-w-xl z-10 bg-white/50 rounded-md shadow-md'>
                    <InputGroupTextarea
                        data-slot="input-group-control"
                        className="flex field-sizing-content min-h-20 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
                        placeholder="Enter your prompt here..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                    />
                    <InputGroupAddon align="block-end">
                        <Select defaultValue="Website" onValueChange={(value) => setDeviceType(value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="Website">Website</SelectItem>
                                    <SelectItem value="Mobile App">Mobile App</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputGroupButton className="ml-auto" disabled={loading} size="sm" variant="default" onClick={()=>onCreateProject()}>
                        {loading ? <Loader className='animate-spin'/> : <Send/>}
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div>
               <div className='flex gap-5 mt-4'>
                {suggestions.map((item, index) => (
                <div key={index} className='p-2 border rounded-2xl flex-col items-center bg-white/50 shadow-md flex gap-2 w-full z-10 hover:bg-white/70 transition cursor-pointer '
                onClick={()=>setUserInput(item.description)}>
                     <h2 className='text-lg'>{item.icon}</h2>
                     <h2 className='text-center  text-sm'>{item.name}</h2>
                </div>

                ))}
               </div>
        </div>
    )
}

export default Hero