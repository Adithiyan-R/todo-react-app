import { useState,useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './index.css';

import { useRecoilValue, useSetRecoilState} from "recoil";

import { todoState,logState } from "./state/state";

function Update(){

    const navigate = useNavigate();
    const location = useLocation();

    const [task,setTask] = useState(location.state.task);
    const [description,setDescription] = useState(location.state.description);

    const todos = useRecoilValue(todoState);
    const setLog = useSetRecoilState(logState);

    function updateTodo(){
        fetch("http://localhost:3000/update/"+location.state.id,
        {
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer '+ localStorage.getItem('jwt'),
                'Accept' : 'application/json'
            },
            body : JSON.stringify({
                "task" : task,
                "description" : description
            })
        })
        .then((res)=> {
            return res.json();
        })
        .then((data)=> {
            alert(data.message);
            navigate('/todo');
        })
        .catch((err)=> {
            alert(err);
            console.log(err);
        })
    }

    useEffect(()=>{
            
    })

    function toTodos(){
        navigate('/todo');
    }

    function logout(){
        localStorage.removeItem('jwt');
        setLog(false);
        alert("user logged out");
        navigate('/login')
    }

    return(
        <div>
            <div className='flex justify-between w-full h-15 bg-gradient-to-r from-cyan-500 to-blue-500 ...'> 
                    <div className='p-3 ml-5 text-lg font-mono font-bold'>
                        <button onClick={toTodos}>Todo</button>
                    </div>
                    <div className='p-3 mr-5 text-lg font-mono font-bold'>
                        <button onClick={logout}>logout</button>
                    </div>
            </div>
            <div className="flex h-screen justify-center bg-gradient-to-r from-cyan-300 to-blue-300 ...">
                <div className="max-w-sm border border-black bg-white rounded-lg p-5 drop-shadow-2xl m-auto">    
                    <div className="space-y-4">
                        <div>
                            <input className="border border-black rounded-md p-2" type='text' placeholder='task' value={task} onChange={(e) => setTask(e.target.value)}></input>
                        </div>    
                        <div>
                            <input className="border border-black rounded-md p-2" type='text' placeholder='description' value={description} onChange={(e) => setDescription(e.target.value)}></input>
                        </div>
                        <div>
                            <button className="border p-2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 ..." onClick={updateTodo}>update</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Update;