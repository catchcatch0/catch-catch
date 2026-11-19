import { FormEvent, useMemo, useState } from "react";

type Product = {
  id: number;
  brand: string;
  name: string;
  price: number;
  original: number;
  image: string;
  tag: string;
  category: string;
  time: string;
  stock: number;
  marketplace: "coupang" | "temu" | "aliexpress";
};

const products: Product[] = [
  {
    id: 1,
    brand: "SONY",
    name: "WH-1000XM5 노이즈 캔슬링 헤드폰",
    price: 349000,
    original: 519000,
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=900&q=85",
    tag: "역대가",
    category: "디지털",
    time: "4분 전",
    stock: 12,
    marketplace: "coupang",
  },
  {
    id: 2,
    brand: "NIKE",
    name: "에어 포스 1 '07 화이트",
    price: 89900,
    original: 139000,
    image:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=85",
    tag: "36% 할인",
    category: "패션",
    time: "12분 전",
    stock: 7,
    marketplace: "temu",
  },
  {
    id: 3,
    brand: "BIALETTI",
    name: "모카 익스프레스 3컵 커피메이커",
    price: 37900,
    original: 62000,
    image:
      "https://images.unsplash.com/photo-1638129284529-bed6d6f588e7?auto=format&fit=crop&w=900&q=85",
    tag: "무료배송",
    category: "리빙",
    time: "18분 전",
    stock: 24,
    marketplace: "aliexpress",
  },
  {
    id: 4,
    brand: "BEATS",
    name: "Solo3 무선 온이어 헤드폰",
    price: 159000,
    original: 269000,
    image:
      "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=900&q=85",
    tag: "오늘만",
    category: "디지털",
    time: "31분 전",
    stock: 5,
    marketplace: "coupang",
  },
  {
    id: 5,
    brand: "NIKE",
    name: "에어맥스 데일리 스니커즈",
    price: 109000,
    original: 169000,
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=85",
    tag: "쿠폰특가",
    category: "패션",
    time: "42분 전",
    stock: 18,
    marketplace: "temu",
  },
  {
    id: 6,
    brand: "EARLYBIRD",
    name: "홈카페 드립 커피메이커",
    price: 68900,
    original: 99000,
    image:
      "https://images.unsplash.com/photo-1603889780734-c4fb812e65e6?auto=format&fit=crop&w=900&q=85",
    tag: "31% 할인",
    category: "리빙",
    time: "1시간 전",
    stock: 32,
    marketplace: "aliexpress",
  },
];

const categories = ["전체", "디지털", "패션", "뷰티", "리빙", "식품", "여행"];
const formatPrice = (price: number) => price.toLocaleString("ko-KR") + "원";
const marketplaceLabels: Record<Product["marketplace"], string> = {
  coupang: "쿠팡 상품",
  temu: "Temu 상품",
  aliexpress: "AliExpress 상품",
};
const marketplaceSearchUrls: Record<Product["marketplace"], string> = {
  coupang: "https://www.coupang.com/np/search?q=",
  temu: "https://www.temu.com/search_result.html?search_key=",
  aliexpress: "https://www.aliexpress.com/wholesale?SearchText=",
};

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.5-5 3-7 8-7s7.5 2 8 7" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    bag: <><path d="M6 8h12l1 13H5L6 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    check: <path d="m5 12 4 4L19 6" />,
    cart: <><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M3 4h2l2 11h11l2-7H6" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Header({
  onLogin,
  onLogout,
  onSearch,
  onNavigate,
  cartCount,
  isLoggedIn,
}: {
  onLogin: () => void;
  onLogout: () => void;
  onSearch: (term: string) => void;
  onNavigate: (view: string) => void;
  cartCount: number;
  isLoggedIn: boolean;
}) {
  const [term, setTerm] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(term);
  };
  return (
    <header className="header">
      <div className="utility">
        <div className="container utility-inner">
          <span>오늘 발견한 핫딜 <b>1,284개</b></span>
          {isLoggedIn ? (
            <div className="member-utility"><span><b>캐치 회원님</b>, 반가워요</span><i /><button onClick={() => onNavigate("mypage")}>마이페이지</button><i /><button onClick={onLogout}>로그아웃</button></div>
          ) : (
            <div><button onClick={onLogin}>로그인</button><i /><button onClick={onLogin}>회원가입</button><i /><button>고객센터</button></div>
          )}
        </div>
      </div>
      <div className="container header-main">
        <button className="logo" onClick={() => onNavigate("home")} aria-label="캐치캐치 홈">
          CATCH<span>CATCH</span><em>●</em>
        </button>
        <form className="search" onSubmit={submit}>
          <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="찾고 싶은 상품을 검색해보세요" aria-label="통합 검색" />
          <button aria-label="검색"><Icon name="search" size={22} /></button>
        </form>
        <div className="quick-menu">
          <button className={isLoggedIn ? "member-button" : ""} onClick={() => isLoggedIn ? onNavigate("mypage") : onLogin()}><Icon name="user" /><span>{isLoggedIn ? "내 정보" : "마이"}</span>{isLoggedIn && <em />}</button>
          <button><Icon name="heart" /><span>찜</span></button>
          <button className="cart-button" onClick={() => onNavigate("cart")}><Icon name="cart" /><span>CATCH</span>{cartCount > 0 && <b>{cartCount}</b>}</button>
        </div>
      </div>
      <nav className="gnb">
        <div className="container nav-inner">
          <button className="category-all"><span className="hamburger" />전체 카테고리</button>
          <button className="active" onClick={() => onNavigate("home")}>홈</button>
          <button onClick={() => onNavigate("products")}>실시간 핫딜</button>
          <button onClick={() => onNavigate("products")}>CATCH 특가</button>
          <button onClick={() => onNavigate("products")}>베스트</button>
          <button onClick={() => onNavigate("products")}>신상품</button>
          <button className="nav-event">이벤트</button>
        </div>
      </nav>
    </header>
  );
}

