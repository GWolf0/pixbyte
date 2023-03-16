import { createContext, useEffect, useState } from "react";
import { redirect, useNavigate, useParams } from "react-router-dom";
import ProfilePage from "../views/ProfilePage";
import AppService from "../services/appService";

const profileContext=createContext();

let g_isLoadingPosts=false;

function ProfileContextProvider({settings}){
const navigate=useNavigate();
//
const loggedUser=AppService.isLogged();
const params=useParams();
const username=params.username;
const user=AppService.getUserByName(username);//console.log("change",username,user.id)
//states
//const [user,setUser]=useState(AppService.getUserByName(username));
const [mine,setMine]=useState(false);
const [isLinked,setIsLinked]=useState(false);
const [posts,setPosts]=useState([]);
const [isLoadingPosts,setIsLoadingPosts]=useState(false);
const [links,setLinks]=useState([]);
const [media,setMedia]=useState([]);
const [imagesChooserModalOn,setImagesChooserModalOn]=useState(false);
//effects
useEffect(()=>{
    if(!user)return navigate("/404");
},[]);
useEffect(()=>{
    setMine(!loggedUser?false:loggedUser.name===user.name);
    setIsLinked((mine||!loggedUser)?false:AppService.isLinkedByUser(loggedUser.id,user.id));
    getPosts(true);
    getLinks();
    setMedia(AppService.getUserMedia(user.id));
},[user]);
// useEffect(()=>{console.log("mine chaged",mine,(mine||!loggedUser)?false:AppService.isLinkedByUser(loggedUser.id,user.id))
//     setIsLinked((mine||!loggedUser)?false:AppService.isLinkedByUser(loggedUser.id,user.id));
// },[mine]);
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
function getPosts(reset=false){
    if(g_isLoadingPosts)return;
    g_isLoadingPosts=true;
    setIsLoadingPosts(true);
    const _posts=AppService.getUserPosts(user.id,!reset?posts.length:0,10);//console.log("new posts",_posts,reset)
    if(_posts.length<1&&!reset){
        g_isLoadingPosts=false;
        setIsLoadingPosts(false);
        return;
    }
    setTimeout(()=>{
        if(!reset)setPosts(prev=>[...prev,..._posts]);
        else setPosts(_posts);
        g_isLoadingPosts=false;
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
    <profileContext.Provider value={{user,mine,posts,onAddPost,isLoadingPosts,isLinked,setIsLinked,links,setLinks,media,setMedia,imagesChooserModalOn,setImagesChooserModalOn}}>
        <ProfilePage settings={settings} />
    </profileContext.Provider>
);

}

export {profileContext,ProfileContextProvider};
