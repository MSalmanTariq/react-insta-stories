import React from 'react'
import Story from './Story'
import ProgressArray from './ProgressArray'
import PropTypes from 'prop-types'

export default class Container extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentId: props.initialIndex,
      pause: true,
      count: 0,
      storiesDone: 0,
      storyId: props.storyId
    }
    this.defaultInterval = 4000
    this.width = props.width || 360
    this.height = props.height || 640
  }

  componentDidMount() {
    this.props.defaultInterval &&
      (this.defaultInterval = this.props.defaultInterval)

    let el = document.getElementById('storyBox')
    this.touchHandler(el)
    el.addEventListener('swl', this.changeView, false)
    el.addEventListener('swr', this.changeView, false)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.storyId !== prevState.storyId) {
      return {
        currentId: nextProps.initialIndex,
        storyId: nextProps.storyId
      }
    } else return null
  }

  pause = (action, bufferAction) => {
    this.setState({ pause: action === 'pause', bufferAction })
    if (action === 'play' && bufferAction) {
      this.props.onStoryChange(this.state, 'seen')
    }
  }

  previous = () => {
    if (this.state.currentId > 0) {
      this.setState({
        currentId: this.state.currentId - 1,
        count: 0
      })
    } else {
      this.props.onStoryChange(this.state, 'previous')
    }
  }

  next = () => {
    if (this.state.currentId < this.props.stories.length - 1) {
      this.setState({
        currentId: this.state.currentId + 1,
        count: 0
      })
    } else {
      this.props.onStoryChange(this.state, 'next')
    }
  }

  play = () => {
    this.mousedownId && clearTimeout(this.mousedownId)
    this.pause('play')
  }

  debouncePause = e => {
    //  e.preventDefault()
    this.mousedownId = setTimeout(() => {
      this.pause('pause')
    }, 200)
  }

  mouseUp = (e, type) => {
    //  e.preventDefault()
    this.mousedownId && clearTimeout(this.mousedownId)
    if (this.state.pause) {
      if (this.story.state.loaded) {
        this.pause('play')
      } else {
        type === 'next' ? this.next() : this.previous()
      }
    } else {
      type === 'next' ? this.next() : this.previous()
    }
  }

  getVideoDuration = duration => {
    this.setState({ videoDuration: duration })
  }

  toggleMore = show => {
    if (this.story) {
      this.story.toggleMore(show)
      return true
    } else return false
  }
  changeView = e => {
    if (e.type === 'swl') {
      this.props.onStoryChange(this.state, 'next')
      if (this.story.state.loaded) {
        this.play()
      }
    } else if (e.type === 'swr') {
      this.props.onStoryChange(this.state, 'previous')
      if (this.story.state.loaded) {
        this.play()
      }
    } /* else if (e.type === 'swu') {
      this.props.onSeeMore(this.props.stories[this.state.currentId].seeMore)
      if (this.story.state.loaded) {
        this.play()
      }
    } */
  }
  touchHandler = d => {
    var ce = function(e, n) {
      var a = document.createEvent('CustomEvent')
      a.initCustomEvent(n, true, true, e.target)
      e.target.dispatchEvent(a)
      a = null
      return false
    }
    var nm = true
    var md = false
    var sp = {
      x: 0,
      y: 0
    }
    var ep = {
      x: 0,
      y: 0
    }
    var touch = {
      touchstart: e => {
        e.preventDefault()
        sp = {
          x: e.touches[0].pageX,
          y: e.touches[0].pageY
        }
        this.debouncePause()
      },
      touchmove: e => {
        // e.preventDefault()
        nm = false
        ep = {
          x: e.touches[0].pageX,
          y: e.touches[0].pageY
        }
      },
      touchend: e => {
        e.preventDefault()
        if (nm) {
          if (Number(sp.x - d.getBoundingClientRect().left) <= this.width / 2) {
            this.mouseUp(null, 'previous')
            ce(e, 'left')
          } else {
            this.mouseUp(null, 'next')
            ce(e, 'right')
          }
        } else {
          var x = ep.x - sp.x
          var xr = Math.abs(x)
          var y = ep.y - sp.y
          var yr = Math.abs(y)
          if (Math.max(xr, yr) > this.props.swipeThreshold) {
            let pos = xr > yr ? (x < 0 ? 'swl' : 'swr') : y < 0 ? 'swu' : 'swd'
            ce(e, pos)
            if (pos === 'swd' || pos === 'swu') {
              if (this.story.state.loaded) {
                this.play()
              }
            }
          } else {
            if (this.story.state.loaded) {
              this.play()
            }
          }
        }
        nm = true
      },
      touchcancel: e => {
        nm = false
      },
      mousedown: e => {
        e.preventDefault()
        ;(md = true),
        (sp = {
          x: e.pageX,
          y: e.pageY
        }),
        this.debouncePause()
      },
      mousemove: e => {
        if (md) {
          nm = false
          ep = {
            x: e.pageX,
            y: e.pageY
          }
        }
      },
      mouseup: e => {
        e.preventDefault()
        md = false
        if (nm) {
          if (Number(sp.x - d.getBoundingClientRect().left) <= this.width / 2) {
            this.mouseUp(null, 'previous')
            ce(e, 'left')
          } else {
            this.mouseUp(null, 'next')
            ce(e, 'right')
          }
        } else {
          var x = ep.x - sp.x
          var xr = Math.abs(x)
          var y = ep.y - sp.y
          var yr = Math.abs(y)
          if (Math.max(xr, yr) > this.props.swipeThreshold) {
            let pos = xr > yr ? (x < 0 ? 'swl' : 'swr') : y < 0 ? 'swu' : 'swd'
            ce(e, pos)
            if (pos === 'swd' || pos === 'swu') {
              if (this.story.state.loaded) {
                this.play()
              }
            }
          } else {
            if (this.story.state.loaded) {
              this.play()
            }
          }
        }
        nm = true
      }
    }
    for (var a in touch) {
      d.addEventListener(a, touch[a], false)
    }
  }
  render() {
    return (
      <div
        style={{
          ...styles.container,
          ...{
            width: this.width,
            height: this.height,
            margin: `${this.props.isMobile ? '0' : '24'}px 0px`
          }
        }}
      >
        <ProgressArray
          next={this.next}
          pause={this.state.pause}
          bufferAction={this.state.bufferAction}
          videoDuration={this.state.videoDuration}
          length={this.props.stories.map((s, i) => i)}
          defaultInterval={this.defaultInterval}
          currentStory={this.props.stories[this.state.currentId]}
          progress={{
            id: this.state.currentId,
            storyId: this.state.storyId,
            completed:
              this.state.count /
              ((this.props.stories[this.state.currentId] &&
                this.props.stories[this.state.currentId].duration) ||
                this.defaultInterval)
          }}
        />
        <Story
          ref={s => (this.story = s)}
          action={this.pause}
          bufferAction={this.state.bufferAction}
          height={this.height}
          playState={this.state.pause}
          width={this.width}
          story={this.props.stories[this.state.currentId]}
          loader={this.props.loader}
          header={this.props.header}
          getVideoDuration={this.getVideoDuration}
          storyContentStyles={this.props.storyContentStyles}
          navigate={this.props.navigate}
          componentStyles={this.props.componentStyles}
          // fastAverageColor={this.props.fastAverageColor}
        />
        <div style={styles.overlay}>
          <div style={{ width: this.width, zIndex: 999 }} id='storyBox' />
        </div>
      </div>
    )
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    background: '#111',
    position: 'relative'
  },
  overlay: {
    position: 'absolute',
    height: 'inherit',
    width: 'inherit',
    display: 'flex'
  },
  left: {},
  right: {}
}
Container.defaultProps = {
  swipeThreshold: 50
}
Container.propTypes = {
  stories: PropTypes.array,
  defaultInterval: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  swipeThreshold: PropTypes.number,
  loader: PropTypes.element,
  header: PropTypes.element,
  storyContentStyles: PropTypes.object,
  initialIndex: PropTypes.number,
  storyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onStoryChange: PropTypes.func,
  navigate: PropTypes.func,
  isMobile: PropTypes.bool,
  componentStyles: PropTypes.object
  // fastAverageColor: PropTypes.func
}
