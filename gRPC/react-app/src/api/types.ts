export interface BlogApi {
  id: string;
  name: string;
  createAt: Date;
  posts: PostApi[];
}

export interface PostApi {
  id: string;
  name: string;
  createAt: Date;
  tags: string[];
}
