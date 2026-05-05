"use client"
import React, { useContext, useEffect, useState, useRef } from 'react'
import ProjectHeader from './_shared/ProjectHeader'
import SettingSection from './_shared/SettingSection'
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { ProjectType, ScreenConfigType } from '@/type/types';
import Canvas from './_shared/Canvas';
import { SettingContext } from '@/context/SettingContext';
import { RefreshDataContext } from '@/context/RefreshDataContext';

const Page = () => {
    const { projectId } = useParams();
    const [projectDetail, setProjectDetail] = useState<ProjectType>();
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('Loading');
    const [screenConfigOriginal, setScreenConfigOriginal] = useState<ScreenConfigType[]>([]);
    const [screenConfig, setScreenConfig] = useState<ScreenConfigType[]>([]);
    const { settingDetails, setSettingDetails } = useContext(SettingContext);
    const { refreshData, setRefreshData } = useContext(RefreshDataContext);
    const [takeScreenShot, setTakeScreenShot] = useState<any>();

    //  Refs to prevent duplicate/concurrent generation
    const hasGenerated = useRef(false);
    const hasGeneratedUI = useRef(false);
    const isGeneratingUI = useRef(false);

    // Reset all refs when projectId changes (navigating to different project)
    useEffect(() => {
        hasGenerated.current = false;
        hasGeneratedUI.current = false;
        isGeneratingUI.current = false;
    }, [projectId]);

    // Initial fetch on mount
    useEffect(() => {
        GetProjectDetails();
    }, []);

    // Watch for refresh triggers (screen added/deleted)
    useEffect(() => {
        if (refreshData?.method === 'screnConfig') {
            GetProjectDetails(true);
        }
    }, [refreshData]);

    // Trigger generation only when projectDetail and screenConfigOriginal are ready
    useEffect(() => {
        if (!projectDetail) return;

        if (screenConfigOriginal.length === 0 && !hasGenerated.current) {
            hasGenerated.current = true;
            generateScreenConfig();
        } else if (screenConfigOriginal.length > 0 && !hasGeneratedUI.current) {
            hasGeneratedUI.current = true;
            handleGenerateScreenUI(screenConfigOriginal);
        }
    }, [projectDetail, screenConfigOriginal]);

    // isRefresh flag: on refresh, allow UI gen to re-run for new screens only
    const GetProjectDetails = async (isRefresh = false) => {
        setLoading(true);
        setLoadingMessage('Fetching project details...');
        const result = await axios.get('/api/project?projectId=' + projectId);
        console.log(result.data);
        setProjectDetail(result.data?.projectDetail);
        setScreenConfigOriginal(result.data?.screens);
        setScreenConfig(result.data?.screens);
        setSettingDetails(result.data?.projectDetail);

        //  On refresh, reset UI gen refs so new screens can be generated
        if (isRefresh) {
            hasGeneratedUI.current = false;
            isGeneratingUI.current = false;
        }

        setLoading(false);
    };

    const generateScreenConfig = async () => {
        setLoading(true);
        setLoadingMessage('Generating screen configuration...');
        try {
            const aiResponse = await axios.post('/api/generate-config', {
                userInput: projectDetail?.userInput,
                device: projectDetail?.device,
                projectId: projectId
            });
            console.log(aiResponse.data);
        } catch (e) {
            console.error('Failed to generate screen config', e);
        }
        // Re-fetch to get the newly created screens from DB
        await GetProjectDetails();
        setLoading(false);
    };

    const handleGenerateScreenUI = async (screens: ScreenConfigType[]) => {
        if (isGeneratingUI.current) return; // prevent concurrent runs
        isGeneratingUI.current = true;
        setLoading(true);

        for (let i = 0; i < screens.length; i++) {
            const screen = screens[i];
            if (screen?.code) continue; // Skip already generated screens

            setLoadingMessage(`Generating UI for screen ${i + 1} of ${screens.length}`);

            try {
                const result = await axios.post('/api/generate-screen-ui', {
                    projectId: projectId,
                    screenId: screen.screenId,
                    screenName: screen.screenName,
                    purpose: screen.purpose,
                    screenDescription: screen.screenDescription,
                    theme: projectDetail?.theme,
                    device: projectDetail?.device,
                });
                console.log(result.data);

                setScreenConfig(prev =>
                    prev.map((item) =>
                        item.screenId === screen.screenId ? result.data : item
                    )
                );
            } catch (e) {
                console.error(`Failed to generate UI for screen: ${screen.screenName}`, e);
            }
        }

        setLoading(false);
        isGeneratingUI.current = false;
    };

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
                {/* Settings Sidebar */}
                <SettingSection
                    projectDetail={projectDetail}
                    screenDescription={screenConfig[0]?.screenDescription}
                    takeScreenShot={() => setTakeScreenShot(Date.now())}
                />
                {/* Canvas */}
                <Canvas
                    projectDetail={projectDetail}
                    screenConfig={screenConfig}
                    takeScreenShot={takeScreenShot}
                />
            </div>
        </div>
    );
};

export default Page;