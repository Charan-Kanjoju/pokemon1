import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PokemonListingPage } from "./pages/PokemonListingPage";
import { PokemonDetailPage } from "./pages/PokemonDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PokemonListingPage />} />
        <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
