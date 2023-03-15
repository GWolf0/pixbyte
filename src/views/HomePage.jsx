import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import ImageChooserModal from "../components/modals/ImageChooserModal";
import NewPost from "../components/NewPost";
import PostCard from "../components/PostCard";
import ProfilePic from "../components/ProfilePic";
import {globalContext} from "../contexts/globalContext";
import { homeContext } from "../contexts/homeContext";
import AppService from "../services/appService";

function HomePage(){
const loggedUser=AppService.isLogged();
//contexts
const global_x=useContext(globalContext);
const home_x=useContext(homeContext);
//states
const [linksSuggs,setLinksSuggs]=useState([]);
//effects
useEffect(()=>{
    if(!home_x.userHasLinks){
        const suggs=AppService.getLinksSuggestions(loggedUser,6);
        setLinksSuggs(suggs);
    }
},[home_x.userHasLinks]);


return(
<div id="homePage" className="relative isolate w-screen min-h-screen bg-lighter dark:bg-darkest" style={{paddingTop:'64px'}}>
    <Header isMobile={global_x.isMobile} />
    <main className="mx-auto px-4 py-6" style={{width:'min(100vw,1280px)',minHeight:'80vh'}}>
        <NewPost isHomePage={true} openImagesChooserModal={()=>home_x.setImagesChooserModalOn(true)} />
        <section id="tagsSection" className="px-0 mt-6 border-b border-dashed border-dark pb-2">
            <p className="text-dark dark:text-light font-semibold mb-4 text-sm">Tags</p>
            <ul className="flex no-wrap overflow-x-auto">
                {
                    home_x.tags.map((t,i)=>(
                        <li key={i} className="shrink-0 py-2 px-4 rounded-full bg-light dark:bg-darker text-dark dark:text-light text-xs mr-1 cursor-pointer hover:opacity-70">{t}</li>
                    ))
                }
                </ul>
        </section>
        <section id="postsSection" className="px-0 mt-6">
            <p className="text-dark dark:text-light font-semibold mb-4 text-sm">Posts</p>
            {
                !home_x.userHasLinks&&(
                <>
                    <p className="text-dark dark:text-accent py-2 text-xs mb-4">Links suggestions!</p>
                    <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {
                            linksSuggs.map((l,i)=>(
                                <Link key={l.id} to={`/profile/${l.name}`} target="_blank" rel="noopener noreferrer">
                                    <div className="py-2 px-4 flex items-center rounded bg-light dark:bg-darker">
                                        <ProfilePic imgUrl={l.profileImg} username={l.name} />
                                        <p className="text-sm text-dark dark:text-light ml-auto">{l.name}</p>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </>
                )
            }
            {
                home_x.posts.map((p,i)=>(<PostCard key={p.id} post={p} />))
            }
        </section>
        <div className="flex justify-center py-4" style={{display:home_x.isLoadingPosts?'block':'none'}}>
            <p className="text-dark dark:text-light text-xs text-center">Loading...</p>
        </div>
    </main>
    {home_x.imagesChooserModalOn&&<div id="overlay" className="fixed top-0 left-0 w-screen h-screen bg-semitrans"></div>}
    {home_x.imagesChooserModalOn&&<ImageChooserModal onClose={()=>home_x.setImagesChooserModalOn(false)} />}
</div>
);

}

export default HomePage;
    