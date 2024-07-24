import React from "react";
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { ThemeProvider } from "./components/ToggleContext";
import CrossWord from "./components/CrossWord";


const App:React.FC = ()=>{
    return(
      <ThemeProvider>
      <BrowserRouter>
      
      <Routes>
        {/* <Route path="/" element={<HomePage/>}/> */}
        <Route path="/" element={<CrossWord/>}></Route>
        {/* <Route path="/mw" element={<UserData/>}/> 
        <Route path="/end" element={<Thank/>}/> */}
      </Routes>
      </BrowserRouter>
      </ThemeProvider>
    )
}

export default App;