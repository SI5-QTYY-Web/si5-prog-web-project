import FilterCheckBox from './CheckBox'

export default function CheckBoxList({elementList, onCheckBoxChange}:{elementList:string[],onCheckBoxChange:(value:string,checked:boolean)=>any}) {
  return (
    <ul>
        {elementList.map((elt)=><FilterCheckBox key={elt} value={elt} onCheckBoxClick={onCheckBoxChange}/>)}
    </ul>
  )
}

