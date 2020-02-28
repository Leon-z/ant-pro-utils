import { TSNotNeed } from '@/constants/index'

export interface searchParams {
  [key: string]: TSNotNeed;
  pageSize?: string | undefined;
  pageNum?: string | undefined;
}
