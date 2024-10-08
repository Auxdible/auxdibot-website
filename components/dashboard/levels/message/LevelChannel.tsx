'use client';

import { BsCheckLg, BsTrophy } from 'react-icons/bs';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import Channels from '@/components/ui/select/channels';
import { Button } from '@/components/ui/button/button';
import { useToast } from '@/components/ui/use-toast';
export default function LevelChannel({
    server,
}: {
    server: { serverID: string; level_channel: string };
}) {
    let { data: channels } = useQuery(
        ['data_channels', server.serverID],
        async () =>
            await fetch(`/bot/v1/servers/${server.serverID}/channels`)
                .then(async (data) => await data.json().catch(() => undefined))
                .catch(() => undefined)
    );
    const [channel, setChannel] = useState<string | undefined>(
        server?.level_channel ?? undefined
    );
    const [success, setSuccess] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    function onLevelChannelChange(e: { channel: string | undefined }) {
        if (success) setSuccess(false);
        if (channel == 'null') setChannel(undefined);
        setChannel(e.channel);
    }
    function setLevelChannel() {
        if (!server) return;
        const body = new URLSearchParams();
        body.append('level_channel', channel == 'null' ? '' : (channel ?? ''));
        fetch(`/bot/v1/servers/${server.serverID}/levels/channel`, {
            method: 'POST',
            body,
        })
            .then(async (data) => {
                const json = await data.json().catch(() => undefined);
                if (!json || json['error']) {
                    toast({
                        title: 'Failed to update levels channel',
                        description: json['error'] ?? 'An error occured',
                        status: 'error',
                    });
                    return;
                }
                queryClient.invalidateQueries(['data_levels', server.serverID]);
                setSuccess(true);
                setChannel('');
                toast({
                    title: 'Levels Channel Updated',
                    description:
                        channel && channel != 'null'
                            ? `Successfully updated levels channel to: #${channels.find((c: { id: string }) => channel == c.id)?.name ?? 'Unknown'}`
                            : 'Level up messages will now be sent as a reply to the message causing the user to level up.',
                    status: 'success',
                });
            })
            .catch(() => {});
    }
    if (!channels) return <></>;

    return (
        <div
            className={
                'mx-auto flex w-fit flex-col gap-3 border-b border-gray-700 p-4'
            }
        >
            <span className={'secondary flex flex-col text-center text-xl'}>
                Set Levels Channel
            </span>

            <span
                className={'flex flex-row items-center gap-2 max-xl:flex-col'}
            >
                <Channels
                    serverID={server.serverID}
                    value={channel}
                    onChange={onLevelChannelChange}
                />
                <Button
                    onClick={() => setLevelChannel()}
                    className={`flex w-fit flex-row items-center gap-2 max-md:mx-auto`}
                    variant={'outline'}
                    type='submit'
                >
                    {success ? (
                        <>
                            <BsCheckLg /> Updated!
                        </>
                    ) : (
                        <>
                            <BsTrophy /> Update
                        </>
                    )}
                </Button>
            </span>
        </div>
    );
}
