"use client"
import React, { useEffect, useState, useContext } from 'react'
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Camera, Loader2Icon, Share, Sparkle, SparkleIcon,Loader2 } from 'lucide-react';
import { THEME_LIST_NAME, THEMES } from '@/data/Themes';
import { ProjectType } from '@/type/types';
import { SettingContext } from '@/context/SettingContext';
import axios from 'axios';
import { RefreshDataContext } from '@/context/RefreshDataContext';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
// This component can be expanded to include more settings as needed, such as theme selection, project name editing, screen generation input, etc. For now, it includes placeholders for these functionalities.
type Props = {
    projectDetail: ProjectType | undefined,
    screenDescription?: string | undefined,
    takeScreenShot:any
}
const SettingSection = ({ projectDetail, screenDescription, takeScreenShot }: Props) => {
    const [selectedTheme, setSelectedTheme] = useState(' DUSTY_ORCHID');
    // const[projectName,setProjectName]=useState(projectDetail?.projectName );
    const [projectName, setProjectName] = useState('');
    const [generateScreenInput, setGenerateScreenInput] = useState<string>('');
    const { settingDetails, setSettingDetails } = useContext(SettingContext);
    const [loading, setLoading] = useState(false);
     const{refreshData,setRefreshData}=useContext(RefreshDataContext);
    const [loadingMessage,setLoadingMessage]=useState<string>('Loading');

    const {has}=useAuth();
    const hasPremium=has({plan:'unlimited'});
    // We can have useEffects to initialize the state based on projectDetail when it is loaded
    useEffect(() => {
        projectDetail && setProjectName(projectDetail?.projectName ?? '');
        setSelectedTheme(projectDetail?.theme as string);
    }, [projectDetail])
    const onThemeSelect = (theme: string) => {
        setSelectedTheme(theme);
        // We can also update the project details in the context here if needed, so that it can be reflected in the canvas immediately
        setSettingDetails((prev: any) => ({ ...prev, theme: theme }))
       
    }

    const generateNewScreen = async () => {
        if(!hasPremium){
            toast.error('You have reached the maximum screen generation limit for free users. Please upgrade to the premium plan for unlimited screen generations.');
            return;
        }
        try{
        setLoading(true);
        setLoadingMessage('Generating new screen configuration...');
        const result = await axios.post('/api/newscreen-Config', {
            projectId: projectDetail?.projectId,
            projectName: projectDetail?.projectName,
            deviceType: projectDetail?.device,
            theme: projectDetail?.theme,
            oldScreenDescription: screenDescription,
            userInput: generateScreenInput
        })
        console.log(result.data)
        setRefreshData({ method: 'screnConfig', date: Date.now() });
        setLoading(false);
    }catch(e){
        setLoading(false);
        console.error(e);
    }
    }
    return (
        <div className='w-[250px] h-[90vh] p-5 border-r'>
            <h2 className='font-medium text-lg'>Settings</h2>
             {loading && (
                                <div className='absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-blue-50 border border-blue-400 p-3 px-5 rounded-xl shadow-md flex gap-3 items-center text-blue-600'>
                                    <Loader2 className='animate-spin h-5 w-5' />
                                    <h2 className='font-medium'>{loadingMessage}</h2>
                                </div>)}
            <div className='mt-3'>
                <h2 className='text-sm mb-1' >Project Name</h2>
                <Input placeholder='Project Name' className='w-full' value={projectName} onChange={(e) => {
                    setProjectName(e.target.value)
                    setSettingDetails((prev: any) => ({
                        ...prev,
                        projectName: projectName
                    }))
                }} />
            </div>
            <div className='mt-5'>
                <h2 className='text-sm mb-1'>Generate New Screen</h2>
                <Textarea placeholder='Describe the screen you want to generate'  value={generateScreenInput} onChange={(e) => setGenerateScreenInput(e.target.value)} />
                <Button size={'sm'} disabled={loading} className='mt-2 w-full' onClick={generateNewScreen}>
                    {loading ? <Loader2Icon className='animate-spin' /> : <SparkleIcon />}Generate
                </Button>
            </div>
            <div className='mt-5'>
                <h2 className='text-sm mb-1'>Theme</h2>
                <div className='h-[200px] overflow-auto'>
                    <div>
                        {THEME_LIST_NAME.map((theme, index) => (
                            <div className={`border rouded-xl mb-2 p-3 ${theme == selectedTheme && 'border-primary bg-primary/20'}`} key={index}
                                onClick={() => onThemeSelect(theme)}>
                                <h2>{theme}</h2>
                                <div className='flex gap-2 '>
                                    <div className={`h-4 w-4 rounded-full`} style={{ backgroundColor: THEMES[theme].primary }} />
                                    <div className={`h-4 w-4 rounded-full`} style={{ backgroundColor: THEMES[theme].secondary }} />
                                    <div className={`h-4 w-4 rounded-full`} style={{ backgroundColor: THEMES[theme].muted }} />
                                    <div className={`h-4 w-4 rounded-full`} style={{ backgroundColor: THEMES[theme].accent }} />
                                    <div className={`h-4 w-4 rounded-full`} style={{ backgroundColor: THEMES[theme].destructive }} />
                                    <div className={`h-4 w-4 rounded-full`} style={{ backgroundColor: THEMES[theme].background }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='mt-5'>

                <Button size={'sm'} className='mt-2 w-full' onClick={()=>takeScreenShot()}><Camera />ScreenShot</Button>
                <Button size={'sm'} className='mt-2 w-full'><Share />Share</Button>

            </div>
        </div>

    )
}

export default SettingSection