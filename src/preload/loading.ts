

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
export function useLoading() {
  const loadingStyle = document.createElement('style')
  const loadingDiv = document.createElement('div')

  loadingStyle.innerHTML = `
.loading-animation {
  margin: 100px auto;
  height: 80px;
  text-align: center;
  font-size: 10px;
}

.loading-animation > div {
  background-color: #fff;
  height: 100%;
  width: 6px;
  display: inline-block;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}
.loading-animation > div + div{
  margin-left:6px;
}
.loading-animation > div:nth-child(2) {
  animation-delay: -1.1s;
}

.loading-animation > div:nth-child(3) {
  animation-delay: -1.0s;
}

.loading-animation > div:nth-child(4) {
  animation-delay: -0.9s;
}

.loading-animation > div:nth-child(5) {
  animation-delay: -0.8s;
}

@-webkit-keyframes sk-stretchdelay {
  0%, 40%, 100% { -webkit-transform: scaleY(0.4) }  
  20% { -webkit-transform: scaleY(1.0) }
}

@keyframes sk-stretchdelay {
  0%, 40%, 100% { 
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }  20% { 
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
} 
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
`
  loadingDiv.className = 'app-loading-wrap'
  loadingDiv.innerHTML = '<div class="loading-animation"><div></div><div></div><div></div><div></div><div></div></div>'

  return {
    appendLoading() {
      document.head.appendChild(loadingStyle)
      document.body.appendChild(loadingDiv)
    },
    removeLoading() {
      document.head.removeChild(loadingStyle)
      document.body.removeChild(loadingDiv)
    },
  }
}
