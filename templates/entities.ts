export interface baseTableReq {
  [key: string]: any;
  pageSize?: number | undefined;
  current?: number | undefined;
  total?: number;
  pageNum?: number;
  pages?: number;
  requestTime?: number;
}

export interface getListResp {
  code: number;
  message: string;
  data: RootObject[];
}

export {{listTs}}