declare type ListMeta = {
  total: number;
  results: number;
};

declare type ErrorResponse = {
  status: "fail" | "error";
  message: string;
};

declare type ApiSuccessStatus = "success";
