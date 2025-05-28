import { Injectable } from "@nestjs/common"
import { CreateCommentDto } from "./dto/create-comment.dto"
import { UpdateCommentDto } from "./dto/update-comment.dto"

@Injectable()
export class CommentsService {
  create(_createCommentDto: CreateCommentDto) {
    return "This action adds a new comment"
  }

  findAll() {
    return `This action returns all comments`
  }

  findOne(_id: number) {
    return `This action returns a #${_id} comment`
  }

  update(_id: number, _updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${_id} comment`
  }

  remove(_id: number) {
    return `This action removes a #${_id} comment`
  }
}
