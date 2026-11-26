function App() {

  let products = ["phone", "laptop"]

  function addProduct() {
    products.push("charger")
  }

  return (
    <div>
      <button className="btn btn-primary" onClick={addProduct}>Add Product</button>
    </div>
  )

}
export default App