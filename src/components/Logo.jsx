import { useContext } from "react";
import { Link } from "react-router-dom";
import { globalContext } from "../contexts/globalContext";

function Logo({noLink}){
const globalx=useContext(globalContext);

function build(){
    return(!globalx.isMobile?
        <div id="logo" className="px-2 font-semibold text-2xl tracking-wider drop-shadow-md select-none">
            <span className="text-primary">PIX<span className="text-secondary text-2xl">Byte</span></span>
        </div>:
        <div id="logo" className="px-2 font-semibold text-2xl tracking-wider drop-shadow-md select-none">
            <span className="text-primary">PI<span className="text-secondary text-2xl">X</span></span>
        </div>
    );
}

return(!noLink?
<Link to={'/'}>
    {build()}
</Link>:
<>
    {build()}
</>
);

}

Logo.defaultProps={
    noLink:false
};

export default Logo;

    