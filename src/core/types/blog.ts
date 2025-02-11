export interface BlogPost {
  title: string
  category: string
  author: string
  imageUrl: string
  content: string
}

export type BlogPosts = {
  [key: string]: BlogPost
}
