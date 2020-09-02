import React from 'react'
import Highlight from './../highlight'
import Clipboard from './../clipBoard'
import './index.scss'

/* 文本 */
export default function Document (props) {
  const { codes, desc } = props
  return (
    <section className="document">
      {
        desc.details.content.map((item, index) => {
          return (
            <div key={index}>
              <h3 className="document-item-title">{`${index + 1}、${item.title}`}</h3>
              <div className="document-item-content">
                <Clipboard codes={codes[index]} />
                <Highlight className="javascript,js,jsx">{codes[index]}</Highlight>
              </div>
            </div>
          )
        })
      }
    </section>
  )
}
