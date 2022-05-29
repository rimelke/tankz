export interface ISimplePosition {
  x: number
  y: number
}

export interface IPosition extends ISimplePosition {
  direction: number
}

interface IMapObject {
  x: number
  y: number
  width: number
  height: number
}

export interface IMap {
  width: number
  height: number
  objects: IMapObject[]
}
