interface IIntegration {
  onTextMessage(cb: (text: string, sendMessage: (text: string) => Promise<boolean>) => void): void
  // sendTextMessage?(text: string, context?: any): Promise<boolean>
}