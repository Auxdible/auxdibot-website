import { BsBell, BsClock, BsImage, BsJournalCheck, BsPersonBadge, BsQuestion, BsRobot, BsShield, BsStar, BsTextLeft, BsTrophy } from "react-icons/bs";
import { PiHandWaving } from "react-icons/pi";
import { motion } from 'framer-motion';
import { useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
export default function Features() {
    const { valueOf: isMobile } = useMediaQuery({ query: "(max-width: 1024px)" })
    return (
    <div className={"grid grid-cols-3 max-lg:grid-cols-1 gap-4 max-w-7xl mx-auto lg:w-full relative"}>

        
        <FeatureColumn>
            <Feature name={<><BsShield/> Moderation</>} description={<>
                Auxdibot&apos;s moderation suite features a tracked punishment history, a variety of moderation commands, a reporting tool, and more. Moderators have a tool for every situation with Auxdibot&apos;s moderation suite.
            </>}/>
            <Feature name={<><BsBell/> Notifications</>} description={<>
                Auxdibot&apos;s notifications allow you to subscribe to alerts from your favorite youtube channel, twitch streamer, or RSS feed! Get notified when your favorite content creator uploads a new video or goes live.
            </>}/>
            <Feature name={<><BsQuestion/> Suggestions</>} description={<>
                Receive feedback from your server members with Auxdibot&apos;s suggestion system. Members can submit suggestions and vote on them, and moderators can respond to them with a reason and status.
            </>}/>
            <Feature name={<><BsTextLeft/> Embeds</>} description={<>
                Create fleshed out custom Discord Embeds with Auxdibot&apos;s embeds feature. Featuring an easy-to-use editor, you can create embeds with a variety of fields and colors.
            </>}/>
        </FeatureColumn>
        <FeatureColumn reverse={!isMobile}>
        <Feature name={<><BsStar/> Starboard</>} description={<>
                Showcase your community highlights with Auxdibot&apos;s starboard feature! When a message reaches a certain amount of reactions, it will be showcased in a starboard channel.
            </>}/>
            <Feature name={<><BsJournalCheck/> Logging</>} description={<>
                Log messages, moderation actions, and more with Auxdibot&apos;s logging feature. Trace the latest actions taken on your server, and keep a record of everything that happens.
            </>}/>
            <Feature name={<><BsTrophy/> Levels</>} description={<>
                Incentivize your members to chat on your server with Auxdibot&apos;s levels feature. Members can earn experience, level up, and gain role rewards by chatting on a server with Auxdibot&apos;s Levels module enabled.
            </>}/>
            <Feature name={<><BsRobot/> AutoMod</>} description={<>
                Auxdibot features a fleshed out automod system which automatically logs actions on the server and automatically deals out punishments for specific infractions. AutoMod features a vast config that can be customized to your server&apos;s needs.
            </>}/>
        </FeatureColumn>
        <FeatureColumn>
        <Feature name={<><BsClock/> Schedules</>} description={<>
                Schedule reminders for events, meetings, and more with Auxdibot&apos;s schedules feature. Schedules can utilize custom embeds, placeholders, timestamps, and more.
            </>}/>
            <Feature name={<><PiHandWaving/> Greetings</>} description={<>
                Greet members as they join your server with Auxdibot&apos;s greetings feature. Greetings can be customized using Auxdibot&apos;s Discord Embed creator.
            </>}/>
            <Feature name={<><BsPersonBadge/> Permissions</>} description={<>
                Configure Auxdibot&apos;s permissions to your server&apos;s needs. Auxdibot features a variety of permissions for each module, and a role-based/user-based permission system.
            </>}/>
            <Feature name={<><span className={"border border-green-500 rounded-2xl p-1 text-md"}>BETA</span> <BsImage/> Cards</>} description={<>
                Experience the future of server presentation with Auxdibot&apos;s cards feature. Cards are a way to present your server to the world in a unique way. Create a custom website for your server with a library of various fonts and backgrounds.
            </>}/>
            
        </FeatureColumn>

    </div>
    )
}
function FeatureColumn({ children, reverse }: { children: any, reverse?: boolean}) {
    const child1 = useRef<HTMLDivElement | null>(null);
    const child2 = useRef<HTMLDivElement | null>(null);
    const sectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const animation = child1.current?.animate([
            { transform: "translateY(0px)" },
            { transform: reverse ? "translateY(100%)" : "translateY(-100%)" }
        ], {
            duration: 30000,
            iterations: Infinity
        });
        const animation2 = child2.current?.animate([
            { transform: reverse ? "translateY(-100%)" : "translateY(100%)" },
            { transform: "translateY(0px)" }
        ], {
            duration: 30000,
            iterations: Infinity
        });

        const handleMouseEnter = () => {
            animation?.pause();
            animation2?.pause();
        }

        const handleMouseLeave = () => {
            animation?.play();
            animation2?.play();
        }

        sectionRef.current?.addEventListener('mouseenter', handleMouseEnter);
        sectionRef.current?.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            animation?.cancel();
            animation2?.cancel();
            sectionRef.current?.removeEventListener('mouseenter', handleMouseEnter);
            sectionRef.current?.removeEventListener('mouseleave', handleMouseLeave);
        }
    }, [reverse])

    return <section ref={sectionRef} className={"relative h-[800px] flex flex-col gap-4 overflow-visible max-lg:overflow-hidden"}>
        <div className={"absolute z-30 bg-gradient-to-b from-black via-transparent from-5% to-95% via-50% to-black self-stretch w-full top-0 h-[800px] pointer-events-none lg:hidden"}/>
        <div ref={child1} className={`absolute flex flex-col gap-4 ${reverse ? 'mt-4' : ''}`}>{children}</div>
        <div ref={child2} className={`absolute flex flex-col gap-4 ${!reverse ? 'mt-4' : ''}`}>{children}</div>
    </section>;
}
function Feature({ name, description }: { name: JSX.Element, description: JSX.Element }) {
    return <motion.div viewport={{ once: true }} transition={{ duration: 1 }} whileInView={{ opacity: 1 }} initial={false} className={"relative group opacity-0"}>
        <div
            className="absolute lg:group-hover:scale-105 group-hover:opacity-30 -inset-1 rounded-lg bg-gradient-to-tl z-10 from-orange-400 to-red-500 opacity-0 blur-2xl"
            ></div>
        <div className={"flex flex-col gap-1 max-lg:w-fit bg-background-300 border p-2 py-5 rounded-2xl hover:border-gray-400 border-gray-800 transition-all hover:bg-gradient-to-br from-background-200 to-background-300 relative z-20"}>
            <h1 className={"font-montserrat text-2xl max-lg:text-xl flex items-center gap-2"}>{name}</h1>
            <p className={"font-open-sans max-lg:text-sm max-lg:w-fit"}>{description}</p>
        </div>
    </motion.div>;
}