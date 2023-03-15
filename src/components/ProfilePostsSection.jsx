import { useContext, useEffect, useState } from "react";
import { profileContext } from "../contexts/profileContext";
import AppService from "../services/appService";
import ImageChooserModal from "./modals/ImageChooserModal";
import NewPost from "./NewPost";
import PostCard from "./PostCard";

function ProfilePostsSection({loggedUser,user,mine}){
const profile_x=useContext(profileContext);
const postsCount=AppService.getPostsCount(user.id);
const posts=profile_x.posts;
const isLoadingPosts=profile_x.isLoadingPosts;
//states
//effects
//methods

return(
<section id="postsSection" className="py-4 bg-inherit rounded mt-6">
    <div className="py-4 border-b border-semitrans dark:border-dark border-dashed">
        <NewPost />
    </div>
    <div className="py-2 flex mb-4 items-center">
        <p className="text-lg text-semibold text-dark dark:text-lighter">Posts</p>
        <span className="w-fit h-fit text-xs text-semibold text-darkest px-2.5 py-0.5 rounded-full bg-primary ml-2">{postsCount}</span>
    </div>
    {
        posts.map((p,i)=>(<PostCard key={p.id} post={p} onPostUpdated={profile_x.updatePost} />))
    }
    <div className="fslex justify-center py-4" style={{display:isLoadingPosts?'block':'none'}}>
        <p className="text-dark dark:text-light text-xs text-center">Loading...</p>
    </div>
</section>
);
}

export default ProfilePostsSection;