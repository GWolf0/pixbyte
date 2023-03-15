import { Link } from "react-router-dom";


function ProfilePic({imgUrl,username,size,redirectUrl}){

function render(){
    return imgUrl!=null?
    (<div className="rounded-full overflow-hidden bg-dark bg-contain" style={{width:`${size}px`,height:`${size}px`,backgroundImage:`url(${imgUrl})`}}></div>)
    :(<div className="object-cover text-lg font-bold bg-light dark:bg-darker text-primary rounded-full flex items-center justify-center border border-semitrans" style={{width:`${size}px`,height:`${size}px`}}>{username.charAt(0).toUpperCase()}</div>);
}

return redirectUrl!=null?(
    <Link to={redirectUrl} replace={true}>{render()}</Link>
):
<>
{render()}
</>
}

ProfilePic.defaultProps={
    size:32
};

export default ProfilePic;