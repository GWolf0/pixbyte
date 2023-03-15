import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import Header from "../components/Header";
import AppService from "../services/appService";
import { useContext, useEffect, useState } from "react";
import { globalContext } from "../contexts/globalContext";
import ProfilePic from "../components/ProfilePic";
import CommentCard from "../components/CommentCard";
import { postContext } from "../contexts/postContext";
import ImageChooserModal from "../components/modals/ImageChooserModal";


function PostPage(){
//context
const global_x=useContext(globalContext);
const post_x=useContext(postContext);
//
const loggedUser=AppService.isLogged();
const post=post_x.post;
const commentsCount=AppService.getPostCommentsCount(parseInt(post.id));
const isLikedByLoggedUser=AppService.isPostLiked(post.id);


return(
<div id="postPage" className="relative isolate w-screen min-h-screen bg-lighter dark:bg-darkest" style={{paddingTop:'64px'}}>
    <Header isMobile={global_x.isMobile} />
    <main className="mx-auto px-4 py-6" style={{width:'min(100vw,1280px)',minHeight:'80vh'}}>
        {
            post!=null?
            (<>
                <PostCard post={post} redirect={false} isPostPage={true} onCommentAdded={post_x.onCommentAdded} openImagesChooserModal={()=>post_x.setImagesChooserModalOn(true)} />
                <section id="commentsSection" className="mt-6">
                    <div className="flex">
                        <p className="text-dark dark:text-light text-sm">Comments </p>
                        <span className="w-fit h-fit text-xs text-semibold text-darkest px-2.5 py-0.5 rounded-full bg-primary ml-2">{commentsCount}</span>
                    </div>
                    <ul className="mt-4">
                        {
                        post_x.comments.map((c,i)=>(
                            <CommentCard key={c.id} comment={c} onCommentRemoved={post_x.onCommentRemoved} />
                        ))
                        }
                    </ul>
                    {!post_x.noMoreComments&&
                        <button onClick={post_x.onShowMoreComments} className="w-full py-2 rounded bg-primary text-lighter text-sm hover:opacity-70 my-4">{!post_x.isLoading?'show more':'loading..'}</button>
                    }
                    </section>
            </>)
            :
            <p className="text-lg text-dark dark:text-light">This post does not exist!</p>
        }
    </main>
    {post_x.imagesChooserModalOn&&<div id="overlay" className="fixed top-0 left-0 w-screen h-screen bg-semitrans"></div>}
    {post_x.imagesChooserModalOn&&<ImageChooserModal onClose={()=>post_x.setImagesChooserModalOn(false)} />}
</div>
);
}

export default PostPage;