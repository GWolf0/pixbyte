import { createContext, useState, useEffect } from "react";
import AppService from "../services/appService";
import HomePage from "../views/homePage";

const homeContext=createContext();

function HomeContextProvider(){
const loggedUser=AppService.isLogged();
//states
const [posts,setPosts]=useState([]);
const [isLoadingPosts,setIsLoadingPosts]=useState(false);
const [userHasLinks,setUserHasLinks]=useState(true);
const [tags,setTags]=useState([]);
const [imagesChooserModalOn,setImagesChooserModalOn]=useState(false);

//effects
useEffect(()=>{
    getPosts();
    setUserHasLinks(AppService.getUserLinks(loggedUser.id).length>0);
},[]);
useEffect(()=>{
    //events handlers
    function onScroll(e){
        const isAtBottom=(document.body.scrollHeight-(window.innerHeight-window.screenTop))-window.scrollY<10;
        if(isAtBottom){
            //do things when scroll at bottom
            getPosts();
        }
    }
    //event listener
    document.addEventListener('scroll',onScroll);
    updateTagsList();
    //remove event listeners
    return()=>{
        document.removeEventListener('scroll',onScroll);
    };
},[posts,isLoadingPosts]);
//methods
function getPosts(){
    if(isLoadingPosts)return;
    setIsLoadingPosts(true);
    const _posts=AppService.getPosts(posts.length,10);
    if(_posts.length<1){
        setIsLoadingPosts(false);
        return;
    }
    setTimeout(()=>{
        setPosts(prev=>[...prev,..._posts]);
        setIsLoadingPosts(false);
    },1300);
}
function updateTagsList(){
    let _tags=new Set();
    posts.forEach(p=>{
        p.tags.forEach(t=>{
            _tags.add(t);
        });
    });
    setTags(Array.from(_tags).slice(0,Math.min(30,_tags.size)));
}
function onAddPost(newPost){
    setPosts(prev=>[newPost,...prev]);
}



return(
<homeContext.Provider value={{posts,isLoadingPosts,userHasLinks,tags,onAddPost,imagesChooserModalOn,setImagesChooserModalOn}}>
    <HomePage />
</homeContext.Provider>
);
}

export {homeContext,HomeContextProvider};
