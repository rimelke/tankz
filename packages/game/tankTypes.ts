import tank1 from './tanks/tank1'

export type TankType = 'tank1'

export interface ITankFigure {
  x: number
  y: number
  width: number
  height: number
  color: string
}

const tankTypes: Record<TankType, ITankFigure[]> = {
  tank1
}

export default tankTypes
