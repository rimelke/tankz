import {
  IAction,
  IContinuosAction,
  ISingleAction
} from '@tankz/game/factories/createTank'
import { IEvent, IObserver } from '@tankz/game/types'

const continuosKeys: Record<string, IContinuosAction> = {
  ArrowUp: 'MoveForward',
  ArrowDown: 'MoveBackward',
  ArrowLeft: 'TurnLeft',
  ArrowRight: 'TurnRight',
  w: 'MoveForward',
  s: 'MoveBackward',
  a: 'TurnLeft',
  d: 'TurnRight'
}

const singleKeys: Record<string, ISingleAction> = {
  Space: 'Fire'
}

const makeKeyboardListener = () => {
  const observers: IObserver[] = []
  const runnings: Set<IAction> = new Set([])

  const subscribe = (observer: IObserver) => {
    observers.push(observer)
  }

  const unsubscribe = (observer: IObserver) => {
    observers.splice(observers.indexOf(observer), 1)
  }

  const notifyAll = (event: IEvent) => {
    observers.forEach((observer) => observer(event))
  }

  document.onkeydown = (e) => {
    if (continuosKeys[e.key]) runnings.add(continuosKeys[e.key])
  }

  document.onkeyup = (e) => {
    if (continuosKeys[e.key]) runnings.delete(continuosKeys[e.key])

    if (singleKeys[e.code])
      notifyAll({ type: 'action', payload: singleKeys[e.code] })
  }

  const interval = setInterval(() => {
    runnings.forEach((action) => notifyAll({ type: 'action', payload: action }))
  }, 10)

  const destroy = () => {
    clearInterval(interval)
    document.onkeydown = null
    document.onkeyup = null
    observers.forEach(unsubscribe)
  }

  return {
    subscribe,
    unsubscribe,
    destroy
  }
}

export default makeKeyboardListener
