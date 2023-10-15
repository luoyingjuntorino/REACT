import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'
import Hello from './Hello';

const root = document.getElementById('root');
const rootElement = createRoot(root);

// // 函数组件
// // function Hello() {
// //   return (
// //           <div>my first React 函数 component</div>
// //   )
// // }

// // 箭头组件
// // const Hello = () => <div>这是我的第一个箭头组件</div>

// // 类组件
// // class Hello extends React.Component {
// //   render() {
// //     return (<div>这是我的第一个类组件？</div>)
// //   }
// // }

// // class App extends React.Component {
// //   handleClick() {
// //     console.log('click event has been triggered.')
// //   }
// //   render(){
// //     return (
// //       <button onClick={this.handleClick}>click, click</button>
// //     )
// //   }
// // }


// // function App() {
// //   function handleClick(e) {
// //     e.preventDefault()
// //     console.log('clicked!!')
// //   }
// //   return (
// //     <a href='https://www.google.com/maps' onClick={handleClick}>google</a>
// //   )
// // }

// // state的基本使用
// class App extends React.Component {
//   state = {
//     count:10,
//     test:'hihihi'
//   }
//   render() {
//     return (
//       <div>
//         <h1>counter:{this.state.count}</h1>
//         <p>{this.state.test}</p>
//       <button onClick={() => {
//         this.setState({
//           count:this.state.count + 1
//         })
//       }}>plus one</button>

//       <button onClick={() => {
//         this.setState({
//           count:this.state.count - 1
//         })
//       }}>minues one</button>

//       <button onClick={() => {
//         this.setState({
//           count:this.state.count * 2
//         })
//       }}>multiple 2</button>

//       <button onClick={() => {
//         this.setState({
//           count:this.state.count / 2
//         })
//       }}>devide 2</button>
//       </div>
//     )
//   }
// }
// const isLoading = true

// const loadData = () => {
//   if (isLoading){
//     return <a>is loaded</a>
//   }
//   return <a>is not loaded</a>
// }

// const styleOfclass = (<p className='wow'>style of className</p>)

// const stl = (<p style={{color:'blue'}}>this is a style</p>)

// const songs = [{id:1, name:'痴心绝对'},
//                {id:2, name:'小猴之歌'},
//                {id:3, name:'大猴之歌'}]

// const list = (
//               <ul>
//                 {songs.map(item => <li key={item.id}>{item.name}</li>)}
//               </ul>
//               )


// const name = 'Andy'

// const title = (
//                 <h1 className='title'>
//                   欢迎进入React的世界!
//                   <p>我叫:{name}</p>
//                   <p>{3 > 5 ? '大于':'小于'}</p>
//                   <p>条件渲染：{loadData()}</p>
//                   <p>三元运算符：{isLoading ? (<a>is loaded</a>) : (<a>is not loaded</a>)}</p>
//                   {list}
//                   {stl}
//                   {styleOfclass}
//                 </h1>
//               )

// // 渲染



// class App2 extends React.Component{
 
// state = {
//     name:'andy',
//     count:0
//   }

//   // constructor(){
//   //   super()
//   //   this.onIncrement = this.onIncrement.bind(this)
    
//   // }

//   onIncrement = () => {
//     this.setState({count:this.state.count + 1})
//   }

//   render(){
//     return(<div>
//            <h1>{this.state.count}</h1>
//            <button onClick={this.onIncrement}>click me</button>
//            </div>
//     )
//   }

// }

// class ContolledComp extends React.Component{
//   state = {
//     txt:'',
//     content:'',
//     city:'',
//     isChecked:''
//   }

//   // handleChange = e => {
//   //   this.setState({
//   //     txt:e.target.value
//   //   })
//   // }
  
//   // handleContent = e => {
//   //   this.setState({
//   //     content:e.target.value
//   //   })
//   // }

//   // handlCity = e =>{
//   //   this.setState({
//   //     city:e.target.value
//   //   })
//   // }

//   // handleChecked = e =>{
//   //   this.setState({
//   //     isChecked:e.target.checked
//   //   })
//   // }

//   handleForm = e =>{
//     const target = e.target
    
//     const value = target.type == 'checkbox'
//     ? target.checked
//     : target.value

//     const name = target.name

//     this.setState({
//       [name]:value
//     })

//   }
//   render(){
//     return(
//       <div>
//         {/* 文本框 操作value值 */}
//         <input type='text' name='txt' value={this.state.txt} onChange={this.handleForm}/><br/>
//         {/* 富文本框 操作value值 */}
//         <textarea name='content' value={this.state.content} onChange={this.handleForm}></textarea><br/>
//         {/* 下拉 操作value值 */}
//         <select name='city' value={this.state.city} onChange={this.handleForm}>
//           <option value='sh'>shanghai</option>
//           <option value='bj'>beijing</option>
//           <option value='gz'>guangzhou</option>
//         </select><br/>
//         {/* 复选框 操作checked值*/}
//         <input type='checkbox' name='isChecked' checked={this.state.isChecked} onChange={this.handleForm}/><br/>
//         {/* 多表单元素 */}

//       </div>
//     )
//   }
// }

// class Abc extends React.Component {
//   constructor(){
//     super()

//     this.txtRef = React.createRef()
//   }

//   getTxt = () => {
//     console.log('txt values is:', this.txtRef.current.value)
//   }
//   render(){
//     return(
//       <div>
//         <input type='text' ref={this.txtRef} />
//         <button onClick={this.getTxt}>get text</button>
//       </div>
//     )
//   }
// }

class Comments extends React.Component {
  state = {
    comments:[
      {id:1, name:'jack', content:'hello i am jack'},
      {id:2, name:'rose', content:'hello i am rose'},
      {id:3, name:'tom', content:'hello i am tom'}
    ]
  }

  renderList () {
    const name = this.state
    if (name.comments.length ===0){ 
          return (<div className='no-comment'>暂无评论，快去评论吧！</div>) 
    }
    return (
                <ul>
                  {name.comments.map(item=> 
                  <li key={item.id}>
                    <h3>评论人: {item.name}</h3>
                    <p>内容: {item.content}</p>
                  </li>)}
                </ul>
            )
  }
  render(){
    return(
      <div className='app'>
        <div>
          <input className='user' type='text' placeholder='请输入评论人' />
          <br/>
          <br/>

          <textarea className='content' cols='30' rows='10' placeholder='请输入评论内容'></textarea>
          <br/>
          <br/>
          <button>发表内容</button>
        </div>
        <br/>
        {this.renderList()}
      </div>
    )
  }
}
rootElement.render(<Comments />)