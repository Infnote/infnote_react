import { createStore } from 'redux'
import reducers from './reducers'
export { default as NoteModel } from './Note'
export { default as APIClient} from './APIClient' 

export const Store = createStore(reducers)