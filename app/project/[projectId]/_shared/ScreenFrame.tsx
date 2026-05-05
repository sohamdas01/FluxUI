
"use client"
import React, { useRef, useState, useContext, useCallback, useEffect } from 'react'
import { Rnd } from 'react-rnd';
import { THEMES } from '@/data/Themes';
import { ProjectType, ScreenConfigType } from '@/type/types';
import { SettingContext } from '@/context/SettingContext';
import ScreenHandler from './ScreenHandler';
import { htmlWrapper } from '@/data/constant';

type Props = {
  x: number,
  y: number,
  setPanningEnabled: (enabled: boolean) => void,
  width: number,
  height: number,
  htmlCode: string | undefined,
  projectDetail: ProjectType | undefined,
  isMobile?: boolean,
  screen: ScreenConfigType | undefined,
  iframeRef: (el: HTMLIFrameElement | null) => void  
}

const ScreenFrame = ({ x, y, setPanningEnabled, width, height, htmlCode, projectDetail, isMobile, screen, iframeRef }: Props) => {
  const { settingDetails } = useContext(SettingContext);
  const themeKey = (settingDetails?.theme ?? projectDetail?.theme ?? 'DUSTY_ORCHID') as keyof typeof THEMES;
  const theme = THEMES[themeKey];
  const html = htmlWrapper(theme ?? THEMES['AURORA_INK'], htmlCode as string, isMobile ?? false);

  const [size, setSize] = useState({ width, height });

  // Local ref 
  const localRef = useRef<HTMLIFrameElement | null>(null);

  //  Merged ref for updating both localRef AND the parent Canvas callback
  const setRef = useCallback((el: HTMLIFrameElement | null) => {
    localRef.current = el;
    iframeRef(el); // notify Canvas so screenshot capture works
  }, [iframeRef]);

  useEffect(() => {
    setSize({ width, height });
  }, [width, height]);

  const measureIframeHeight = useCallback(() => {
    const iframe = localRef.current; 
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument;
      if (!doc) return;
      const headerH = 40;
      const htmlEl = doc.documentElement;
      const body = doc.body;
      const contentH = Math.max(
        htmlEl?.scrollHeight ?? 0,
        body?.scrollHeight ?? 0,
        htmlEl?.offsetHeight ?? 0,
        body?.offsetHeight ?? 0
      );
      const next = Math.min(Math.max(contentH + headerH, 160), 2000);
      setSize((s) => (Math.abs(s.height - next) > 2 ? { ...s, height: next } : s));
    } catch {
      // sandboxed iframe - can't measure
    }
  }, []);

  useEffect(() => {
    const iframe = localRef.current; 
    if (!iframe) return;

    let observer: MutationObserver | null = null;
    // let t1: ReturnType<typeof setTimeout>;
    // let t2: ReturnType<typeof setTimeout>;
    // let t3: ReturnType<typeof setTimeout>;
    let t1: number;
    let t2: number;
    let t3: number;

    const onLoad = () => {
      measureIframeHeight();
      const doc = iframe.contentDocument;
      if (!doc?.documentElement) return;

      observer = new MutationObserver(() => measureIframeHeight());
      observer.observe(doc.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      t1 = window.setTimeout(measureIframeHeight, 50);
      t2 = window.setTimeout(measureIframeHeight, 200);
      t3 = window.setTimeout(measureIframeHeight, 600);
    };

    iframe.addEventListener('load', onLoad);

    return () => {
      iframe.removeEventListener('load', onLoad);
      observer?.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [measureIframeHeight, htmlCode]);

  return (
    <Rnd
      default={{ x, y, width, height }}
      size={size}
      dragHandleClassName='drag-handle'
      enableResizing={{ bottomRight: true, bottomLeft: true }}
      onDragStart={() => setPanningEnabled(false)}
      onDragStop={() => setPanningEnabled(true)}
      onResizeStart={() => setPanningEnabled(false)}
      onResizeStop={(_, __, ref) => {
        setPanningEnabled(true);
        setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
      }}
    >
      <div className='drag-handle flex gap-2 items-center cursor-move bg-white rounded-lg p-4'>
        <ScreenHandler
          screen={screen}
          theme={theme}
          isMobile={isMobile}
          iframeref={localRef}       
          projectId={projectDetail?.projectId}
        />
      </div>
      <iframe
        ref={setRef}              
        className='w-full h-[calc(100%-40px)] bg-white rounded-2xl mt-5'
        sandbox='allow-same-origin allow-scripts'
        srcDoc={html}
      />
    </Rnd>
  );
};

export default ScreenFrame;