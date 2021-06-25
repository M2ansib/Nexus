import React, {useState, useEffect} from 'react';
import { Toolbar } from '@material-ui/core';
import { useLocation } from 'react-router-dom';

export default function ToolbarWrapper (props) {
    const loc = useLocation()
    
    if (props.excludes) 
        if (props.excludes.includes(loc.pathname)) return null;
    return <Toolbar />;
}