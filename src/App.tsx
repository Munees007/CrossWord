import React from "react";
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { ThemeProvider } from "./components/ToggleContext";
import CrossWord from "./components/CrossWord";
import HomePage from "./components/HomePage";
import UserData from "./components/UserData";
import Thank from "./components/Thank";


const App:React.FC = ()=>{
    return(
      <ThemeProvider>
      <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/crossword" element={<CrossWord/>}></Route>
        <Route path="/mw" element={<UserData/>}/> 
        <Route path="/end" element={<Thank/>}/>
      </Routes>
      </BrowserRouter>
      </ThemeProvider>
    )
}

export default App;