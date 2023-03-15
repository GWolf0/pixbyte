import { useContext, useEffect, useState } from "react";
import { profileContext } from "../contexts/profileContext";
import ProfilePic from "../components/ProfilePic";
import AppService from "../services/appService";
import Helper from "../services/helper";

function ProfileHero({loggedUser,user,mine,isLinked}){
const profile_x=useContext(profileContext);
//states
//methods
function onLink(){
    const _isLinked=AppService.toggleLink(loggedUser.id,user.id);
    profile_x.setIsLinked(_isLinked);
}


return(
<section id="profileHero" className="rounded mb-6 overflow-hidden bg-gradient-to-r from-darker via-dark to-primary" style={{minHeight:'120px'}}>
    <div className="py-6 flex items-center px-4">
        <ProfilePic imgUrl={user.profileImg} username={user.name} size={64} />
        <div className="ml-4">
            <p className="text-lighter text-xl font-bold">{user.name}</p>
            <p className="text-light text-sm">Joined {Helper.diffForHumans(Date.parse(user.createdAt))}</p>
        </div>
        {!mine&&loggedUser&&
            <button onClick={onLink} className={`ml-auto py-1.5 px-4 md:px-6 rounded ${isLinked?'bg-darkest text-light':'bg-darkprimary text-light'} text-sm hover:opacity-70`}><i className="bi-link-45deg"></i> {!isLinked?'Link':'Unlink'}</button>
        }
    </div>
</section>
);
}

export default ProfileHero;