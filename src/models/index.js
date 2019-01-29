import { createStore } from 'redux'
import reducers from './reducers'
export { default as NoteModel } from './Note'
export { default as PostModel } from './Post'
export { default as UserModel } from './User'
export { default as Key} from './Key'
export { default as APIClient} from './APIClient' 

export const Store = createStore(reducers)