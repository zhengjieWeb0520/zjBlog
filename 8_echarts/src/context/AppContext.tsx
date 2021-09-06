/*
 * @Author: 郑杰14
 * @Date: 2021-04-15 17:40:56
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-04-15 17:57:58
 * @Description: 公共context
 */
import React, { useState } from 'react'

interface AppStateValue {
  username: string
}

const defaultContextValue: AppStateValue = {
  username: '郑杰'
}

export const appContext = React.createContext(defaultContextValue)
export const appSetStateContext = React.createContext<React.Dispatch<React.SetStateAction<AppStateValue>> | undefined>(undefined)

export const ContextProvider: React.FC = (props) => {
  const [state, setState] = useState(defaultContextValue)

  return (
    <appContext.Provider value={state}>
      <appSetStateContext.Provider value={setState}>
        {props.children}
      </appSetStateContext.Provider>
    </appContext.Provider>
  )
}
