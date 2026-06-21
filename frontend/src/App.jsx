import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Test from '../pages/test'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Test/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
