import { useState, useCallback, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

// ─── Stock Database ────────────────────────────────────────────────────────────
const STOCK_DB = {
  // US Stocks (USD)
  AAPL:  { price: 189,  currency: "USD", exchange: "NASDAQ", name: "Apple Inc." },
  GOOGL: { price: 172,  currency: "USD", exchange: "NASDAQ", name: "Alphabet Inc." },
  MSFT:  { price: 415,  currency: "USD", exchange: "NASDAQ", name: "Microsoft Corp." },
  TSLA:  { price: 175,  currency: "USD", exchange: "NASDAQ", name: "Tesla Inc." },
  AMZN:  { price: 198,  currency: "USD", exchange: "NASDAQ", name: "Amazon.com Inc." },
  NVDA:  { price: 875,  currency: "USD", exchange: "NASDAQ", name: "NVIDIA Corp." },
  META:  { price: 525,  currency: "USD", exchange: "NASDAQ", name: "Meta Platforms" },
  NFLX:  { price: 625,  currency: "USD", exchange: "NASDAQ", name: "Netflix Inc." },
  UBER:  { price: 72,   currency: "USD", exchange: "NYSE",   name: "Uber Technologies" },
  AMD:   { price: 168,  currency: "USD", exchange: "NASDAQ", name: "Advanced Micro Devices" },
  INTC:  { price: 42,   currency: "USD", exchange: "NASDAQ", name: "Intel Corp." },
  DIS:   { price: 112,  currency: "USD", exchange: "NYSE",   name: "Walt Disney Co." },
  BABA:  { price: 78,   currency: "USD", exchange: "NYSE",   name: "Alibaba Group" },
  PYPL:  { price: 68,   currency: "USD", exchange: "NASDAQ", name: "PayPal Holdings" },
  SPOT:  { price: 375,  currency: "USD", exchange: "NYSE",   name: "Spotify Technology" },
  COIN:  { price: 225,  currency: "USD", exchange: "NASDAQ", name: "Coinbase Global" },
  PLTR:  { price: 24,   currency: "USD", exchange: "NYSE",   name: "Palantir Technologies" },
  GME:   { price: 18,   currency: "USD", exchange: "NYSE",   name: "GameStop Corp." },
  JPM:   { price: 198,  currency: "USD", exchange: "NYSE",   name: "JPMorgan Chase" },
  V:     { price: 272,  currency: "USD", exchange: "NYSE",   name: "Visa Inc." },
  WMT:   { price: 68,   currency: "USD", exchange: "NYSE",   name: "Walmart Inc." },
  BRKB:  { price: 372,  currency: "USD", exchange: "NYSE",   name: "Berkshire Hathaway B" },
  // Indian Stocks (INR) — NSE symbols
  RELIANCE:   { price: 2840,  currency: "INR", exchange: "NSE", name: "Reliance Industries" },
  TCS:        { price: 3720,  currency: "INR", exchange: "NSE", name: "Tata Consultancy Services" },
  INFY:       { price: 1520,  currency: "INR", exchange: "NSE", name: "Infosys Ltd." },
  HDFCBANK:   { price: 1640,  currency: "INR", exchange: "NSE", name: "HDFC Bank Ltd." },
  ICICIBANK:  { price: 1080,  currency: "INR", exchange: "NSE", name: "ICICI Bank Ltd." },
  HINDUNILVR: { price: 2380,  currency: "INR", exchange: "NSE", name: "Hindustan Unilever" },
  SBIN:       { price: 780,   currency: "INR", exchange: "NSE", name: "State Bank of India" },
  BAJFINANCE: { price: 7100,  currency: "INR", exchange: "NSE", name: "Bajaj Finance Ltd." },
  WIPRO:      { price: 480,   currency: "INR", exchange: "NSE", name: "Wipro Ltd." },
  ADANIENT:   { price: 2460,  currency: "INR", exchange: "NSE", name: "Adani Enterprises" },
  TATAMOTORS: { price: 920,   currency: "INR", exchange: "NSE", name: "Tata Motors Ltd." },
  HCLTECH:    { price: 1380,  currency: "INR", exchange: "NSE", name: "HCL Technologies" },
  AXISBANK:   { price: 1120,  currency: "INR", exchange: "NSE", name: "Axis Bank Ltd." },
  MARUTI:     { price: 11200, currency: "INR", exchange: "NSE", name: "Maruti Suzuki India" },
  SUNPHARMA:  { price: 1580,  currency: "INR", exchange: "NSE", name: "Sun Pharmaceutical" },
  TITAN:      { price: 3460,  currency: "INR", exchange: "NSE", name: "Titan Company Ltd." },
  ONGC:       { price: 248,   currency: "INR", exchange: "NSE", name: "Oil & Natural Gas Corp." },
  POWERGRID:  { price: 318,   currency: "INR", exchange: "NSE", name: "Power Grid Corp." },
  NESTLEIND:  { price: 2280,  currency: "INR", exchange: "NSE", name: "Nestle India Ltd." },
  LTIM:       { price: 5400,  currency: "INR", exchange: "NSE", name: "LTIMindtree Ltd." },
  ZOMATO:     { price: 224,   currency: "INR", exchange: "NSE", name: "Zomato Ltd." },
  PAYTM:      { price: 420,   currency: "INR", exchange: "NSE", name: "One 97 Communications" },
  NYKAA:      { price: 168,   currency: "INR", exchange: "NSE", name: "FSN E-Commerce (Nykaa)" },
  POLICYBZR:  { price: 1680,  currency: "INR", exchange: "NSE", name: "PB Fintech (PolicyBazaar)" },
  ITC:        { price: 438,   currency: "INR", exchange: "NSE", name: "ITC Ltd." },
  COALINDIA:  { price: 412,   currency: "INR", exchange: "NSE", name: "Coal India Ltd." },
  BHARTIARTL: { price: 1540,  currency: "INR", exchange: "NSE", name: "Bharti Airtel Ltd." },
  KOTAKBANK:  { price: 1740,  currency: "INR", exchange: "NSE", name: "Kotak Mahindra Bank" },
  LT:         { price: 3280,  currency: "INR", exchange: "NSE", name: "Larsen & Toubro Ltd." },
  ASIANPAINT: { price: 2820,  currency: "INR", exchange: "NSE", name: "Asian Paints Ltd." },
  ULTRACEMCO: { price: 10400, currency: "INR", exchange: "NSE", name: "UltraTech Cement Ltd." },
  // Global / European
  ASML:  { price: 785,  currency: "USD", exchange: "NASDAQ", name: "ASML Holding NV" },
  SAP:   { price: 192,  currency: "USD", exchange: "NYSE",   name: "SAP SE" },
  NVO:   { price: 118,  currency: "USD", exchange: "NYSE",   name: "Novo Nordisk A/S" },
  LVMUY: { price: 148,  currency: "USD", exchange: "OTC",    name: "LVMH Moet Hennessy" },
  SONY:  { price: 88,   currency: "USD", exchange: "NYSE",   name: "Sony Group Corp." },
  TSM:   { price: 165,  currency: "USD", exchange: "NYSE",   name: "Taiwan Semiconductor" },
  BIDU:  { price: 96,   currency: "USD", exchange: "NASDAQ", name: "Baidu Inc." },
  SE:    { price: 78,   currency: "USD", exchange: "NYSE",   name: "Sea Limited" },
  SHOP:  { price: 98,   currency: "USD", exchange: "NYSE",   name: "Shopify Inc." },
  ARM:   { price: 128,  currency: "USD", exchange: "NASDAQ", name: "Arm Holdings PLC" },
};

const CURRENCY_SYMBOLS = { USD: "$", INR: "₹", EUR: "€", GBP: "£", JPY: "¥" };

const POPULAR_US     = ["AAPL", "NVDA", "MSFT", "TSLA", "GOOGL", "META", "AMZN", "NFLX"];
const POPULAR_IN     = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ZOMATO", "TATAMOTORS", "SBIN", "BHARTIARTL"];
const POPULAR_GLOBAL = ["ASML", "TSM", "NVO", "SONY", "SAP", "SE", "ARM", "SHOP"];

// ─── Price history generator (deterministic seeded) ───────────────────────────
function generateHistory(ticker, days, basePrice) {
  const seed = ticker.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = (i) => {
    const x = Math.sin(seed * 9301 + i * 49297 + 233720) * 439.545;
    return x - Math.floor(x);
  };
  const vol = 0.016 + rng(seed % 7) * 0.014;
  const data = [];
  let price = basePrice * (0.78 + rng(seed) * 0.44);
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    price = Math.max(price * (1 + (rng(i * 3 + 1) - 0.474) * vol), 1);
    data.push({
      date: date.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      price: parseFloat(price.toFixed(2)),
    });
  }
  if (data.length > 0) {
    const diff = basePrice - data[data.length - 1].price;
    data[data.length - 1].price = parseFloat((data[data.length - 1].price + diff * 0.65).toFixed(2));
  }
  return data;
}

