'use client';

import NotFound from '@/app/not-found';
import { LeaderboardPagination } from '@/components/public/leaderboard/LeaderboardPagination';
import { LeaderboardServer } from '@/components/public/leaderboard/LeaderboardServer';
import LoadingLeaderboard from '@/components/public/leaderboard/LoadingLeaderboard';
import { MemberLeaderboard } from '@/components/public/leaderboard/MemberLeaderboard';
import { TopThreeMembers } from '@/components/public/leaderboard/TopThreeMembers';
import { StartContext } from '@/context/StartContext';
import { LeaderboardPayload } from '@/lib/types/LeaderboardPayload';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from 'react-query';

export default function LeaderboardPage({
    params,
}: {
    params: { serverID: string };
}) {
    const queryParams = useSearchParams();
    const startQuery = queryParams.get('start'),
        limit = queryParams.get('limit');
    const [start, setStart] = useState<number>(Number(startQuery) || 0);

    const { data, status, error } = useQuery<
        LeaderboardPayload | { error: string } | undefined
    >(
        [params.serverID, 'leaderboard', start, limit],
        async () =>
            await fetch(
                `/bot/v1/leaderboard/${params.serverID}?start=${start ?? ''}&limit=${limit ?? ''}`
            )
                .then(async (data) => await data.json().catch(() => undefined))
                .catch(() => undefined)
    );
    if (status == 'loading')
        return <LoadingLeaderboard serverID={params.serverID} />;
    if (!data || error || (data && 'error' in data)) {
        return <NotFound />;
    }

    return (
        <StartContext.Provider value={{ setStart, start }}>
            <main
                className={`flex flex-col gap-40 self-stretch overflow-x-hidden`}
            >
                <LeaderboardServer server={data.server} />
                <div className='flex flex-col gap-20'>
                    <h1
                        className={
                            'header text-center text-7xl max-sm:text-5xl'
                        }
                    >
                        leaderboard
                    </h1>
                    {Number(start) === 0 ? (
                        <TopThreeMembers
                            members={data.leaderboard.slice(0, 3)}
                        />
                    ) : (
                        ''
                    )}
                    <MemberLeaderboard
                        leaderboard={
                            Number(start) === 0
                                ? data.leaderboard.slice(3)
                                : data.leaderboard
                        }
                        start={Number(start) || 0}
                    />
                    <LeaderboardPagination total={data.total} />
                </div>
            </main>
        </StartContext.Provider>
    );
}
