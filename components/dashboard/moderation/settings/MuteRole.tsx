'use client';

import { BsCheckLg, BsMicMute } from 'react-icons/bs';
import { useState } from 'react';
import { useQuery } from 'react-query';
import Roles from '@/components/ui/select/roles';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button/button';
export default function MuteRole({
    server,
}: {
    server: { readonly serverID: string; readonly mute_role: string };
}) {
    let { data: roles } = useQuery(
        ['data_roles', server.serverID],
        async () =>
            await fetch(`/bot/v1/servers/${server.serverID}/roles`)
                .then(async (data) => await data.json().catch(() => undefined))
                .catch(() => undefined)
    );
    const [role, setRole] = useState<string | undefined>(
        server.mute_role ?? undefined
    );
    const { toast } = useToast();
    const [success, setSuccess] = useState(false);
    function onMuteRoleChange(e: { role?: string }) {
        if (success) setSuccess(false);
        if (e.role == 'null') return setRole(undefined);

        setRole(e.role || undefined);
    }
    function setMuteRole() {
        if (!server) return;
        const body = new URLSearchParams();
        body.append('new_mute_role', role || '');
        fetch(`/bot/v1/servers/${server.serverID}/moderation/mute_role`, {
            method: 'POST',
            body,
        })
            .then(async (data) => {
                const json = await data.json().catch(() => undefined);
                if (!json || json['error']) {
                    toast({
                        title: 'Failed to set mute role',
                        description: json['error'] || "Couldn't find error.",
                        status: 'error',
                    });
                    return;
                }
                toast({
                    title: 'Mute Role Updated',
                    description: role
                        ? `The mute role has been updated to @${roles?.find((i: { id: string }) => i.id === role)?.name ?? 'Unknown'}.`
                        : "Mute role is now disabled for this server. Auxdibot will utilize Discord's timeout system for mutes.",
                    status: 'success',
                });
                setSuccess(true);
            })
            .catch(() => {});
    }
    if (!roles) return <></>;

    return (
        <div className={'mx-auto flex w-fit flex-col gap-3'}>
            <h3
                className={
                    'flex flex-col text-center font-open-sans text-2xl text-gray-300'
                }
            >
                Mute Role
            </h3>

            <span className={'flex flex-row gap-2 max-md:flex-col'}>
                <span className={'mx-auto'}>
                    <Roles
                        serverID={server.serverID}
                        onChange={onMuteRoleChange}
                        value={role}
                    />
                </span>
                <Button
                    onClick={() => setMuteRole()}
                    className={`mx-auto flex w-fit items-center gap-1`}
                    variant={'outline'}
                    type='submit'
                >
                    {success ? (
                        <>
                            <BsCheckLg /> Updated!
                        </>
                    ) : (
                        <>
                            <BsMicMute /> Update
                        </>
                    )}
                </Button>
            </span>
        </div>
    );
}
