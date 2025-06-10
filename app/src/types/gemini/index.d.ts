// 💡 서버에서 보내는 aiResponse 데이터의 타입을 정의합니다.
export interface AiResponseData {
  message: string;
  retrievedProductIds: string[];
  relevantProductId: string;
}

// 💡 메시지 타입 정의: 텍스트 메시지와 함께 상품 ID 목록을 저장할 수 있도록 합니다.
export interface ChatMessage {
  type: "text" | "aiResponse"; // 메시지 타입 구분
  content: string; // 표시될 텍스트 내용
  productIds?: string[]; // AI 응답일 경우 관련 상품 ID 목록
  relevantProductId?: string; // AI 응답일 경우 최고 좋아요 상품 ID
}
