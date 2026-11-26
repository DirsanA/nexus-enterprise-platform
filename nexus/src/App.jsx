import {useState} from "react";

function  App(){
    let [count,setCount]=useState(0)

    function increment(){
        setCount(count+1)
    }

    function deacrment(){
        setCount(count-1)
    }
    function reset(){
        setCount(0)
    }

    return(
        <div>
            <div>
                count={count}
            </div>
        <button onClick={deacrment}>
            deacrment
        </button>

            <button onClick={increment}>
                Increase
            </button>

            <button onClick={reset}>
            reset
            </button>
        </div>
    )

}export default App