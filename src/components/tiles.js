import React from 'react'
import './Tile.css';
import { Link } from 'react-router-dom';

export default function Tile(titles) {
    let tileItems = []
    debugger

    tileItems = (
        <>
            <div className='tile-list'>
                {titles.titles.map((title, index) => (
                    <div key={index} className='tile-item'>
                        <div className='tile-clr'>{title}</div>
                    </div>
                ))}
            </div>
        </>

    );

    return (
        <>
            <div className='tile-list'>
                {tileItems}
            </div>

        </>
    )
}
