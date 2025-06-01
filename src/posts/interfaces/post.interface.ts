import { Community } from "../enums/community.enum";
import { Comment } from "./comment.interface";
import { IUser } from "../../users/interface/user.interface";

export interface IPost {
  id: number;
  title: string;
  community: Community;
  content: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  user?: IUser;
  comments?: Comment[];
}