// ─── AI lookup for unknown tickers ───────────────────────────────────────────
async function fetchUnknownStock(query) {
  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        system: `You are a global stock price API supporting Indian (NSE/BSE) and all international markets.
Given a stock ticker or company name, search the web for its CURRENT price and return ONLY a JSON object.
Format: {"ticker":"SYMBOL","name":"Full Company Name","price":1234.56,"currency":"INR","exchange":"NSE","valid":true}
- For NSE/BSE stocks: use INR currency
- For US stocks: use USD currency
- If not a real stock: {"ticker":"X","valid":false}
Return ONLY the JSON. No markdown. No explanation. No backticks.`,
        messages: [{ role: "user", content: `Find stock: "${query}"` }],
      }),
    });
    const data = await resp.json();
    const text = (data.content || []).map((b) => b.text || "").join("");
    const match = text.match(/\{[\s\S]*?"valid"[\s\S]*?\}/);
    if (match) return JSON.parse(match[0]);
  } catch {}
  return { ticker: query, valid: false };
}

// ─── Config ───────────────────────────────────────────────────────────────────
const TIME_SPANS = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
  { label: "5Y", days: 1825 },
];

const PALETTE = [
  { line: "#00d4aa", glow: "#00d4aa1a" },
  { line: "#6c8fff", glow: "#6c8fff1a" },
  { line: "#ff6b6b", glow: "#ff6b6b1a" },
  { line: "#ffd166", glow: "#ffd1661a" },
  { line: "#a78bfa", glow: "#a78bfa1a" },
  { line: "#f97316", glow: "#f973161a" },
  { line: "#38bdf8", glow: "#38bdf81a" },
  { line: "#fb7185", glow: "#fb71851a" },
];

