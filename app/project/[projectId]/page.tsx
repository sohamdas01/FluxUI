"use client"
import React, { useEffect, useState } from 'react'
import ProjectHeader from './_shared/ProjectHeader'
import SettingSection from './_shared/SettingSection'
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Loader2Icon } from 'lucide-react';
import { ProjectType,ScreenConfigType } from '@/type/types';
const page = () => {
    const {projectId}=useParams();
    const[projectDetail,setProjectDetail]=useState<ProjectType>();
    const[loading,setLoading]=useState<boolean>(false);
    const[loadingMessage,setLoadingMessage]=useState<string>('Loading');
    const[screenConfig,setScreenConfig]=useState<ScreenConfigType[]>([]);
    useEffect(()=>{
        GetProjectDetails();
    },[])
  // Fetch project details and screen config on component mount
    const GetProjectDetails=async ()=>{
        setLoading(true);
        setLoadingMessage('Fetching project details...');
        const result= await axios.get('/api/project?projectId=' + projectId);
        console.log(result.data);
        setProjectDetail(result.data?.projectDetail);
        setScreenConfig(result.data?.screens);
        // if(result.data?.screenConfig?.length===0){
        //     generateScreenConfig();
        // }
        setLoading(false);
    }
// We can have a separate useEffect to watch for projectDetail and screenConfig changes to trigger screen config generation if needed
    useEffect(()=>{
      if(projectDetail&&screenConfig.length===0){
        generateScreenConfig();
      }
    },[projectDetail,screenConfig])
// This function can also be called on demand from the UI, for example via a button in the settings section, if we want to allow users to regenerate screen config
    const generateScreenConfig=async()=>{
        setLoading(true);
        setLoadingMessage('Generating screen configuration...');
        // Implementation for generating screen config
        const aiResponse = await axios.post('/api/generate-config', {
            userInput: projectDetail?.userInput,
            deviceType: projectDetail?.device ,
            projectId: projectId
        });
        console.log(aiResponse.data);
            // After receiving the AI response, we can update the screenConfig state to trigger a re-render with the new config
            GetProjectDetails(); // Re-fetch project details to get the updated screen config from the database
        setLoading(false);
    }
  return (
    <div>
        <ProjectHeader/>
        <div>
            {loading && (
                <div className='flex flex-col items-center justify-center h-[80vh] gap-3'>
                    <h2><Loader2Icon className='animate-spin'/>{loadingMessage}</h2>
                </div>
            )}
            <SettingSection projectDetail={projectDetail} />
        </div>
    </div>
  )
}

export default page