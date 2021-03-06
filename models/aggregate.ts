import { BaseRespModel } from './base'
import { UserDto } from './user'
import { CategoryModel } from './category'

export namespace Top {
  export interface Note {
    _id: string
    title: string
    nid: number
  }

  export interface Post {
    _id: string
    title: string
    slug: string
    category: {
      name: string
      slug: string
    }
  }

  export interface Project {
    _id: string
    name: string
    avatar: string
  }
  export interface Say {
    _id: string
    source: string
    text: string
    author: string
    created: Date
    modified: Date
    id: string
  }
  export interface Aggregate {
    notes: Note[]
    posts: Post[]
    projects: Project[]
    says: Say[]
  }
}
export interface Seo {
  title: string
  description: string
  keywords: string[]
}

interface PageMeta {
  _id: string
  title: string
  slug: string
  order?: number
}

export namespace RandomImage {
  export interface Dimensions {
    height: number
    width: number
    type: string
  }

  export enum Locate {
    Local,
    Online,
  }
  export interface Image {
    _id: string
    name: string
    dimensions: Dimensions
    filename: string
    mime: string
    type: number
    locate?: Locate
    url?: string
  }
}

export interface AggregateResp extends BaseRespModel {
  user: UserDto
  seo: Seo
  categories: CategoryModel[]
  pageMeta: PageMeta[]
  lastestNoteNid: number
}
