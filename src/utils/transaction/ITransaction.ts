/**
 * トランザクション
 */
export interface ITransaction {
  /** トランザクション ID */
  txid: string;
  /** トランザクションバージョン */
  ver: number;
  /** 送信者の公開鍵 */
  pubKey: string;
  /** データ */
  data: {
    fn: string;
    [index: string]: any;
  };
}
