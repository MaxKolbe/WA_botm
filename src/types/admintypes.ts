 export interface IQuery {
    user?: string;
    otpName?: string;
    queriedAt?: { $gte?: Date; $lte?: Date };
  }