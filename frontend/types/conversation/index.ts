export type CreateMemberMessageArgumentTypes = {
  conversationId: string;
  text: string;
};

export type CreateCreatorMessageArgumentTypes = {
  conversationId: string;
  text?: string;
  productId?: string;
  nudeId?: string;
};
