"use client"
import React, { useState } from 'react'
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import ScreenFrame from './ScreenFrame';
import { ProjectType, ScreenConfigType } from '@/type/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';


type Props={
  projectDetail:ProjectType|undefined,
  screenConfig:ScreenConfigType[],
  loading?:boolean
}
const Canvas = ({projectDetail,screenConfig,loading}:Props) => {
  const [panningEnabled, setPanningEnabled] =useState(true);
const isMobile = projectDetail?.device?.toLowerCase().includes('mobile'); // Example condition to determine if the device is mobile, adjust as needed
const SCREEN_WIDTH = isMobile ? 400 : 1200;
const SCREEN_HEIGHT = isMobile ? 800 : 800;
const GAP=isMobile? 20:70;

 const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="tools absolute p-1 px-5 bg-white shadow flex gap-3 rounded-4xl bottom-10 left-1/2 z-30 text-gray-600">
      <Button  variant={'ghost'} size={'sm'} onClick={() => zoomIn()}><Plus/></Button>
      <Button variant={'ghost'} size={'sm'} onClick={() => zoomOut()}><Minus/></Button>
      <Button variant={'ghost'} size={'sm'} onClick={() => resetTransform()}><X/></Button>
    </div>
  );
};
  return (
    
    <div className='w-full h-screen bg-blue-50'
    style={{backgroundImage:"radial-gradient(rgba(0,0,0,0.15) 1px,transparent 1px)",
    backgroundSize:"20px 20px"}}>
      <TransformWrapper
        initialScale={0.7}
        minScale={0.7}
        maxScale={3}
        initialPositionX={50}
        initialPositionY={50}
        limitToBounds={false}
        wheel={{step:0.8}}
        doubleClick={{disabled:false}}
        panning={{disabled:!panningEnabled}}
      >
         {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <>
          <Controls />
        <TransformComponent 
        wrapperStyle={{width:'100%',height:'100%'}}
         
      >  
      {screenConfig?.map((screen,index)=>(
        
        <div key={`${screen.screenId}-${index}`}>
          {screen?.code?<ScreenFrame x={index*(SCREEN_WIDTH+GAP)} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT} 
          setPanningEnabled={setPanningEnabled} 
          htmlCode={screen?.code}
          projectDetail={projectDetail}
          isMobile={isMobile}
          screen={screen}
          />
          :
          <div className='bg-white rounded-2xl gap-4 p-5 flex flex-col' 
          style={{width:SCREEN_WIDTH,
            height:SCREEN_HEIGHT
          }}>
           <Skeleton className='w-full rounded-lg h-10 bg-gray-300'/>
           <Skeleton className='w-[50%] rounded-lg h-20 bg-gray-400'/>
           <Skeleton className='w-full rounded-lg h-10 bg-gray-300'/>
           <Skeleton className='w-[30%] rounded-lg h-30 bg-gray-400'/>
            <Skeleton className='w-[70%] rounded-lg h-30 bg-gray-300'/>
            <Skeleton className='w-[80%] rounded-lg h-20 bg-gray-200'/>
            <Skeleton className='w-[40%] rounded-lg h-10 bg-gray-300'/>
          </div>
         }
        </div>
      ))}
         
          
        </TransformComponent>
        </>
         )}
        </TransformWrapper>
    </div>
  )
}

export default Canvas