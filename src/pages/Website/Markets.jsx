import React from 'react';
import '../../styles/Website/Markets.css';

function Markets() {
  const instruments = [
    { symbol: 'EURUSD', name: 'Euro vs US Dollar', spread: '0.2 pips' },
    { symbol: 'XAUUSD', name: 'Gold vs US Dollar', spread: '15¢' },
    { symbol: 'US30', name: 'Dow Jones Industrial', spread: '1.2 points' }
  ];

  return (
    <section className="markets" id="markets">
      <div className="container">
        <h2 className="section-title">Trade Global Markets</h2>
        <p className="section-subtitle">Forex, Metals, Indices with tight spreads</p>
        
        <div className="markets-types">
          <div className="market-type">
            <h3>💱 Forex</h3>
            <p>60+ currency pairs with deep liquidity</p>
          </div>
          <div className="market-type">
            <h3>🥇 Metals</h3>
            <p>Gold, Silver, Platinum, Palladium</p>
          </div>
          <div className="market-type">
            <h3>📈 Indices</h3>
            <p>US30, US100, S&P500, and more</p>
          </div>
        </div>

        <table className="spreads-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Instrument</th>
              <th>Spread From</th>
            </tr>
          </thead>
          <tbody>
            {instruments.map((inst, i) => (
              <tr key={i}>
                <td><strong>{inst.symbol}</strong></td>
                <td>{inst.name}</td>
                <td className="spread">{inst.spread}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Markets;