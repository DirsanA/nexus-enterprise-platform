import { useEffect, useState } from "react";


function App() {

  let [data, setdata] = useState([])

  async function featchUser() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users")
    const data = await response.json()
    if (data) {
      console.log(data)
      setdata(data)
    }

    console.log("user not found ")

  }
  useEffect(function () {
    featchUser()
  }, [])

  return (
    <div>
   // featchUser
      <h1>Users</h1>
      {
        data.map(function (data) {
          return (
            <div key={data.id}>
              <p>{data.name} </p>
              <p>{data.username}</p>
              <p>{data.email}</p>
            </div>
          )
        })
      }
    </div>
  )


} export default App