import {useEffect, useState} from 'react'
import './App.css'
import { writeText, readText } from '@tauri-apps/plugin-clipboard-manager';
import { TrayIcon } from '@tauri-apps/api/tray';
import { Menu } from '@tauri-apps/api/menu';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { defaultWindowIcon } from '@tauri-apps/api/app';

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

        async function tray() {
            const menu = await Menu.new({
                items: [
                    {
                        id: 'quit',
                        text: 'Quit',
                        action: () => {
                            console.log('quit pressed');
                        },
                    },
                    {
                        id: 'show',
                        text: 'show',
                        action: async() => {
                            await getCurrentWindow().show();
                        },
                    },
                ],
            });

            const options = {
                menu,
                icon: await defaultWindowIcon(),
                menuOnLeftClick: true,
            };

            const tray = await TrayIcon.new(options);        }
        tray();

    }, []);


    useEffect(() => {
        let lastContent="";
        async function fetchData() {
            const content = await readText();
            if(content!==lastContent){
                setItems(prev=>[{time:Date.now(),content:content},...prev]);
                lastContent=content;
            }
        }
        const intervalId=setInterval(fetchData,500);
        return()=>clearInterval(intervalId);

    }, []);

    async function HandleHideWindow(){
        await getCurrentWindow().hide();
    }


    return (
        <div>
            <div className='titlebar'>
                <div className='titlebar-btns'>
                    <button onClick={HandleHideWindow}>close</button>
                    <button>minimize</button>
                    <button>maximize</button>
                </div>
            </div>
            <div className='body'>
                <div className="header">
                    <h1 className="heading">Clipboard Manager</h1>
                </div>
                <div className='list'>{items.map((item, index) => (
                    <div className='card' key={item.time}>
                        <div>{formattedDateTime(item.time)}</div>
                        <pre className='copied-text'>{item.content}</pre>
                    </div>
                ))}</div>

            </div>
        </div>

  )
}

export default App
