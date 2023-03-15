import Helper from "../services/helper";


function MediaCard({media}){
return(
<div className="mediaCard rounded overflow-hidden bg-light dark:bg-darker">
    <img className="w-full object-cover" src={media.url} style={{height:'156px'}} />
    <div className="p-2"><p className="text-xs text-dark dark:text-light text-right">{Helper.diffForHumans(Date.parse(media.createdAt))}</p></div>
</div>
)
}

export default MediaCard;