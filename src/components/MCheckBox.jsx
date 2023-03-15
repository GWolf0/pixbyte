
function MCheckBox({value,onChange}){
return(
<span className="mCheckBox">
    <input type="checkbox" checked={value} onChange={onChange} />
    <span className="mCheckBoxSlider bg-lightest"></span>
</span>
)
}

export default MCheckBox;