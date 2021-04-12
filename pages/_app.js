import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div style={{
			backgroundColor: `rgba(var(--b3f,250,250,250),1)`
		}}>
			<Component {...pageProps} />
		</div>
  );
}

export default MyApp
