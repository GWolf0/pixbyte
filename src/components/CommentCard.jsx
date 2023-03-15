import AppService from "../services/appService";
import Helper from "../services/helper";
import ProfilePic from "./ProfilePic";


function CommentCard({comment,onCommentRemoved}){
const loggedUser=AppService.isLogged();
const mine=loggedUser!=null?comment.user_id===loggedUser.id:false;
const [user,post]=AppService.getCommentDetails(comment.id);
if(user===null)return (<p className="text-sm text-red-500 py-2">Error on comment!</p>);
//methods
function onRemoveComment(){
    if(confirm('Confirm remove comment?')){
        AppService.removeComment(comment.id);
        onCommentRemoved(comment.id);
    }
}

return(
<li className="rounded overflow-hidden bg-light dark:bg-darker px-4 py-2 mb-2">
    <div className="flex items-center py-2">
        <ProfilePic imgUrl={user.profileImg} username={user.name} redirectUrl={`/profile/${user.name}`} />
        <div className="ml-4">
            <p className="text-dark dark:text-lighter text-sm font-bold">{user.name}</p>
            <p className="text-dark dark:text-light text-xs">{Helper.diffForHumans(Date.parse(comment.createdAt))}</p>
        </div>
        {mine&&
        <button onClick={onRemoveComment} className="ml-auto text-dark dark:text-light p-2 hover:opacity-70"><i className="bi-archive"></i></button>
        }
    </div>
    <div className="my-1">
        <p className="text-dark dark:text-light text-sm">{comment.text}</p>
    </div>
</li>
);
}

export default CommentCard;