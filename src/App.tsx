import { Route, Routes } from 'react-router-dom';
import { useLang } from './lib/hooks';
import Home from './pages/Home';
import RankingPage from './pages/RankingPage';

export default function App() {
  const [lang, setLang] = useLang();
  return (
    <Routes>
      <Route path="/" element={<Home lang={lang} setLang={setLang} />} />
      <Route path="/ranking" element={<RankingPage lang={lang} setLang={setLang} />} />
    </Routes>
  );
}
