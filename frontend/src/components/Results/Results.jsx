import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'

function Results(){
    return (
        <div>
            <h1>RESULTS!</h1>
            <Link to={`/`}>Back to game</Link>
        </div>
    );
}

export default Results;