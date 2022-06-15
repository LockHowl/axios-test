import axios from 'axios';
import { useState, useEffect } from 'react';
import "./App.css";
import PokeBall from "./assets/PokeBall.png";

const colourMap = {
  grass: "#78C850",
  fire: "#F08030",
  water: "#6890F0",
  bug: "#A8B820",
  normal: "#A8A878",
  poison: "#A040A0",
  electric: "#F8D030",
  ground: "#E0C068",
  fighting: "#C03028",
  psychic: "#F85888",
  rock: "#B8A038",
  ghost: "#795898",
  ice: "#98D8D8",
  dragon: "#7038F8",
  fairy: "#EE99AC",
  flying: "#8094BC",
  steel: "#7B9095",
  dark: "#A9A9A9"
};

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/pokemon'
});

function App() {
  const [list, setList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(898);
  const [visibility, setVisibility] = useState(false);
  const [selection, setSelection] = useState("");
  const [search, setSearch] = useState("");
  const [regionOn, setRegionOn] = useState([
    {region: "Kanto", on: false},
    {region: "Johto", on: false},
    {region: "Hoenn", on: false},
    {region: "Sinnoh", on: false},
    {region: "Unova", on: false},
    {region: "Kalos", on: false},
    {region: "Alola", on: false},
    {region: "Galar", on: false}
  ]);

  const kantoCheck = (id) => {
    return (regionOn.reduce((a,b)=> a || (b.region === "Kanto" && b.on), false) && 1 <= id+1 && id+1 <= 151);
  }

  const johtoCheck = (id) => {
    return (regionOn.reduce((a,b)=> a || (b.region === "Johto" && b.on), false) && 152 <= id+1 && id+1 <= 251);
  }

  const hoennCheck = (id) => {
    return (regionOn.reduce((a,b)=> a || (b.region === "Hoenn" && b.on), false) && 252 <= id+1 && id+1 <= 386);
  }

  const sinnohCheck = (id) => {
    return (regionOn.reduce((a,b)=> a || (b.region === "Sinnoh" && b.on), false) && 387 <= id+1 && id+1 <= 493);
  }

  const unovaCheck = (id) => {
    return (regionOn.reduce((a,b)=> a || (b.region === "Unova" && b.on), false) && 494 <= id+1 && id+1 <= 649);
  }

  const kalosCheck = (id) => {
    return (regionOn.reduce((a,b)=> a || (b.region === "Kalos" && b.on), false) && 650 <= id+1 && id+1 <= 721);
  }

  const alolaCheck = (id) => {
    return (regionOn.reduce((a,b)=> a || (b.region === "Alola" && b.on), false) && 722 <= id+1 && id+1 <= 809);
  }

  const galarCheck = (id) => {
    return (regionOn.reduce((a,b)=> a || (b.region === "Galar" && b.on), false) && 810 <= id+1 && id+1 <= 905);
  }

  const regionTest = (id) => {
    return kantoCheck(id) || johtoCheck(id) || sinnohCheck(id) || hoennCheck(id) || unovaCheck(id) || kalosCheck(id) || alolaCheck(id) || galarCheck(id)
  }

  const getPokemon = () => {
    api.get('/?limit='+limit+"&offset="+offset)
    .then(res => {
      return (res.data.results.filter((_, i) => regionTest(i)));
    })
    .then(res => {
      return (res.filter(e => !search || e.name.toUpperCase().includes(search.toUpperCase())));
    })
    .then(res => {
      setList(res);
    })
    .catch(err => {
      console.log(err);
    })
  };

  const handleSearch = (event) => {
    setTimeout(() => {
      setSearch(event.target.value);
    }, "1000");
  };

  const handleChange = (event) => {
    let updatedRegion = regionOn.map((elem) => elem.region === event.target.value ? {region: event.target.value, on: event.target.checked} : elem);
    setRegionOn(JSON.parse(JSON.stringify(updatedRegion)));
  }

  useEffect(() => {
    setList([]);
    getPokemon();
  },
    //eslint-disable-next-line
  regionOn);

  useEffect(() => {
    setList([]);
    getPokemon();
  },
    //eslint-disable-next-line
  [search]);

  const toggleVisibility = () => {
    setVisibility(!visibility);
  };

  const modalSelection = (link) => {
    setSelection(link);
    setVisibility(!visibility);
  };

  const renderCards = () => {
    return list
    .map((e,i) => 
      <Card key={"B"+i} pokemon={e} modalSelection={modalSelection}/>
    )
  };

  return (
    <>
      <div className="pokestrip"><div className='pokebutton'></div></div>
      <input type="text" style={{display: "block", width:"180px", margin: "24px auto"}} onChange={handleSearch}></input>

      <form className='labelCheckboxes'>
      {regionOn.map((e,i) => {
            return (<label className='labelCheckbox' key={"A"+i}>{e.region}<input value={e.region} type="checkbox" onChange={handleChange}></input></label>)
          }
        )
      }
      </form>

      {visibility && <Zoom toggleVisibility={toggleVisibility} url={selection}/>}
      <div style={{display:"flex", flexWrap: "wrap", justifyContent: "center"}}>
      {
        renderCards()
      }
      </div>
    </>
  );
}

function Card(data) {
  const [state, setState] = useState({});
  const [display, setDisplay] = useState("none");

  const Loaded = () => {
    setDisplay("Flex");
  }

  useEffect(() => {
    axios.get(data.pokemon.url)
    .then(res => {
      setState(res.data);
    })
    .catch(err => {
      //console.log(err);
    });
  }, 
    //eslint-disable-next-line
  []);

  return(
    <>
      <article style={{display: display}} className='card' onClick={() => {data.modalSelection(data.pokemon.url)}} >
        {state.sprites && <img alt="pokemon-sprite" onLoad={() => Loaded()} style={{}} className='cardImg' src={state.sprites.other["official-artwork"].front_default}/>}
        {state.id && <p className='cardId'>#{state.id}</p>}
        {state.name && <p className='cardName'>{state.name.charAt(0).toUpperCase() + state.name.slice(1)}</p>}
        <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
          {state.types && <h4 className='cardTypeTag' style={{backgroundColor: colourMap[state.types[0].type.name]}}>{(state.types[0].type.name)}</h4>}
          {state.types && state.types[1] && <h4 className='cardTypeTag' style={{backgroundColor: colourMap[state.types[1].type.name]}}>{(state.types[1].type.name)}</h4>}
        </div>
      </article>
    </>
  );
}

function Zoom(info) {
  const [pokemon, setPokemon] = useState({})

  useEffect(() => {
    axios.get(info.url)
    .then(res => {
      setPokemon(res.data);
    })
    .catch(err => {
      //console.log(err);
    })
  }, 
    //eslint-disable-next-line
  []);

  return(
    <div className='modalBackground' onClick={info.toggleVisibility}>
      <article className="modalWindow" onClick={e => e.stopPropagation()}>
        <img alt="pokemon sprite" style={{position: "absolute", zIndex: "999", right: "10px", top: "10px", width: "32px"}} onClick={info.toggleVisibility} src={PokeBall}></img>
        <h2 className='modalId'>#{pokemon.id}</h2>

        <div className='modalWrap'>
          {pokemon.name && <h1 className='modalName' style={{color: "black"}}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>}
          {pokemon.sprites ? <img alt="pokemon sprite" className="modalArt" src={pokemon.sprites.other["official-artwork"].front_default}/> : <p style={{textAlign: "center", fontSize: "35px"}}>Loading</p>}
          
          <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
            {pokemon.types && <h4 className='cardTypeTag' style={{backgroundColor: colourMap[pokemon.types[0].type.name]}}>{(pokemon.types[0].type.name)}</h4>}
            {pokemon.types && pokemon.types[1] && <h4 className='cardTypeTag' style={{backgroundColor: colourMap[pokemon.types[1].type.name]}}>{(pokemon.types[1].type.name)}</h4>}
          </div>
          
          {pokemon.sprites && <h3 style={{textAlign: "center", margin: "15px 0 0 0"}}>Sprites</h3>}
          
          <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            {pokemon.sprites && <img alt="pokemon sprite" style={{width: 96, height: 96}} src={pokemon.sprites.front_default}/>}
            {pokemon.sprites && <img alt="pokemon sprite" style={{width: 96, height: 96}} src={pokemon.sprites.front_shiny}/>}
          </div>

          {pokemon.height && 
          <>
            <h3 style={{textAlign: "center", margin: "0"}}>Details</h3>
            <div className='modalDescBox'>
              <p className='note'>Height: {pokemon.height/10 >= 1 ? pokemon.height/10 + "m" : pokemon.height*10 + "cm" }</p>
              <p className='note'>Weight: {pokemon.weight/10 + "kg"}</p>
              <p>{`Abilities: `} 
                {pokemon.abilities[0].ability.name.charAt(0).toUpperCase()+pokemon.abilities[0].ability.name.slice(1)}
                {pokemon.abilities[1] && ", "+pokemon.abilities[1].ability.name.charAt(0).toUpperCase()+pokemon.abilities[1].ability.name.slice(1)}
                {pokemon.abilities[2] && ", "+pokemon.abilities[2].ability.name.charAt(0).toUpperCase()+pokemon.abilities[2].ability.name.slice(1)+"..."}
              </p>
            </div>
          </>}
        </div>
      </article>
    </div>
  )
}

export default App;
