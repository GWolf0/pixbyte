import { useContext, useEffect, useRef, useState } from "react";
import { homeContext } from "../contexts/homeContext";
import { postContext } from "../contexts/postContext";
import { profileContext } from "../contexts/profileContext";
import AppService from "../services/appService";
import Helper from "../services/helper";

function NewPost({editablePost,isHomePage,onDoneEdit,openImagesChooserModal}){
const profile_x=useContext(profileContext);
const post_x=useContext(postContext);
const home_x=useContext(homeContext);
//
const loggedUser=AppService.isLogged();
const hasEditablePost=editablePost!=null;
//refs
const textAreaRef=useRef();
//states
const [media,setMedia]=useState([]);
//effects
useEffect(()=>{
    if(hasEditablePost){
        textAreaRef.current.value=editablePost.text;//console.log(AppService.getPostMedia(editablePost.id))
        setMedia(AppService.getPostMedia(editablePost.id));
    }
},[]);

//methods
function onSubmitPost(){
    const text=textAreaRef.current.value;
    if(text.length<3||text.length>256){return;}
    if(hasEditablePost){
        const editedPost=AppService.editPost(editablePost.id,text,media.map(m=>m.id));
        if(editedPost){
            alert('Post edited!');
            textAreaRef.current.value="";
            post_x.onUpdatePost(editedPost);
            onDoneEdit();//doneedit is comming from postcard when rendering newpost to edit the post (it sets editmode to false)
        }else{
            alert("Couldn't edit post!");
        }
        return;
    }
    const newPost=AppService.postNewPost(text,media.map(m=>m.id));
    textAreaRef.current.value="";
    if(isHomePage)home_x.onAddPost(newPost);
    else profile_x.onAddPost(newPost);
    setMedia([]);
}
function onOpenImagesChooserModal(){
    openImagesChooserModal();
    Helper.awaitImageChooserModalResult().then(res=>{
        //console.log("res",res);
        setMedia(prev=>[...prev,...res.filter(img=>prev.find(_img=>_img.id===img.id)==null)]);
    });
}
function onRemoveMedia(index){
    setMedia(prev=>prev.filter((m,i)=>i!==index));
}

return (
<section id="newPostSection" className={`rounded bg-light dark:bg-darker py-4 ${hasEditablePost?'mb-4':''}`}>
    <p className="text-primary text-xs font-semibold px-4 mb-2">New Post</p>
    <div className="px-4 pt-1">
        <textarea ref={textAreaRef} className="w-full h-14 resize-none bg-lightest dark:bg-darkest text-sm text-darker dark:text-light p-2 outline-none focus:border-b border-light dark:border-darker focus:border-primary dark:focus:border-primary" placeholder="text.." maxLength="256"></textarea>
    </div>
    <div className="px-4 pb-1 pt-0.5 flex items-center justify-end">
        <button onClick={onOpenImagesChooserModal} className="px-2 py-0.5 text-primary text-xs md:text-sm border border-primary rounded hover:opacity-70">+ Image</button>
    </div>
    <div className="px-4 mb-2"><hr className="border-dark" /></div>
    <div id="newPostMediaContainer" className="px-4 pb-2" hidden={media.length<1}>
        <ul className="flex no-wrap overflow-x-auto">
            {
                media.map((m,i)=>{
                    return(
                        <li key={m.id} className="relative w-32 h-32 rounded overflow-hidden mr-1 shrink-0 bg-darkest">
                            <img className="w-full h-full object-contain" src={m.url} />
                            <span onClick={()=>onRemoveMedia(i)} className="absolute top-1 right-1 text-light text-xs p-1 cursor-pointer hover:text-accent">&times;</span>
                        </li>
                    )
                })
            }
        </ul>
    </div>
    <div className="px-4 pb-1">
        <button onClick={onSubmitPost} className="w-full py-2 rounded bg-primary text-light hover:-translate-y-0.5 transition-transform active:opacity-70"><i className="bi-send"></i> {!hasEditablePost?'Submit':'Edit'}</button>
    </div>
</section>
);
}

export default NewPost;