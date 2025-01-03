'use client';
import { isEmbedEmpty } from '@/lib/isEmbedEmpty';
import blockquote from '@/lib/parser/blockquote';
import codeblock from '@/lib/parser/codeblock';
import noimages from '@/lib/parser/noimages';
import placeholders from '@/lib/parser/placeholders';
import smallest from '@/lib/parser/smallest';
import spoiler from '@/lib/parser/spoiler';
import { APIEmbed } from 'discord-api-types/v10';
import Image from 'next/image';
import MarkdownView from 'react-showdown';
import Twemoji from '../emojis/twemoji';
import emoji from '@/lib/parser/emoji';
import { parsePlaceholders } from '@/lib/placeholders';
import time from '@/lib/parser/time';
import nolinks from '@/lib/parser/nolinks';
import { useQuery } from 'react-query';
import { TemplatePlaceholderData } from '@/lib/constants/TemplatePlaceholderData';
import serveremoji from '@/lib/parser/serveremoji';
import role from '@/lib/parser/role';
import user from '@/lib/parser/user';
import channel from '@/lib/parser/channel';
import { useEffect, useState } from 'react';

type DiscordMessageBody = {
    embed?: APIEmbed;
    content?: string;
    background?: boolean;
    serverData?: {
        serverID?: string;
        placeholderContext?: string[] | string;
    };
};

const CONTENT_OPTS = {
    noHeaderId: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    ghCodeBlocks: true,
    backslashEscapesHTMLTags: true,
    extensions: [
        spoiler,
        smallest,
        noimages,
        role,
        user,
        channel,
        blockquote,
        codeblock,
        emoji,
        time,
        serveremoji,
    ],
    underline: true,
};
const EMBED_OPTS = {
    noHeaderId: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    ghCodeBlocks: true,
    backslashEscapesHTMLTags: true,
    extensions: [
        spoiler,
        smallest,
        noimages,
        user,
        channel,
        blockquote,
        role,
        emoji,
        codeblock,
        time,
        serveremoji,
    ],
    underline: true,
};
const EMBED_TITLE_OPTS = {
    noHeaderId: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    backslashEscapesHTMLTags: true,
    extensions: [
        spoiler,
        smallest,
        noimages,
        emoji,
        role,
        user,
        nolinks,
        channel,
        serveremoji,
    ],
    underline: true,
};

