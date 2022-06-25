export interface VerificationToken {
  _id: string;
  _userId: string;
  code: string;
  expire_at: Date;
}
