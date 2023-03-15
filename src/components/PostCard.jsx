import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppService from "../services/appService";
import ProfilePic from "./ProfilePic";
import NewPost from "./NewPost";
import Helper from "../services/helper";
import PostMediaSlider from "./PostMediaSlider";

function PostCard({post,redirect,isPostPage,onCommentAdded,openImagesChooserModal}){
const loggedUser=AppService.isLogged();
const mine=loggedUser!=null?post.user_id===loggedUser.id:false;
const user=AppService.getUserById(post.user_id);
const comments=AppService.getPostComments(post.id);
const likesCount=AppService.getPostLikesCount(post.id);
//
const navigate=useNavigate();
//refs
const commentInputRef=useRef();
//states
const [isLiked,setIsLiked]=useState(AppService.likedPosts.includes(post.id));
const [minMenuOn,setMinMenuOn]=useState(false);
const [editMode,setEditMode]=useState(false);
const [media,setMedia]=useState([]);
//effects
useEffect(()=>{
    function onKeyDown(e){
        const kc=e.keyCode;
        if(kc===13&&document.activeElement==commentInputRef.current){
            onAddComment();
        }
    }
    window.addEventListener('keydown',onKeyDown);
    setMedia(AppService.getPostMedia(post.id));
    return ()=>{
        window.removeEventListener('keydown',onKeyDown);
    };
},[]);
//methods
function onEdit(){
    setMinMenuOn(false);
    setEditMode(true);
}
function onRemove(){
    if(confirm("Confirm remove this post?")){
        AppService.removePost(post.id);
        window.location.href=`/profile/${loggedUser.name}`;
    }
}
function onAddComment(){
    const text=commentInputRef.current.value;
    if(text.length<3)return;
    const newComment=AppService.addComment(loggedUser.id,post.id,text);
    commentInputRef.current.value="";
    onCommentAdded(newComment);
}
function onCommentsBtn(){
    if(redirect){
        navigate(`/post/${post.id}`);
    }
}
function onLikeBtn(){
    const liked=AppService.toggleLike(post.id);
    setIsLiked(liked);
}


return !editMode?(
<div className="postCard bg-light dark:bg-darker py-2 rounded overflow-hidden mb-4">
    <div className="postCardHeader relative flex items-center px-4">
        <ProfilePic imgUrl={user.profileImg} username={user.name} redirectUrl={`/profile/${user.name}`} />
        <div className="ml-2">
            <p className="text-xs text-dark dark:text-light mb-1">{user.name}</p>
            <p className="text-xs text-dark dark:text-light">{Helper.diffForHumans(Date.parse(post.createdAt))}</p>
        </div>
        {redirect&&
            <Link to={`/post/${post.id}`} className="ml-auto text-dark dark:text-light mr-4 hover:text-accent dark:hover:text-accent"><div className=""><i className="bi-box-arrow-up-right"></i></div></Link>
        }
        {mine&&isPostPage&&
        <>
        <button onClick={()=>setMinMenuOn(prev=>!prev)} className={`p-2 ${!redirect?'ml-auto':''} text-dark dark:text-light`}><i className="bi-three-dots-vertical"></i></button>
        <ul hidden={!minMenuOn} className="absolute right-4 top-10 py-2 px-1.5 rounded overflow-hidden bg-light border border-semitrans" style={{width:'min(99vw,200px)'}}>
            <li onClick={onEdit} className="py-1.5 text-dark text-sm text-center cursor-pointer border-b border-semitrans hover:opacity-70"><i className="bi-pen"></i> Edit</li>
            <li onClick={onRemove} className="py-1.5 text-dark text-sm text-center cursor-pointer hover:opacity-70"><i className="bi-archive"></i> Remove</li>
        </ul>
        </>
        }
    </div>
    <div className="postCardBody px-4 py-2 mt-2">
        <ul>
        {
            post.tags.map((t,i)=>(<li key={i*post.id} className="text-primary dark:text-accent text-xs inline-block ml-2"><Link>{t}</Link></li>))
        }
        </ul>
        <p className="text-sm text-darker dark:text-lightest px-2 py-2">{post.text}</p>
        {media.length>0&&
        <PostMediaSlider media={media} />
        }
    </div>
    {loggedUser!=null&&
    <>
    {!redirect&&
    <div className="px-4">
        <input ref={commentInputRef} className="w-full text-xs resize-none bg-lightest dark:bg-darkest text-dark dark:text-light px-2.5 py-2.5 rounded outline-none focus:border-b border-light dark:border-darker focus:border-primary dark:focus:border-primary" placeholder="comment.." />
    </div>
    }
    <div className="postCardFooter flex items-center px-4 mt-2">
        <button onClick={onLikeBtn} title="like" className="w-8 h-8 text-primary text-xs md:text-sm rounded-full hover:opacity-70 mr-1"><i className={!isLiked?'bi-heart':'bi-heart-fill'}></i> {likesCount}</button>
        <button onClick={onCommentsBtn} title="comments" className="w-8 h-8 text-primary text-xs md:text-sm rounded-full hover:opacity-70 mr-1"><i className="bi-chat-text"></i> {comments.length}</button>
        <button title="share" className="w-8 h-8 text-primary text-xs md:text-sm rounded-full hover:opacity-70 ml-auto"><i className="bi-share"></i> 0</button>
    </div>
    </>
    }
</div>
):(
    <NewPost editablePost={post} onDoneEdit={()=>setEditMode(false)} openImagesChooserModal={openImagesChooserModal} />
);
}

PostCard.defaultProps={
    redirect:true
};

export default PostCard;