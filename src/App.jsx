import React,{useState,useEffect} from 'react'
import "./App.css";

const App = () => {
  const [poke,setPoke]=useState([])
  const [filtered,setFiltered]=useState([])
  const [pokesearch,setPokeSearch]=useState("")
  const [selected,setSelected]=useState("All")

  useEffect(()=>{
    async function fetchData(){
      try{const response=await fetch ("https://pokeapi.co/api/v2/pokemon?limit=151");
      const data=await response.json();

      const details=await Promise.all(
        data.results.map(async(pokemon)=>{
          const repo=await fetch(pokemon.url);
          return repo.json()
        })
      )
      setPoke(details)
      setFiltered(details)}
      catch(err){
        console.log(err)
      }
    }
    fetchData()
  },[])

  useEffect(()=>{
    let filtered=poke;

    if (pokesearch){
      filtered=filtered.filter((p)=>(
        p.name.toLowerCase().includes(pokesearch.toLowerCase())
      ))
    }

    if (selected!=="All"){
      filtered=filtered.filter((p)=>(
        p.types.some((t)=>t.type.name==selected.toLowerCase())
      ))
    }

    setFiltered(filtered)
  },[pokesearch,selected,poke])

  const types=Array.from(
    new Set(poke.flatMap((p)=>p.types.map((t)=>t.type.name)))
  )


  return (
    <div className='app'>
      <h1 className='title'>Poke App</h1>
      <div className='filters'>
      <input 
      type="text" 
      placeholder='Search Pokemon' 
      value={pokesearch}
      onChange={(e)=>setPokeSearch(e.target.value)}
      />
      <select value={selected} onChange={(e)=>setSelected(e.target.value)}>
      <option value="All">All</option>
      {types.map((type)=>(
        <option key={type} value={type}>{type.charAt(0).toUpperCase()+type.slice(1)}</option>
      ))}

      </select>
      </div>

      <div className='card-container'>
        {filtered.map((pokemon)=>(
          <div className='card' key={pokemon.id}>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <p className="number">#{pokemon.id}</p>
          <div className='types'>
          {pokemon.types.map((type) => (
                <span key={type.slot} className="type">
                  {type.type.name.charAt(0).toUpperCase()+type.type.name.slice(1)}
                </span>
              ))}
          </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App