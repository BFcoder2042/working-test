import * as React from 'react';

const Text = (props) => {
    return(
        <div>
            <input type='password' onChange={(event) => props.onChange(event)}></input>
        </div>
    )
}

export default Text;