import { useState } from "react";

export default function TaskPanel() {

  const [task,setTask] = useState(
    "Write a function to reverse a string."
  );

  return(

    <div style={{
      border:"1px solid gray",
      padding:10,
      marginBottom:10
    }}>

      <h3>Interview Task</h3>

      <p>{task}</p>

    </div>

  )
}