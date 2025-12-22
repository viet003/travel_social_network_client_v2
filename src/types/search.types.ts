// Search-related type definitions
import type { UserResponse } from './user.types';
import type { GroupResponse } from './group.types';
import type { PostResponse } from './post.types';
import type { PageableResponse } from './common.types';

export interface SearchResult {
  users: PageableResponse<UserResponse>;
  groups: PageableResponse<GroupResponse>;
  posts: PageableResponse<PostResponse>;
}

export interface SearchSuggestionsResult {
  users: UserResponse[];
  groups: GroupResponse[];
  posts: PostResponse[];
}
