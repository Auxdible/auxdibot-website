'use client';

import { useQuery } from 'react-query';
import StarboardBoards from './boards/StarboardBoards';
import { Suspense } from 'react';
import StarboardSettings from './settings/StarboardSettings';
import { Link, Star } from 'lucide-react';
import { Button } from '@/components/ui/button/button';
import { ModuleDisableOverlay } from '../ModuleDisableOverlay';

export default function DashboardStarboardConfig({ id }: { id: string }) {
    let { data: starboard } = useQuery(
        ['data_starboard', id],
        async () =>
            await fetch(`/bot/v1/servers/${id}/starboard`)
                .then(async (data) => await data.json().catch(() => undefined))
                .catch(() => undefined)
    );
    return (
        <>
            <ModuleDisableOverlay id={id} module={'Starboard'} />
            <main className={'flex-grow bg-gray-950'}>
                <div
                    className={
                        'flex animate-fadeIn flex-col gap-5 py-5 max-md:items-center md:px-5'
                    }
                >
                    <span className='mb-5 mt-2 flex items-center gap-5 max-md:flex-col'>
                        <div className='flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-800 bg-gradient-to-bl from-gray-500/40 to-gray-900/40 shadow transition-colors hover:bg-gray-500/40'>
                            <Star size={'48'} />
                        </div>
                        <div className='flex flex-col max-md:items-center max-md:text-center'>
                            <h1
                                className={
                                    'header flex items-center font-raleway text-4xl font-bold'
                                }
                            >
                                Starboard
                                <Link
                                    target='_blank'
                                    href={
                                        process.env
                                            .NEXT_PUBLIC_DOCUMENTATION_LINK +
                                        '/modules/starboard'
                                    }
                                >
                                    <Button className='text-sm' variant='link'>
                                        [docs]
                                    </Button>
                                </Link>
                            </h1>
                            <p className='max-w-4xl font-inter text-lg'>
                                Allows users to setup and configure starboards
                                that can be utilized on their server.
                            </p>
                        </div>
                    </span>
                    <span
                        className={
                            'flex w-full flex-row gap-10 max-xl:flex-col'
                        }
                    >
                        <Suspense fallback={null}>
                            {starboard && (
                                <StarboardBoards server={starboard} />
                            )}
                            {starboard && (
                                <StarboardSettings server={starboard} />
                            )}
                        </Suspense>
                    </span>
                </div>
            </main>
        </>
    );
}
