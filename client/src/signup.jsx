import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './index.css';

import { useRecoilState } from "recoil";

import { usernameState,passwordState,nameState } from "./state/state";

function Signup(){

    // const [name,setName] = useState("");
    // const [username,setUsername] = useState("");
    // const [password,setPassword] = useState("");

    const[name,setName] = useRecoilState(nameState);
    const [username,setUsername] = useRecoilState(usernameState);
    const [password,setPassword] = useRecoilState(passwordState);

    const navigate = useNavigate();

    async function signup(){
        fetch('http://localhost:3000/signup',
        {
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                "name" : name,
                "username" : username,
                "password" : password
            })
        })
        .then((res)=>{
            return res.json();
        })
        .then((data)=>{
            const token = data.token;
            localStorage.setItem('jwt',token);
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
                        Signup to our platform
                    </div>
                    <div>
                        <input className="border border-black rounded-md p-2" placeholder='name' value={name} onChange={(e) => setName(e.target.value)}></input>
                    </div>    
                    <div>
                        <input className="border border-black rounded-md p-2" placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)}></input>
                    </div>    
                    <div>
                        <input className="border border-black rounded-md p-2" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    </div>
                    <div>
                        <button className="border p-2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 ..." onClick={signup}>Signup</button>
                    </div>
                    <div>
                        not new? <Link className="border p-2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 ..." to='/login'>login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
