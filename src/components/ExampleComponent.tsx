import { useState } from "react";

function Example() {
    const [count, setCount] = useState(0)

    const changeNum = () => {
        setCount(count + 1);
    }

    return (<div>
        <button onClick={changeNum}>
            +
        </button>
        {count}
    </div>)
}

export default Example;
