import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppService from "../services/appService";
import GoogleAuthService from "../services/googleSignInService";
import Helper from "../services/helper";
import Logo from "./Logo";
import MCheckBox from "./MCheckBox";
import SearchBox from "./SearchBox";

function Header({isTransparent,isMobile}){
const user=AppService.isLogged();
const isLogged=user!=null;
const navigate=useNavigate();
//refs
const messagesTogglerRef=useRef();
const notificationsTogglerRef=useRef();
const profileTogglerRef=useRef();
//states
const [layout,setLayout]=useState({profileMinMenu:false,notificationsMinMenu:false,messagesMinMenu:false});
const [searchOn,setSearchOn]=useState(false);
const [darkTheme,setDarkTheme]=useState(document.body.classList.contains("dark"));
const [messages,setMessages]=useState([]);
const [notifications,setNotifications]=useState([]);
//effects
useEffect(()=>{
    //events handlers
    function onDocumentClick(e){
        //toggle all minmenus off when click on other elements other than the minmenus togglers
        const target=e.target;
        if([messagesTogglerRef.current,notificationsTogglerRef.current,profileTogglerRef.current].includes(target)){
            return;
        }
        setLayout({profileMinMenu:false,notificationsMinMenu:false,messagesMinMenu:false});
    }
    //event listener
    document.addEventListener('click',onDocumentClick);
    //init
    init();
    //remove event listeners
    return()=>{
        document.removeEventListener('click',onDocumentClick);
    };
},[]);

//methods
function init(){
    setDarkTheme(document.body.classList.contains("dark"));
    if(user){
        setMessages(AppService.getMessages(user.id));
        setNotifications(AppService.getNotifications(user.id));
    }
}
function toggleMinMenu(alias){
    const newVal={profileMinMenu:false,notificationsMinMenu:false,messagesMinMenu:false};
    newVal[alias]=!layout[alias];
    setLayout(newVal);
}
function onDisposeSearchBox(){
    setSearchOn(false);
}
function onThemeToggle(){
    if(!darkTheme){
        document.body.classList.add("dark");
        localStorage.setItem("darkTheme","true");
        setDarkTheme(true);
    }else{
        document.body.classList.remove("dark");
        localStorage.setItem("darkTheme","false");
        setDarkTheme(false);
    }
}
function onLogout(){
    AppService.logout();
    //GoogleAuthService.revoke("")
    window.location.href="/";
}


return(
<header id="pageHeader" className={`fixed z-10 top-0 left-0 w-full ${isTransparent?'':'bg-lighter dark:bg-darkest'} flex items-center px-4 md:px-6`} style={{height:'60px'}}>
    <Logo />
    {searchOn&&isLogged&&<SearchBox smallScreen={isMobile} onDispose={onDisposeSearchBox} />}
    {isLogged&&
    <section id="loggedInSection" className="ml-auto flex items-center">
        <button hidden={searchOn} onClick={()=>setSearchOn(true)} id="smSearchBtn" className="mr-2 rounded-full text-dark dark:text-light border border-light dark:border-semitrans hover:text-accent" style={{width:'40px',height:'40px'}}><i className="bi-search"></i></button>
        <button ref={messagesTogglerRef} onClick={()=>toggleMinMenu('messagesMinMenu')} id="messagesBtn" className="relative mr-2 rounded-full text-dark dark:text-light border border-light dark:border-semitrans hover:text-accent" style={{width:'40px',height:'40px'}}>
            <i className="bi-chat-text pointer-events-none"></i>
            {messages.length>0&&<span className="absolute -right-0.5 -bottom-0.5 py-0.5 px-1.5 bg-secondary text-darker text-xs rounded-full pointer-events-none">{messages.length}</span>}
        </button>
        <button ref={notificationsTogglerRef} onClick={()=>toggleMinMenu('notificationsMinMenu')} id="notificationsBtn" className="relative mr-2 rounded-full text-dark dark:text-light border border-light dark:border-semitrans hover:text-accent" style={{width:'40px',height:'40px'}}>
            <i className="bi-bell pointer-events-none"></i>
            {notifications.length>0&&<span className="absolute -right-0.5 -bottom-0.5 py-0.5 px-1.5 bg-secondary text-darker text-xs rounded-full pointer-events-none">{notifications.length}</span>}
        </button>
        <div ref={profileTogglerRef} onClick={()=>toggleMinMenu('profileMinMenu')} id="profileImg" className="cursor-pointer rounded-full overflow-hidden border border-none" style={{width:'40px',height:'40px'}}>
            {user.profileImg!=null?
                (<img src={user.profileImg} className="w-full h-full object-cover pointer-events-none" />)
                :(<div className="w-full h-full object-cover pointer-events-none text-xl font-bold bg-darker text-primary rounded-full flex items-center justify-center">{user.name.charAt(0).toUpperCase()}</div>)
            }
        </div>
        <ul hidden={!layout.profileMinMenu} id="profileMinMenu" className="fixed rounded overflow-hidden py-1 px-2 bg-lighter dark:bg-darkest border border-light dark:border-darker shadow" style={{width:'min(100vw,360px)',top:'64px',right:'0.5rem'}}>
            <li onClick={()=>window.location.href=`/profile/${user.name}`} className="py-2 px-4 text-dark dark:text-light text-base border-b border-light dark:border-darker cursor-pointer hover:opacity-70"><i className="bi-person mr-4"></i> Profile</li>
            <li onClick={()=>window.location.href=`/profile/${user.name}/settings`} className="py-2 px-4 text-dark dark:text-light text-base border-none border-light cursor-pointer hover:opacity-70"><i className="bi-gear mr-4"></i> Settings</li>
            <li className="py-2 px-4 text-dark dark:text-light"><label className="flex items-center"><MCheckBox value={darkTheme} onChange={onThemeToggle} /> <p className="ml-2">Dark Theme</p></label></li>
            <li onClick={onLogout} className="py-2 px-4 my-2 bg-secondary text-darkest text-base border-none border-light cursor-pointer rounded hover:opacity-70"><i className="bi-box-arrow-left mr-4"></i> Logout</li>
        </ul>
        <ul hidden={!layout.notificationsMinMenu} id="notificationsMinMenu" className="fixed rounded overflow-hidden overflow-y-auto px-2 bg-light border border-semitrans" style={{width:'min(100vw,360px)',maxHeight:'70vh',top:'64px',right:'0.5rem'}}>
            {
                notifications.length>0?notifications.map((n,i)=>(
                    <li key={n.id} className={`py-2 px-2 bg-light text-dark text-sm ${i<notifications.length-1?'border-b':''} border-dark border-dashed cursor-pointer hover:text-primary hover:opacity-70`}>
                        <i className="bi-circle-fill text-inherit text-xs"></i>
                        <p className="text-sm text-darker">{n.text.substr(0,Math.min(25,n.text.length))}..</p>
                        <p className="text-xs text-darker text-right">{Helper.diffForHumans(Date.parse(n.createdAt))}</p>
                    </li>
                )):
                (
                    <li className="py-2 px-2 bg-light text-dark text-sm">No notifications</li>  
                )
            }
        </ul>
        <ul hidden={!layout.messagesMinMenu} id="messagesMinMenu" className="fixed rounded overflow-hidden overflow-y-auto px-2 bg-light border border-semitrans" style={{width:'min(100vw,360px)',maxHeight:'70vh',top:'64px',right:'0.5rem'}}>
            {
                messages.length>0?messages.map((m,i)=>(
                    <li key={m.id} className={`py-2 px-2 bg-light text-dark text-sm ${i<messages.length-1?'border-b':''} border-dark border-dashed cursor-pointer hover:opacity-70`}>
                        <div className="flex">
                            <img src={`/assets/images/${m.userProfileImg}`} className="rounded-full" style={{width:'32px',height:'32px'}} />
                            <div className="p-1">
                                <p className="text-xs text-dark mb-0.5">{m.username}</p>
                                <p className="text-sm text-darker" style={{maxHeight:'64px'}}>{m.text.substr(0,Math.min(25,m.text.length))}..</p>
                            </div>
                        </div>
                        <p className="text-xs text-darker text-right">{Helper.diffForHumans(Date.parse(m.createdAt))}</p>
                    </li>
                )):
                (
                    <li className="py-2 px-2 bg-light text-dark text-sm">No messages</li>  
                )
            }
        </ul>
    </section>
    }
</header>
);

}

Header.defaultProps={
    isTransparent:false,
};

export default Header;

