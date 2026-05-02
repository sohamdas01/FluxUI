// import React from 'react'
// import { ProjectType } from '@/type/types';
// import Image from 'next/image';
// import Link from 'next/link';

// type Props={
//     project: ProjectType
// }
// const ProjectCard = ({project}:Props) => {
//   return (
//     <Link href={`/projects/${project?.projectId}`}>
//     <div className='rounded-2xl p-4'>
//         {project?.screenshot ? (
//   <Image
//     src={project.screenshot}
//     alt={project?.projectName ?? "Project screenshot"}
//     width={300}
//     height={200}
//     className='rounded-xl object-contain h-[200px] w-full bg-gray-100'
//   />
// ) : null}
//     <div className='p-2'>
//     <h2>{project?.projectName}</h2>
//     <p className='text-sm text-gray-500'>{project.createdOn}</p>
//     </div>
//     </div>
//     </Link>
//   )
// }

// export default ProjectCard
import React from 'react'
import { ProjectType } from '@/type/types';
import Image from 'next/image';
import Link from 'next/link';
import { Monitor, Smartphone, Calendar } from 'lucide-react';

type Props = {
    project: ProjectType
}

const ProjectCard = ({ project }: Props) => {
    const isMobile = project?.device?.toLowerCase().includes('mobile');
    const formattedDate = project?.createdOn
        ? new Date(project.createdOn).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        })
        : null;

    return (
        <Link href={'/project/'+project?.projectId}>
            <div className='group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden cursor-pointer'>

                {/* Thumbnail area */}
                <div className='relative w-full h-[180px] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden'>
                    {project?.screenshot ? (
                        <Image
                            src={project.screenshot}
                            alt={project?.projectName ?? "Project screenshot"}
                            fill
                            className='object-cover group-hover:scale-105 transition-transform duration-300'
                        />
                    ) : (
                        // Placeholder when no screenshot
                        <div className='w-full h-full flex flex-col items-center justify-center gap-2'>
                            <div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center'>
                                {isMobile
                                    ? <Smartphone className='w-5 h-5 text-primary' />
                                    : <Monitor className='w-5 h-5 text-primary' />
                                }
                            </div>
                            <span className='text-xs text-gray-400'>No preview</span>
                        </div>
                    )}

                    {/* Device badge */}
                    <div className='absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 shadow-sm'>
                        {isMobile
                            ? <><Smartphone className='w-3 h-3' /> Mobile</>
                            : <><Monitor className='w-3 h-3' /> Web</>
                        }
                    </div>
                </div>

                {/* Card footer */}
                <div className='p-4'>
                    <h2 className='font-semibold text-gray-900 truncate group-hover:text-primary transition-colors'>
                        {project?.projectName ?? 'Untitled Project'}
                    </h2>
                    {formattedDate && (
                        <p className='text-xs text-gray-400 mt-1 flex items-center gap-1'>
                            <Calendar className='w-3 h-3' />
                            {formattedDate}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default ProjectCard