
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import type { CoinProps } from '../home'
import styles from './detail.module.css'
interface responseData {
  data: CoinProps
}
interface ErrorData {
  error: string
}

type DataProps = responseData | ErrorData

export function Detail() {
  const { cripto } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState<CoinProps>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCoin() {
      try {
        fetch(`https://rest.coincap.io/v3/assets/${cripto}apiKey=8e6b08083c007d584aa0cbb5b5107bfdd0fe072896309e56062cef6e7f271e1a210989`)
          .then(response => response.json())
          .then((data: DataProps) => {

            if ("error" in data) {
              navigate("/");
              return
            }
            const price = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD"
            });

            const priceCompact = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact"
            });
            const resulData = {
              ...data.data,
              formatedPrice: price.format(Number(data.data.priceUsd)),
              formatedMarket: priceCompact.format(Number(data.data.marketCapUsd)),
              formatedVolume: priceCompact.format(Number(data.data.volumeUsd24Hr)),
            }
            setCoin(resulData);
            setLoading(false);
          })
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    }

    getCoin();
  }, [cripto])

  if (loading || !coin) {
    return (
      <div className={styles.container}>
        <h4 className={styles.center}>Carregando detalhes...</h4>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.center}>{coin?.name}</h1>
      <h1 className={styles.center}>{coin?.symbol}</h1>

      <section className={styles.content}>
        <img className={styles.logo}
          src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`}
          alt="Logo Cripto" />

        <h1>{coin?.name} | {coin?.symbol}</h1>
        <p><strong>Preço: </strong>{coin?.formatedPrice}</p>

        <a><strong> Mercado: </strong> {coin?.formatedMarket}</a>
        <a><strong> Volume: </strong> {coin?.formatedVolume}</a>

        <a><strong> Mudança 24h: </strong>
          <span className={Number(coin?.changePercent24Hr) > 0 ? styles.profit : styles.loss}
          > {Number(coin?.changePercent24Hr).toFixed(3)} </span>
        </a>

      </section>

    </div>
  )
}

