

function MediaCard(){
return(
<div className="mediaCard rounded overflow-hidden bg-light dark:bg-darker">
    <img className="w-full object-cover" src="/assets/images/bg.jpg" style={{height:'156px'}} />
    <div className="p-2"><p className="text-xs text-dark dark:text-light text-right">at 06/03/2023</p></div>
</div>
)
}

export default MediaCard;