function ProductCard({ product, onClick, onCatch }: { product: Product; onClick: () => void; onCatch: () => void }) {
  const discount = Math.round((1 - product.price / product.original) * 100);
  const [liked, setLiked] = useState(false);
  return (
    <article className="product-card">
      <div className="product-image" onClick={onClick}>
        <img src={product.image} alt={product.name} />
        <span className="deal-tag">{product.tag}</span>
        <span className={`market-ribbon ${product.marketplace}`}>{marketplaceLabels[product.marketplace]}</span>
        <button className={`heart ${liked ? "liked" : ""}`} onClick={(e) => { e.stopPropagation(); setLiked(!liked); }} aria-label="찜하기">
          <Icon name="heart" size={19} />
        </button>
      </div>
      <button className="product-info" onClick={onClick}>
        <span className="brand">{product.brand}</span>
        <strong>{product.name}</strong>
        <div className="price"><b>{discount}%</b><em>{formatPrice(product.price)}</em></div>
        <del>{formatPrice(product.original)}</del>
      </button>
      <div className="product-foot">
        <span><i className="live-dot" />{product.time}</span>
        <button onClick={onCatch}><Icon name="bell" size={15} /> CATCH</button>
      </div>
    </article>
  );
}

function Home({ onNavigate, onSelect, onCatch }: { onNavigate: (v: string) => void; onSelect: (p: Product) => void; onCatch: (p: Product) => void }) {
  const [category, setCategory] = useState("전체");
  const visible = category === "전체" ? products.slice(0, 4) : products.filter((p) => p.category === category).slice(0, 4);
  return (
    <main>
      <section className="hero container">
        <div className="hero-copy">
          <span className="eyebrow">CATCH ONLY · 이번 주 단독 혜택</span>
          <h1>망설인 순간 품절.<br />최저가는 지금이에요</h1>
          <p>여러 쇼핑몰의 할인과 재고를 한눈에.<br />원하는 가격이 되면 가장 먼저 알려드릴게요.</p>
          <button className="primary" onClick={() => onNavigate("products")}>지금 핫딜 구경하기 <Icon name="arrow" /></button>
          <div className="hero-dots"><b /><span /><span /><em>01 / 03</em></div>
        </div>
        <div className="hero-visual">
          <div className="hero-circle" />
          <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1100&q=90" alt="이번 주 특가 무선 헤드폰" />
          <div className="floating-price"><small>오늘의 CATCH 가격</small><strong>349,000원</strong><span>32% OFF</span></div>
          <div className="floating-stock"><i className="live-dot" /><span><b>12개</b> 남았어요</span></div>
        </div>
      </section>

      <section className="container shortcut-section">
        {[
          ["디지털", "노트북·태블릿", "01"],
          ["패션", "요즘 인기 브랜드", "02"],
          ["리빙", "자취 필수템", "03"],
          ["식품", "오늘의 먹거리", "04"],
          ["여행", "주말엔 어디로?", "05"],
          ["전체보기", "모든 카테고리", "06"],
        ].map(([name, desc, num]) => (
          <button className="shortcut" key={name} onClick={() => onNavigate("products")}>
            <span>{num}</span><strong>{name}</strong><small>{desc}</small>
          </button>
        ))}
      </section>

      <section className="live-section">
        <div className="container">
          <div className="section-title">
            <div><span className="live-label"><i className="live-dot" /> LIVE</span><h2>지금 뜨는 실시간 핫딜</h2><p>가격과 재고 변화를 실시간으로 추적하고 있어요</p></div>
            <button onClick={() => onNavigate("products")}>전체보기 <Icon name="chevron" size={17} /></button>
          </div>
          <div className="category-tabs">
            {categories.slice(0, 6).map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <div className="product-grid">
            {visible.map((p) => <ProductCard key={p.id} product={p} onClick={() => onSelect(p)} onCatch={() => onCatch(p)} />)}
          </div>
        </div>
      </section>

      <section className="catch-intro container">
        <div className="catch-copy">
          <span>CATCH LIVE DEAL</span>
          <h2>기다리던 가격,<br />놓치지 않게 잡아드려요</h2>
          <p>원하는 가격과 옵션만 정해두세요.<br />조건이 맞는 순간 바로 알려드릴게요.</p>
          <button onClick={() => onCatch(products[0])}>CATCH 알림 설정하기 <Icon name="arrow" /></button>
        </div>
        <div className="catch-steps">
          <div><b>01</b><span className="step-icon"><Icon name="search" /></span><strong>상품을 찾고</strong><p>여러 쇼핑몰을 한 번에 검색해요</p></div>
          <div><b>02</b><span className="step-icon"><span>₩</span></span><strong>목표가를 정하면</strong><p>가격과 재고를 계속 지켜봐요</p></div>
          <div><b>03</b><span className="step-icon"><Icon name="bell" /></span><strong>바로 알려드려요</strong><p>조건 충족 즉시 알림을 보내요</p></div>
        </div>
      </section>

      <section className="newsletter">
        <div className="container newsletter-inner">
          <div><span>WEEKLY CATCH</span><h2>이번 주 놓치면 아쉬운 딜만 모았어요</h2><p>매주 목요일, 엄선한 핫딜을 메일로 보내드려요.</p></div>
          <form onSubmit={(e) => e.preventDefault()}><input type="email" placeholder="이메일 주소를 입력하세요" /><button>구독하기</button></form>
        </div>
      </section>
    </main>
  );
}

function ProductsView({ query, onSelect, onCatch }: { query: string; onSelect: (p: Product) => void; onCatch: (p: Product) => void }) {
  const [active, setActive] = useState("전체");
  const result = useMemo(() => products.filter((p) => (active === "전체" || p.category === active) && (!query || `${p.brand} ${p.name}`.toLowerCase().includes(query.toLowerCase()))), [active, query]);
  return (
    <main className="container listing">
      <div className="breadcrumb">홈 <Icon name="chevron" size={13} /> {query ? "검색 결과" : "실시간 핫딜"}</div>
      <div className="listing-head">
        <div><span className="eyebrow">{query ? "SEARCH RESULTS" : "ALL LIVE DEALS"}</span><h1>{query ? `'${query}' 검색 결과` : "실시간 핫딜"}</h1><p>검증된 할인 정보만 빠르게 모았어요.</p></div>
        <b>{result.length}개의 상품</b>
      </div>
      <div className="filter-row">
        <div>{categories.slice(0, 4).map((c) => <button className={active === c ? "active" : ""} onClick={() => setActive(c)} key={c}>{c}</button>)}</div>
        <button className="filter-button">추천순 <span>⌄</span></button>
      </div>
      {result.length ? <div className="product-grid wide">{result.map((p) => <ProductCard key={p.id} product={p} onClick={() => onSelect(p)} onCatch={() => onCatch(p)} />)}</div> : (
        <div className="empty"><Icon name="search" size={36} /><h2>검색 결과가 없어요</h2><p>다른 검색어를 입력하거나 인기 키워드를 확인해보세요.</p><div><button>에어팟</button><button>나이키</button><button>자취템</button></div></div>
      )}
    </main>
  );
}

function DetailView({ product, onCatch, onAdd, onMove }: { product: Product; onCatch: () => void; onAdd: () => void; onMove: () => void }) {
  return (
    <main className="container detail">
      <div className="breadcrumb">홈 <Icon name="chevron" size={13} /> {product.category} <Icon name="chevron" size={13} /> {product.brand}</div>
      <div className="detail-grid">
        <div className="detail-image"><img src={product.image} alt={product.name} /><span className="deal-tag">{product.tag}</span><span className={`market-ribbon ${product.marketplace}`}>{marketplaceLabels[product.marketplace]}</span></div>
        <div className="detail-info">
          <div className="detail-brand">{product.brand}<button><Icon name="heart" /></button></div>
          <h1>{product.name}</h1>
          <p className="rating">★★★★★ <b>4.8</b> <span>리뷰 248개</span></p>
          <div className="detail-price"><del>{formatPrice(product.original)}</del><div><b>{Math.round((1 - product.price / product.original) * 100)}%</b><strong>{formatPrice(product.price)}</strong></div></div>
          <div className="detail-benefit"><span>혜택</span><p><b>최대 10,000원</b> 추가 할인 가능<br /><small>신규 회원 쿠폰 + 카드 할인</small></p></div>
          <div className="detail-benefit"><span>배송</span><p><b>무료배송</b><br /><small>내일 도착 예정</small></p></div>
          <label className="option">옵션 선택<select><option>옵션을 선택해주세요</option><option>블랙 / 기본</option><option>실버 / 기본</option></select></label>
          <button className="catch-button" onClick={onCatch}><Icon name="bell" /> 목표가가 되면 알려주세요 <span>조건 설정</span></button>
          <div className="detail-actions"><button className="outline" onClick={onAdd}><Icon name="cart" /> CATCH</button><button className="primary" onClick={onMove}>이동하기</button></div>
        </div>
      </div>
      <div className="detail-tabs"><button className="active">상품정보</button><button>리뷰 248</button><button>Q&A 32</button><button>배송/교환/반품</button></div>
    </main>
  );
}

function SimpleView({ type, cart, onNavigate, onMove }: { type: string; cart: Product[]; onNavigate: (v: string) => void; onMove: (product: Product) => void }) {
  if (type === "cart") return (
    <main className="container simple-page">
      <div className="simple-title"><span>CATCH LIST</span><h1>CATCH</h1></div>
      {cart.length === 0 ? <div className="empty"><Icon name="cart" size={40} /><h2>CATCH가 비어있어요</h2><p>마음에 드는 핫딜을 담아보세요.</p><button className="primary" onClick={() => onNavigate("products")}>상품 보러가기</button></div> :
        <div className="cart-layout"><div className="cart-list">{cart.map((p) => <div className="cart-item" key={p.id}><input type="checkbox" defaultChecked /><img src={p.image} alt="" /><div><span>{p.brand}</span><strong>{p.name}</strong><small>옵션: 기본</small></div><div className="cart-item-action"><b>{formatPrice(p.price)}</b><button className="primary" onClick={() => onMove(p)}>이동하기</button></div></div>)}</div></div>}
    </main>
  );
  return (
    <main className="container simple-page">
      <div className="simple-title"><span>MY CATCH</span><h1>마이페이지</h1></div>
      <div className="profile-card"><div className="avatar"><Icon name="user" size={30} /></div><div><span>안녕하세요</span><h2>캐치 회원님</h2><p>현재 <b>WELCOME</b> 등급이에요</p></div><button>회원정보 수정 <Icon name="chevron" size={15} /></button></div>
      <div className="my-stats"><div><b>0</b><span>결제완료</span></div><div><b>1</b><span>배송중</span></div><div><b>0</b><span>배송완료</span></div><div><b>0</b><span>취소/교환/반품</span></div></div>
      <div className="my-menu"><button><Icon name="bell" /><span><b>내 CATCH 알림</b><small>목표가와 재고 알림을 관리해요</small></span><Icon name="chevron" /></button><button><Icon name="bag" /><span><b>주문/배송 조회</b><small>최근 주문과 배송 현황을 확인해요</small></span><Icon name="chevron" /></button><button><Icon name="heart" /><span><b>찜한 상품</b><small>저장해 둔 상품을 모아봐요</small></span><Icon name="chevron" /></button></div>
    </main>
  );
}

function Modal({ type, product, onClose, onAuthenticated, moveRequested = false }: { type: string; product?: Product; onClose: () => void; onAuthenticated: () => void; moveRequested?: boolean }) {
  const [done, setDone] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [price, setPrice] = useState(product ? Math.floor(product.price * 0.9 / 1000) * 1000 : 0);
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><Icon name="close" /></button>
        {type === "login" && authMode === "login" ? (
          <>
            <span className="modal-logo">CATCH<span>CATCH</span></span>
            <h2>{moveRequested ? <>로그인 후 쇼핑몰로<br />이동할 수 있어요</> : <>로그인하고 더 정확하게<br />핫딜을 잡아보세요</>}</h2>
            <p>{moveRequested ? "회원에게 제공되는 안전한 쇼핑몰 연결 서비스예요." : "관심 상품의 가격 변화를 놓치지 않도록 알려드려요."}</p>
            <div className="social-buttons"><button className="kakao" onClick={onAuthenticated}>K 카카오로 계속하기</button><button className="naver" onClick={onAuthenticated}>N 네이버로 계속하기</button><button className="google" onClick={onAuthenticated}>G Google로 계속하기</button></div>
            <div className="divider"><span>또는 이메일로 로그인</span></div>
            <form className="login-form" onSubmit={(e) => { e.preventDefault(); onAuthenticated(); }}><input type="email" placeholder="이메일" required /><input type="password" placeholder="비밀번호" required /><button className="primary">로그인</button></form>
            <div className="modal-links"><button>아이디 찾기</button><i /><button>비밀번호 찾기</button><i /><button onClick={() => setAuthMode("signup")}>회원가입</button></div>
          </>
        ) : type === "login" ? (
          <>
            <span className="modal-logo">CATCH<span>CATCH</span></span>
            <h2>회원가입하고<br />핫딜을 바로 만나보세요</h2>
            <p>간단한 정보만 입력하면 쇼핑몰 이동과 CATCH 알림을 이용할 수 있어요.</p>
            <form className="login-form signup-form" onSubmit={(e) => { e.preventDefault(); onAuthenticated(); }}><input type="text" placeholder="이름" required /><input type="email" placeholder="이메일" required /><input type="password" placeholder="비밀번호" required /><input type="password" placeholder="비밀번호 확인" required /><button className="primary">회원가입</button></form>
            <div className="modal-links"><span>이미 계정이 있나요?</span><button onClick={() => setAuthMode("login")}>로그인</button></div>
          </>
        ) : done ? (
          <div className="success-state"><span><Icon name="check" size={34} /></span><h2>CATCH 설정 완료!</h2><p><b>{product?.name}</b><br />조건이 맞는 순간 바로 알려드릴게요.</p><button className="primary" onClick={onClose}>확인</button></div>
        ) : (
          <>
            <span className="modal-kicker">CATCH LIVE DEAL</span>
            <h2>어떤 순간에<br />알려드릴까요?</h2>
            <p>가격과 재고 조건을 설정하면 실시간으로 확인해드려요.</p>
            <div className="catch-product"><img src={product?.image} alt="" /><div><span>{product?.brand}</span><strong>{product?.name}</strong><b>현재 {product && formatPrice(product.price)}</b></div></div>
            <label className="price-input"><span>목표 가격</span><div><input value={price.toLocaleString()} onChange={(e) => setPrice(Number(e.target.value.replace(/[^0-9]/g, "")))} /><b>원 이하</b></div><small>현재가보다 {product ? Math.max(0, Math.round((1 - price / product.price) * 100)) : 0}% 낮은 가격이에요</small></label>
            <label className="toggle-row"><span><b>재고 알림도 받을게요</b><small>품절 상품이 다시 입고되면 알려드려요</small></span><input type="checkbox" defaultChecked /></label>
            <button className="primary modal-submit" onClick={() => setDone(true)}>이 조건으로 CATCH 하기</button>
          </>
        )}
      </section>
    </div>
  );
}

