/**
 * シグナリング(WebRTC接続確立のための情報交換)で使う
 * Socket.IO イベントとペイロードの型定義。
 * フロントエンド・バックエンドの両方から参照される。
 *
 * ルーム参加の成否は Socket.IO の acknowledgement(応答コールバック)で返す。
 * https://socket.io/docs/v4/typescript/
 */

/** 1ルームの最大参加人数(1対1通話のため2人) */
export const ROOM_MAX_PARTICIPANTS = 2;

/**
 * offer / answer のセッション記述。
 * ブラウザの RTCSessionDescriptionInit と構造互換(バックエンドにはDOMの型がないため自前定義)
 */
export interface SessionDescription {
  type: 'offer' | 'answer';
  sdp: string;
}

/**
 * ICE candidate(通信経路の候補)。
 * ブラウザの RTCIceCandidateInit と構造互換
 */
export interface IceCandidate {
  candidate: string;
  sdpMid: string | null;
  sdpMLineIndex: number | null;
  usernameFragment?: string | null;
}

/** ルーム参加・退出のリクエスト */
export interface RoomPayload {
  roomId: string;
}

/** ルーム参加失敗の理由コード(種類が増えたらここに追加する) */
export type RoomJoinError = 'room-full';

/**
 * ルーム参加リクエストへの応答(acknowledgement)。
 * 成功時の peerIds が空でなければ、自分が offer を送る側になる
 */
export type JoinRoomResult =
  | { success: true; peerIds: string[] }
  | { success: false; error: RoomJoinError };

/** 他の参加者の入室・退出の通知 */
export interface PeerPayload {
  peerId: string;
}

/** offer / answer の送信(クライアント → サーバー) */
export interface SendSessionDescriptionPayload {
  roomId: string;
  description: SessionDescription;
}

/** ICE candidate の送信(クライアント → サーバー) */
export interface SendIceCandidatePayload {
  roomId: string;
  candidate: IceCandidate;
}

/** offer / answer の受信(サーバー → クライアント) */
export interface ReceiveSessionDescriptionPayload {
  from: string;
  description: SessionDescription;
}

/** ICE candidate の受信(サーバー → クライアント) */
export interface ReceiveIceCandidatePayload {
  from: string;
  candidate: IceCandidate;
}

/** クライアント → サーバーのイベント定義(Socket.IO の型付けに使用) */
export interface ClientToServerEvents {
  'room:join': (payload: RoomPayload, callback: (result: JoinRoomResult) => void) => void;
  'room:leave': (payload: RoomPayload) => void;
  'signal:offer': (payload: SendSessionDescriptionPayload) => void;
  'signal:answer': (payload: SendSessionDescriptionPayload) => void;
  'signal:ice-candidate': (payload: SendIceCandidatePayload) => void;
}

/** サーバー → クライアントのイベント定義(Socket.IO の型付けに使用) */
export interface ServerToClientEvents {
  'peer:joined': (payload: PeerPayload) => void;
  'peer:left': (payload: PeerPayload) => void;
  'signal:offer': (payload: ReceiveSessionDescriptionPayload) => void;
  'signal:answer': (payload: ReceiveSessionDescriptionPayload) => void;
  'signal:ice-candidate': (payload: ReceiveIceCandidatePayload) => void;
}
