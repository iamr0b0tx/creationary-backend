export interface commentInput {
  post: string;
  author: string;
  content: string;
}

export interface commentResponse {
  success: boolean;
  message: string;
  data?: any;
}