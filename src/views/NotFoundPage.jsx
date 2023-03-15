import { Link } from "react-router-dom";

function NotFoundPage(){


return(
<div className="notfoundPage w-screen h-screen bg-lighter dark:bg-darkest flex flex-col items-center justify-center">
    <p className="text-dark dark:text-light text-3xl md:text-5xl text-center font-bold">Page Not Found</p>
    <Link to="/" className="rounded border border-primary p-2 mt-10"><p className="text-primary text-center text-lg p-2 hover:opacity-70"><i className="bi-house mr-4"></i> Home Page</p></Link>
</div>
);
}

export default NotFoundPage;