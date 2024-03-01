import { BsHash } from "react-icons/bs";
import { useQuery } from "react-query";

export function Channel({ channelID, serverID }: { channelID: string, serverID: string }) {
    const channelData = useQuery(["channels", channelID], async () => await fetch(`/api/v1/servers/${serverID}/channels?id=${channelID}`).then(async (data) => await data.json().catch(() => undefined)).catch(() => undefined)).data;
    return (<span className={"flex gap-2 items-center"}>
    <BsHash/>
    {channelData ? channelData.name : "Unknown"}
    </span>);
}   