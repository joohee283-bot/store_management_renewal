const STORES = [
    {
        id: 1,
        name: "신 홈플러스 전주완산점",
        address: "전라북도 전주시 기린대로 170 LG베스트샵 전주완산점",
        info: "34PY | 전체",
        tel: "063-263-2080",
        zones: ["주출입문", "주차장", "구독케어존", "집한채", "M&B", "냉장고", "세탁기", "TV"],
        distribution: "혼매",
        channel: "홈플러스",
        mainImage: "images_store_thumb/신 홈플러스 전주완산점.jpg",
        images: [
            { id: 101, url: "images_store_zone/2.jpg", zone: "구독케어존", tag: "전경1" },
            { id: 102, url: "images_store_집한채/그림2.jpg", zone: "집한채", tag: "공간1" },
            { id: 103, url: "images_store_M&B/그림8.jpg", zone: "M&B", tag: "공간2" },
            { id: 104, url: "images_store_zone/5.jpg", zone: "냉장고", tag: "냉장고1" },
            { id: 105, url: "images_store_zone/7.jpg", zone: "TV", tag: "TV1" },
            { id: 106, url: "images_store_zone/8.jpg", zone: "세탁기", tag: "세탁기1" },
            { id: 107, url: "images_store_zone/10.jpg", zone: "세탁기", tag: "세탁기2" },
            { id: 108, url: "images_store_zone/2.jpg", zone: "주출입문", tag: "입구1" },
            { id: 109, url: "images_store_zone/4 (2).jpg", zone: "주차장", tag: "주차장1" },
        ],
        managers: {
            "HSAD": { name: "서지현", email: "jseo12@hsad.co.kr", tel: "010-2036-7605" },
            "마케터/지점장": { name: "김철수", email: "kim@lge.com", tel: "010-1234-5678" },
            "도급사": { name: "전완산", email: "wansan@contractor.co.kr", tel: "010-5555-6666" }
        },
        inspection: { date: "2025-08-04", status: "점검완료", grade: "성수기" }
    },
    {
        id: 2,
        name: "신 홈플러스 전북전주점",
        address: "전라북도 전주시 백제대로 777 홈플러스",
        info: "30PY | 전체",
        tel: "063-270-8000",
        zones: ["주출입문", "구독케어존", "냉장고", "PC", "모니터"],
        distribution: "혼매",
        channel: "홈플러스",
        mainImage: "images_store_thumb/신 홈플러스 전북전주점.jpg",
        images: [
            { id: 201, url: "images_store_zone/12.jpg", zone: "구독케어존", tag: "전경1" },
            { id: 202, url: "images_store_zone/13.jpg", zone: "구독케어존", tag: "전경2" },
            { id: 203, url: "images_store_zone/14.jpg", zone: "냉장고", tag: "냉장고1" },
            { id: 204, url: "images_store_zone/16.jpg", zone: "PC", tag: "PC1" },
            { id: 205, url: "images_store_zone/17.jpg", zone: "주출입문", tag: "입구1" },
        ],
        managers: {
            "HSAD": { name: "정지운", email: "jw@hsad.co.kr", tel: "010-1111-2222" },
            "마케터/지점장": { name: "최정호", email: "jh@lge.com", tel: "010-3333-4444" },
            "도급사": { name: "박전주", email: "jj@contractor.co.kr", tel: "010-7777-8888" }
        },
        inspection: { date: "2025-08-10", status: "점검대기", grade: "비수기" }
    },
    {
        id: 3,
        name: "신 홈플러스 순천풍덕점",
        address: "전남 순천시 팔마로 222 홈플러스",
        info: "25PY | 전체",
        tel: "061-740-8000",
        zones: ["집한채", "M&B", "TV", "RAC", "에어케어"],
        distribution: "혼매",
        channel: "홈플러스",
        mainImage: "images_store_thumb/신 홈플러스 순천풍덕점.jpg",
        images: [
            { id: 301, url: "images_store_집한채/그림3.jpg", zone: "집한채", tag: "공간1" },
            { id: 302, url: "images_store_집한채/그림4.jpg", zone: "집한채", tag: "공간2" },
            { id: 303, url: "images_store_M&B/그림9.jpg", zone: "M&B", tag: "비즈니스1" },
            { id: 304, url: "images_store_zone/17.jpg", zone: "TV", tag: "TV1" },
            { id: 305, url: "images_store_zone/18.jpg", zone: "RAC", tag: "RAC1" },
        ],
        managers: {
            "HSAD": { name: "김태희", email: "th@hsad.co.kr", tel: "010-9999-0000" },
            "마케터/지점장": { name: "이민정", email: "mj@lge.com", tel: "010-3333-2222" },
            "도급사": { name: "오순천", email: "sc@contractor.co.kr", tel: "010-4444-5555" }
        },
        inspection: { date: "2025-08-12", status: "점검완료", grade: "성수기" }
    },
    {
        id: 4,
        name: "신 홈플러스 순천점",
        address: "전남 순천시 중앙로 10 홈플러스",
        info: "28PY | 전체",
        tel: "061-720-8000",
        zones: ["구독케어존", "M&B", "세탁기", "청소기", "워터케어"],
        distribution: "혼매",
        channel: "홈플러스",
        mainImage: "images_store_thumb/신 홈플러스 순천점.jpg",
        images: [
            { id: 401, url: "images_store_zone/17.jpg", zone: "구독케어존", tag: "케어1" },
            { id: 402, url: "images_store_M&B/그림9.jpg", zone: "M&B", tag: "비즈1" },
            { id: 403, url: "images_store_zone/18.jpg", zone: "세탁기", tag: "세탁기1" },
            { id: 404, url: "images_store_zone/20.jpg", zone: "청소기", tag: "청소기1" },
        ],
        managers: {
            "HSAD": { name: "박지성", email: "js@hsad.co.kr", tel: "010-7777-7777" },
            "마케터/지점장": { name: "손흥민", email: "hm@lge.com", tel: "010-1010-1010" },
            "도급사": { name: "이순천", email: "sc2@contractor.co.kr", tel: "010-2020-2020" }
        },
        inspection: { date: "2025-08-15", status: "점검진행", grade: "성수기" }
    },
    {
        id: 5,
        name: "하이마트 효자점",
        address: "전북 전주시 완산구 백제대로 100 LG베스트샵",
        info: "45PY | 전체",
        tel: "063-228-0001",
        zones: ["집한채", "냉장고", "AV", "쿠킹"],
        distribution: "혼매",
        channel: "하이마트",
        mainImage: "images_store_thumb/하이마트 효자점.jpg",
        images: [
            { id: 501, url: "images_store_집한채/그림5.jpg", zone: "집한채", tag: "공간1" },
            { id: 502, url: "images_store_집한채/그림6.jpg", zone: "집한채", tag: "공간2" },
            { id: 503, url: "images_store_zone/20.jpg", zone: "냉장고", tag: "냉장고1" },
            { id: 504, url: "images_store_zone/5.jpg", zone: "AV", tag: "AV1" },
        ],
        managers: {
            "HSAD": { name: "유재석", email: "jsu@hsad.co.kr", tel: "010-1234-1234" },
            "마케터/지점장": { name: "강호동", email: "hd@lge.com", tel: "010-5678-5678" },
            "도급사": { name: "노홍철", email: "hc@contractor.co.kr", tel: "010-0909-0909" }
        },
        inspection: { date: "2025-08-18", status: "점검완료", grade: "비수기" }
    },
    {
        id: 6,
        name: "하이마트 아중점",
        address: "전주 덕진구 아중로 123 LG베스트샵",
        info: "32PY | 전체",
        tel: "063-241-1111",
        zones: ["구독케어존", "M&B", "세탁기", "CAC", "육성제품"],
        distribution: "전매",
        channel: "전문점",
        mainImage: "images_store_thumb/77634904-c1a9-418f-8898-58c5de2aa19f.jpg",
        images: [
            { id: 601, url: "images_store_zone/4 (2).jpg", zone: "구독케어존", tag: "케어1" },
            { id: 602, url: "images_store_M&B/그림8.jpg", zone: "M&B", tag: "비즈1" },
            { id: 603, url: "images_store_zone/4 (3).jpg", zone: "세탁기", tag: "세탁1" },
            { id: 604, url: "images_store_zone/6 (1).jpg", zone: "CAC", tag: "CAC1" },
        ],
        managers: {
            "HSAD": { name: "지석진", email: "sj@hsad.co.kr", tel: "010-8888-8888" },
            "마케터/지점장": { name: "이광수", email: "ks@lge.com", tel: "010-4444-4444" },
            "도급사": { name: "전소민", email: "sm@contractor.co.kr", tel: "010-3333-3333" }
        },
        inspection: { date: "2025-08-20", status: "점검완료", grade: "성수기" }
    },
    {
        id: 7,
        name: "하이마트 평화점",
        address: "전주 완산구 평화로 456 LG베스트샵",
        info: "28PY | 전체",
        tel: "063-222-3333",
        zones: ["M&B", "TV", "PC", "모니터", "AV"],
        distribution: "전매",
        channel: "백화점",
        mainImage: "images_store_thumb/878b85d9-e6ac-4a68-a516-2cb24b47bc80.jpg",
        images: [
            { id: 701, url: "images_store_M&B/그림9.jpg", zone: "M&B", tag: "전경1" },
            { id: 702, url: "images_store_M&B/그림8.jpg", zone: "M&B", tag: "전경2" },
            { id: 703, url: "images_store_zone/4 (4).jpg", zone: "TV", tag: "TV1" },
            { id: 704, url: "images_store_zone/9 (2).jpg", zone: "PC", tag: "PC1" },
        ],
        managers: {
            "HSAD": { name: "하하", email: "haha@hsad.co.kr", tel: "010-1111-1111" },
            "마케터/지점장": { name: "송지효", email: "jh2@lge.com", tel: "010-2222-2222" },
            "도급사": { name: "김종민", email: "jm@contractor.co.kr", tel: "010-3333-6666" }
        },
        inspection: { date: "2025-08-22", status: "점검대기", grade: "비수기" }
    },
    {
        id: 8,
        name: "하이마트 삼천점",
        address: "전주 완산구 거마대로 789 LG베스트샵",
        info: "35PY | 전체",
        tel: "063-231-1234",
        zones: ["구독케어존", "집한채", "냉장고", "세탁기", "워터케어"],
        distribution: "B2B",
        channel: "B2B",
        mainImage: "images_store_thumb/eb975284-1904-4cd4-b612-bcb307f9f464.jpg",
        images: [
            { id: 801, url: "images_store_zone/4 (5).jpg", zone: "구독케어존", tag: "케어1" },
            { id: 802, url: "images_store_집한채/그림7.jpg", zone: "집한채", tag: "공간1" },
            { id: 803, url: "images_store_zone/4 (6).jpg", zone: "냉장고", tag: "냉장고1" },
            { id: 804, url: "images_store_zone/10.jpg", zone: "세탁기", tag: "세탁기1" },
        ],
        managers: {
            "HSAD": { name: "김종국", email: "jk@hsad.co.kr", tel: "010-5555-5555" },
            "마케터/지점장": { name: "양세찬", email: "sc3@lge.com", tel: "010-6666-6666" },
            "도급사": { name: "이지혜", email: "jh3@contractor.co.kr", tel: "010-7777-9999" }
        },
        inspection: { date: "2025-08-25", status: "점검완료", grade: "성수기" }
    },
    {
        id: 9,
        name: "이마트 광주수완점",
        address: "광주광역시 광산구 수완로 52 이마트",
        info: "40PY | 전체",
        tel: "062-958-1234",
        zones: ["TV", "RAC", "냉장고", "세탁기", "PC", "모니터"],
        distribution: "혼매",
        channel: "이마트",
        mainImage: "images_store_thumb/77634904-c1a9-418f-8898-58c5de2aa19f.jpg",
        images: [
            { id: 901, url: "images_store_zone/2.jpg", zone: "TV", tag: "TV전경" },
            { id: 902, url: "images_store_zone/5.jpg", zone: "냉장고", tag: "냉장고1" },
            { id: 903, url: "images_store_zone/7.jpg", zone: "세탁기", tag: "세탁기1" },
            { id: 904, url: "images_store_zone/9 (2).jpg", zone: "PC", tag: "PC1" },
            { id: 905, url: "images_store_zone/9 (3).jpg", zone: "RAC", tag: "RAC1" },
        ],
        managers: {
            "HSAD": { name: "이수현", email: "sh@hsad.co.kr", tel: "010-1357-2468" },
            "마케터/지점장": { name: "박수진", email: "sj2@lge.com", tel: "010-2468-1357" },
            "도급사": { name: "강광주", email: "gj@contractor.co.kr", tel: "010-1122-3344" }
        },
        inspection: { date: "2025-09-01", status: "점검완료", grade: "성수기" }
    },
    {
        id: 10,
        name: "전자랜드 전주점",
        address: "전북 전주시 덕진구 팔달로 15 전자랜드",
        info: "38PY | 전체",
        tel: "063-252-8877",
        zones: ["TV", "AV", "모니터", "PC", "쿠킹", "청소기"],
        distribution: "혼매",
        channel: "전자랜드",
        mainImage: "images_store_thumb/878b85d9-e6ac-4a68-a516-2cb24b47bc80.jpg",
        images: [
            { id: 1001, url: "images_store_zone/12.jpg", zone: "TV", tag: "TV1" },
            { id: 1002, url: "images_store_zone/13.jpg", zone: "AV", tag: "AV1" },
            { id: 1003, url: "images_store_zone/14.jpg", zone: "모니터", tag: "모니터1" },
            { id: 1004, url: "images_store_zone/20.jpg", zone: "청소기", tag: "청소기1" },
        ],
        managers: {
            "HSAD": { name: "오민준", email: "mj2@hsad.co.kr", tel: "010-3344-5566" },
            "마케터/지점장": { name: "임지현", email: "jh4@lge.com", tel: "010-5566-7788" },
            "도급사": { name: "차전주", email: "cj@contractor.co.kr", tel: "010-7788-1122" }
        },
        inspection: { date: "2025-09-05", status: "점검대기", grade: "비수기" }
    },
    {
        id: 11,
        name: "LG베스트샵 여수점",
        address: "전남 여수시 충민로 150 LG베스트샵",
        info: "42PY | 전체",
        tel: "061-682-5500",
        zones: ["집한채", "웨딩존", "키즈존", "냉장고", "세탁기", "에어케어"],
        distribution: "전매",
        channel: "전문점",
        mainImage: "images_store_thumb/eb975284-1904-4cd4-b612-bcb307f9f464.jpg",
        images: [
            { id: 1101, url: "images_store_집한채/그림2.jpg", zone: "집한채", tag: "공간1" },
            { id: 1102, url: "images_store_집한채/그림3.jpg", zone: "웨딩존", tag: "웨딩1" },
            { id: 1103, url: "images_store_zone/6 (1).jpg", zone: "냉장고", tag: "냉장고1" },
            { id: 1104, url: "images_store_zone/6 (2).jpg", zone: "세탁기", tag: "세탁기1" },
            { id: 1105, url: "images_store_zone/9 (4).jpg", zone: "에어케어", tag: "에어1" },
        ],
        managers: {
            "HSAD": { name: "윤미래", email: "mr@hsad.co.kr", tel: "010-9988-7766" },
            "마케터/지점장": { name: "정해인", email: "hi@lge.com", tel: "010-6655-4433" },
            "도급사": { name: "권여수", email: "ys@contractor.co.kr", tel: "010-5544-3322" }
        },
        inspection: { date: "2025-09-08", status: "점검완료", grade: "성수기" }
    },
    {
        id: 12,
        name: "하이마트 나주점",
        address: "전남 나주시 빛가람로 435 하이마트",
        info: "30PY | 전체",
        tel: "061-334-7700",
        zones: ["주출입문", "RAC", "CAC", "TV", "쿠킹"],
        distribution: "혼매",
        channel: "하이마트",
        mainImage: "images_store_thumb/하이마트 효자점.jpg",
        images: [
            { id: 1201, url: "images_store_zone/4 (7).jpg", zone: "주출입문", tag: "입구1" },
            { id: 1202, url: "images_store_zone/8.jpg", zone: "RAC", tag: "RAC1" },
            { id: 1203, url: "images_store_zone/16.jpg", zone: "CAC", tag: "CAC1" },
            { id: 1204, url: "images_store_zone/17.jpg", zone: "TV", tag: "TV1" },
        ],
        managers: {
            "HSAD": { name: "배성우", email: "sw@hsad.co.kr", tel: "010-2233-4455" },
            "마케터/지점장": { name: "고아라", email: "ar@lge.com", tel: "010-4455-6677" },
            "도급사": { name: "황나주", email: "nj@contractor.co.kr", tel: "010-6677-8899" }
        },
        inspection: { date: "2025-09-10", status: "점검진행", grade: "성수기" }
    }
];

window.STORES = STORES;
