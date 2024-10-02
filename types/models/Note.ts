export namespace Notes {
  export type Content = string

  export type Info = {
    id: string
    title: string
    content?: Content
    lastEditTime: number
  }

  export type GetNotes = () => Promise<Info[]>
  export type ReadNote = (filename: Info['title']) => Promise<Content>
  export type WriteNote = (filename: Info['title'], content: Content) => Promise<void>
}