const EXCH_COL = {
  NSE: "#ff9933", BSE: "#3b82f6",
  NASDAQ: "#00d4aa", NYSE: "#6c8fff",
  OTC: "#a78bfa", DEFAULT: "#8892a4",
};

// ─── Tooltip ─────────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null;
  const sym = CURRENCY_SYMBOLS[currency] || "$";
  const val = payload[0].value;
  return (
    <div style={{
      background: "#0d111c", border: "1px solid #1e2540",
      borderRadius: 7, padding: "8px 14px", fontFamily: "monospace",
      boxShadow: "0 4px 24px #00000080",
    }}>
      <div style={{ color: "#6a7485", fontSize: 10, marginBottom: 4 }}>{label}</div>
      <div style={{ color: "#e8ecf4", fontSize: 15, fontWeight: 700 }}>
        {sym}{val >= 1000 ? val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : val.toFixed(2)}
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtPrice(price, currency) {
  const sym = CURRENCY_SYMBOLS[currency] || "$";
  if (price >= 1000) return `${sym}${price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `${sym}${price.toFixed(2)}`;
}

function fmtAxis(v, currency) {
  const sym = CURRENCY_SYMBOLS[currency] || "$";
  if (v >= 100000) return `${sym}${(v / 100000).toFixed(1)}L`;
  if (v >= 1000)   return `${sym}${(v / 1000).toFixed(1)}K`;
  return `${sym}${v.toFixed(0)}`;
}

function getSuggestions(q) {
  if (!q) return [];
  const up = q.toUpperCase();
  return Object.entries(STOCK_DB)
    .filter(([sym, d]) => sym.startsWith(up) || d.name.toUpperCase().includes(up))
    .slice(0, 7)
    .map(([sym, d]) => ({ sym, ...d }));
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function StockTracker() {
  const [stocks, setStocks]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [input, setInput]     = useState("");
  const [span, setSpan]       = useState("1M");
  const [busyKey, setBusyKey] = useState(null);
  const [error, setError]     = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const [activeTab, setActiveTab] = useState("US");
  const historyRef = useRef({});

  const getChartData = useCallback((stock) => {
    const key = `${stock.ticker}__${span}`;
    if (!historyRef.current[key]) {
      const days = TIME_SPANS.find(t => t.label === span)?.days || 30;
      historyRef.current[key] = generateHistory(stock.ticker, days, stock.price);
    }
    return historyRef.current[key];
  }, [span]);

  const addStock = useCallback(async (rawInput, meta = null) => {
    const t = rawInput.trim().toUpperCase();
    if (!t) { setError("Enter a ticker or company name"); return; }
    if (stocks.find(s => s.ticker === t)) { setError(`${t} is already in your list`); return; }

    setError("");
    setShowSugg(false);
    setSuggestions([]);
    setInput("");

    // 1. Fast path: known DB
    let info = STOCK_DB[t] ? { ticker: t, ...STOCK_DB[t] } : null;

    // 2. Passed directly (from suggestion click)
    if (!info && meta) info = { ticker: t, ...meta };

    // 3. AI lookup
    if (!info) {
      setBusyKey(t);
      const result = await fetchUnknownStock(rawInput.trim());
      setBusyKey(null);
      if (!result?.valid) {
        setError(`"${rawInput}" not found — try an NSE ticker (e.g. RELIANCE) or US ticker (e.g. AAPL)`);
        return;
      }
      info = result;
    }

    const colors = PALETTE[stocks.length % PALETTE.length];
    setStocks(prev => [...prev, {
      ticker: info.ticker,
      name: info.name || info.ticker,
      price: info.price,
      currency: info.currency || "USD",
      exchange: info.exchange || "—",
      colors,
    }]);
    setSelected(info.ticker);
  }, [stocks]);

  const removeStock = (ticker) => {
    setStocks(prev => prev.filter(s => s.ticker !== ticker));
    if (selected === ticker) {
      const rest = stocks.filter(s => s.ticker !== ticker);
      setSelected(rest.length ? rest[rest.length - 1].ticker : null);
    }
  };

  const sel  = stocks.find(s => s.ticker === selected);
  const cData = sel ? getChartData(sel) : [];
  const pctChg = cData.length > 1
    ? ((cData[cData.length - 1].price - cData[0].price) / cData[0].price * 100)
    : 0;
  const isUp = pctChg >= 0;
  const isLoading = busyKey !== null;

  const popularMap = { US: POPULAR_US, India: POPULAR_IN, Global: POPULAR_GLOBAL };

  return (
    <div style={{
      height: "100vh", background: "#070a0f",
      fontFamily: "'JetBrains Mono','Courier New',monospace",
      display: "flex", flexDirection: "column", color: "#e8ecf4", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#1a2030;border-radius:2px}
        .srow{cursor:pointer;transition:background .12s;border-left:3px solid transparent}
        .srow:hover{background:#0d1520!important}
        .srow.active{background:#0c1828!important}
        .rmv{opacity:0;transition:opacity .12s;background:none;border:none;cursor:pointer;color:#ff6b6b;font-size:12px;padding:2px 6px;border-radius:4px;flex-shrink:0}
        .rmv:hover{background:#ff6b6b14}
        .srow:hover .rmv{opacity:1}
        .spbtn{cursor:pointer;transition:all .12s;font-family:'JetBrains Mono',monospace;letter-spacing:.5px}
        .spbtn:hover{color:#e8ecf4!important}
        .addbtn{transition:all .18s;cursor:pointer;flex-shrink:0}
        .addbtn:hover:not([disabled]){filter:brightness(1.15);transform:scale(1.05)}
        .addbtn[disabled]{opacity:.45;cursor:default}
        .tinput{background:#0c1018;border:1px solid #1a2030;border-radius:7px;padding:9px 12px;color:#e8ecf4;font-family:'JetBrains Mono',monospace;font-size:13px;letter-spacing:.8px;transition:border-color .15s;width:100%}
        .tinput:focus{outline:none;border-color:#00d4aa;box-shadow:0 0 0 2px #00d4aa18}
        .tabbtn{cursor:pointer;transition:all .12s;background:none;border:none;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.8px;padding:4px 10px;border-radius:5px}
        .qtag{cursor:pointer;transition:all .12s;font-size:10px;padding:3px 8px;border-radius:4px;letter-spacing:.3px;white-space:nowrap}
        .qtag:hover{border-color:#00d4aa40!important;color:#e8ecf4!important}
        .sitem{cursor:pointer;transition:background .1s;padding:8px 12px;display:flex;gap:8px;align-items:center}
        .sitem:hover{background:#131b28}
        .pulse{animation:pulse 2.4s infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        .spin{animation:spin .9s linear infinite;display:inline-block}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .chip{cursor:pointer;transition:all .12s;flex-shrink:0}
        .chip:hover{filter:brightness(1.2)}
        .exbadge{font-size:8px;padding:2px 5px;border-radius:3px;font-weight:700;letter-spacing:.5px;flex-shrink:0}
      `}</style>

      {/* Header */}
      <header style={{
        borderBottom: "1px solid #141c28", padding: "11px 22px",
        display: "flex", alignItems: "center", gap: 14, background: "#080c14",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30,
            background: "linear-gradient(135deg,#00d4aa 0%,#6c8fff 100%)",
            borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#07090e" }}>T</span>
          </div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 17, letterSpacing: 2 }}>
            THRUM STOCK MAN
          </span>
        </div>
        <div style={{ display: "flex", gap: 5, marginLeft: 6 }}>
          {["NSE", "BSE", "NASDAQ", "NYSE"].map(ex => (
            <span key={ex} className="exbadge" style={{
              background: EXCH_COL[ex] + "15", color: EXCH_COL[ex],
              border: `1px solid ${EXCH_COL[ex]}28`,
            }}>{ex}</span>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4aa" }} className="pulse" />
          <span style={{ fontSize: 9, color: "#3a4568", letterSpacing: 1.5 }}>LIVE MARKETS</span>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── Sidebar ── */}
        <aside style={{
          width: 278, borderRight: "1px solid #141c28",
          background: "#080c14", display: "flex", flexDirection: "column", flexShrink: 0,
        }}>

          {/* Input */}
          <div style={{ padding: "13px 13px 10px", borderBottom: "1px solid #111820" }}>
            <div style={{ fontSize: 8, color: "#2e3a50", letterSpacing: 2, marginBottom: 8 }}>
              ADD STOCK — NSE · BSE · NASDAQ · NYSE · LSE
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", gap: 7 }}>
                <input
                  className="tinput"
                  value={input}
                  onChange={e => {
                    setInput(e.target.value);
                    setError("");
                    const q = e.target.value.trim();
                    setSuggestions(getSuggestions(q));
                    setShowSugg(q.length > 0);
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter") addStock(input);
                    if (e.key === "Escape") setShowSugg(false);
                  }}
                  onFocus={() => input.trim() && setShowSugg(true)}
                  onBlur={() => setTimeout(() => setShowSugg(false), 180)}
                  placeholder="RELIANCE, INFY, AAPL, TSM…"
                  autoCapitalize="characters"
                />
                <button
                  className="addbtn"
                  onClick={() => addStock(input)}
                  disabled={isLoading || !input.trim()}
                  style={{
                    background: "linear-gradient(135deg,#00d4aa,#00b894)",
                    color: "#07090e", border: "none", borderRadius: 7,
                    padding: "0 15px", fontWeight: 800, fontSize: 20,
                  }}
                >
                  {isLoading ? <span className="spin">⟳</span> : "+"}
                </button>
              </div>

              {/* Autocomplete */}
              {showSugg && suggestions.length > 0 && (
                <div style={{
                  position: "absolute", top: "calc(100% + 5px)", left: 0, right: 50,
                  background: "#0d1320", border: "1px solid #1a2840",
                  borderRadius: 9, zIndex: 200, overflow: "hidden",
                  boxShadow: "0 12px 40px #00000090",
                }}>
                  {suggestions.map(s => (
                    <div key={s.sym} className="sitem" onMouseDown={() => addStock(s.sym, s)}>
                      <span className="exbadge" style={{
                        background: (EXCH_COL[s.exchange] || EXCH_COL.DEFAULT) + "18",
                        color: EXCH_COL[s.exchange] || EXCH_COL.DEFAULT,
                        border: `1px solid ${(EXCH_COL[s.exchange] || EXCH_COL.DEFAULT)}28`,
                      }}>{s.exchange}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: .5 }}>{s.sym}</div>
                        <div style={{ fontSize: 9, color: "#3a4a5e", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                      </div>
                      <div style={{ fontSize: 10, color: "#6a7a8e", flexShrink: 0 }}>
                        {(CURRENCY_SYMBOLS[s.currency] || "$")}{s.price.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {error && (
              <div style={{ color: "#ff7070", fontSize: 10, marginTop: 7, display: "flex", gap: 5, lineHeight: 1.5 }}>
                <span style={{ flexShrink: 0 }}>⚠</span><span>{error}</span>
              </div>
            )}
            {isLoading && (
              <div style={{ fontSize: 10, color: "#3a5a7e", marginTop: 7, display: "flex", gap: 6, alignItems: "center" }}>
                <span className="spin" style={{ fontSize: 11 }}>⟳</span>
                <span>Searching global markets for <b style={{ color: "#6a8aae" }}>{busyKey}</b>…</span>
              </div>
            )}
          </div>

          {/* Quick Add */}
          <div style={{ padding: "10px 13px", borderBottom: "1px solid #111820" }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 9 }}>
              {Object.keys(popularMap).map(tab => (
                <button
                  key={tab}
                  className="tabbtn"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    color: activeTab === tab ? "#d0d8f0" : "#3a4568",
                    background: activeTab === tab ? "#131e30" : "transparent",
                  }}
                >
                  {tab === "India" ? "🇮🇳 India" : tab === "US" ? "🇺🇸 US" : "🌐 Global"}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {popularMap[activeTab].map(t => {
                const added = !!stocks.find(s => s.ticker === t);
                const db = STOCK_DB[t];
                return (
                  <span
                    key={t}
                    className="qtag"
                    title={db?.name}
                    onClick={() => !added && addStock(t)}
                    style={{
                      border: "1px solid #1a2535",
                      color: added ? "#1e2a3e" : "#6a7a8e",
                      background: added ? "transparent" : "#0c1420",
                      cursor: added ? "default" : "pointer",
                      textDecoration: added ? "line-through" : "none",
                    }}
                  >{t}</span>
                );
              })}
            </div>
          </div>

          {/* Stock List */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {stocks.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "#18202e" }}>
                <div style={{ fontSize: 38, marginBottom: 12 }}>🌏</div>
                <div style={{ fontSize: 11, lineHeight: 1.7 }}>
                  Track any stock worldwide<br />
                  <span style={{ fontSize: 9, color: "#141c28", letterSpacing: 1 }}>
                    NSE · BSE · NASDAQ · NYSE · and more
                  </span>
                </div>
              </div>
            ) : stocks.map(stock => {
              const d = getChartData(stock);
              const chg = d.length > 1 ? ((d[d.length - 1].price - d[0].price) / d[0].price * 100) : 0;
              const up = chg >= 0;
              const isSel = selected === stock.ticker;
              const ec = EXCH_COL[stock.exchange] || EXCH_COL.DEFAULT;
              return (
                <div
                  key={stock.ticker}
                  className={`srow ${isSel ? "active" : ""}`}
                  onClick={() => setSelected(stock.ticker)}
                  style={{
                    borderLeftColor: isSel ? stock.colors.line : "transparent",
                    padding: "10px 12px",
                    borderBottom: "1px solid #0c1018",
                    display: "flex", gap: 9, alignItems: "center",
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: stock.colors.glow,
                    border: `1px solid ${stock.colors.line}24`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 8, fontWeight: 700, color: stock.colors.line,
                    letterSpacing: 0, textAlign: "center", lineHeight: 1.3, flexShrink: 0,
                    padding: "0 2px",
                  }}>
                    {stock.ticker.length > 5 ? stock.ticker.slice(0, 4) + "…" : stock.ticker}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: .5 }}>{stock.ticker}</span>
                      <span className="exbadge" style={{
                        background: ec + "15", color: ec, border: `1px solid ${ec}25`,
                      }}>{stock.exchange}</span>
                    </div>
                    <div style={{ fontSize: 9, color: "#2e3a50", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {stock.name}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{fmtPrice(stock.price, stock.currency)}</div>
                    <div style={{ fontSize: 9, color: up ? "#00d4aa" : "#ff6b6b", marginTop: 2 }}>
                      {up ? "▲" : "▼"}{Math.abs(chg).toFixed(2)}%
                    </div>
                  </div>
                  <button className="rmv" onClick={e => { e.stopPropagation(); removeStock(stock.ticker); }}>✕</button>
                </div>
              );
            })}
          </div>

          <div style={{ padding: "7px 13px", borderTop: "1px solid #0e1520", fontSize: 8, color: "#1a2230", letterSpacing: .5 }}>
            Type company name or ticker · Press Enter to add
          </div>
        </aside>

        {/* ── Main Panel ── */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {!sel ? (
            <div style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: 16,
            }}>
              <div style={{ fontSize: 72, opacity: 0.07 }}>📊</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: "#1e2840", textAlign: "center" }}>
                Add a stock to get started
              </div>
              <div style={{ fontSize: 10, color: "#141c28", letterSpacing: 1 }}>NSE · BSE · NASDAQ · NYSE · and more</div>
            </div>
          ) : (
            <>
              {/* Chart Header */}
              <div style={{
                padding: "13px 22px",
                borderBottom: "1px solid #141c28",
                background: "#080c14",
                display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap",
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{
                      fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800,
                      letterSpacing: 1, color: sel.colors.line,
                    }}>{sel.ticker}</span>
                    <span className="exbadge" style={{
                      fontSize: 9, padding: "2px 7px",
                      background: (EXCH_COL[sel.exchange] || EXCH_COL.DEFAULT) + "18",
                      color: EXCH_COL[sel.exchange] || EXCH_COL.DEFAULT,
                      border: `1px solid ${(EXCH_COL[sel.exchange] || EXCH_COL.DEFAULT)}28`,
                    }}>{sel.exchange}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#3a4a5e", marginTop: 2 }}>{sel.name}</div>
                </div>

                <div>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{fmtPrice(sel.price, sel.currency)}</div>
                  <div style={{
                    fontSize: 11, color: isUp ? "#00d4aa" : "#ff6b6b",
                    display: "flex", gap: 4, alignItems: "center", marginTop: 2,
                  }}>
                    <span>{isUp ? "▲" : "▼"}</span>
                    <span>{Math.abs(pctChg).toFixed(2)}% over {span}</span>
                  </div>
                </div>

                {cData.length > 0 && (
                  <div style={{ display: "flex", gap: 18 }}>
                    {[
                      { l: "HIGH", v: Math.max(...cData.map(d => d.price)) },
                      { l: "LOW",  v: Math.min(...cData.map(d => d.price)) },
                      { l: "OPEN", v: cData[0]?.price },
                    ].map(({ l, v }) => (
                      <div key={l}>
                        <div style={{ fontSize: 8, color: "#2e3a50", letterSpacing: 2, marginBottom: 3 }}>{l}</div>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{fmtPrice(v, sel.currency)}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
                  {TIME_SPANS.map(({ label }) => (
                    <button
                      key={label}
                      className="spbtn"
                      onClick={() => setSpan(label)}
                      style={{
                        background: span === label ? sel.colors.glow : "transparent",
                        border: span === label ? `1px solid ${sel.colors.line}45` : "1px solid transparent",
                        color: span === label ? sel.colors.line : "#2e3a50",
                        borderRadius: 6, padding: "5px 10px", fontSize: 11,
                        fontWeight: span === label ? 700 : 400,
                      }}
                    >{label}</button>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div style={{ flex: 1, padding: "16px 6px 8px 0", minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cData} margin={{ top: 8, right: 22, bottom: 6, left: 8 }}>
                    <defs>
                      <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={sel.colors.line} stopOpacity={0.3} />
                        <stop offset="92%" stopColor={sel.colors.line} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#0f1520" strokeDasharray="4 4" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#263040", fontSize: 10, fontFamily: "monospace" }}
                      tickLine={false} axisLine={{ stroke: "#141c28" }}
                      tickFormatter={(v, i) => {
                        const step = Math.max(1, Math.floor(cData.length / 7));
                        return i % step === 0 ? v : "";
                      }}
                    />
                    <YAxis
                      tick={{ fill: "#263040", fontSize: 10, fontFamily: "monospace" }}
                      tickLine={false} axisLine={false}
                      tickFormatter={v => fmtAxis(v, sel.currency)}
                      domain={["auto", "auto"]}
                      width={70}
                    />
                    <Tooltip content={<ChartTooltip currency={sel.currency} />} />
                    <Area
                      type="monotone" dataKey="price"
                      stroke={sel.colors.line} strokeWidth={2}
                      fill="url(#ag)" dot={false}
                      activeDot={{ r: 4, fill: sel.colors.line, stroke: "#070a0f", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Bottom strip */}
              {stocks.length > 1 && (
                <div style={{
                  borderTop: "1px solid #141c28", background: "#080c14",
                  padding: "7px 18px", display: "flex", gap: 8, overflowX: "auto",
                  alignItems: "center",
                }}>
                  <span style={{ fontSize: 8, color: "#1e2a3e", letterSpacing: 2, flexShrink: 0 }}>ALL</span>
                  {stocks.map(s => {
                    const d = getChartData(s);
                    const chg = d.length > 1 ? ((d[d.length - 1].price - d[0].price) / d[0].price * 100) : 0;
                    const up = chg >= 0;
                    const isSel = selected === s.ticker;
                    return (
                      <div
                        key={s.ticker}
                        className="chip"
                        onClick={() => setSelected(s.ticker)}
                        style={{
                          padding: "4px 11px", borderRadius: 7,
                          border: `1px solid ${isSel ? s.colors.line + "45" : "#141c28"}`,
                          background: isSel ? s.colors.glow : "transparent",
                          display: "flex", gap: 7, alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: 10, fontWeight: 700, color: s.colors.line }}>{s.ticker}</span>
                        <span style={{ fontSize: 9, color: "#3a4a5e" }}>{fmtPrice(s.price, s.currency)}</span>
                        <span style={{ fontSize: 9, color: up ? "#00d4aa" : "#ff6b6b" }}>
                          {up ? "▲" : "▼"}{Math.abs(chg).toFixed(2)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
