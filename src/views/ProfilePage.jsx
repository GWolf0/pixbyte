import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import ProfileHero from "../components/ProfileHero";
import ProfileLinksSection from "../components/ProfileLinksSection";
import ProfileMediaSection from "../components/ProfileMediaSection";
import ProfilePostsSection from "../components/ProfilePostsSection";
import ProfileSettingsSection from "../components/ProfileSettingsSection";
import { profileContext, } from "../contexts/profileContext";
import AppService from "../services/appService";

function ProfilePage({settings}){
const profile_x=useContext(profileContext);
const loggedUser=AppService.isLogged();
const user=profile_x.user;
if(!user){
    return (<p className="text-dark dark:text-light text-lg py-2 text-center pt-12">This user doesn't exist!</p>)
}
const mine=profile_x.mine;
//refs
//states
const [section,setSection]=useState(!settings?"posts":"settings");



return(
<div id="profilePage" className="relative isolate w-screen min-h-screen bg-lighter dark:bg-darkest" style={{paddingTop:'64px'}}>
    <Header />
    <main className="mx-auto px-4 py-6" style={{width:'min(100vw,1280px)',minHeight:'80vh'}}>
        <ProfileHero loggedUser={loggedUser} user={user} mine={mine} isLinked={profile_x.isLinked} />
        <nav id="sectionsNav" className="flex px-0 py-2 no-wrap overflow-x-auto bg-light dark:bg-darker rounded">
            <button onClick={()=>setSection("posts")} className={`shrink-0 text-sm py-2 px-4 ${section=='posts'?'text-primary':'text-dark dark:text-light'} hover:opacity-70 border-r border-semitrans dark:border-dark`}>Posts</button>
            <button onClick={()=>setSection("media")} className={`shrink-0 text-sm py-2 px-4 ${section=='media'?'text-primary':'text-dark dark:text-light'} hover:opacity-70 border-r border-semitrans dark:border-dark`}>Media</button>
            <button onClick={()=>setSection("links")} className={`shrink-0 text-sm py-2 px-4 ${section=='links'?'text-primary':'text-dark dark:text-light'} hover:opacity-70 border-r border-semitrans dark:border-dark`}>Links</button>
            {mine&&
            <button onClick={()=>setSection("settings")} className={`shrink-0 text-sm py-2 px-4 ${section=='settings'?'text-primary':'text-dark dark:text-light'} hover:opacity-70`}>Settings</button>
            }
        </nav>
        {section=="posts"&&<ProfilePostsSection loggedUser={loggedUser} user={user} mine={mine} />}
        {section=="media"&&<ProfileMediaSection loggedUser={loggedUser} user={user} mine={mine} />}
        {section=="links"&&<ProfileLinksSection loggedUser={loggedUser} user={user} mine={mine} />}
        {section=="settings"&&mine&&<ProfileSettingsSection loggedUser={loggedUser} />}
    </main>
</div>
);
}

export default ProfilePage;