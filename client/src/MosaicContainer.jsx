import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import React, {useState, useEffect} from 'react';
// import {fetch} from 'xhr';
// import PropTypes from 'prop-types';

// Generic responsive mosaic layout wrapper, for ease of rendering.

export default function Mosaic(props) {
    // const [items, setItems] = useState([]);

    // useEffect(() => {
    //     fetch(`${props.url}`)
    //     .then(res => res.json())
    //     .then(data => setItems(data))
    // }, [])

    return (
        <ResponsiveMasonry className="mosaic-container"
            columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
        >
            <Masonry className="masonry" gutter="1rem" style={{alignItems: "flex-start", paddingY: "2rem"}}>
                {props.children}
            </Masonry>
        </ResponsiveMasonry>
    );
}