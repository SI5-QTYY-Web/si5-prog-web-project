import React from 'react'
import FilterCheckBox from './FilterCheckBox'

export default function FilterBar({onCheckBoxClick}:
    {onCheckBoxClick: (type:string, value:string,checked:boolean)=>void}) {
  return (
    <div>
        <h1>Filtre</h1>
        <div>
            <h2>Essences</h2>
            <ul>
                <FilterCheckBox type='gas' value='Gazole' onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='gas' value='SP95' onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='gas' value='E85' onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='gas' value='GPLc' onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='gas' value='E10' onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='gas' value='SP98' onCheckBoxClick={onCheckBoxClick}/>
            </ul>
        </div>
        <div>
            <h3>Essences</h3>
            <ul>
                <FilterCheckBox type='services' value="Aire de camping-cars" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Bar" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Bornes électriques" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Boutique alimentaire" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Boutique non alimentaire" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Carburant additivé" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="DAB (Distributeur automatique de billets)" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Douches" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Espace bébé" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="GNV" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Lavage automatique" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Lavage manuel" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Laverie" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Location de véhicule" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Piste poids lourds" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Relais colis" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Restauration à emporter" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Restauration sur place" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Services réparation / entretien" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Station de gonflage" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Toilettes publiques" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Vente d'additifs carburants" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Vente de fioul domestique" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Restauration sur place" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Vente de gaz domestique (Butane, Propane)" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Vente de pétrole lampant" onCheckBoxClick={onCheckBoxClick}/>
                <FilterCheckBox type='services' value="Wifi" onCheckBoxClick={onCheckBoxClick}/>
            </ul>
        </div>
    </div>
    
  )
}
