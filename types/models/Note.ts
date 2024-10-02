export namespace Notes {
  export type Content = string

  export type Info = {
    id: string
    title: string
    content?: Content
    lastEditTime: number
  }

  export type GetNotes = () => Promise<Info[]>
}
