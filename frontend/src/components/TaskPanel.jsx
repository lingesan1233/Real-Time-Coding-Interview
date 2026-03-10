import { useState } from "react"

export default function TaskPanel({tasks}){

const [answers,setAnswers] = useState({})

const submitAnswer = ()=>{

console.log("Submitted Answers",answers)

alert("Solution Submitted")

}

return(

<div style={{
width:"30%",
padding:"10px",
borderRight:"1px solid gray"
}}>

<h3>Tasks</h3>

{tasks.map((task,index)=>(

<div key={index} style={{marginBottom:"20px"}}>

<p>{task}</p>

<textarea
rows="4"
cols="30"
onChange={(e)=>{

setAnswers({
...answers,
[index]:e.target.value
})

}}
/>

</div>

))}

<button onClick={submitAnswer}>
Submit Solution
</button>

</div>

)

}