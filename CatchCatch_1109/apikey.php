<?php
// 1. 발급받은 API 키 세팅
$apiKey = '여기에_발급받은_API_KEY_입력';
// 2. 요청할 API 주소 (Gemini-1.5-flash 모델 사용)
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

// 3. 크롤링해 온 핫딜 제목을 AI에게 전달할 '주문서(JSON)' 작성
$crawledTitle = "[역대급] 햇반 210g 36개입 19,800원 무배!";
$prompt = "이 핫딜 제목에서 '상품명'과 '가격'만 추출해서 쉼표로 구분해 알려줘: " . $crawledTitle;

$data = [
    "contents" => [
        [
            "parts" => [
                ["text" => $prompt]
            ]
        ]
    ]
];

// 4. cURL을 이용해 구글 서버에 요청(Request) 보내기
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

// 5. 구글 서버의 응답(Response) 받기
$response = curl_exec($ch);
curl_close($ch);

// 6. JSON 응답 결과 디코딩 및 활용
$result = json_decode($response, true);
echo $result['candidates'][0]['content']['parts'][0]['text'];
// 예상 출력 결과: 햇반 210g 36개입, 19800원
?>