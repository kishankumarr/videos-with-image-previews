import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items:[],
      isLoaded:true,
      selectedThumbnails:{}
     }
  }

componentDidMount(){
  const url='http://www.mocky.io/v2/5ed5fda4340000740006d560?mocky-delay=500ms'
   fetch(url,{
     method:'GET',
     headers:{
       'Accept':'application/json',
      'content-Type':'application/json'
     }
   }).then((result)=>{
     result.json().then((resp)=>{
       console.log(resp);
       let temp = {}
       for(let item of resp) {
         temp[item.id] = [item.frames[0].id]
       }
      this.setState({
        isLoaded:false,
        items:resp,
        selectedThumbnails:temp
      })
     })
   })
  };

  handleThumbNailSelection = (videoId,thumbId) => {
    let temp = {...this.state.selectedThumbnails}
    const index = temp[videoId].indexOf(thumbId);
    if (index > -1) {
      temp[videoId].splice(index, 1);
    }else {

      temp[videoId].push(thumbId)
    }

    this.setState({selectedThumbnails:temp})
  }

  handleSubmit = () => {
    let payload = []
    for(let item in this.state.selectedThumbnails)
      for(let tmId of this.state.selectedThumbnails[item])
        payload.push({
          id:item,
          frameId:tmId
        })
        
    console.log(payload);
    const url="http://www.mocky.io/v2/5ed609363400004d0006d602 "
    fetch(url,{
      method:'POST',
      body:JSON.stringify(payload),
      headers:{
       'content-Type':'application/json'
      }
    }).then((result)=>{
      result.json().then((resp)=>{
        console.log(resp);
  })
})
  }

  render() {
    return (
      <div className="App">
      {this.state.isLoaded ?(<div>loading...</div>)
        :
        (<div  >
          {this.state.items.map((item,id)=>(
            <div className='row'  key={item.id}>
               <span className="videoplayer"><ReactPlayer width='100%' height='100%' controls  url={item.url} /></span>
               {
                 item.frames.map((sub,subIndex)=>{
                   console.log(this.state.selectedThumbnails,item.id,sub.id);
                   return <span className="thumbnails" key={sub.id}><img className={this.state.selectedThumbnails[item.id].includes(sub.id) ? "active":"" } src={sub.url} width='50' height='50'  onClick={() => {this.handleThumbNailSelection(item.id,sub.id)}}></img></span>
                  }
                 )
                }
            </div>
          ))}
          <button onClick={this.handleSubmit}>submit</button>
        </div>
         )}
        </div>
    )

  }
}

export default App;
