import { IPost } from "../models/Post";

export class postValidations {
  static validatePostInput(postData: IPost): string | null {
    if (!postData.title || postData.title.trim() === "") {
      return "Title is required";
    }

    if (postData.title.length < 5) {
      return "Title must be at least 5 characters long";
    }

    if (!postData.content || postData.content.trim() === "") {
      return "Content is required";
    }

    if (postData.content.length < 20) {
      return "Content must be at least 20 characters long";
    }
    if (!postData.author) {
      return "Author is required";
    }

    return null;
  }
}