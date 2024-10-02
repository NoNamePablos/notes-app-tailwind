import {type Notes} from './models/Note'

declare global {
  interface Window {
    context:{
      locale:string,
      getNotes:Notes.GetNotes
    }
  }
}