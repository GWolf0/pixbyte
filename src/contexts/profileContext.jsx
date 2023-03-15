import { createContext, useEffect, useState } from "react";
import { redirect, useNavigate, useParams } from "react-router-dom";
import ProfilePage from "../views/ProfilePage";
import AppService from "../services/appService";

const profileContext=createContext();

function ProfileContextProvider({settings}){
const navigate=useNavigate();
//
const loggedUser=AppService.isLogged();
const params=useParams();
const username=params.username;
const user=AppService.getUserByName(username);
//states
//const [user,setUser]=useState(AppService.getUserByName(username));
const [mine,setMine]=useState(false);
const [isLinked,setIsLinked]=useState(false);
const [posts,setPosts]=useState([]);
const [isLoadingPosts,setIsLoadingPosts]=useState(false);
const [links,setLinks]=useState([]);
const [imagesChooserModalOn,setImagesChooserModalOn]=useState(false);
//effects
useEffect(()=>{
    if(!user)return navigate("/");
},[]);
useEffect(()=>{
    getPosts();
    getLinks();
    setMine(!loggedUser?false:loggedUser.name===user.name);
},[user]);
useEffect(()=>{
    setIsLinked((mine||!loggedUser)?false:AppService.isLinkedByUser(loggedUser.id,user.id));
},[mine])
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
    //remove event listeners
    return()=>{
        document.removeEventListener('scroll',onScroll);
    };
},[posts,isLoadingPosts]);
//methods
function getPosts(){
    if(isLoadingPosts)return;
    setIsLoadingPosts(true);
    const _posts=AppService.getUserPosts(user.id,posts.length,10);
    if(_posts.length<1){
        setIsLoadingPosts(false);
        return;
    }
    setTimeout(()=>{
        setPosts(prev=>[...prev,..._posts]);
        setIsLoadingPosts(false);
    },1300);
}
function getLinks(){
    const links=AppService.getUserLinks(user.id);
    setLinks(links);
}
//
function onAddPost(newPost){
    setPosts(prev=>[newPost,...prev]);
}


return(
    <profileContext.Provider value={{user,mine,posts,onAddPost,isLoadingPosts,isLinked,setIsLinked,links,setLinks,imagesChooserModalOn,setImagesChooserModalOn}}>
        <ProfilePage settings={settings} />
    </profileContext.Provider>
);

}

export {profileContext,ProfileContextProvider};
