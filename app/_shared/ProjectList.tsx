
"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ProjectType } from '@/type/types';
import ProjectCard from './ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const ProjectList = () => {
    const [projectList, setProjectList] = useState<ProjectType[]>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getProjectList();
    }, [])

    const getProjectList = async () => {
        setLoading(true);
        const result = await axios.get('/api/project');
        setProjectList(result.data);
        setLoading(false);
    }

    return (
        <div>
            {/* Empty state */}
            {!loading && projectList?.length === 0 && (
                <div className='flex flex-col items-center justify-center py-24 text-center'>
                    <div className='w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4'>
                        <FolderOpen className='w-8 h-8 text-primary' />
                    </div>
                    <h2 className='text-xl font-semibold text-gray-800 mb-2'>No projects yet</h2>
                    <p className='text-gray-500 text-sm mb-6 max-w-xs'>
                        Start by generating your first AI-powered UI from the home page.
                    </p>
                    <Link href='/'>
                        <Button>Create your first project</Button>
                    </Link>
                </div>
            )}

            {/* Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {!loading
                    ? projectList?.map((project, idx) => (
                        <ProjectCard key={project.projectId } project={project} />
                    ))
                    : [1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className='rounded-2xl overflow-hidden border border-gray-100 shadow-sm'>
                            <Skeleton className='w-full h-[180px]' />
                            <div className='p-4'>
                                <Skeleton className='w-3/4 h-5 mb-2' />
                                <Skeleton className='w-1/3 h-4' />
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ProjectList