export type NetworkSwitchState =
  | 'idle'
  | 'confirming'
  | 'switching'
  | 'success'
  | 'failed'
  | 'chain-not-found'

export interface NetworkSwitchError {
  code?: number;
  message: string;
}
