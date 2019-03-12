import React from 'react'
import largestRemainderMethod from 'hare-niemeyer'
import produce from 'immer'
import './App.css'

import Header from './Header'
import Footer from './Footer'

const initialValue = [100, 70, 10, 20]

function getCalculatedLRM(value) {
  const [seats, ...votes] = value

  if (!votes.length) {
    return [seats]
  }

  const calculated = largestRemainderMethod(Object.assign({}, votes), seats)

  return [seats, ...Object.values(calculated).map(i => i || 0)]
}

function App() {
  const [values, setValues] = React.useState(initialValue)

  const handleChange = React.useCallback(({ target }) => {
    setValues(values => {
      const newValues = produce(values, draft => {
        draft[target.name] = +target.value
      })

      if (target.name === 0) {
        return newValues
      }

      return getCalculatedLRM(newValues)
    })
  }, [])

  const addSeat = React.useCallback(() => {
    setValues(values => {
      return produce(values, draft => draft.push(0))
    })
  }, [])

  const removeSeat = React.useCallback(() => {
    setValues(values => {
      const newValues = produce(values, draft => {
        if (draft.length !== 1) {
          draft.pop()
        }
      })

      return getCalculatedLRM(newValues)
    })
  }, [])

  return (
    <React.Fragment>
      <Header />
      <form>
        {values.map((value, index) => (
          <div key={index}>
            <label htmlFor={index}>
              {index === 0 ? 'Seats per party' : `Party #${index} votes`}
            </label>
            <input
              type="number"
              min={0}
              max={100}
              id={index}
              name={index}
              onChange={handleChange}
              value={value}
            />
          </div>
        ))}
        <div id="actions">
          <button type="button" onClick={addSeat}>
            Add seat
          </button>
          <button type="button" onClick={removeSeat}>
            Remove seat
          </button>
        </div>
      </form>
      <Footer />
    </React.Fragment>
  )
}

export default App
