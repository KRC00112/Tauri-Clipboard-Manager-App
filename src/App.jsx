import {useEffect, useState} from 'react'
import './App.css'
import { writeText, readText } from '@tauri-apps/plugin-clipboard-manager';


function App() {

const [items, setItems] = useState([]);


const formattedDateTime=(timestamp)=>{
    return new Date(timestamp).toLocaleDateString("en-GB",{
        year:"numeric",
        month:"long",
        day:"numeric",
        hour:"numeric",
        minute:"numeric",
        second:"numeric",
    })
}

    useEffect(() => {
        let lastContent="";
        async function fetchData() {
            const content = await readText();
            if(content!==lastContent){
                setItems(prev=>[...prev,{time:Date.now(),content:content}]);
                lastContent=content;
            }
        }
        const intervalId=setInterval(fetchData,500);
        return()=>clearInterval(intervalId);

    }, []);

    return (
    <div className='body'>
        <h1 className="heading">Clipboard Manager</h1>
        {items.map((item, index) => (
            <div className='card' key={item.time}>
                <div>{formattedDateTime(item.time)}</div>
                <pre className='copied-text'>{item.content}</pre>
            </div>
        ))}

    </div>
  )
}

export default App
