import { createContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AppService from "../services/appService";
import PostPage from "../views/PostPage";

const postContext=createContext();

function PostContextProvider(){
const loggedUser=AppService.isLogged();
const params=useParams();
const postID=params.postID;
//states
const [post,setPost]=useState(AppService.getPostById(parseInt(postID)));
const [comments,setComments]=useState([]);
const [isLoading,setIsLoading]=useState(false);
const [noMoreComments,setNoMoreComments]=useState(false);
const [imagesChooserModalOn,setImagesChooserModalOn]=useState(false);
//effects
useEffect(()=>{
    onShowMoreComments();
},[]);
//methods
function onShowMoreComments(){
    if(isLoading)return;
    setIsLoading(true);
    const more=AppService.getPostComments(parseInt(postID),comments.length,2);
    setTimeout(()=>{
        setComments(prev=>[...prev,...more]);
        setIsLoading(false);
        if(more.length===0){
            setNoMoreComments(true);
        }
    },1200);
}
function onCommentAdded(newComment){
    setComments(prev=>[newComment,...prev]);
}
function onCommentRemoved(commentID){
    setComments(prev=>prev.filter(c=>c.id!==commentID));
}
function onUpdatePost(newVal){
    setPost(newVal);
}


return(
<postContext.Provider value={{post,isLoading,comments,noMoreComments,onUpdatePost,onCommentAdded,onCommentRemoved,onShowMoreComments,imagesChooserModalOn,setImagesChooserModalOn}}>
    <PostPage />
</postContext.Provider>
);
}

export {postContext,PostContextProvider};
