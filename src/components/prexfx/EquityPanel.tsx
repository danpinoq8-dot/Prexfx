import { useState, useEffect } from "react";
import { appwrite } from "@/lib/appwrite";

const EquityPanel = () => {
  const [balance, setBalance] = useState(0);
  const [pnl, setPnl] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("bot_config")
        .select("balance, daily_pnl")
        .limit(1)
        .single();
      if (data) {
        setBalance(Number(data.balance));
        setPnl(Number(data.daily_pnl));
      }
    };
    fetch();

    const interval = setInterval(fetchConfig, 10000);
    return () => clearInterval(interval);
  }, []);

  const pnlPct = balance > 0 ? ((pnl / balance) * 100).toFixed(2) : "0.00";
  const isProfit = pnl >= 0;

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
        Portfolio Equity (OANDA)
      </p>
      <div className="flex items-baseline gap-4 flex-wrap">
        <h2 className="text-4xl md:text-5xl font-extralight tracking-tighter text-foreground">
          ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </h2>
        <span className={`text-xs ${isProfit ? "text-prexfx-profit profit-glow" : "text-prexfx-loss"}`}>
          {isProfit ? "+" : ""}{pnlPct}% ({isProfit ? "SAFE" : "RISK"})
        </span>
      </div>
    </div>
  );
};

export default EquityPanel;
