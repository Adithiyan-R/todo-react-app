import { useEffect , useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './index.css';
import { useRecoilState, useSetRecoilState } from "recoil";

import { usernameState,passwordState,logState } from "./state/state";

function Login(){

    // const [username,setUsername] = useState("");
    // const [password,setPassword] = useState("");

    const [username,setUsername] = useRecoilState(usernameState);
    const [password,setPassword] = useRecoilState(passwordState);
    const setLog = useSetRecoilState(logState);

    const navigate = useNavigate();

    async function login(){
        fetch("http://localhost:3000/login",
        {
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'username' : username,
                'password' : password
            }
        })
        .then((res)=>{
            return res.json();
        })
        .then((data) =>{
            console.log(data);
            const token = data.token;
            localStorage.setItem('jwt',token);
            setLog(true);
            alert(data.message);
            navigate('/todo');
        })
        .catch((err)=>{
            console.log(err);
            alert(err);
        })
    }

    useEffect(()=>{
        
    },[]);

    return(
        <div className="flex h-screen justify-center bg-gradient-to-r from-cyan-500 to-blue-500 ...">
            <div className="max-w-sm border border-black bg-white rounded-lg p-5 drop-shadow-2xl m-auto">    
                <div className="space-y-4">
                    <div className="font-bold text-lg">
                        Login to our platform
                    </div>
                    <div>
                        <input className="border border-black rounded-md p-2" placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)}></input>
                    </div>    
                    <div>
                        <input className="border border-black rounded-md p-2" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    </div>
                    <div>
                        <button className="border p-2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 ..." onClick={login}>login</button>
                    </div>
                    <div>
                        new here? <Link className="border p-2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 ..." to='/signup'>SignUp</Link>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Login;