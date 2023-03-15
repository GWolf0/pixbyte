import MediaCard from "./MediaCard";


function ProfileMediaSection({loggedUser,user,mine}){


return(
<section id="mediaSection" className="py-4 bg-inherit rounded mt-6">
    <div className="py-2 flex mb-4 items-center">
        <p className="text-lg text-semibold text-dark dark:text-lighter">Media</p>
        <span className="w-fit h-fit text-xs text-semibold text-darkest px-2.5 py-0.5 rounded-full bg-primary ml-2">0</span>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {
            Array(8).fill(0).map((e,i)=>(
                <MediaCard key={i} />
            ))
        }
    </div>
</section>
);
}

export default ProfileMediaSection;