export function DiscordMessage({
    embed,
    content,
    background,
    serverData,
}: DiscordMessageBody) {
    const { data: placeholdersRes } = useQuery<{
        placeholders: {
            [k: string]: { context: string | null; description?: string };
        };
    }>(
        ['placeholders', serverData?.placeholderContext ?? '*'],
        async () =>
            await fetch(
                `/bot/v1/placeholders?${Array.isArray(serverData?.placeholderContext) ? serverData?.placeholderContext.map((i) => `context=${i}`, '').join('&') : `context=${serverData?.placeholderContext ?? '*'}`}`
            )
                .then(async (data) => await data.json().catch(() => undefined))
                .catch(() => undefined)
    );
    const additionalExtensions = [
        placeholders(
            Object.keys(
                placeholdersRes?.placeholders ?? TemplatePlaceholderData
            )
        ),
    ];
    const [textDate, setTextDate] = useState('');
    useEffect(() => {
        if (!textDate) {
            setTextDate(
                new Date()
                    .toLocaleTimeString(
                        typeof navigator !== 'undefined'
                            ? navigator?.language
                            : 'en-US',
                        {
                            hour: 'numeric',
                            minute: '2-digit',
                        }
                    )
                    .replace(/(:\d{2})$/, '')
            );
        }
        return () => {};
    }, [textDate]);
    function generateFields() {
        if (!embed?.fields) return '';
        let totalInlines = 0;
        return embed?.fields?.map((field, index) => {
            if (field.inline) {
                totalInlines++;
                if (totalInlines > 3) {
                    totalInlines = 1;
                }
            }

            return (
                <div
                    key={index}
                    className={`min-w-0 ${field.inline ? `col-span-inline-${totalInlines}` : 'col-span-field'}`}
                >
                    <div className='text-left text-sm font-semibold leading-[1.375rem] text-white'>
                        <span
                            className='text-wrap block break-words'
                            dangerouslySetInnerHTML={{
                                __html: parsePlaceholders(
                                    field.name,
                                    false,
                                    Object.keys(
                                        placeholdersRes?.placeholders ??
                                            TemplatePlaceholderData
                                    )
                                ),
                            }}
                        />
                    </div>
                    <div className='min-w-0 whitespace-pre-line text-left text-sm leading-[1.375rem]'>
                        <span className='text-wrap block break-words'>
                            <MarkdownView
                                className='discord-content flex flex-col gap-2'
                                markdown={field.value}
                                options={{
                                    ...EMBED_OPTS,
                                    extensions:
                                        EMBED_OPTS.extensions.concat(
                                            additionalExtensions
                                        ),
                                }}
                                components={{
                                    Twemoji: ({ children }) => (
                                        <Twemoji
                                            serverID={serverData?.serverID}
                                            className='inline'
                                        >
                                            {children?.toString()}
                                        </Twemoji>
                                    ),
                                }}
                            />
                        </span>
                    </div>
                </div>
            );
        });
    }
    return (
        <article
            className={`z-10 whitespace-break-spaces font-sans text-base leading-[1.375rem] text-discord-text ${background ? 'rounded-md bg-discord-bg py-2' : ''}`}
        >
            <div
                className={`relative block ${background ? 'min-h-[44px] pb-[2px] pl-2 pr-2 pt-[2px] md:pl-[72px] md:pr-12' : ''}`}
            >
                {background && (
                    <>
                        <div className='absolute left-4 mt-[2px] h-10 w-10 overflow-hidden rounded-full max-md:hidden'>
                            <Image
                                alt='Auxdibot icon'
                                src={'/discord_icon.png'}
                                width={40}
                                height={40}
                                className='object-fit'
                            />
                        </div>
                        <div>
                            <h3 className='relative block min-h-[1.375rem] overflow-hidden pt-[2px] font-medium'>
                                <div className='mr-[0.25rem] inline'>
                                    <span>Auxdibot</span>
                                    <span className='relative top-[0.1rem] ml-[0.25rem] mt-[0.2em] inline-flex h-[0.9375rem] items-center rounded-[4px] bg-discord-app-tag px-[0.275rem] align-top text-[0.8rem] font-semibold text-white'>
                                        APP
                                    </span>
                                </div>
                                <span className='ml-[0.25rem] h-[1.25rem] align-baseline text-xs text-discord-muted'>
                                    Today at {textDate}
                                </span>
                            </h3>
                        </div>
                    </>
                )}
                {content && (
                    <div className='text-wrap word-break-word discord-content mt-[2px] block max-w-full overflow-hidden break-words'>
                        {
                            <MarkdownView
                                className='discord-content flex flex-col gap-2'
                                markdown={content}
                                options={{
                                    ...CONTENT_OPTS,
                                    extensions:
                                        CONTENT_OPTS.extensions.concat(
                                            additionalExtensions
                                        ),
                                }}
                                components={{
                                    Twemoji: ({ children }) => (
                                        <Twemoji
                                            serverID={serverData?.serverID}
                                            className='inline'
                                        >
                                            {children?.toString()}
                                        </Twemoji>
                                    ),
                                }}
                            />
                        }
                    </div>
                )}
                {embed && !isEmbedEmpty(embed) && (
                    <div
                        className='relative mt-[2px] grid max-w-max select-text rounded-[4px] border-l-4 border-discord-embed-border bg-discord-embed'
                        style={{
                            borderColor:
                                '#' +
                                embed?.color?.toString(16).padStart(6, '0'),
                        }}
                    >
                        <div className='max-w-[516px]'>
                            <div
                                className={`grid overflow-hidden pb-3 pl-4 pr-4 pt-2 ${embed?.thumbnail?.url ? 'grid-cols-thumbnail' : ''} grid-cols-auto grid-rows-auto text-base leading-[22px]`}
                            >
                                {embed?.author && (
                                    <div className='mt-2 flex min-w-0 items-center'>
                                        {/* eslint-disable-next-line @next/next/no-img-element*/}
                                        {embed.author.icon_url && (
                                            <img
                                                src={parsePlaceholders(
                                                    embed?.author?.icon_url,
                                                    false,
                                                    Object.keys(
                                                        placeholdersRes?.placeholders ??
                                                            TemplatePlaceholderData
                                                    )
                                                )}
                                                alt=''
                                                className='mr-2 h-6 w-6 rounded-[50%] object-contain indent-[-9999px] align-baseline'
                                            />
                                        )}
                                        <div className='min-w-0'>
                                            {embed?.author?.url ? (
                                                <a
                                                    href={parsePlaceholders(
                                                        embed?.author?.url,
                                                        false,
                                                        Object.keys(
                                                            placeholdersRes?.placeholders ??
                                                                TemplatePlaceholderData
                                                        )
                                                    )}
                                                    target='_blank'
                                                    role='button'
                                                    className={`text-wrap block cursor-pointer whitespace-pre-line break-words text-left text-sm font-semibold leading-[1.375rem] text-white hover:underline`}
                                                >
                                                    <MarkdownView
                                                        className='discord-content flex flex-col gap-2'
                                                        markdown={
                                                            embed?.author?.name
                                                        }
                                                        options={{
                                                            ...EMBED_TITLE_OPTS,
                                                            extensions:
                                                                EMBED_TITLE_OPTS.extensions.concat(
                                                                    additionalExtensions
                                                                ),
                                                        }}
                                                        components={{
                                                            Twemoji: ({
                                                                children,
                                                            }) => (
                                                                <Twemoji
                                                                    serverID={
                                                                        serverData?.serverID
                                                                    }
                                                                    className='inline'
                                                                >
                                                                    {children?.toString()}
                                                                </Twemoji>
                                                            ),
                                                        }}
                                                    />
                                                </a>
                                            ) : (
                                                <span className='text-wrap block whitespace-break-spaces break-words text-left text-sm font-semibold leading-[1.375rem] text-white'>
                                                    <MarkdownView
                                                        className='discord-content flex flex-col gap-2'
                                                        markdown={
                                                            embed?.author?.name
                                                        }
                                                        options={{
                                                            ...EMBED_TITLE_OPTS,
                                                            extensions:
                                                                EMBED_TITLE_OPTS.extensions.concat(
                                                                    additionalExtensions
                                                                ),
                                                        }}
                                                        components={{
                                                            Twemoji: ({
                                                                children,
                                                            }) => (
                                                                <Twemoji
                                                                    serverID={
                                                                        serverData?.serverID
                                                                    }
                                                                    className='inline'
                                                                >
                                                                    {children?.toString()}
                                                                </Twemoji>
                                                            ),
                                                        }}
                                                    />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {embed?.title && (
                                    <div
                                        className={`mt-2 inline-block min-w-0 text-left font-semibold text-white outline-0`}
                                    >
                                        {embed.url ? (
                                            <a
                                                className={
                                                    'text-discord-link hover:underline'
                                                }
                                                href={parsePlaceholders(
                                                    embed?.url,
                                                    false,
                                                    Object.keys(
                                                        placeholdersRes?.placeholders ??
                                                            TemplatePlaceholderData
                                                    )
                                                )}
                                                target='_blank'
                                                role='button'
                                            >
                                                <MarkdownView
                                                    className='discord-content flex flex-col gap-2'
                                                    markdown={embed?.title}
                                                    options={{
                                                        ...EMBED_TITLE_OPTS,
                                                        extensions:
                                                            EMBED_TITLE_OPTS.extensions.concat(
                                                                additionalExtensions
                                                            ),
                                                    }}
                                                    components={{
                                                        Twemoji: ({
                                                            children,
                                                        }) => (
                                                            <Twemoji
                                                                serverID={
                                                                    serverData?.serverID
                                                                }
                                                                className='inline'
                                                            >
                                                                {children?.toString()}
                                                            </Twemoji>
                                                        ),
                                                    }}
                                                />
                                            </a>
                                        ) : (
                                            <span className='text-wrap block break-words text-white'>
                                                <MarkdownView
                                                    className='discord-content flex flex-col gap-2'
                                                    markdown={embed?.title}
                                                    options={{
                                                        ...EMBED_TITLE_OPTS,
                                                        extensions:
                                                            EMBED_TITLE_OPTS.extensions.concat(
                                                                additionalExtensions
                                                            ),
                                                    }}
                                                    components={{
                                                        Twemoji: ({
                                                            children,
                                                        }) => (
                                                            <Twemoji
                                                                serverID={
                                                                    serverData?.serverID
                                                                }
                                                                className='inline'
                                                            >
                                                                {children?.toString()}
                                                            </Twemoji>
                                                        ),
                                                    }}
                                                />
                                            </span>
                                        )}
                                    </div>
                                )}
                                {embed?.description && (
                                    <div className='col-span-1 mt-2 min-w-0 whitespace-pre-line text-left text-sm leading-[1.125rem]'>
                                        <span className='text-wrap block break-words'>
                                            <MarkdownView
                                                className='discord-content flex flex-col gap-2'
                                                markdown={embed.description}
                                                options={{
                                                    ...EMBED_OPTS,
                                                    extensions:
                                                        EMBED_OPTS.extensions.concat(
                                                            additionalExtensions
                                                        ),
                                                }}
                                                components={{
                                                    Twemoji: ({ children }) => (
                                                        <Twemoji
                                                            serverID={
                                                                serverData?.serverID
                                                            }
                                                            className='inline'
                                                        >
                                                            {children?.toString()}
                                                        </Twemoji>
                                                    ),
                                                }}
                                            />
                                        </span>
                                    </div>
                                )}
                                {embed?.fields && embed.fields.length > 0 && (
                                    <div className='col-span-1 mt-2 grid min-w-0 gap-2 whitespace-pre-line leading-[1.125rem]'>
                                        {generateFields()}
                                    </div>
                                )}
                                {embed?.image?.url && (
                                    <div
                                        className={`mt-4 min-w-0 ${embed?.thumbnail?.url ? 'col-span-image' : 'col-span-1'} contain-paint block rounded-[4px] object-fill`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element*/}
                                        <img
                                            src={parsePlaceholders(
                                                embed?.image?.url,
                                                false,
                                                Object.keys(
                                                    placeholdersRes?.placeholders ??
                                                        TemplatePlaceholderData
                                                )
                                            )}
                                            alt=''
                                        />
                                    </div>
                                )}
                                {embed?.thumbnail?.url && (
                                    <div
                                        className={`contain-paint col-span-thumbnail row-span-thumbnail ml-4 mt-2 block h-20 w-[80px] min-w-0 rounded-[4px] object-fill`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element*/}
                                        <img
                                            src={parsePlaceholders(
                                                embed?.thumbnail?.url,
                                                false,
                                                Object.keys(
                                                    placeholdersRes?.placeholders ??
                                                        TemplatePlaceholderData
                                                )
                                            )}
                                            alt=''
                                            className='overflow-hidden rounded-[3px] object-contain'
                                        />
                                    </div>
                                )}
                                {embed?.footer && (
                                    <div className='mt-2 flex min-w-0 items-center'>
                                        {/* eslint-disable-next-line @next/next/no-img-element*/}
                                        {embed.footer.icon_url && (
                                            <img
                                                src={parsePlaceholders(
                                                    embed?.footer?.icon_url,
                                                    false,
                                                    Object.keys(
                                                        placeholdersRes?.placeholders ??
                                                            TemplatePlaceholderData
                                                    )
                                                )}
                                                alt=''
                                                className='mr-2 h-6 w-6 rounded-[50%] object-contain indent-[-9999px] align-baseline'
                                            />
                                        )}
                                        <div className='min-w-0'>
                                            <span className='text-wrap block whitespace-break-spaces break-words text-left text-sm font-semibold leading-[1.375rem] text-white'>
                                                <MarkdownView
                                                    className='discord-content flex flex-col gap-2'
                                                    markdown={
                                                        embed?.footer?.text
                                                    }
                                                    options={{
                                                        ...EMBED_TITLE_OPTS,
                                                        extensions:
                                                            EMBED_TITLE_OPTS.extensions.concat(
                                                                additionalExtensions
                                                            ),
                                                    }}
                                                    components={{
                                                        Twemoji: ({
                                                            children,
                                                        }) => (
                                                            <Twemoji
                                                                serverID={
                                                                    serverData?.serverID
                                                                }
                                                                className='inline'
                                                            >
                                                                {children?.toString()}
                                                            </Twemoji>
                                                        ),
                                                    }}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}
