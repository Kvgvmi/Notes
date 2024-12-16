
import List from './components/list/List';
import Login from "./components/Login/Login";
import Navbar from './components/Navbar/Navbar';
import { useState } from 'react';


function App() {
  const [IsConnected, setIsConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [token, setToken] = useState(""); 
  const [UserInfo,setUserInfo]=useState("");
  

  return (
    <>
      {IsConnected ? (
        <>
          <Navbar UserInfo={UserInfo} setSearchQuery={setSearchQuery} setIsConnected={setIsConnected} />
          <List  token={token}  searchQuery={searchQuery} />
        </>
      ) : (
        <Login setToken={setToken}  setIsConnected={setIsConnected} setUserInfo={setUserInfo}/>
      )}
    </>
  );
}
export default App;