function Footer() {
  return (
    <footer><div className="container footer-grid"><div className="footer-brand"><span>CATCH<span>CATCH</span></span><p>세상의 모든 핫딜을 가장 빠르게.<br />가격을 비교하고, 기회를 잡으세요.</p></div><div><strong>서비스</strong><button>실시간 핫딜</button><button>CATCH 알림</button><button>베스트</button></div><div><strong>고객지원</strong><button>공지사항</button><button>자주 묻는 질문</button><button>문의하기</button></div><div className="support"><strong>고객센터</strong><b>1588-2847</b><span>평일 09:00–18:00</span></div></div><div className="container footer-bottom"><span>© 2025 CATCHCATCH. All rights reserved.</span><div><button>이용약관</button><button>개인정보처리방침</button></div></div></footer>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product>(products[0]);
  const [modal, setModal] = useState<"login" | "catch" | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pendingMove, setPendingMove] = useState<Product | null>(null);
  const [showLoginNotice, setShowLoginNotice] = useState(false);
  const [appBar, setAppBar] = useState(true);
  const navigate = (v: string) => { setView(v); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const search = (term: string) => { setQuery(term); navigate("products"); };
  const select = (p: Product) => { setSelected(p); navigate("detail"); };
  const addCart = () => { if (!cart.find((p) => p.id === selected.id)) setCart([...cart, selected]); navigate("cart"); };
  const moveToStore = (product: Product) => window.open(`${marketplaceSearchUrls[product.marketplace]}${encodeURIComponent(product.name)}`, "_blank", "noopener,noreferrer");
  const requestMove = (product: Product) => {
    if (isLoggedIn) {
      moveToStore(product);
      return;
    }
    setSelected(product);
    setPendingMove(product);
    setModal("login");
  };
  const completeAuthentication = () => {
    setIsLoggedIn(true);
    setShowLoginNotice(true);
    setModal(null);
    if (pendingMove) moveToStore(pendingMove);
    setPendingMove(null);
  };
  const logout = () => {
    setIsLoggedIn(false);
    setShowLoginNotice(false);
    navigate("home");
  };
  return (
    <div className="app">
      {appBar && <div className="app-bar"><div className="container"><span className="app-mark">C</span><div><b>앱에서 더 빠르게 핫딜을 잡아보세요</b><small>가격 알림을 실시간으로 받아볼 수 있어요</small></div><button className="download">앱 다운로드</button><button className="bar-close" onClick={() => setAppBar(false)}><Icon name="close" size={18} /></button></div></div>}
      <Header onLogin={() => { setPendingMove(null); setModal("login"); }} onLogout={logout} onSearch={search} onNavigate={navigate} cartCount={cart.length} isLoggedIn={isLoggedIn} />
      {showLoginNotice && <div className="login-notice"><span><Icon name="check" size={17} /></span><div><b>로그인되었습니다</b><small>이제 모든 핫딜의 쇼핑몰 이동과 CATCH 알림을 이용할 수 있어요.</small></div><button onClick={() => setShowLoginNotice(false)} aria-label="로그인 알림 닫기"><Icon name="close" size={16} /></button></div>}
      {view === "home" && <Home onNavigate={navigate} onSelect={select} onCatch={(p) => { setSelected(p); setModal("catch"); }} />}
      {view === "products" && <ProductsView query={query} onSelect={select} onCatch={(p) => { setSelected(p); setModal("catch"); }} />}
      {view === "detail" && <DetailView product={selected} onCatch={() => setModal("catch")} onAdd={addCart} onMove={() => requestMove(selected)} />}
      {(view === "cart" || view === "mypage") && <SimpleView type={view} cart={cart} onNavigate={navigate} onMove={requestMove} />}
      <Footer />
      {modal && <Modal type={modal} product={selected} onClose={() => { setModal(null); setPendingMove(null); }} onAuthenticated={completeAuthentication} moveRequested={Boolean(pendingMove)} />}
      <nav className="mobile-nav"><button onClick={() => navigate("home")}><Icon name="home" /><span>홈</span></button><button onClick={() => navigate("products")}><Icon name="search" /><span>검색</span></button><button onClick={() => setModal("catch")}><Icon name="bell" /><span>CATCH</span></button><button onClick={() => navigate("mypage")}><Icon name="user" /><span>마이</span></button></nav>
    </div>
  );
}
