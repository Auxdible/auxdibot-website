import { TextareaMessage } from '@/components/ui/messages/textarea-message';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { BsTrophy } from 'react-icons/bs';
import { LevelPayload } from '../DashboardLevelsConfig';

import { EmbedDialog } from '@/components/ui/dialog/embed-dialog';
import { Button } from '@/components/ui/button/button';
import { APIEmbed } from 'discord-api-types/v10';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useQueryClient } from 'react-query';
import { DiscordMessage } from '@/components/ui/messages/discord-message';
import { isEmbedEmpty } from '@/lib/isEmbedEmpty';
import { MessageCircleIcon } from 'lucide-react';
import { StoredEmbeds } from '@/components/ui/messages/stored-embeds';
import { StoredEmbed } from '@/lib/types/StoredEmbed';

type FormBody = { embed: APIEmbed; content: string };
export function LevelMessage({ server }: { server: LevelPayload }) {
    let level_message = Object.create(server.level_message);
    const { register, handleSubmit, control, watch, setValue } =
        useForm<FormBody>({
            defaultValues: {
                embed: server?.level_message?.embed,
                content: server?.level_message?.content,
            },
        });
    const { append, remove } = useFieldArray({
        name: 'embed.fields',
        control,
        rules: {
            maxLength: 25,
        },
    });
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { data: embeds } = useQuery<
        { data: { stored_embeds: StoredEmbed[] } } | undefined
    >(
        ['data_embeds', server.serverID],
        async () =>
            await fetch(`/bot/v1/servers/${server.serverID}/embeds`)
                .then(async (data) => await data.json().catch(() => undefined))
                .catch(() => undefined)
    );
    function onSubmit(data: FormBody) {
        let body = new URLSearchParams();
        body.append('content', data.content || '');
        if (
            data.embed.author?.name ||
            data.embed.description ||
            data.embed.title ||
            data.embed.footer?.text ||
            (data.embed.fields?.length || 0) > 0
        ) {
            body.append('embed', JSON.stringify(data.embed));
        }
        fetch(`/bot/v1/servers/${server.serverID}/levels/message`, {
            method: 'POST',
            body,
        })
            .then(async (res) => {
                const json = await res.json().catch(() => undefined);
                if (!json || json['error']) {
                    toast({
                        title: 'Failed to update levels message',
                        description: json['error'] ?? 'An error occured',
                        status: 'error',
                    });
                    return;
                }
                toast({
                    title: 'Levels Message Updated',
                    description: `Successfully updated the levels message for your server.`,
                    status: 'success',
                });
                queryClient.invalidateQueries(['data_levels', server.serverID]);
            })
            .catch(() => {});
    }
    const embed = watch('embed');
    const content = watch('content');
    level_message.content = content || level_message.content;
    level_message.embed =
        content?.length > 0 ||
        embed?.author?.name ||
        embed?.description ||
        embed?.title ||
        embed?.footer?.text ||
        (embed?.fields?.length || 0) > 0
            ? embed
            : level_message.embed;
    return (
        <div
            className={
                'h-fit w-full flex-1 flex-shrink-0 flex-grow rounded-2xl border-2 border-gray-800 px-2 shadow-2xl max-md:mx-auto'
            }
        >
            <h2
                className={
                    'secondary rounded-2xl rounded-b-none p-4 text-center text-2xl'
                }
            >
                Embed Preview
            </h2>
            <DiscordMessage
                background
                serverData={{
                    serverID: server.serverID,
                    placeholderContext: [
                        'member',
                        'level',
                        'member_join',
                        'member_punishments',
                        'member_levels',
                    ],
                }}
                content={
                    isEmbedEmpty(embed) && !content
                        ? `This is the Embed preview for the Levelup Message you are creating. When you make changes to your embed, the changes will be reflected here! See the [documentation for Embeds](${process.env.NEXT_PUBLIC_DOCUMENTATION_LINK}/modules/embeds) for more information!`
                        : content
                }
                embed={embed}
            />
            <h3 className='secondary mt-5 text-center text-xl'>
                Update Level Embed
            </h3>
            <span className='mx-auto mt-2 flex max-w-lg text-center font-lato text-sm italic text-gray-400'>
                Using the placeholders %LEVEL_TO%/&quot;Level To&quot; and
                %LEVEL_FROM%/&quot;Level From&quot; will automatically fill with
                the level the player is going to, and the level the player is
                going from when the levelup message is sent.
            </span>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={'mb-5 flex flex-col gap-2 md:m-5'}
            >
                <section
                    className={
                        'flex flex-col gap-2 font-open-sans text-xl max-md:items-center'
                    }
                >
                    <span
                        className={
                            'flex w-full flex-row items-center gap-2 max-md:flex-col'
                        }
                    >
                        <label className={'flex flex-row items-center gap-1'}>
                            <MessageCircleIcon /> Message Content:
                        </label>
                        <span className='ml-auto max-md:mx-auto'>
                            <StoredEmbeds
                                id={server.serverID}
                                value={''}
                                onValueChange={(e) => {
                                    const message =
                                        embeds?.data?.stored_embeds?.find(
                                            (i) => i.id === e
                                        );
                                    if (!message) return;
                                    setValue('embed', message.embed ?? {});
                                    setValue('content', message.content ?? '');
                                }}
                            />
                        </span>
                    </span>

                    <Controller
                        name={'content'}
                        control={control}
                        render={({ field }) => {
                            return (
                                <TextareaMessage
                                    serverID={server.serverID}
                                    wrapperClass={'w-full'}
                                    placeholderContext={[
                                        'level',
                                        'member',
                                        'member_join',
                                        'member_punishments',
                                        'member_levels',
                                    ]}
                                    value={field.value}
                                    onChange={field.onChange}
                                    maxLength={2000}
                                />
                            );
                        }}
                    />
                </section>

                <section
                    className={
                        'flex items-center justify-between gap-2 max-md:flex-col'
                    }
                >
                    <EmbedDialog
                        serverID={server.serverID}
                        addField={append}
                        removeField={remove}
                        control={control}
                        placeholderContext={[
                            'level',
                            'member',
                            'member_join',
                            'member_punishments',
                            'member_levels',
                        ]}
                        register={register}
                    />

                    <Button
                        variant={'outline'}
                        className={`flex flex-row items-center gap-2`}
                        type='submit'
                    >
                        <BsTrophy /> Update
                    </Button>
                </section>
            </form>
        </div>
    );
}
