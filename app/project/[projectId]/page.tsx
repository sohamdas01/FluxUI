"use client"
import React, { useContext, useEffect, useState } from 'react'
import ProjectHeader from './_shared/ProjectHeader'
import SettingSection from './_shared/SettingSection'
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Loader2, Loader2Icon } from 'lucide-react';
import { ProjectType, ScreenConfigType } from '@/type/types';
import Canvas from './_shared/Canvas';
import { SettingContext } from '@/context/SettingContext';
import { RefreshDataContext } from '@/context/RefreshDataContext';

const page = () => {
    const { projectId } = useParams();
    const [projectDetail, setProjectDetail] = useState<ProjectType>();
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('Loading');
    const [screenConfigOriginal, setScreenConfigOriginal] = useState<ScreenConfigType[]>([]);
    const [screenConfig, setScreenConfig] = useState<ScreenConfigType[]>([]);
    const{settingDetails,setSettingDetails}=useContext(SettingContext);
   const{refreshData,setRefreshData}=useContext(RefreshDataContext);
   const[takeScreenShot,setTakeScreenShot]=useState<any>();
    useEffect(() => {
        GetProjectDetails();
    }, [])
    // We can have a separate useEffect to watch for refreshData changes to trigger data refresh when needed, for example after screen deletion
    useEffect(() => {
        if (refreshData?.method=='screnConfig') {
            GetProjectDetails();
        }
    }, [refreshData]);

    // Fetch project details and screen config on component mount
    const GetProjectDetails = async () => {
        setLoading(true);
        setLoadingMessage('Fetching project details...');
        const result = await axios.get('/api/project?projectId=' + projectId);
        console.log(result.data);
        setProjectDetail(result.data?.projectDetail);
        setScreenConfigOriginal(result.data?.screens);
        setScreenConfig(result.data?.screens);
        setSettingDetails(result.data?.projectDetail);
        setLoading(false);
    }
    // We can have a separate useEffect to watch for projectDetail and screenConfig changes to trigger screen config generation if needed
    useEffect(() => {
        if (projectDetail && screenConfigOriginal.length === 0) {
            generateScreenConfig();
        }
        else if (projectDetail && screenConfigOriginal.length > 0) {
            handleGenerateScreenUI();
        }
    }, [projectDetail, screenConfigOriginal])

    // This function can also be called on demand from the UI, for example via a button in the settings section, if we want to allow users to regenerate screen config
    const generateScreenConfig = async () => {
        setLoading(true);
        setLoadingMessage('Generating screen configuration...');
        // Implementation for generating screen config
        const aiResponse = await axios.post('/api/generate-config', {
            userInput: projectDetail?.userInput,
            device: projectDetail?.device,
            projectId: projectId
        });
        console.log(aiResponse.data);
        // After receiving the AI response, we can update the screenConfig state to trigger a re-render with the new config
        GetProjectDetails(); // Re-fetch project details to get the updated screen config from the database
        setLoading(false);
    }

    const handleGenerateScreenUI = async () => {
        setLoading(true);

        for (let i = 0; i < screenConfig.length; i++) {
            const screen = screenConfig[i];
            if (screen?.code) continue; // Skip if code is already generated for the screen
            setLoadingMessage(`Generating UI for screen` + i + 1);
            const result = await axios.post('/api/generate-screen-ui', {
                projectId: projectId,
                screenId: screen.screenId,
                screenName: screen.screenName,
                purpose: screen.purpose,
                screenDescription: screen.screenDescription,
                theme: projectDetail?.theme,               // ← ADD THIS
                device: projectDetail?.device,             // ← ADD THIS
                // projectVisualDescription: projectDetail?.projectVisualDescription // ← ADD THIS
            });
            console.log(result.data)

            setScreenConfig(prev => prev.map((item, idx) => (i === idx ? result.data : item)));
        }
        setLoading(false);
     
    }
    return (
        <div>
            <ProjectHeader />
            <div className='flex'>
                {loading && (
                    <div className='absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-blue-50 border border-blue-400 p-3 px-5 rounded-xl shadow-md flex gap-3 items-center text-blue-600'>
                        <Loader2 className='animate-spin h-5 w-5' />
                        <h2 className='font-medium'>{loadingMessage}</h2>
                    </div>
                )}
                {/* Setting */}
                <SettingSection projectDetail={projectDetail}  screenDescription={screenConfig[0]?.screenDescription} takeScreenShot={() => setTakeScreenShot(Date.now())} />
                {/* canvas */}
                <Canvas projectDetail={projectDetail} screenConfig={screenConfig} takeScreenShot={takeScreenShot}/>
            </div>
        </div>
    )
}

export default page