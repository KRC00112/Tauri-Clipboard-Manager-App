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
                        action: async() => {
                            await getCurrentWindow().close();
                        },
                    },
                    {
                        id: 'show',
                        text: 'show',
                        action: async() => {
                            await getCurrentWindow().show();
                            await getCurrentWindow().setFocus();
                        },
                    },
                ],
            });

            const options = {
                menu,
                icon: await defaultWindowIcon(),
                menuOnLeftClick: false,
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

    async function HandleMaximizeWindow(){
        await getCurrentWindow().toggleMaximize();
    }

    async function HandleMinimizeWindow(){
        await getCurrentWindow().minimize();
    }

    return (
        <div className='body'>
            <div className='titlebar'>
                <div data-tauri-drag-region className='empty-space-title-bar'></div>
                <div className='titlebar-btns'>
                    <button onClick={HandleHideWindow}> ✕ </button>
                    <button onClick={HandleMaximizeWindow}> 🗖 </button>
                    <button onClick={HandleMinimizeWindow}> _ </button>
                </div>
            </div>
            <div className='main-body'>
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
