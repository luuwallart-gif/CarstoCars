import { MotionConfig } from "framer-motion";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <MotionConfig reducedMotion="user">
      <Component {...pageProps} />
    </MotionConfig>
  );
}
