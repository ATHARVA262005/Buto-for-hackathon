import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

import Home from "./pages/Home";
import Error from "./pages/Error";
import About from "./pages/About";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import PromptBattle from "./pages/PromptBattle";
import Contact from "./pages/Contact";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="bg-gradient-to-b from-[#0F172A] to-[#1E293B] min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/prompt-battle" element={<PromptBattle />} />
          <Route path="/events/:title" element={<EventDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
