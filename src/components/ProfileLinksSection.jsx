import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { profileContext } from '../contexts/profileContext';
import AppService from '../services/appService';
import Helper from '../services/helper';
import ProfilePic from './ProfilePic';

function ProfileLinksSection({loggedUser,user,mine}){
const profile_x=useContext(profileContext);
const links=profile_x.links;
//states
//effects
//methods
function onUnlink(userID){
    if(confirm("Unlink this profile?")){
        const isLinked=AppService.toggleLink(loggedUser.id,userID);
        profile_x.setLinks(prev=>prev.filter(l=>l.id!==userID));
    }
}


return(
<section id="linksSection" className="py-4 bg-inherit rounded mt-6">
    <div className="py-2 flex mb-4 items-center">
        <p className="text-lg text-semibold text-dark dark:text-lighter">Links</p>
        <span className="w-fit h-fit text-xs text-semibold text-darkest px-2.5 py-0.5 rounded-full bg-primary ml-2">{links.length}</span>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {
            links.map((l,i)=>(
                <div key={l.id} className="linkCard p-2 rounded bg-light dark:bg-darker">
                    <div className="py-0 flex items-center">
                        <ProfilePic imgUrl={l.profileImg} username={l.name} redirectUrl={`/profile/${l.name}`} />
                        <p className="text-dark dark:text-light text-xs ml-2 font-semibold">{l.name}</p>
                        {mine&&<button onClick={()=>onUnlink(l.id)} className="text-dark dark:text-light p-2 ml-auto text-sm hover:opacity-70" title="Unlink"><i className="bi-link-45deg"></i></button>}
                    </div>
                    {mine&&
                    <div className="pt-2.5 flex">
                        <p className="text-xs text-dark dark:text-light">{Helper.diffForHumans(Date.parse(l.createdAt))}</p>
                        <button className="ml-auto text-primary text-sm hover:opacity-70" title="Send Message"><i className="bi-chat-text pr-2"></i></button>
                    </div>
                    }
                </div>
            ))
        }
    </div>
</section>
);
}

export default ProfileLinksSection;