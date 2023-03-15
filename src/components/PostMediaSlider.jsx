import { useState } from "react";

function PostMediaSlider({media}){
const [curIdx,setCurIdx]=useState(0);

function onBrowse(dir){
    if(dir>0){
        setCurIdx(prev=>Math.min(media.length-1,prev+1));
    }else{
        setCurIdx(prev=>Math.max(0,prev-1));
    }
}

return(
<div className="postMediaSlider relative rounded overflow-hidden bg-light dark:bg-darkest" style={{height:'256px'}}>
    <ul className="relative h-full">
    {
        media.map((m,i)=>(
            <li key={m.id} className="w-full h-full absolute top-0" style={{left:`${(i-curIdx)*100}%`,transition:'left 0.2s'}}>
                <div key={m.id} className="h-full" style={{background:`url(${m.url})`,backgroundSize:'contain',backgroundRepeat:'no-repeat',backgroundPosition:'center'}}></div>
            </li>
        ))
    }
    </ul>
    <div className="absolute left-0 top-0 w-full h-full bg-semitrans">
        <button onClick={()=>onBrowse(-1)} className="absolute top-1/2 left-2.5 w-8 h-8 text-dark bg-semitrans rounded-full hover:opacity-70"><i className="bi-chevron-left"></i></button>
        <button onClick={()=>onBrowse(1)} className="absolute top-1/2 right-2.5 w-8 h-8 text-dark bg-semitrans rounded-full hover:opacity-70"><i className="bi-chevron-right"></i></button>
        <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2">
            {media.map((m,i)=>(<span key={m.id} className={`inline-block ${curIdx==i?'w-2.5 h-2.5':'w-2 h-2'} mx-0.5 rounded-full bg-light/75`}></span>))}
        </span>
    </div>
</div>
);

}

export default PostMediaSlider;