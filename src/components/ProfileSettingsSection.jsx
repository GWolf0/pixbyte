import { useEffect, useRef } from "react";
import AppService from "../services/appService";
import Helper from "../services/helper";
import ProfilePic from "./ProfilePic";


function ProfileSettingsSection({loggedUser}){
//refs
const usernameInputRef=useRef();
//effects
useEffect(()=>{
    usernameInputRef.current.value=loggedUser.name;
},[]);
//methods
function onChangeUsername(){
    const newUsername=usernameInputRef.current.value;
    const re=new RegExp("^[a-zA-Z0-9]{3,32}$","gi");
    if(!re.test(newUsername)){
        return alert(`Username can only have letters and numbers (no spaces or special characters)!`);
    }
    if(AppService.userNameExists(newUsername)){
        return alert(`This username '${newUsername}' already exists!`);
    }
    AppService.updateUsername(loggedUser.id,newUsername);
    window.location.href=`./#/profile/${newUsername}`;
}


return(
<section id="settingsSection" className="py-4 bg-inherit rounded mt-6">
    <div className="py-2 flex mb-4 items-center">
        <p className="text-lg text-semibold text-dark dark:text-lighter">Settings</p>
    </div>
    <div className="py-0">
        <section id="settingsAccountDetails" className="bg-light dark:bg-darker py-2 md:py-4 rounded">
            <div className="border-b border-semitrans dark:border-dark px-2 md:px-4 pb-2 mb-4">
                <p className="text-sm text-dark dark:text-light">Account Details</p>
            </div>
            <div className="px-2 md:px-4 mb-4 py-2 flex items-center">
                <ProfilePic imgUrl={loggedUser.profileImg} username={loggedUser.name} />
                <button className="rounded py-1 px-4 bg-inherit text-dark dark:text-light border border-semitrans dark:border-dark text-sm hover:opacity-70 ml-4">Change</button>
            </div>
            <div className="px-2 md:px-4 mb-4">
                <div className="flex rounded overflow-hidden border border-semitrans dark:border-dark">
                    <input ref={usernameInputRef} className="p-2 grow basis-0 bg-lightest dark:bg-darkest text-sm text-dark dark:text-light outline-none" placeholder="username" type="text" />
                    <button onClick={onChangeUsername} className="px-4 text-primary hover:opacity-70">Change</button>
                </div>
            </div>
            <div className="px-2 md:px-4 mb-4">
                <table className="w-full md:w-fit">
                    <tbody>
                        <tr className="border-b border-semitrans dark:border-dark">
                            <td className="p-2"><p className="text-sm text-primary">Email </p></td>
                            <td className="p-2"><p className="text-sm text-dark dark:text-light">{loggedUser.email}</p></td>
                        </tr>
                        <tr className="border-b border-semitrans dark:border-dark">
                            <td className="p-2"><p className="text-sm text-primary">Member Since </p></td>
                            <td className="p-2"><p className="text-sm text-dark dark:text-light">{Helper.diffForHumans(Date.parse(loggedUser.createdAt))}</p></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="px-2 md:px-4 mt-4">
                <button className="px-4 py-2 rounded bg-dark text-lighter text-sm hover:text-accent">Change Password</button>
            </div>
        </section>
    </div>
</section>
);
}

export default ProfileSettingsSection;