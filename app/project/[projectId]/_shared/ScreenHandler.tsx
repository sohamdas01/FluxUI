"use client"
import React, { useContext, useState } from 'react'
import { Code2Icon, Copy, Download, GripVertical, Loader, Loader2Icon, MoreVertical, SparkleIcon, Trash } from 'lucide-react';
import { ScreenConfigType } from '@/type/types';
import { Button } from '@/components/ui/button';
import { RefreshDataContext } from '@/context/RefreshDataContext';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"

import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { toast } from 'sonner';
import { htmlWrapper } from '@/data/constant';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    screen: ScreenConfigType | undefined,
    theme: any,
    isMobile?: boolean,
    iframeref: any,
    projectId: string | undefined
}
const ScreenHandler = ({ screen, theme, isMobile, iframeref, projectId }: Props) => {
    const htmlCode = htmlWrapper(theme, screen?.code as string, isMobile ?? false);

    const { refreshData, setRefreshData } = useContext(RefreshDataContext);
    const [userInput,setUserInput]=useState<string>('');
    const [loading,setLoading]=useState<boolean>(false);

    const takeIframeScreenshot = async () => {
        const iframe = iframeref.current;
        if (!iframe) return;

        try {
            const doc = iframe.contentDocument;
            if (!doc) return;

            const body = doc.body;

            // wait one frame to ensure layout is stable
            await new Promise((res) => requestAnimationFrame(res));

            const canvas = await html2canvas(body, {
                backgroundColor: null,
                useCORS: true,
                scale: window.devicePixelRatio || 1,
            });

            const image = canvas.toDataURL("image/png");

            // download automatically
            const link = document.createElement("a");
            link.href = image;
            link.download = `${screen?.screenName as string || "screen"}.png`;
            link.click();
        } catch (err) {
            console.error("Screenshot failed:", err);
        }
    };
    const OnDelete = async () => {
        const result = await axios.delete('/api/generate-config?projectId=' + projectId + '&&screenId=' + screen?.screenId);
        toast.success('Screen deleted successfully!');
        setRefreshData({ method: 'screnConfig', date: Date.now() });

    }
    const editScreen=async()=>{
        setLoading(true);
         toast.info('Regenerating screen, please wait...');
      const result=await axios.post('/api/edit-screen',{
        projectId:projectId,
        screenId:screen?.screenId,
        oldCode:screen?.code,
        userInput:userInput
      });
      console.log(result.data);
      toast.success('Screen updated successfully!');
      setRefreshData({ method: 'screnConfig', date: Date.now() });
        setLoading(false);
    }
    return (
        <div className='flex justify-between items-center w-full'>
            <div className='flex items-center gap-2'>
                <GripVertical className='text-gray-400 h-4 w-4' />
                <h2>{screen?.screenName}</h2>
            </div>
            <div>

                <Dialog>
                    <DialogTrigger>
                        <Button variant={"ghost"}><Code2Icon /></Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-6xl w-full h-[70vh] flex flex-col'>
                        <DialogHeader>
                            <DialogTitle>HTML + TailWindcss Code </DialogTitle>
                            <DialogDescription>
                                <div className='flex-1 overflow-y-auto rounded-md border bg-muted p-4'>
                                    {/* @ts-ignore */}
                                    <SyntaxHighlighter language="html" style={docco} customStyle={{
                                        margin: 0,
                                        padding: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowX: 'hidden', height: '50vh'
                                    }}
                                        codeTagProps={{
                                            style: {
                                                whiteSpace: 'pre-wrap',
                                                wordBreak: 'break-word'
                                            }
                                        }}>
                                        {htmlCode}
                                    </SyntaxHighlighter>

                                </div>
                                <Button className='mt-5' onClick={() => {
                                    navigator.clipboard.writeText(htmlCode as string);
                                    toast.success('Code copied to clipboard!')
                                }} ><Copy />Copy</Button>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
                <Button onClick={takeIframeScreenshot}><Download /></Button>
                {/* edit screen */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button><SparkleIcon /></Button> 
                    </PopoverTrigger>
                    <PopoverContent>
                        <div>
                            <Textarea placeholder='what changes do you want?' value={userInput} onChange={(e) => setUserInput(e.target.value)} />
                            <Button size={'sm'} className='mt-2' disabled={loading} onClick={()=>editScreen()}>{loading?<Loader2Icon className='animate-spin' />:<SparkleIcon />}Generate</Button>
                        </div>

                    </PopoverContent>
                </Popover>

                {/* delete screen */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button><MoreVertical /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>

                        <DropdownMenuItem variant={'destructive'} onClick={OnDelete}><Trash /> Delete Screen</DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>

            </div>

        </div>
    )
}

export default ScreenHandler