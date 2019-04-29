import React from 'react'
import PropTypes from 'prop-types'
import style from './../styles.css'
import up from './../up.png'

export default function seeMore(props) {
  return (
    <div
      onClick={() => props.navigate(props.seeMoreContent)}
      className={style.seeMore}
    >
      <span className={style.seemoreIcon}>
        <img src={up} />
      </span>
      <span className={style.seemoreText}>Read more</span>
    </div>
  )
}

seeMore.propTypes = {
  seeMoreContent: PropTypes.string,
  showContent: PropTypes.bool,
  action: PropTypes.func,
  toggleMore: PropTypes.func,
  navigate: PropTypes.func
}
