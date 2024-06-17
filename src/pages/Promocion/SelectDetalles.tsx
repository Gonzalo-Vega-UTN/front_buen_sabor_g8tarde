import React from 'react'
import { Articulo } from '../../entities/DTO/Articulo/Articulo'
interface SelectProps{
    articulos : Articulo[]
}
export const SelectDetalles = ( {articulos} : SelectProps) => {
  return (
    <div>SelectDetalles</div>
  )
}
