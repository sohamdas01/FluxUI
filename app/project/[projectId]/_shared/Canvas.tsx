
"use client"
import React, { useEffect, useRef, useState } from 'react'
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import ScreenFrame from './ScreenFrame';
import { ProjectType, ScreenConfigType } from '@/type/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import axios from 'axios';

type Props = {
  projectDetail: ProjectType | undefined,
  screenConfig: ScreenConfigType[],
  loading?: boolean,
  takeScreenShot: any
}


const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="tools absolute p-1 px-5 bg-white shadow flex gap-3 rounded-4xl bottom-10 left-1/2 z-30 text-gray-600">
      <Button variant={'ghost'} size={'sm'} onClick={() => zoomIn()}><Plus /></Button>
      <Button variant={'ghost'} size={'sm'} onClick={() => zoomOut()}><Minus /></Button>
      <Button variant={'ghost'} size={'sm'} onClick={() => resetTransform()}><X /></Button>
    </div>
  );
};

const Canvas = ({ projectDetail, screenConfig, loading, takeScreenShot }: Props) => {
  const [panningEnabled, setPanningEnabled] = useState(true);
  const isMobile = projectDetail?.device?.toLowerCase().includes('mobile');
  const SCREEN_WIDTH = isMobile ? 400 : 1200;
  const SCREEN_HEIGHT = isMobile ? 800 : 800;
  const GAP = isMobile ? 5 : 10;
  const iframerefs = useRef<(HTMLIFrameElement | null)[]>([]);

  // Total canvas content dimensions
  const totalWidth = screenConfig.length * (SCREEN_WIDTH + GAP) + GAP;
  const totalHeight = SCREEN_HEIGHT + 120;

  useEffect(() => {
    takeScreenShot && onTakeScreenShot();
  }, [takeScreenShot]);

  const captureOneIframe = async (iframe: HTMLIFrameElement) => {
    const doc = iframe.contentDocument;
    if (!doc) throw new Error("iframe doc not ready");
    // @ts-ignore
    if (doc.fonts?.ready) await doc.fonts.ready;
    await new Promise((r) => setTimeout(r, 250));
    const target = doc.body;
    const w = doc.documentElement.scrollWidth;
    const h = doc.documentElement.scrollHeight;
    const canvas = await html2canvas(target, {
      backgroundColor: null,
      useCORS: true,
      allowTaint: true,
      width: w,
      height: h,
      windowWidth: w,
      windowHeight: h,
      scale: window.devicePixelRatio || 1,
    });
    return canvas;
  };

  const onTakeScreenShot = async () => {
    try {
      const iframes = iframerefs.current.filter(Boolean) as HTMLIFrameElement[];
      if (!iframes.length) {
        toast.error("No iframes found to capture");
        return;
      }
      const shotCanvases: HTMLCanvasElement[] = [];
      for (let i = 0; i < iframes.length; i++) {
        const c = await captureOneIframe(iframes[i]);
        shotCanvases.push(c);
      }
      const scale = window.devicePixelRatio || 1;
      const headerH = 40;
      const outW = Math.max(iframes.length * (SCREEN_WIDTH + GAP), SCREEN_WIDTH) * scale;
      const outH = SCREEN_HEIGHT * scale;
      const out = document.createElement("canvas");
      out.width = outW;
      out.height = outH;
      const ctx = out.getContext("2d");
      if (!ctx) throw new Error("No 2D context");
      ctx.clearRect(0, 0, outW, outH);
      for (let i = 0; i < shotCanvases.length; i++) {
        const x = i * (SCREEN_WIDTH + GAP) * scale;
        const y = headerH * scale;
        ctx.drawImage(shotCanvases[i], x, y);
      }
      const url = out.toDataURL("image/png");
      updateProjectWithScreenshot(url);
      const a = document.createElement("a");
      a.href = url;
      a.download = "canvas.png";
      a.click();
    } catch (e) {
      console.error(e);
      toast.error("Capture failed (iframe)");
    }
  };

  const updateProjectWithScreenshot = async (base64Url: string) => {
    try {
      const result = await axios.put('/api/project', {
        projectId: projectDetail?.projectId,
        screenshot: base64Url,
        theme: projectDetail?.theme,
        projectName: projectDetail?.projectName
      });
      console.log(result.data);
    } catch (e) {
      console.error('Failed to save screenshot', e);
    }
  };

  return (
    <div
      className='w-full h-screen bg-blue-50'
      style={{
        backgroundImage: "radial-gradient(rgba(0,0,0,0.15) 1px,transparent 1px)",
        backgroundSize: "20px 20px"
      }}
    >
      <TransformWrapper
        initialScale={0.6}
        minScale={0.2}
        maxScale={3}
        initialPositionX={50}
        initialPositionY={50}
        limitToBounds={false}
        wheel={{ step: 0.8 }}
        doubleClick={{ disabled: false }}
        panning={{ disabled: !panningEnabled }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <Controls />
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{
                width: `${totalWidth}px`,
                height: `${totalHeight}px`,
              }}
            >
            
              <div
                style={{
                  position: 'relative',
                  width: `${totalWidth}px`,
                  height: `${totalHeight}px`,
                }}
              >
                {screenConfig?.map((screen, index) => (
                  screen?.code ? (
                   
                    <ScreenFrame
                      key={`${screen.screenId}-${index}`}
                      x={index * (SCREEN_WIDTH + GAP)}
                      y={60}
                      width={SCREEN_WIDTH}
                      height={SCREEN_HEIGHT}
                      setPanningEnabled={setPanningEnabled}
                      htmlCode={screen?.code}
                      projectDetail={projectDetail}
                      isMobile={isMobile}
                      screen={screen}
                      iframeRef={(ifrm: any) => iframerefs.current[index] = ifrm}
                    />
                  ) : (
                   
                    <div
                      key={`skeleton-${screen.screenId}-${index}`}
                      className='bg-white rounded-2xl gap-4 p-5 flex flex-col'
                      style={{
                        position: 'absolute',
                        left:index * (SCREEN_WIDTH + GAP),
                        top: 60,
                        width: SCREEN_WIDTH,
                        height: SCREEN_HEIGHT,
                      }}
                    >
                      <Skeleton className='w-full rounded-lg h-10 bg-gray-300' />
                      <Skeleton className='w-[50%] rounded-lg h-20 bg-gray-400' />
                      <Skeleton className='w-full rounded-lg h-10 bg-gray-300' />
                      <Skeleton className='w-[30%] rounded-lg h-30 bg-gray-400' />
                      <Skeleton className='w-[70%] rounded-lg h-30 bg-gray-300' />
                      <Skeleton className='w-[80%] rounded-lg h-20 bg-gray-200' />
                      <Skeleton className='w-[40%] rounded-lg h-10 bg-gray-300' />
                    </div>
                  )
                ))}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default Canvas;