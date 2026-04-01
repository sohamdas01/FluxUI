"use client"
import React, { useState } from 'react'
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Camera, Share, Sparkle, SparkleIcon } from 'lucide-react';
import { THEME_LIST_NAME, THEMES } from '@/data/Themes';
const SettingSection = () => {
    const [selectedTheme,setSelectedTheme]=useState(' DUSTY_ORCHID');
    const[projectName,setProjectName]=useState('');
    const[generateScreenInput,setGenerateScreenInput]=useState<string>('');
    return (
        <div className='w-[250px] h-[90vh] p-5 border-r'>
            <h2 className='font-medium text-lg'>Settings</h2>
            <div className='mt-3'>
                <h2 className='text-sm mb-1' >Project Name</h2>
                <Input placeholder='Project Name' className='w-full' value={projectName} onChange={(e) => setProjectName(e.target.value)} />
            </div>
            <div className='mt-5'>
                <h2 className='text-sm mb-1'>Generate New Screen</h2>
                <Textarea placeholder='Describe the screen you want to generate' value={generateScreenInput} onChange={(e) => setGenerateScreenInput(e.target.value)} />
                <Button size={'sm'} className='mt-2 w-full'><SparkleIcon />Generate</Button>
            </div>
            <div className='mt-5'>
                <h2 className='text-sm mb-1'>Theme</h2>
                <div className='h-[200px] overflow-auto'>
                    <div>
                        {THEME_LIST_NAME.map((theme, index) => (
                            <div className={`border rouded-xl mb-2 p-3 ${theme==selectedTheme &&'border-primary bg-primary/20'}`} key={index}
                             onClick={()=>setSelectedTheme(theme)}>
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
    
                <Button size={'sm'} className='mt-2 w-full'><Camera/>ScreenShot</Button>
                <Button size={'sm'} className='mt-2 w-full'><Share/>Share</Button>
               
            </div>
        </div>

    )
}

export default SettingSection